import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mis publicaciones", robots: { index: false, follow: false } };

export default async function PublicationsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");
  const { data: animals } = await supabase.from("animals").select("id, public_code, name, species, breed, publication_status, price_pen, view_count, image_urls").eq("owner_id", data.user.id).order("created_at", { ascending: false });
  const records = animals ?? [];
  const published = records.filter((item) => item.publication_status === "publicado").length;
  const views = records.reduce((total, item) => total + (item.view_count ?? 0), 0);

  return <section className="inventory-page publications-page"><div className="section-shell">
    <div className="inventory-heading"><div><span className="eyebrow">Ventas y alcance</span><h1>Mis publicaciones</h1><p>Controla qué animales están visibles y cuántas visitas reciben.</p></div><Link className="button button-primary" href="/cuenta/animales/nuevo">+ Nueva publicación</Link></div>
    <div className="publication-summary"><article><small>Publicaciones activas</small><strong>{published}</strong></article><article><small>Vistas acumuladas</small><strong>{views}</strong></article><article><small>Animales disponibles</small><strong>{records.filter((item) => item.publication_status !== "pausado").length}</strong></article></div>
    {!records.length ? <div className="empty-inventory"><strong>Aún no tienes publicaciones</strong><p>Registra un animal y selecciona “Publicado” para mostrarlo en el marketplace.</p><Link className="button button-primary" href="/cuenta/animales/nuevo">Registrar animal</Link></div> : <div className="publication-table"><div className="publication-table-head"><span>Animal</span><span>Estado</span><span>Precio</span><span>Vistas</span></div>{records.map((animal) => <article key={animal.id}><div><span className="inventory-code">{animal.public_code}</span><strong>{animal.name}</strong><small>{[animal.species, animal.breed].filter(Boolean).join(" · ")}</small></div><span className={`publication-state state-${animal.publication_status}`}>{animal.publication_status}</span><strong>{animal.price_pen == null ? "Sin precio" : `S/ ${Number(animal.price_pen).toLocaleString("es-PE")}`}</strong><span className="publication-views">{animal.view_count ?? 0}</span></article>)}</div>}
  </div></section>;
}
