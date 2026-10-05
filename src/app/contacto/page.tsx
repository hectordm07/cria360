import type { Metadata } from "next";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { sendPublicContact } from "./actions";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Contacta a CRIA360 para consultas sobre la plataforma, placas QR/NFC, planes y soporte.",
  alternates: { canonical: "/contacto" },
};

export default async function ContactPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const [settings, params] = await Promise.all([getPublicSiteSettings(), searchParams]);
  const whatsapp = (settings.whatsapp_number ?? "").replace(/\D/g, "");

  return (
    <section className="legal-page contact-page">
      <div className="section-shell legal-shell">
        <span className="eyebrow">Contacto</span>
        <h1>Hablemos de CRIA360</h1>
        <p className="legal-lead">Consultas sobre tu cuenta, placas inteligentes, marketplace o información legal.</p>

        <div className="contact-options">
          {whatsapp && (
            <a className="contact-option" href={`https://wa.me/${whatsapp}?text=${encodeURIComponent("Hola CRIA360, quisiera recibir información.")}`} target="_blank" rel="noopener noreferrer">
              <strong>WhatsApp</strong><span>Conversación directa</span>
            </a>
          )}
          {settings.contact_email && (
            <a className="contact-option" href={`mailto:${settings.contact_email}`}>
              <strong>Correo</strong><span>{settings.contact_email}</span>
            </a>
          )}
        </div>

        {params.ok && <p className="form-success">Recibimos tu mensaje. Gracias por contactarnos.</p>}
        {params.error && <p className="form-error">No pudimos enviar el mensaje. Revisa los datos e inténtalo nuevamente.</p>}

        <form action={sendPublicContact} className="public-contact-form">
          <input className="hp-field" type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" />
          <input type="hidden" name="started_at" value={Date.now()} />
          <div className="form-grid">
            <label>Nombre<input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label>
            <label>Correo<input name="email" type="email" required maxLength={180} autoComplete="email" /></label>
          </div>
          <label>Asunto<input name="subject" required minLength={3} maxLength={140} /></label>
          <label>Mensaje<textarea name="message" required minLength={10} maxLength={2500} rows={6} /></label>
          <button className="button button-primary" type="submit" data-analytics-cta="contact-form">Enviar mensaje</button>
        </form>
      </div>
    </section>
  );
}
