import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";

export default function NotFound() {
  return (
    <section className="not-found-page">
      <div className="not-found-card">
        <span className="auth-logo-mark"><LogoMark /></span>
        <span className="eyebrow">Error 404</span>
        <h1>Esta página no está disponible.</h1>
        <p>Puede haberse movido, eliminado o el enlace puede estar incompleto.</p>
        <div className="not-found-actions">
          <Link className="button button-primary" href="/">Ir al inicio</Link>
          <Link className="button button-secondary" href="/marketplace">Ver animales</Link>
        </div>
      </div>
    </section>
  );
}
