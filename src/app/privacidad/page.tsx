import type { Metadata } from "next";
import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Conoce cómo CRIA360 trata y protege los datos personales de usuarios y criaderos.",
  alternates: { canonical: "/privacidad" },
};

export default async function PrivacyPage() {
  const settings = await getPublicSiteSettings();
  return <section className="legal-page"><div className="section-shell legal-shell">
    <span className="eyebrow">Privacidad</span><h1>Política de privacidad</h1>
    <p className="legal-lead">CRIA360 aplica el principio de mínima información pública y mantiene privados los datos internos del criadero por defecto.</p>
    <article><h2>1. Responsable y contacto</h2><p>El responsable de la plataforma es <strong>{settings.legal_name}</strong>. Puedes ejercer consultas o solicitudes desde <Link href="/contacto">Contacto</Link>{settings.contact_email ? <> o mediante <a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a></> : null}.</p></article>
    <article><h2>2. Datos que tratamos</h2><p>Podemos tratar nombre, correo, teléfono opcional, datos del criadero, inventario animal, fotografías, genealogía, salud declarada, publicaciones, mensajes de soporte y datos técnicos mínimos necesarios para operar el servicio.</p></article>
    <article><h2>3. Finalidades</h2><p>Usamos la información para autenticar cuentas, administrar inventarios y publicaciones, prestar soporte, mejorar la plataforma, prevenir abuso y cumplir obligaciones aplicables.</p></article>
    <article><h2>4. Información pública y privada</h2><p>La ubicación exacta, documentos completos, movimientos internos y datos personales permanecen privados salvo que el usuario decida publicarlos o una obligación legal exija su tratamiento.</p></article>
    <article><h2>5. Analítica</h2><p>La analítica de navegación es opcional. Solo se registra tras el consentimiento y se limita a eventos anónimos como ruta visitada, tipo general de dispositivo y dominio de referencia. No guardamos la dirección IP en nuestra tabla de analítica.</p></article>
    <article><h2>6. Conservación y seguridad</h2><p>Aplicamos controles de acceso, políticas RLS y conexiones cifradas. Conservamos los datos mientras sean necesarios para prestar el servicio, resolver incidencias o cumplir obligaciones.</p></article>
    <article><h2>7. Derechos</h2><p>Los usuarios pueden solicitar acceso, corrección o eliminación de información cuando corresponda, sujeto a obligaciones legales y de seguridad.</p></article>
    <article><h2>8. Terceros</h2><p>CRIA360 puede utilizar proveedores de infraestructura y autenticación necesarios para operar el servicio. Estos proveedores tratan datos conforme a sus propias obligaciones contractuales y legales.</p></article>
    <p className="legal-updated">Última actualización: 5 de octubre de 2026.</p>
  </div></section>;
}
