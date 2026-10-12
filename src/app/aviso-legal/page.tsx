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
    {(settings.legal_ruc || settings.legal_address) && <article><h2>Datos del titular</h2>{settings.legal_ruc && <p>RUC: {settings.legal_ruc}</p>}{settings.legal_address && <p>Domicilio: {settings.legal_address}</p>}</article>}
    <article><h2>2. Finalidad de la plataforma</h2><p>CRIA360 ofrece herramientas de identidad digital, inventario, genealogía, historial sanitario, publicaciones y servicios relacionados con criaderos y animales permitidos legalmente.</p></article>
    <article><h2>3. Uso responsable</h2><p>No se permite utilizar la plataforma para comercio ilícito, fauna silvestre protegida, peleas, apuestas, maltrato, documentación falsa o actividades contrarias a la ley.</p></article>
    <article><h2>4. Contenido de usuarios</h2><p>Los usuarios son responsables de la veracidad de la información, fotografías, precios y documentos que registren. CRIA360 puede retirar contenido que incumpla las condiciones de uso o represente un riesgo para terceros.</p></article>
    <article><h2>5. Propiedad intelectual</h2><p>La marca, interfaz, textos propios, software y elementos gráficos de CRIA360 están protegidos por las normas aplicables. El contenido aportado por cada usuario conserva la titularidad que legalmente corresponda.</p></article>
    <article><h2>6. Enlaces y servicios externos</h2><p>Algunas funciones pueden enlazar a servicios de terceros. Sus términos, disponibilidad y políticas son responsabilidad de cada proveedor.</p></article>
    <article><h2>7. Actualizaciones</h2><p>Este aviso puede actualizarse cuando cambien las funciones, requisitos legales o condiciones de operación. La versión publicada en esta página será la vigente.</p></article>
    <article><h2>8. Prueba gratis de lanzamiento</h2><p>El plan Inicial ofrece una prueba gratuita de 30 días corridos (720 horas) desde el primer registro del correo en CRIA360. Incluye hasta 5 animales, una publicación activa y una placa vinculada. Las placas físicas se adquieren por separado.</p><p>No se solicita tarjeta ni se realiza un cobro automático al terminar. La fecha de inicio no se reinicia por cerrar sesión, editar el perfil o reinstalar la mini app. Al vencer, los datos se conservan para consulta y descarga; el registro de nuevos animales, publicaciones y movimientos requiere un plan de pago activo.</p></article>
    <article><h2>9. Planes de pago y compras</h2><p>Los precios, periodo y capacidad figuran en <Link href="/planes">Planes</Link>. La activación se coordina con soporte; solicitar información no equivale a comprar. Antes de pagar debes recibir el importe total, condiciones de activación, cancelación, entrega cuando corresponda y el comprobante aplicable.</p></article>
    <article id="reclamaciones"><h2>10. Atención de reclamos</h2><p>Las consultas de soporte se reciben en <Link href="/contacto">Contacto</Link>. El Libro de Reclamaciones es un canal distinto.</p>{settings.complaints_url ? <p><a href={settings.complaints_url} target="_blank" rel="noopener noreferrer">Abrir el Libro de Reclamaciones</a></p> : <p>El enlace al Libro de Reclamaciones virtual está pendiente de configuración por el titular.</p>}</article>
    <p className="legal-updated">Versión y última actualización: 12 de octubre de 2026.</p>
  </div></section>;
}

