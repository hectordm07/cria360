import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Icon } from "@/components/icon";
import { LogoMark } from "@/components/logo-mark";
import { getPublicSiteSettings } from "@/lib/site-settings";
import { whatsappLink } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Bienvenido",
  description: "Tu criadero en una mini app. Prueba CRIA360 gratis durante 30 días desde tu primer registro.",
  alternates: { canonical: "/ingresar" },
  robots: { index: false, follow: true },
};

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ error?: string; preview?: string }> }) {
  const [params, settings] = await Promise.all([searchParams, getPublicSiteSettings()]);
  return <section className="signin-screen" aria-labelledby="signin-title">
    <div className="signin-intro">
      <div className="signin-brand"><LogoMark /><span>CRIA<strong>360</strong><small>Tu granja, conectada.</small></span></div>
      <span className="signin-launch-pill"><Icon name="spark" size={16} /> 30 días gratis por lanzamiento</span>
      <h1 id="signin-title">Tu criadero.<br /><em>Siempre contigo.</em></h1>
      <p>Cuida tus animales y lleva las cuentas de tu negocio. Todo desde tu celular.</p>
      <ul className="signin-features">
        <li><span><Icon name="box" size={24} /></span><strong>Animales</strong><small>Fotos y fichas</small></li>
        <li><span><Icon name="wallet" size={24} /></span><strong>Movimientos</strong><small>Ventas y gastos</small></li>
        <li><span><Icon name="scan" size={24} /></span><strong>Identidad</strong><small>QR y NFC</small></li>
      </ul>
    </div>
    <div className="signin-access">
      <h2>Bienvenido a tu mini app</h2>
      <p>Ingresa o crea tu cuenta con Google.</p>
      {params.error && <p className="auth-error" role="alert">No pudimos completar el acceso. Vuelve a intentarlo o <Link href="/contacto">contacta con soporte</Link>.</p>}
      <GoogleSignInButton preview={params.preview === "1"} />
      {params.preview === "1" && <small className="signin-google-info">Vista de ejemplo. Abre tu cuenta fuera de esta previsualización para ingresar.</small>}
      <p className="signin-trial-note"><Icon name="check" size={17} /> Sin tarjeta y sin cobros automáticos.</p>
      <p className="signin-privacy">La prueba del plan Inicial comienza al registrar tu correo por primera vez. Si ya tienes una cuenta, el ingreso conserva tu plan y tus datos.</p>
      <nav className="signin-legal" aria-label="Información de acceso"><Link href="/aviso-legal">Términos</Link><Link href="/privacidad">Privacidad</Link><Link href="/contacto">Ayuda</Link><a href={whatsappLink("Hola CRIA360, necesito ayuda para ingresar a mi cuenta.", settings.whatsapp_number || undefined)} target="_blank" rel="noopener noreferrer">WhatsApp</a></nav>
      <small className="signin-google-info">Google comparte tu nombre, correo y foto de perfil para identificar tu cuenta.</small>
      <Link className="signin-install" href="/instalar">Añadir CRIA360 a mi celular <span aria-hidden="true">→</span></Link>
    </div>
  </section>;
}
