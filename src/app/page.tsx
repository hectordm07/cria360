import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AnimalCard } from "@/components/animal-card";
import { FinanceChart } from "@/components/dashboard-charts";
import { Icon } from "@/components/icon";
import { blogPosts } from "@/lib/blog-data";
import { animalCategories } from "@/lib/category-data";
import { featuredAnimals } from "@/lib/demo-data";

export const metadata: Metadata = { alternates: { canonical: "/" } };
const illustration = [
  { key: "example-1", label: "Mes 1", sales: 1100, purchases: 600, expenses: 220 },
  { key: "example-2", label: "Mes 2", sales: 1600, purchases: 900, expenses: 340 },
  { key: "example-3", label: "Mes 3", sales: 1300, purchases: 650, expenses: 300 },
  { key: "example-4", label: "Mes 4", sales: 2200, purchases: 1000, expenses: 500 },
  { key: "example-5", label: "Mes 5", sales: 1900, purchases: 850, expenses: 420 },
  { key: "example-6", label: "Mes 6", sales: 2600, purchases: 1100, expenses: 550 },
];

export default function Home() {
  return <div className="landing-page">
    <section className="landing-hero">
      <div className="section-shell landing-hero-grid">
        <div className="landing-hero-copy">
          <h1>Identidad que protege.<br /><em>Gestión que hace crecer.</em></h1>
          <p>Identifica tus animales con placas QR o NFC y administra inventario, genealogía, vacunas y publicaciones desde un solo panel.</p>
          <div className="landing-hero-actions"><Link className="button button-gold" href="/registro" data-analytics-cta="crear-granja-hero">Empezar gratis<Icon name="spark" size={16} /></Link><Link className="button button-outline-light" href="#gestion">Explorar el panel</Link></div>
          <ul className="landing-hero-points"><li><Icon name="check" size={16} /> Plan gratuito: hasta 5 animales</li><li><Icon name="check" size={16} /> Desde tu celular o computadora</li></ul>
        </div>
        <figure className="landing-hero-photo">
          <Image src="/images/hero-granja-movil-v2.webp" alt="Productor avícola consultando su celular junto a los animales de su granja" fill preload sizes="(max-width: 760px) 100vw, 50vw" />
          <figcaption><Icon name="tag" size={20} /><div><strong>Tu granja, conectada.</strong><span>Una placa. Una ficha siempre actualizada.</span></div></figcaption>
        </figure>
      </div>
    </section>

    <div className="landing-benefits"><ul className="section-shell"><li><Icon name="store" /> Inventario organizado</li><li><Icon name="tree" /> Genealogía conectada</li><li><Icon name="health" /> Historial sanitario</li><li><Icon name="scan" /> Identidad QR + NFC</li></ul></div>

    <section className="section-shell landing-overview" id="gestion">
      <div className="landing-overview-copy"><h2>Tu criadero,<br /><em>de un vistazo.</em></h2><p>Menos registros dispersos. Más claridad para cuidar tus animales y organizar el trabajo de cada día.</p>
        <dl className="landing-feature-list"><div><dt>Un inventario que puedes consultar</dt><dd>Fichas, fotografías y estados de cada animal.</dd></div><div><dt>Información que acompaña su crianza</dt><dd>Procedencia, padres y registros de salud en un solo lugar.</dd></div><div><dt>Las cifras de tu negocio, ordenadas</dt><dd>Gráficos de ventas, compras y gastos para seguir tus movimientos.</dd></div></dl>
        <Link className="text-link" href="/cuenta">Entrar al panel <span aria-hidden="true">→</span></Link>
      </div>
      <div className="landing-overview-visual"><FinanceChart months={illustration} illustrative /><p className="landing-preview-caption">Ejemplo ilustrativo. En tu cuenta verás los datos de tu criadero.</p></div>
    </section>

    <section className="section-shell landing-identity" aria-labelledby="identity-title">
      <div className="landing-identity-visual"><Icon name="scan" size={56} /><div><strong>CRIA360 ID</strong><span>QR + NFC</span></div><p>Una placa que conecta con la ficha de tu animal.</p><Link className="text-link" href="/animales/CRIA-PE-01452">Abrir ficha de ejemplo <span aria-hidden="true">→</span></Link></div>
      <div><h2 id="identity-title">Su historia,<br /><em>siempre a la mano.</em></h2><p>El QR y el NFC abren la misma identidad digital. Tú decides qué información compartes y cuál permanece privada.</p><ul><li><Icon name="check" size={18} />Código único vinculado al animal.</li><li><Icon name="check" size={18} />Consulta la ficha desde el navegador.</li><li><Icon name="check" size={18} />Actualiza la información sin cambiar la placa.</li></ul><Link className="text-link" href="/placas-inteligentes">Conocer las placas inteligentes <span aria-hidden="true">→</span></Link></div>
    </section>

    <section className="section-shell landing-species" id="especies">
      <div className="landing-section-heading"><div><h2>Un espacio para cada crianza.</h2><p>Explora animales de granja, equinos, mascotas permitidas y otras especies autorizadas.</p></div><Link className="text-link" href="/marketplace">Ver marketplace <span aria-hidden="true">→</span></Link></div>
      <form className="landing-search" action="/marketplace"><label htmlFor="home-search">Encuentra un animal, raza o criadero</label><div><Icon name="search" size={18} /><input id="home-search" type="search" name="q" autoComplete="off" placeholder="Ej. gallinas, vacunos, criadero…" /><button className="button button-primary" type="submit">Buscar</button></div></form>
      <div className="landing-species-grid">{animalCategories.map(category => <Link href={`/categorias/${category.slug}`} className="landing-species-card" key={category.slug}><div className="landing-species-photo"><Image src={category.image} alt={category.imageAlt} fill sizes="(max-width: 620px) 45vw, (max-width: 900px) 30vw, 22vw" /></div><div><strong>{category.shortName}</strong><span aria-hidden="true">→</span></div></Link>)}</div>
    </section>

    <section className="landing-process"><div className="section-shell"><div className="landing-section-heading"><div><h2>Del primer registro<br />a la publicación.</h2><p>La ficha se actualiza sin reemplazar la placa del animal.</p></div><Link className="button button-secondary" href="/placas-inteligentes">Cómo funciona QR + NFC</Link></div><ol>
      <li><h3>Registra</h3><p>Crea el inventario privado de tu criadero.</p></li>
      <li><h3>Identifica</h3><p>Vincula una placa QR o NFC con un código único.</p></li>
      <li><h3>Documenta</h3><p>Organiza procedencia, salud y genealogía.</p></li>
      <li><h3>Publica</h3><p>Comparte solo la información autorizada.</p></li>
    </ol></div></section>

    <section className="section-shell landing-featured"><div className="landing-section-heading"><div><h2>Conoce el marketplace.</h2><p>Fichas demostrativas para explorar la experiencia de CRIA360.</p></div><Link className="text-link" href="/marketplace">Explorar animales <span aria-hidden="true">→</span></Link></div><div className="animal-grid">{featuredAnimals.slice(0, 3).map(animal => <AnimalCard animal={animal} key={animal.id} />)}</div></section>

    <section className="landing-responsible"><div className="section-shell"><Icon name="shield" size={32} /><div><h2>Una crianza responsable.<br />Un marketplace con criterios claros.</h2><p>Solo especies de crianza y tenencia autorizadas, con documentación sanitaria cuando corresponda. Sin fauna protegida, peleas, apuestas, maltrato o comercio prohibido.</p></div><Link className="text-link" href="/aviso-legal">Ver criterios de publicación</Link></div></section>

    <section className="section-shell landing-guides"><div className="landing-section-heading"><div><h2>Para cuidar mejor,<br /><em>cada día.</em></h2><p>Guías de nutrición, salud y crianza.</p></div><Link className="text-link" href="/blog">Ver todas las guías <span aria-hidden="true">→</span></Link></div><div className="article-grid">{blogPosts.slice(0, 3).map(post => <article className="article-card" key={post.slug}><Link href={`/blog/${post.slug}`} className="article-image"><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 620px) 100vw, 33vw" /></Link><div><span>{post.category} · {post.readingTime}</span><Link href={`/blog/${post.slug}`}><h3>{post.title}</h3></Link><p>{post.description}</p><Link className="article-link" href={`/blog/${post.slug}`}>Leer guía</Link></div></article>)}</div></section>

    <section className="section-shell landing-start" aria-labelledby="start-title"><div><h2 id="start-title">Empieza gratis.<br /><em>Crece a tu ritmo.</em></h2><p>Prueba CRIA360 con el plan Inicial: hasta 5 animales, ficha básica, fotografías y una publicación activa.</p><p>Cuando tu criadero lo necesite, elige Granja o Granja Pro para ampliar capacidad y acceder a la carga masiva desde Excel.</p><Link className="text-link" href="/planes">Comparar planes y precios <span aria-hidden="true">→</span></Link></div><div className="landing-start-detail"><strong>Plan Inicial</strong><span className="landing-start-price">Gratis</span><ul><li><Icon name="check" size={18} />Hasta 5 animales</li><li><Icon name="check" size={18} />Ficha básica y fotografías</li><li><Icon name="check" size={18} />1 publicación activa</li></ul><Link className="button button-primary" href="/registro" data-analytics-cta="plan-inicial-landing">Crear mi cuenta gratuita</Link><small>Las placas físicas se adquieren por separado.</small></div></section>

    <section className="landing-final"><div className="section-shell"><div><h2>Empieza con<br /><em>tu primer animal.</em></h2><p>Crea la vitrina digital de tu criadero y conecta cada ficha con su origen.</p></div><div><Link className="button button-gold" href="/registro" data-analytics-cta="crear-granja-final">Empezar gratis</Link><Link className="text-link" href="/planes">Conocer los planes <span aria-hidden="true">→</span></Link></div></div></section>
  </div>;
}
