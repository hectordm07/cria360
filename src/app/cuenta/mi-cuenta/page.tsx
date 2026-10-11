import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

export default async function MyAccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");
  return <section className="inventory-page finance-page my-account-section"><div className="section-shell">
    <div className="inventory-heading"><div><span className="eyebrow">Acceso y privacidad</span><h1>Mi cuenta</h1><p>Administra tu acceso y conoce cómo tratamos tu información.</p></div></div>
    <div className="account-card my-account-card"><h2>Tu acceso a CRIA360</h2><p>Correo de registro</p><strong className="my-account-email">{user.email}</strong><p>Si ingresas con Google, tu contraseña se administra desde tu cuenta de Google.</p><form action="/auth/signout" method="post"><button className="button button-secondary" type="submit">Cerrar sesión</button></form></div>
    <div className="account-card my-account-card"><h2>Tus datos</h2><p>Consulta nuestra política o solicita ayuda con tus datos personales.</p><Link className="button button-secondary" href="/privacidad">Política de privacidad</Link> <Link className="button button-secondary" href="/cuenta/soporte">Contactar soporte</Link></div>
    <div className="account-card my-account-card"><h2>Eliminar mi cuenta</h2><p>Puedes solicitar la eliminación de tu cuenta y de los datos asociados. Primero verificaremos tu identidad y te informaremos sobre los registros que se deban conservar.</p><Link className="button button-secondary" href="/eliminar-cuenta">Solicitar eliminación de cuenta</Link></div>
  </div></section>;
}
