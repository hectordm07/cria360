import type { Metadata } from "next";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { Icon } from "@/components/icon";

export const metadata: Metadata = {
  title: "Ingresar",
  description: "Ingresa a CRIA360 con tu cuenta de Google para administrar tu criadero.",
  alternates: { canonical: "/ingresar" },
};

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="auth-page">
      <div className="auth-benefits">
        <span className="eyebrow light">Tu cuenta CRIA360</span>
        <h1>Tu criadero,<br />siempre contigo.</h1>
        <p>Accede desde la web o instala CRIA360 en tu celular para administrar tus animales desde cualquier lugar.</p>
        <ul>
          <li><Icon name="check" /> Publicaciones y contactos en un solo lugar</li>
          <li><Icon name="check" /> Identidad, genealogía y salud organizadas</li>
          <li><Icon name="check" /> La misma cuenta en computadora y celular</li>
        </ul>
      </div>
      <div className="auth-panel">
        <span className="auth-logo-mark">C</span>
        <h2>Bienvenido a CRIA360</h2>
        <p>Usa tu cuenta de Google. No tendrás que crear ni recordar otra contraseña.</p>
        {params.error && <p className="auth-error" role="alert">No fue posible completar el acceso. Vuelve a intentarlo.</p>}
        <GoogleSignInButton />
        <div className="auth-divider"><span>Acceso seguro</span></div>
        <small>CRIA360 solo solicitará tu nombre, correo y foto de perfil.</small>
        <Link href="/instalar" className="text-link">¿Quieres instalar la app?</Link>
      </div>
    </section>
  );
}
