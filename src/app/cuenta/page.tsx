import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mi cuenta",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/ingresar");
  }

  const [{ data: profile }, { data: breeder }, { data: animals }] = await Promise.all([
    supabase.from("profiles").select("full_name, plan, onboarding_completed").eq("id", data.user.id).maybeSingle(),
    supabase.from("breeders").select("name, primary_species").eq("owner_id", data.user.id).maybeSingle(),
    supabase.from("animals").select("inventory_status, publication_status").eq("owner_id", data.user.id),
  ]);
  if (!profile?.onboarding_completed || !breeder) redirect("/registro");
  const displayName = profile.full_name;
  const initial = displayName.trim().charAt(0).toUpperCase() || "C";
  const active = animals?.filter((animal) => animal.inventory_status === "activo").length ?? 0;
  const published = animals?.filter((animal) => animal.publication_status === "publicado").length ?? 0;

  return (
    <section className="account-page">
      <div className="section-shell">
        <div className="account-welcome">
          <span className="account-avatar" aria-hidden="true">{initial}</span>
          <div><span className="eyebrow">Mi cuenta</span><h1>Hola, {displayName}</h1><p>{data.user.email}</p></div>
          <form action="/auth/signout" method="post"><button className="button button-secondary" type="submit">Cerrar sesión</button></form>
        </div>
        <div className="account-stats"><div><strong>{animals?.length ?? 0}</strong><span>Total animales</span></div><div><strong>{active}</strong><span>Activos</span></div><div><strong>{published}</strong><span>Publicados</span></div></div>
        <div className="account-grid">
          <article><span className="icon-box"><Icon name="store" /></span><div><h2>{breeder.name}</h2><p>Especie principal: {breeder.primary_species}. Administra fichas, estados y publicaciones.</p></div><Link className="button button-primary" href="/cuenta/animales">Ver inventario</Link></article>
          <article><span className="icon-box"><Icon name="spark" /></span><div><h2>Plan {profile.plan === "gratis" ? "Gratis" : profile.plan}</h2><p>Hasta 2 publicaciones activas, sin mensualidad.</p></div><Link className="text-link" href="/planes">Ver planes</Link></article>
          <article><span className="icon-box"><Icon name="tag" /></span><div><h2>Placas inteligentes</h2><p>Conecta cada animal con su ficha digital.</p></div><Link className="text-link" href="/placas-inteligentes">Conocer más</Link></article>
        </div>
      </div>
    </section>
  );
}
