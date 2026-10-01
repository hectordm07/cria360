import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inventario de animales", robots: { index: false, follow: false } };

export default async function AnimalsInventoryPage({ searchParams }: { searchParams: Promise<{ created?: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");
  const [{ data: animals }, params] = await Promise.all([
    supabase.from("animals").select("id, public_code, name, species, breed, sex, inventory_status, publication_status, price_pen, created_at").eq("owner_id", data.user.id).order("created_at", { ascending: false }),
    searchParams,
  ]);

  return <section className="inventory-page"><div className="section-shell"><div className="inventory-heading"><div><span className="eyebrow">Gestión del criadero</span><h1>Inventario de animales</h1><p>{animals?.length ?? 0} ejemplares registrados.</p></div><Link className="button button-primary" href="/cuenta/animales/nuevo">+ Registrar animal</Link></div>{params.created && <p className="form-success">Animal registrado correctamente.</p>}{!animals?.length ? <div className="empty-inventory"><strong>Tu inventario está vacío</strong><p>Registra el primer animal para crear su ficha, historial y publicación.</p><Link className="button button-primary" href="/cuenta/animales/nuevo">Registrar primer animal</Link></div> : <div className="inventory-list">{animals.map((animal) => <article key={animal.id}><div><span className="inventory-code">{animal.public_code}</span><h2>{animal.name}</h2><p>{[animal.species, animal.breed, animal.sex].filter(Boolean).join(" · ")}</p></div><div className="inventory-badges"><span>{animal.inventory_status}</span><span className={animal.publication_status === "publicado" ? "is-public" : ""}>{animal.publication_status}</span></div><strong>{animal.price_pen == null ? "Sin precio" : `S/ ${Number(animal.price_pen).toLocaleString("es-PE")}`}</strong></article>)}</div>}</div></section>;
}
