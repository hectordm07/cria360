import type { Metadata } from "next";
import { InstallAppButton } from "@/components/install-app-button";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Instalar la app",
  description: "Instala CRIA360 en tu celular Android o iPhone.",
  alternates: { canonical: "/instalar" },
};

export default function InstallPage() {
  return (
    <section className="install-page">
      <div className="section-shell install-grid">
        <div className="phone-preview" aria-label="Vista móvil de CRIA360">
          <div className="phone-speaker" />
          <div className="phone-screen">
            <div className="mini-app-head"><span className="auth-logo-mark">C</span><strong>CRIA360</strong></div>
            <div className="mini-greeting"><small>Buenos días</small><strong>Tu criadero en el bolsillo</strong></div>
            <div className="mini-actions"><span>Publicar</span><span>Animales</span><span>Placas</span></div>
            <div className="mini-card"><span>PLAN GRATIS</span><strong>2 publicaciones activas</strong><small>Administra tus animales desde cualquier lugar.</small></div>
          </div>
        </div>
        <div className="install-copy">
          <span className="eyebrow">App móvil CRIA360</span>
          <h1>Instálala sin descargarla de una tienda.</h1>
          <p>CRIA360 funciona como una aplicación en Android y iPhone: abre a pantalla completa, mantiene tu sesión y ofrece accesos rápidos para comprar, publicar y administrar.</p>
          <InstallAppButton />
          <div className="install-benefits">
            <div><Icon name="check" /><span><strong>Acceso rápido</strong><small>Un ícono directo en la pantalla de inicio.</small></span></div>
            <div><Icon name="check" /><span><strong>Vista tipo app</strong><small>Navegación inferior optimizada para una mano.</small></span></div>
            <div><Icon name="check" /><span><strong>Siempre actualizada</strong><small>No necesitas descargar nuevas versiones.</small></span></div>
          </div>
          <div className="platform-steps">
            <article><strong>Android</strong><p>Abre CRIA360 en Chrome, toca “Instalar aplicación” y confirma.</p></article>
            <article><strong>iPhone</strong><p>Abre en Safari, toca Compartir y selecciona “Agregar a inicio”.</p></article>
          </div>
        </div>
      </div>
    </section>
  );
}
