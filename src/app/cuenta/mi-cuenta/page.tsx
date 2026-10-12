import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { trialDate, trialStatus } from "@/lib/trial";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

export default async function MyAccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");
  const { data: profile } = await supabase.from("profiles").select("plan,trial_started_at,trial_ends_at").eq("id", user.id).maybeSingle();
  const trial = trialStatus(profile);
  return <section className="inventory-page finance-page my-account-section"><div className="section-shell">
    <div className="inventory-heading"><div><span className="eyebrow">Acceso y privacidad</span><h1>Mi cuenta</h1><p>Administra tu acceso y conoce cómo tratamos tu información.</p></div></div>
    <div className="account-card my-account-card"><h2>Tu acceso a CRIA360</h2><p>Correo de registro</p><strong className="my-account-email">{user.email}</strong><p>Si ingresas con Google, tu contraseña se administra desde tu cuenta de Google.</p><form action="/auth/signout" method="post"><button className="button button-secondary" type="submit">Cerrar sesión</button></form></div>
    <div className="account-card my-account-card"><h2>{trial.status === "paid" ? "Tu plan" : "Tu prueba gratis de 30 días"}</h2><p>{trial.status === "paid" ? "Tu plan de pago está activo." : trial.status === "active" ? `Te quedan ${trial.daysRemaining} días. La prueba corresponde al plan Inicial: hasta 5 animales, 1 publicación activa y 1 placa vinculada.` : trial.status === "expired" ? "Tu prueba terminó. Puedes seguir consultando y descargando tus datos. Para registrar nuevos animales o movimientos solicita la activación de un plan." : "No pudimos verificar tu plan. Contacta con soporte antes de guardar nuevos registros."}</p>{profile?.trial_started_at && profile?.trial_ends_at && trial.status !== "paid" && <dl className="trial-account-detail"><div><dt>Primer registro</dt><dd>{trialDate(profile.trial_started_at)}</dd></div><div><dt>Fin de la prueba</dt><dd>{trialDate(profile.trial_ends_at)}</dd></div></dl>}<p>Sin tarjeta ni renovación automática. Cerrar sesión, editar tu perfil o reinstalar la mini app no reinicia la prueba.</p><Link className="button button-secondary" href="/planes">Comparar planes</Link> <Link className="button button-primary" href="/cuenta/soporte">Solicitar activación</Link></div>
    <div className="account-card my-account-card"><h2>Tus datos</h2><p>La descarga incluye tu perfil, criadero, animales y movimientos en formato JSON. Está disponible incluso después de la prueba.</p><a className="button button-secondary" href="/api/cuenta/exportar">Descargar mis datos</a> <Link className="button button-secondary" href="/privacidad">Política de privacidad</Link> <Link className="button button-secondary" href="/cuenta/soporte">Contactar soporte</Link></div>
    <div className="account-card my-account-card"><h2>Eliminar mi cuenta</h2><p>Puedes solicitar la eliminación de tu cuenta y de los datos asociados. Primero verificaremos tu identidad y te informaremos sobre los registros que se deban conservar.</p><Link className="button button-secondary" href="/eliminar-cuenta">Solicitar eliminación de cuenta</Link></div>
  </div></section>;
}

