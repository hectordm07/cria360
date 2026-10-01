import Link from "next/link";
import { AccountLink } from "./account-link";
import { Logo } from "./logo";

export function SiteHeader() {
  return <header className="site-header"><div className="section-shell header-inner"><Logo /><nav aria-label="Navegación principal"><Link href="/marketplace">Marketplace</Link><Link href="/#especies">Especies</Link><Link href="/placas-inteligentes">QR + NFC</Link><Link href="/blog">Guía animal</Link><Link href="/planes">Planes</Link></nav><div className="header-actions"><AccountLink /><Link className="button button-small button-primary" href="/registro">Publicar animal</Link></div></div></header>;
}
