import Link from "next/link";
import { Logo } from "./logo";

export function SiteHeader() {
  return <header className="site-header"><div className="section-shell header-inner"><Logo /><nav aria-label="Navegación principal"><Link href="/marketplace">Marketplace</Link><Link href="/planes">Planes</Link><Link href="/animales/CRIA-PE-00428">Ficha demo</Link></nav><div className="header-actions"><Link className="login-link" href="/registro">Ingresar</Link><Link className="button button-small button-primary" href="/registro">Crear cuenta</Link></div></div></header>;
}
