import Link from "next/link";
import { Icon } from "./icon";

export function AccountInventorySummary({ total, active, published }: { total: string; active: string; published: string }) {
  return <section className="home-inventory" aria-label="Mi criadero">
    <div className="home-section-heading"><h2>Mi criadero</h2><Link href="/cuenta/animales">Ver animales →</Link></div>
    <div className="home-counts">
      <Link href="/cuenta/animales"><Icon name="box" size={22} /><strong>{total}</strong><span>Animales registrados</span><small>{active} activos</small></Link>
      <Link href="/cuenta/publicaciones"><Icon name="users" size={22} /><strong>{published}</strong><span>Publicaciones</span><small>Ver mis anuncios →</small></Link>
    </div>
    <Link className="home-reports-link" href="/cuenta/reportes"><span className="home-report-icon"><Icon name="chart" size={26} /></span><span><strong>Reportes de mi criadero</strong><small>Inventario y resumen económico</small></span><span aria-hidden="true">→</span></Link>
  </section>;
}
