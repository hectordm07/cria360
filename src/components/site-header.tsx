import Link from "next/link";
import { AccountLink } from "./account-link";
import { Logo } from "./logo";

export function SiteHeader() {
  return <header className="site-header"><div className="section-shell header-inner"><Logo /><nav aria-label="Navegación principal"><Link href="/marketplace">Comprar animales</Link><Link href="/venta-de-gallos">Gallos</Link><Link href="/placas-inteligentes">Placa inteligente</Link><Link href="/blog">Guía animal</Link><Link href="/planes">Planes</Link></nav><div className="header-actions"><AccountLink /><Link className="button button-small button-primary" href="/registro">Publicar gratis</Link></div></div></header>;
}
