import type { Metadata } from "next";
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

  const displayName =
    typeof data.user.user_metadata.full_name === "string"
      ? data.user.user_metadata.full_name
      : "Criador CRIA360";
  const initial = displayName.trim().charAt(0).toUpperCase() || "C";

  return (
    <section className="account-page">
      <div className="section-shell">
        <div className="account-welcome">
          <span className="account-avatar" aria-hidden="true">{initial}</span>
          <div><span className="eyebrow">Mi cuenta</span><h1>Hola, {displayName}</h1><p>{data.user.email}</p></div>
          <form action="/auth/signout" method="post"><button className="button button-secondary" type="submit">Cerrar sesión</button></form>
        </div>
        <div className="account-grid">
          <article><span className="icon-box"><Icon name="store" /></span><div><h2>Mi criadero</h2><p>Completa tu perfil y empieza a publicar animales.</p></div><a className="button button-primary" href="/registro">Configurar</a></article>
          <article><span className="icon-box"><Icon name="spark" /></span><div><h2>Plan Gratis</h2><p>Hasta 2 publicaciones activas, sin mensualidad.</p></div><a className="text-link" href="/planes">Ver planes</a></article>
          <article><span className="icon-box"><Icon name="tag" /></span><div><h2>Placas inteligentes</h2><p>Conecta cada animal con su ficha digital.</p></div><a className="text-link" href="/placas-inteligentes">Conocer más</a></article>
        </div>
      </div>
    </section>
  );
}
