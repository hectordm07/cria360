import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { readInventoryDetails } from "@/lib/dashboard-server";
import { InventoryView } from "@/components/inventory-view";

export const metadata: Metadata = { title: "Inventario de animales", robots: { index: false, follow: false } };

export default async function AnimalsInventoryPage({ searchParams }: { searchParams: Promise<{ created?: string; tipo?: string; updated?: string; deleted?: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");

  const [inventory, { data: profile }, params] = await Promise.all([
    readInventoryDetails(supabase, data.user.id),
    supabase.from("profiles").select("plan").eq("id", data.user.id).maybeSingle(),
    searchParams,
  ]);

  const paid = profile?.plan === "criador" || profile?.plan === "profesional";
  const animals = inventory.rows;

  return <section className="inventory-page"><div className="section-shell">
    <div className="inventory-heading">
      <div><span className="eyebrow">Gestión del criadero</span><h1>Inventario de animales</h1><p>{inventory.error ? "Inventario temporalmente no disponible." : `${animals.length} ejemplares registrados · organizados por tipo de animal.`}</p></div>
      <div className="inventory-heading-actions">
        <Link className="button button-secondary" href="/cuenta/escanear">Escanear QR / NFC</Link>
        <Link className={`button ${paid ? "button-secondary" : "button-premium-lock"}`} href="/cuenta/animales/importar">
          Importar Excel{paid ? "" : " · Pro"}
        </Link>
        <Link className="button button-primary" href="/cuenta/animales/nuevo">+ Registrar animal</Link>
      </div>
    </div>
    {params.updated && <p className="form-success">Cambios guardados.</p>}
    {params.deleted && <p className="form-success">Animal eliminado.</p>}
    {params.created && <p className="form-success">Animal registrado correctamente.</p>}
    {inventory.error ? <p className="form-error" role="alert">No pudimos cargar tus animales. <a href="/cuenta/animales">Volver a intentar</a></p> : !animals.length && !params.tipo ? <div className="empty-inventory"><strong>Tu inventario está vacío</strong><p>Registra tu primer animal. Su tarjeta se creará automáticamente según el tipo de animal que elijas.</p><div className="empty-inventory-actions"><Link className="button button-primary" href="/cuenta/animales/nuevo">Registrar primer animal</Link><Link className="button button-secondary" href="/cuenta/animales/importar">Importar Excel</Link></div></div> : <InventoryView key={params.tipo ?? "folders"} animals={animals} selectedType={params.tipo} />}
  </div></section>;
}


