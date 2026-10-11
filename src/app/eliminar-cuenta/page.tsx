import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { requestAccountDeletion } from "./actions";

export const metadata: Metadata = {
  title: "Eliminar mi cuenta",
  description: "Solicita la eliminación de tu cuenta CRIA360 y de tus datos asociados, aunque ya no tengas la app instalada.",
  alternates: { canonical: "/eliminar-cuenta" },
};

export default async function DeleteAccountPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const params = await searchParams;
  await connection();
  // Server-only timestamp for this request, never a cached or client-rendered value.
  // eslint-disable-next-line react-hooks/purity
  const startedAt = Date.now();
  return <section className="legal-page contact-page"><div className="section-shell legal-shell">
    <span className="eyebrow">Tu cuenta, tu decisión</span>
    <h1>Solicitar eliminación de mi cuenta</h1>
    <p className="legal-lead">Puedes enviar esta solicitud sin iniciar sesión y sin tener instalada la app CRIA360.</p>
    <article><h2>Qué sucede después</h2><p>Recibiremos tu solicitud en nuestro panel de contacto. Antes de realizar cualquier eliminación, verificaremos que eres titular de la cuenta mediante el correo con el que te registraste. Una solicitud enviada por otra persona no permite eliminar tu cuenta.</p></article>
    <article><h2>Qué datos se eliminan</h2><p>La solicitud comprende tu acceso a CRIA360, perfil, datos personales del criadero, fotografías y registros vinculados a tu cuenta. Si compartes un criadero o existen registros vinculados a otros usuarios, revisaremos contigo su tratamiento antes de cerrar la cuenta.</p><p>Los datos que deban conservarse por obligaciones legales, seguridad o resolución de reclamaciones se limitarán a esa finalidad y al plazo aplicable. Las copias de respaldo se retirarán al finalizar su ciclo de conservación. Te informaremos si existe una excepción que afecte tu solicitud.</p></article>
    {params.ok ? <div className="form-success" role="status"><strong>Tu solicitud quedó registrada.</strong><p>Revisaremos la información y nos comunicaremos contigo al correo indicado para verificar tu identidad. La cuenta permanece activa hasta completar este proceso.</p><Link href="/">Volver al inicio</Link></div> : <>
      {params.error && <p className="form-error" role="alert">{params.error === "guardar" ? "No pudimos registrar la solicitud. Inténtalo nuevamente o utiliza Contacto." : "Revisa tu nombre, correo y la confirmación antes de enviar."} <Link href="/contacto">Ir a Contacto</Link></p>}
      <form action={requestAccountDeletion} className="public-contact-form">
        <input className="hp-field" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input type="hidden" name="started_at" value={startedAt} />
        <div className="form-grid">
          <label>Tu nombre<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
          <label>Correo de tu cuenta CRIA360<input name="email" type="email" required maxLength={180} autoComplete="email" /></label>
        </div>
        <label>Información adicional (opcional)<textarea name="reason" maxLength={1500} rows={4} placeholder="Puedes indicar el nombre de tu criadero para ayudarnos a localizar la cuenta." /></label>
        <label className="deletion-confirm"><input type="checkbox" name="confirm" value="yes" required /><span>Solicito eliminar mi cuenta y los datos asociados. Entiendo que primero se verificará mi identidad.</span></label>
        <button className="button button-primary" type="submit">Enviar solicitud de eliminación</button>
      </form>
    </>}
    <p className="legal-updated">Consulta nuestra <Link href="/privacidad">política de privacidad</Link>. Si solo necesitas ayuda, visita <Link href="/contacto">Contacto</Link>.</p>
  </div></section>;
}
