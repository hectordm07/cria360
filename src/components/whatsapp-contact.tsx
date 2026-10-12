import { Icon } from "@/components/icon";
import { CRIA360_WHATSAPP, whatsappDisplay, whatsappLink } from "@/lib/whatsapp";

export function WhatsAppContact({ number, salesOnly = false }: { number?: string | null; salesOnly?: boolean }) {
  const phone = number || CRIA360_WHATSAPP;
  return <section className="whatsapp-contact" aria-label="WhatsApp de soporte y ventas empresariales">
    <div className="whatsapp-contact-heading"><h2>{salesOnly ? "¿Tu empresa necesita más capacidad?" : "Hablemos por WhatsApp"}</h2><p>{salesOnly ? "Cuéntanos cuántos animales y criaderos administras. Coordinamos una propuesta para tu operación." : "Soporte para tu cuenta y atención comercial para empresas grandes."}</p><strong>{whatsappDisplay(phone)}</strong></div>
    <div className={`whatsapp-contact-options${salesOnly ? " sales-only" : ""}`}>
      {!salesOnly && <a className="whatsapp-contact-card" href={whatsappLink("Hola CRIA360, necesito soporte con mi cuenta o mi criadero.", phone)} target="_blank" rel="noopener noreferrer" data-analytics-cta="whatsapp-support"><Icon name="help" size={25} /><span><strong>Soporte por WhatsApp</strong><small>Ayuda con acceso, inventario, QR y uso de la app.</small></span><span aria-hidden="true">↗</span></a>}
      <a className="whatsapp-contact-card enterprise" href={whatsappLink("Hola CRIA360, represento a una empresa y quisiera una cotización para una operación de mayor tamaño.", phone)} target="_blank" rel="noopener noreferrer" data-analytics-cta="whatsapp-enterprise"><Icon name="users" size={25} /><span><strong>Ventas para empresas</strong><small>Cotiza una solución para criaderos y operaciones grandes.</small></span><span aria-hidden="true">↗</span></a>
    </div>
  </section>;
}
