import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso de cookies",
  description: "Preferencias de almacenamiento y analítica utilizadas por CRIA360.",
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return <section className="legal-page"><div className="section-shell legal-shell">
    <span className="eyebrow">Preferencias</span><h1>Aviso de cookies y almacenamiento</h1>
    <p className="legal-lead">CRIA360 separa el almacenamiento necesario de la analítica opcional.</p>
    <article><h2>Necesarias</h2><p>Se utilizan mecanismos de sesión y almacenamiento técnico indispensables para autenticación, seguridad, preferencias y funcionamiento de la PWA. No pueden desactivarse desde el panel de consentimiento porque la plataforma podría dejar de funcionar.</p></article>
    <article><h2>Analítica opcional</h2><p>Con tu permiso registramos eventos anónimos de navegación para conocer qué páginas funcionan mejor. Puedes rechazarla y seguir usando CRIA360 normalmente.</p></article>
    <article><h2>Preferencia guardada</h2><p>Tu elección se conserva localmente en el navegador. Si limpias los datos del sitio, volveremos a solicitar tu preferencia.</p></article>
    <article><h2>Más información</h2><p>Consulta la <Link href="/privacidad">Política de privacidad</Link> para conocer cómo protegemos la información.</p></article>
    <p className="legal-updated">Última actualización: 5 de octubre de 2026.</p>
  </div></section>;
}
