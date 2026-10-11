"use client";
import Link from "next/link";

export default function AccountError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="account-dashboard account-recovery" role="alert"><h1>No pudimos abrir esta sección</h1><p>Vuelve a intentarlo. También puedes regresar al inicio de tu criadero.</p><div><button type="button" className="button button-primary" onClick={retry}>Intentar de nuevo</button><Link className="button button-secondary" href="/cuenta">Ir al inicio</Link></div></section>;
}
