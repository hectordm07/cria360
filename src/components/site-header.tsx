import Link from "next/link";
import { AccountLink } from "./account-link";
import { Logo } from "./logo";

export function SiteHeader() {
  return <header className="site-header"><div className="section-shell header-inner">
    <Logo />
    <nav aria-label="Navegación principal"><Link href="/#especies">Para granjas</Link><Link href="/placas-inteligentes">Placas QR + NFC</Link><Link href="/marketplace">Animales</Link><Link href="/blog">Guía de crianza</Link><Link href="/planes">Planes</Link></nav>
    <div className="header-actions"><AccountLink /><Link className="button button-small button-primary" href="/registro">Crear mi granja</Link></div>
  </div></header>;
}
