import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return <footer className="site-footer"><div className="section-shell footer-grid"><div><Logo inverse /><p>Marketplace, identidad y gestión responsable para criaderos de animales.</p></div><div><strong>Comprar</strong><Link href="/marketplace">Venta de animales</Link><Link href="/venta-de-gallos">Venta de gallos</Link><Link href="/criaderos/hacienda-el-roble">Criaderos</Link></div><div><strong>CRIA360</strong><Link href="/placas-inteligentes">Placa QR animal</Link><Link href="/planes">Planes</Link><Link href="/registro">Publicar un animal</Link></div><div><strong>Aprende</strong><Link href="/blog">Nutrición y crianza</Link><span>Privacidad</span><span>Bienestar animal</span></div></div><div className="section-shell footer-bottom"><span>© 2026 CRIA360. Todos los derechos reservados.</span><span>Hecho en Perú para Latinoamérica.</span></div></footer>;
}
