import Link from "next/link";

export default function OfflinePage() {
  return (
    <section className="offline-page">
      <div><span className="auth-logo-mark">C</span><h1>Sin conexión</h1><p>Revisa tu conexión a Internet y vuelve a intentarlo.</p><Link className="button button-primary" href="/">Reintentar</Link></div>
    </section>
  );
}
