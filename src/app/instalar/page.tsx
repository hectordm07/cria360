import type { Metadata } from "next";
import Link from "next/link";
import { InstallAppButton } from "@/components/install-app-button";
import { Icon } from "@/components/icon";
import { LogoMark } from "@/components/logo-mark";

export const metadata: Metadata = {
  title: "Instalar la mini app",
  description: "Añade CRIA360 a la pantalla de inicio de tu Android o iPhone. Tu inventario, ventas y fichas QR desde la web.",
  alternates: { canonical: "/instalar" },
};

export default function InstallPage() {
  return <section className="install-page miniapp-install-page"><div className="section-shell install-grid">
    <div className="install-copy">
      <span className="eyebrow">CRIA360 · Mini app web</span>
      <h1>Tu criadero,<br />a un toque.</h1>
      <p>Añade CRIA360 a la pantalla de inicio de tu celular. Entra a tu inventario, registra ventas y gastos y consulta las fichas de tus animales.</p>
      <InstallAppButton />
      <Link className="text-link install-open-link" href="/cuenta">Entrar a mi criadero <span aria-hidden="true">→</span></Link>
      <div className="install-benefits">
        <div><Icon name="check" /><span><strong>Un icono en tu celular</strong><small>Abre CRIA360 directamente desde tu pantalla de inicio.</small></span></div>
        <div><Icon name="check" /><span><strong>Tu información sincronizada</strong><small>Usa la misma cuenta en tu celular y computadora.</small></span></div>
        <div><Icon name="check" /><span><strong>Plan gratis para empezar</strong><small>Registra hasta 5 animales en tu criadero.</small></span></div>
      </div>
    </div>
    <div className="install-app-tile"><div className="install-app-symbol"><LogoMark inverse /></div><strong>CRIA360</strong><span>Tu granja, conectada.</span><p>Inventario · Ventas · Identidad QR</p></div>
    <div className="platform-steps miniapp-platform-steps">
      <article id="instalar-android"><span className="eyebrow">Android</span><h2>Añadir desde Chrome</h2><ol><li>Abre esta página en Chrome.</li><li>Toca el menú <strong>⋮</strong> de tu navegador.</li><li>Elige <strong>Añadir a pantalla de inicio</strong> o <strong>Instalar aplicación</strong> y confirma.</li></ol></article>
      <article id="instalar-iphone"><span className="eyebrow">iPhone / iPad</span><h2>Añadir desde Safari</h2><ol><li>Abre esta página en Safari.</li><li>Toca <strong>Compartir</strong>.</li><li>Elige <strong>Añadir a pantalla de inicio</strong> y confirma.</li></ol></article>
    </div>
    <p className="miniapp-install-note">Necesitas conexión para consultar y guardar los datos del criadero. Si abriste el enlace dentro de Facebook o WhatsApp, usa la opción de abrirlo en Chrome o Safari.</p>
  </div></section>;
}
