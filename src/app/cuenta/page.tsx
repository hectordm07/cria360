import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AccountHomeSummary } from "@/components/account-home-summary";
import { Icon } from "@/components/icon";
import { FinanceChart, InventoryStatusChart, SpeciesChart, type ChartItem } from "@/components/dashboard-charts";
import { financeMonths, integer, pen, summarizeDay, summarizeFinance } from "@/lib/dashboard-data";
import { readFinance, readInventory } from "@/lib/dashboard-server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Panel de mi criadero", robots: { index: false, follow: false } };
const speciesGroups = [
  { label: "Aves", match: /ave|pato|gall|pollo/i, color: "#23664d" },
  { label: "Vacunos", match: /vacuno/i, color: "#63834b" },
  { label: "Porcinos", match: /porcino/i, color: "#ae7333" },
  { label: "Ovinos", match: /ovino/i, color: "#738795" },
  { label: "Caprinos", match: /caprino/i, color: "#a89557" },
  { label: "Equinos", match: /equino/i, color: "#76594d" },
  { label: "Mascotas", match: /mascota/i, color: "#8b789c" },
  { label: "Otras especies", match: null, color: "#83958a" },
];
const statusGroups = [
  { label: "Activos", state: "activo", color: "#23664d" },
  { label: "Reservados", state: "reservado", color: "#c19945" },
  { label: "Vendidos", state: "vendido", color: "#738795" },
  { label: "Transferidos", state: "transferido", color: "#8b789c" },
  { label: "Fallecidos", state: "fallecido", color: "#b7c2ba" },
];

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/ingresar");
  const periods = financeMonths();
  const [{ data: profile }, { data: breeder }, animalResult, financeResult] = await Promise.all([
    supabase.from("profiles").select("full_name, plan").eq("id", data.user.id).maybeSingle(),
    supabase.from("breeders").select("name, primary_species").eq("owner_id", data.user.id).maybeSingle(),
    readInventory(supabase, data.user.id),
    readFinance(supabase, data.user.id, periods),
  ]);
  if (!profile || !breeder) redirect("/registro");
  const records = animalResult.rows;
  const active = records.filter(animal => animal.inventory_status === "activo").length;
  const published = records.filter(animal => animal.publication_status === "publicado").length;
  const draft = records.filter(animal => animal.publication_status === "borrador").length;
  const views = records.reduce((total, animal) => total + (Number(animal.view_count) || 0), 0);
  const firstName = (profile.full_name ?? "").trim().split(/\s+/)[0] || "Criador";
  const bySpecies: ChartItem[] = speciesGroups.map(group => ({ label: group.label, value: 0, color: group.color }));
  for (const animal of records) {
    const index = speciesGroups.findIndex(group => group.match?.test(animal.species));
    bySpecies[index < 0 ? bySpecies.length - 1 : index].value++;
  }
  const byStatus: ChartItem[] = statusGroups.map(group => ({ label: group.label, value: records.filter(animal => animal.inventory_status === group.state).length, color: group.color }));
  const known = new Set(statusGroups.map(group => group.state));
  const unknownCount = records.filter(animal => !known.has(animal.inventory_status)).length;
  if (unknownCount) byStatus.push({ label: "Otros estados", value: unknownCount, color: "#8a8a8a" });
  const daily = summarizeDay(financeResult.rows);
  const dateLabel = new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", day: "numeric", month: "short" }).format(new Date());
  const financial = summarizeFinance(financeResult.rows, periods);
  const publicationCapacity = profile.plan === "profesional" ? "Ilimitadas" : profile.plan === "criador" ? "30" : "1";
  const stat = (value: number) => animalResult.error ? "—" : integer.format(value);

  return <section className="account-dashboard analytics-dashboard">
    <AccountHomeSummary firstName={firstName} breederName={breeder.name} dateLabel={dateLabel} summary={financeResult.error ? null : daily} />
    <div className="dashboard-section-head"><div><h2>Tu inventario</h2><p>Animales, publicaciones e identidad</p></div><Link className="text-link" href="/cuenta/animales">Ver fichas</Link></div>
    {animalResult.error && <p className="form-notice error" role="alert">No pudimos cargar el inventario. <a href="/cuenta">Recargar el panel</a></p>}
    <section className="dashboard-kpis" aria-label="Resumen del inventario">
      <article><span className="kpi-icon green"><Icon name="store" /></span><div><small>Animales registrados</small><strong>{stat(records.length)}</strong><p>Inventario total</p></div></article>
      <article><span className="kpi-icon lime"><Icon name="health" /></span><div><small>Animales activos</small><strong>{stat(active)}</strong><p>En el criadero</p></div></article>
      <article><span className="kpi-icon gold"><Icon name="spark" /></span><div><small>Publicaciones</small><strong>{stat(published)}</strong><p>{animalResult.error ? "—" : `${integer.format(draft)} borradores`}</p></div></article>
      <article><span className="kpi-icon gray"><Icon name="users" /></span><div><small>Vistas recibidas</small><strong>{stat(views)}</strong><p>En tus publicaciones</p></div></article>
    </section>
    {!animalResult.error && <section className="dashboard-report-grid" aria-label="Gráficos de inventario"><SpeciesChart items={bySpecies} /><InventoryStatusChart items={byStatus} /></section>}
    <section className="dashboard-financial-section" aria-label="Resumen económico">
      <div className="dashboard-section-head"><div><h2>El mes en cifras</h2><p>Ventas y egresos registrados en {periods.at(-1)!.label}</p></div><Link className="text-link" href="/cuenta/finanzas">Ver movimientos</Link></div>
      {financeResult.error ? <p className="form-notice error" role="alert">No pudimos cargar los movimientos económicos. <a href="/cuenta">Recargar el panel</a></p> : <>
        <div className="finance-metric-grid">
          <article><small>Ventas registradas</small><strong>{pen.format(financial.current.sales)}</strong><span>Pagadas y pendientes</span></article>
          <article><small>Compras y gastos</small><strong>{pen.format(financial.current.purchases + financial.current.expenses)}</strong><span>Egresos registrados</span></article>
          <article className={financial.balance < 0 ? "negative-balance" : "positive-balance"}><small>Balance registrado</small><strong>{pen.format(financial.balance)}</strong><span>{financial.balance < 0 ? "Egresos mayores que ventas" : "Ventas menos compras y gastos"}</span></article>
          <article><small>Por cobrar este mes</small><strong>{pen.format(financial.pending)}</strong><span>Ventas pendientes de pago</span></article>
        </div>
        <FinanceChart months={financial.months} />
      </>}
    </section>
    <section className="dashboard-lower-grid">
      <article className="dashboard-panel"><h2>Acciones rápidas</h2><div className="quick-action-grid">
        <Link href="/cuenta/animales"><Icon name="store" /><span><strong>Ver inventario</strong><small>Fichas y estados</small></span></Link>
        <Link href="/cuenta/escanear"><Icon name="scan" /><span><strong>Escanear QR / NFC</strong><small>Consultar y registrar salidas</small></span></Link>
        <Link href="/cuenta/animales/importar"><Icon name="tag" /><span><strong>Importar Excel</strong><small>Disponible en planes de pago</small></span></Link>
        <Link href="/cuenta/publicaciones"><Icon name="users" /><span><strong>Mis publicaciones</strong><small>Gestionar el marketplace</small></span></Link>
      </div></article>
      <article className="dashboard-panel breeder-summary"><h2>{breeder.name}</h2><p>Especialidad: <strong>{breeder.primary_species}</strong></p><div><span><small>Plan actual</small><strong>{profile.plan === "criador" ? "Granja" : profile.plan === "profesional" ? "Granja Pro" : "Gratis"}</strong></span><span><small>Publicaciones activas</small><strong>{stat(published)} / {publicationCapacity}</strong></span></div><Link className="button button-secondary" href="/planes">Ver mi plan</Link></article>
    </section>
  </section>;
}

