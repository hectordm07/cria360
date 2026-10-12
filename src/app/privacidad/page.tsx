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
    <article><h2>Registro y duración de la prueba</h2><p>Guardamos la fecha del primer registro de correo para calcular la prueba gratuita de 30 días y prevenir su reinicio. Registramos también la fecha y versión de los términos aceptados en el formulario de registro. La aceptación del servicio no activa comunicaciones promocionales.</p></article>
    <article><h2>3. Finalidades</h2><p>Usamos la información para autenticar cuentas, administrar inventarios y publicaciones, prestar soporte, mejorar la plataforma, prevenir abuso y cumplir obligaciones aplicables.</p></article>
    <article><h2>4. Información pública y privada</h2><p>La ubicación exacta, documentos completos, movimientos internos y datos personales permanecen privados salvo que el usuario decida publicarlos o una obligación legal exija su tratamiento.</p></article>
    <article><h2>5. Analítica</h2><p>La analítica de navegación es opcional. Solo se registra tras el consentimiento y se limita a eventos anónimos como ruta visitada, tipo general de dispositivo y dominio de referencia. No guardamos la dirección IP en nuestra tabla de analítica.</p></article>
    <article><h2>6. Conservación y seguridad</h2><p>Aplicamos controles de acceso, políticas RLS y conexiones cifradas. Conservamos los datos mientras sean necesarios para prestar el servicio, resolver incidencias o cumplir obligaciones. Terminar la prueba no elimina tus registros: puedes consultarlos y descargarlos desde Mi cuenta, o solicitar su eliminación.</p></article>
    <article><h2>7. Derechos y eliminación de cuenta</h2><p>Puedes solicitar acceso o corrección desde <Link href="/contacto">Contacto</Link>. Para cerrar tu cuenta y solicitar la eliminación de los datos asociados, utiliza <Link href="/eliminar-cuenta">Eliminar mi cuenta</Link>, disponible sin iniciar sesión. Desde la app encontrarás el mismo enlace en Mi cuenta.</p><p>Antes de eliminar verificamos la identidad del titular. La solicitud incluye acceso, perfil, datos personales del criadero y registros vinculados. Informaremos si es necesario conservar datos por obligaciones legales, seguridad o reclamaciones, limitando su uso a esa finalidad y al plazo aplicable. Las copias de respaldo se retiran al terminar su ciclo de conservación.</p></article>
    <article><h2>8. Proveedores y acceso desde Android</h2><p>Utilizamos Supabase para autenticación, base de datos y almacenamiento, Vercel para alojar la plataforma y Google cuando eliges iniciar sesión con ese proveedor. La app se añade a la pantalla de inicio desde un navegador compatible y utiliza el mismo servicio que la versión web.</p><p>La cámara se solicita cuando utilizas el escáner QR. El acceso a NFC depende del dispositivo y del navegador. Las autorizaciones se administran desde el navegador y los ajustes del dispositivo. La app no solicita acceso a contactos, SMS ni ubicación precisa. Las fotografías se incorporan cuando tú eliges un archivo.</p></article>
    <article><h2>9. Infraestructura fuera del Perú</h2><p>El servicio utiliza infraestructura internacional de Supabase, Vercel y Google. La base de datos de este proyecto está alojada en la región de São Paulo, Brasil. El alojamiento, distribución de contenido y autenticación pueden implicar tratamiento fuera del Perú según los servicios del proveedor. El titular debe documentar y comunicar los flujos transfronterizos que correspondan.</p></article>
    <p className="legal-updated">Última actualización: 12 de octubre de 2026.</p>
  </div></section>;
}


