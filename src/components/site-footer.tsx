import Link from "next/link";
import { Logo } from "./logo";
import { CRIA360_WHATSAPP, whatsappLink, whatsappDisplay } from "@/lib/whatsapp";

export function SiteFooter({ whatsappNumber }: { whatsappNumber?: string | null }) {
  return <footer className="site-footer">
    <div className="section-shell footer-grid">
      <div><Logo inverse /><p>Marketplace, identidad y gestión responsable para criaderos de animales.</p><a href={whatsappLink("Hola CRIA360, quisiera información sobre soporte o ventas para empresas.", whatsappNumber || CRIA360_WHATSAPP)} target="_blank" rel="noopener noreferrer">WhatsApp: {whatsappDisplay(whatsappNumber || CRIA360_WHATSAPP)}</a></div>
      <div><strong>Comprar</strong><Link href="/marketplace">Venta de animales</Link><Link href="/venta-de-gallos">Venta de gallos</Link><Link href="/criaderos/hacienda-el-roble">Criaderos</Link></div>
      <div><strong>CRIA360</strong><Link href="/placas-inteligentes">Placa QR animal</Link><Link href="/planes">Planes</Link><Link href="/registro">Crear mi granja</Link><Link href="/contacto">Contacto</Link></div>
      <div><strong>Legal</strong><Link href="/aviso-legal">Aviso legal</Link><Link href="/privacidad">Privacidad</Link><Link href="/aviso-legal#reclamaciones">Libro de Reclamaciones</Link><Link href="/eliminar-cuenta">Eliminar mi cuenta</Link><Link href="/cookies">Cookies</Link><Link href="/blog">Guía de crianza</Link></div>
    </div>
    <div className="section-shell footer-bottom"><span>© 2026 CRIA360. Todos los derechos reservados.</span><Link href="/contacto">Hecho en Perú para Latinoamérica.</Link></div>
  </footer>;
}


