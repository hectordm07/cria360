import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inventario de animales", robots: { index: false, follow: false } };

export default async function AnimalsInventoryPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");

  const [{ data: animals }, { data: profile }, params] = await Promise.all([
    supabase.from("animals").select("id, public_code, name, species, breed, sex, inventory_status, publication_status, price_pen, created_at").eq("owner_id", data.user.id).order("created_at", { ascending: false }),
    supabase.from("profiles").select("plan").eq("id", data.user.id).maybeSingle(),
    searchParams,
  ]);

  const paid = profile?.plan === "criador" || profile?.plan === "profesional";

  return <section className="inventory-page"><div className="section-shell">
    <div className="inventory-heading">
      <div><span className="eyebrow">Gestión del criadero</span><h1>Inventario de animales</h1><p>{animals?.length ?? 0} ejemplares registrados.</p></div>
      <div className="inventory-heading-actions">
        <Link className="button button-secondary" href="/cuenta/escanear">Escanear QR / NFC</Link>
        <Link className={`button ${paid ? "button-secondary" : "button-premium-lock"}`} href="/cuenta/animales/importar">
          Importar Excel{paid ? "" : " · Pro"}
        </Link>
        <Link className="button button-primary" href="/cuenta/animales/nuevo">+ Registrar animal</Link>
      </div>
    </div>
    {params.created && <p className="form-success">Animal registrado correctamente.</p>}
    {!animals?.length ? <div className="empty-inventory"><strong>Tu inventario está vacío</strong><p>Registra el primer animal o importa una plantilla Excel si tienes un plan de pago.</p><div className="empty-inventory-actions"><Link className="button button-primary" href="/cuenta/animales/nuevo">Registrar primer animal</Link><Link className="button button-secondary" href="/cuenta/animales/importar">Importar Excel</Link></div></div> : <div className="inventory-list">{animals.map((animal) => <article key={animal.id}><div><span className="inventory-code">{animal.public_code}</span><h2>{animal.name}</h2><p>{[animal.species, animal.breed, animal.sex].filter(Boolean).join(" · ")}</p></div><div className="inventory-badges"><span>{animal.inventory_status}</span><span className={animal.publication_status === "publicado" ? "is-public" : ""}>{animal.publication_status}</span></div><strong>{animal.price_pen == null ? "Sin precio" : `S/ ${Number(animal.price_pen).toLocaleString("es-PE")}`}</strong></article>)}</div>}
  </div></section>;
}
