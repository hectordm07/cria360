import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BulkAnimalImport } from "@/components/bulk-animal-import";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Carga masiva de animales",
  robots: { index: false, follow: false },
};

const paidPlans = {
  criador: { label: "Granja", limit: 150 },
  profesional: { label: "Granja Pro", limit: 1000 },
} as const;

export default async function BulkImportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");

  const [{ data: profile }, { data: breeder }, { count }, { data: batches }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    supabase.from("breeders").select("id,name").eq("owner_id", user.id).maybeSingle(),
    supabase.from("animals").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
    supabase.from("animal_import_batches").select("id,file_name,total_rows,imported_rows,skipped_rows,error_rows,created_at").eq("owner_id", user.id).order("created_at", { ascending: false }).limit(5),
  ]);

  if (!profile || !breeder) redirect("/registro");

  const paid = profile.plan === "criador" || profile.plan === "profesional";
  const plan = paid ? paidPlans[profile.plan] : null;

  return <section className="inventory-page bulk-import-page"><div className="section-shell">
    <div className="inventory-heading">
      <div><span className="eyebrow">Inventario · función premium</span><h1>Carga masiva desde Excel</h1><p>Registra decenas o cientos de animales sin llenar las fichas una por una.</p></div>
      <Link className="button button-secondary" href="/cuenta/animales">Volver al inventario</Link>
    </div>

    {!paid || !plan ? (
      <div className="premium-feature-lock">
        <span>FUNCIÓN DE PLAN DE PAGO</span>
        <h2>Importa tu inventario completo desde Excel.</h2>
        <p>La carga masiva está incluida desde el plan <strong>Granja</strong>. El plan Gratis mantiene el registro manual de animales.</p>
        <div><Link className="button button-primary" href="/planes?feature=excel" data-analytics-cta="upgrade-excel">Ver planes de pago</Link><Link className="button button-secondary" href="/cuenta/animales/nuevo">Registrar manualmente</Link></div>
      </div>
    ) : (
      <>
        <BulkAnimalImport planLabel={plan.label} animalLimit={plan.limit} currentCount={count ?? 0} />
        {batches?.length ? <section className="bulk-history"><div className="bulk-preview-head"><strong>Últimas cargas</strong><span>{breeder.name}</span></div>{batches.map((batch) => <article key={batch.id}><div><strong>{batch.file_name}</strong><small>{new Date(batch.created_at).toLocaleString("es-PE")}</small></div><span>{batch.imported_rows} importados · {batch.skipped_rows} omitidos · {batch.error_rows} errores</span></article>)}</section> : null}
      </>
    )}
  </div></section>;
}
