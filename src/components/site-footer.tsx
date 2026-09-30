import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return <footer className="site-footer"><div className="section-shell footer-grid"><div><Logo inverse /><p>La plataforma de identidad, gestión y comercio responsable para criaderos.</p></div><div><strong>Producto</strong><Link href="/marketplace">Marketplace</Link><Link href="/planes">Planes</Link><Link href="/animales/CRIA-PE-00428">Ficha digital</Link></div><div><strong>Comunidad</strong><Link href="/criaderos/hacienda-el-roble">Criaderos</Link><Link href="/registro">Registrar criadero</Link><span>Soporte</span></div><div><strong>Legal</strong><span>Privacidad</span><span>Términos</span><span>Bienestar animal</span></div></div><div className="section-shell footer-bottom"><span>© 2026 CRIA360. Todos los derechos reservados.</span><span>Hecho en Perú para Latinoamérica.</span></div></footer>;
}
