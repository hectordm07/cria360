import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Panel de mi criadero", robots: { index: false, follow: false } };

type StockAnimal = { name: string; species: string; breed: string | null; inventory_status: string; publication_status: string };
const stockGroups = [
  { label: "Aves", match: (a: StockAnimal) => /ave/i.test(a.species) && !/pato/i.test(`${a.name} ${a.breed ?? ""}`), image: "https://images.unsplash.com/photo-1685032236350-3873c9035ee0?auto=format&fit=crop&w=900&q=84", tone: "sun" },
  { label: "Patos", match: (a: StockAnimal) => /pato/i.test(`${a.name} ${a.breed ?? ""}`), image: "https://images.unsplash.com/photo-1555852095-64e7428df0fa?auto=format&fit=crop&w=900&q=84", tone: "water" },
  { label: "Vacunos", match: (a: StockAnimal) => /vacuno/i.test(a.species), image: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=84", tone: "field" },
  { label: "Porcinos", match: (a: StockAnimal) => /porcino/i.test(a.species), image: "https://images.unsplash.com/photo-1532633378163-24c2c0da3c99?auto=format&fit=crop&w=900&q=84", tone: "clay" },
  { label: "Ovinos y caprinos", match: (a: StockAnimal) => /ovino|caprino/i.test(a.species), image: "https://images.unsplash.com/photo-1484557985045-edf25e08da945?auto=format&fit=crop&w=900&q=84", tone: "sky" },
  { label: "Equinos", match: (a: StockAnimal) => /equino/i.test(a.species), image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=900&q=84", tone: "earth" },
];

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/ingresar");
  const [{ data: profile }, { data: breeder }, { data: animals }] = await Promise.all([
    supabase.from("profiles").select("full_name, plan").eq("id", data.user.id).maybeSingle(),
    supabase.from("breeders").select("name, primary_species").eq("owner_id", data.user.id).maybeSingle(),
    supabase.from("animals").select("name, species, breed, inventory_status, publication_status").eq("owner_id", data.user.id),
  ]);
  if (!profile || !breeder) redirect("/registro");
  const records = (animals ?? []) as StockAnimal[];
  const active = records.filter((animal) => animal.inventory_status === "activo").length;
  const published = records.filter((animal) => animal.publication_status === "publicado").length;
  const draft = records.filter((animal) => animal.publication_status === "borrador").length;
  const firstName = profile.full_name.trim().split(/\s+/)[0] || "Criador";

  return <main className="account-dashboard">
    <header className="dashboard-topbar"><div><span className="eyebrow">Panel del criadero</span><h1>Buenos días, {firstName}</h1><p>Controla el stock, las publicaciones y la identidad de tus animales.</p></div><div className="dashboard-user"><span>{profile.full_name.charAt(0).toUpperCase()}</span><div><strong>{profile.full_name}</strong><small>{data.user.email}</small></div><form action="/auth/signout" method="post"><button type="submit">Salir</button></form></div></header>
    <section className="dashboard-kpis" aria-label="Resumen del inventario"><article><span className="kpi-icon green"><Icon name="store" /></span><div><small>Stock total</small><strong>{records.length}</strong><p>Animales registrados</p></div></article><article><span className="kpi-icon lime"><Icon name="health" /></span><div><small>Activos</small><strong>{active}</strong><p>En el criadero</p></div></article><article><span className="kpi-icon gold"><Icon name="spark" /></span><div><small>Publicados</small><strong>{published}</strong><p>Visibles en marketplace</p></div></article><article><span className="kpi-icon gray"><Icon name="tag" /></span><div><small>Borradores</small><strong>{draft}</strong><p>Pendientes de publicar</p></div></article></section>
    <section className="dashboard-section"><div className="dashboard-section-head"><div><span className="eyebrow">Stock por especie</span><h2>Inventario visual</h2><p>Consulta rápidamente cuántos animales tienes registrados en cada grupo.</p></div><Link className="button button-primary" href="/cuenta/animales/nuevo">+ Registrar animal</Link></div><div className="stock-species-grid">{stockGroups.map((group) => { const count = records.filter(group.match).length; return <Link className={`stock-species-card tone-${group.tone}`} href="/cuenta/animales" key={group.label}><Image src={group.image} alt={group.label} fill sizes="(max-width: 620px) 50vw, 25vw" /><span className="stock-shade" /><div><small>STOCK</small><strong>{count}</strong><h3>{group.label}</h3><p>{count === 1 ? "1 animal registrado" : `${count} animales registrados`}</p></div></Link>; })}</div></section>
    <section className="dashboard-lower-grid"><article className="dashboard-panel"><div className="dashboard-panel-head"><div><span className="eyebrow">Acciones rápidas</span><h2>Gestiona tu criadero</h2></div></div><div className="quick-action-grid"><Link href="/cuenta/animales"><Icon name="store" /><span><strong>Ver inventario</strong><small>Fichas y estados</small></span></Link><Link href="/cuenta/animales/nuevo"><Icon name="spark" /><span><strong>Nuevo animal</strong><small>Crear una ficha</small></span></Link><Link href="/placas-inteligentes"><Icon name="tag" /><span><strong>Activar placa</strong><small>QR y NFC</small></span></Link><Link href="/marketplace"><Icon name="users" /><span><strong>Marketplace</strong><small>Ver publicaciones</small></span></Link></div></article><article className="dashboard-panel breeder-summary"><span className="eyebrow">Mi criadero</span><h2>{breeder.name}</h2><p>Especialidad principal: <strong>{breeder.primary_species}</strong></p><div><span><small>Plan</small><strong>{profile.plan === "gratis" ? "Gratis" : profile.plan}</strong></span><span><small>Capacidad usada</small><strong>{published}/2 publicaciones</strong></span></div><Link className="button button-secondary" href="/planes">Mejorar mi plan</Link></article></section>
  </main>;
}
