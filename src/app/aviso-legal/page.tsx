import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Información legal sobre el uso del sitio y la plataforma CRIA360.",
  alternates: { canonical: "/aviso-legal" },
};

export default async function LegalNoticePage() {
  const settings = await getPublicSiteSettings();
  return <section className="legal-page"><div className="section-shell legal-shell">
    <span className="eyebrow">Información legal</span><h1>Aviso legal</h1>
    <p className="legal-lead">Este documento regula el acceso y uso de CRIA360.</p>
    <article><h2>1. Titular y contacto</h2><p>El sitio opera bajo la denominación <strong>{settings.legal_name}</strong>. Para consultas legales o administrativas utiliza nuestra <Link href="/contacto">página de contacto</Link>{settings.contact_email ? <> o escribe a <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a></> : null}.</p></article>
    <article><h2>2. Finalidad de la plataforma</h2><p>CRIA360 ofrece herramientas de identidad digital, inventario, genealogía, historial sanitario, publicaciones y servicios relacionados con criaderos y animales permitidos legalmente.</p></article>
    <article><h2>3. Uso responsable</h2><p>No se permite utilizar la plataforma para comercio ilícito, fauna silvestre protegida, peleas, apuestas, maltrato, documentación falsa o actividades contrarias a la ley.</p></article>
    <article><h2>4. Contenido de usuarios</h2><p>Los usuarios son responsables de la veracidad de la información, fotografías, precios y documentos que registren. CRIA360 puede retirar contenido que incumpla las condiciones de uso o represente un riesgo para terceros.</p></article>
    <article><h2>5. Propiedad intelectual</h2><p>La marca, interfaz, textos propios, software y elementos gráficos de CRIA360 están protegidos por las normas aplicables. El contenido aportado por cada usuario conserva la titularidad que legalmente corresponda.</p></article>
    <article><h2>6. Enlaces y servicios externos</h2><p>Algunas funciones pueden enlazar a servicios de terceros. Sus términos, disponibilidad y políticas son responsabilidad de cada proveedor.</p></article>
    <article><h2>7. Actualizaciones</h2><p>Este aviso puede actualizarse cuando cambien las funciones, requisitos legales o condiciones de operación. La versión publicada en esta página será la vigente.</p></article>
    <p className="legal-updated">Última actualización: 5 de octubre de 2026.</p>
  </div></section>;
}
