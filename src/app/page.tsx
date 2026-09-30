import Image from "next/image";
import Link from "next/link";
import { AnimalCard } from "@/components/animal-card";
import { Icon } from "@/components/icon";
import { blogPosts } from "@/lib/blog-data";
import { featuredAnimals } from "@/lib/demo-data";

const categories = [
  { name: "Gallos y aves", detail: "Gallos, gallinas y aves de crianza", href: "/venta-de-gallos", symbol: "A" },
  { name: "Ganado vacuno", detail: "Reproductores, terneros y vaquillonas", href: "/marketplace?especie=vacunos", symbol: "V" },
  { name: "Porcinos", detail: "Lechones y reproductores", href: "/marketplace?especie=porcinos", symbol: "P" },
  { name: "Caballos", detail: "Equinos de criaderos registrados", href: "/marketplace?especie=equinos", symbol: "E" },
  { name: "Ovinos y caprinos", detail: "Animales con origen e historial", href: "/marketplace?especie=ovinos", symbol: "O" },
  { name: "Ver todos", detail: "Explora el marketplace completo", href: "/marketplace", symbol: "+" },
];

export default function Home() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CRIA360",
    url: "https://cria360.vercel.app",
    description: "Marketplace, identidad y gestión para criaderos de animales en Perú.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c") }} />

      <section className="commerce-hero">
        <div className="section-shell commerce-hero-grid">
          <div className="commerce-copy">
            <span className="eyebrow light"><Icon name="verified" /> Criaderos, animales e identidad digital</span>
            <h1>Encuentra animales con <em>origen verificable.</em></h1>
            <p>Compra y publica ejemplares de criaderos en Perú. Revisa procedencia, genealogía y salud antes de contactar.</p>
            <form className="hero-search" action="/marketplace">
              <label className="sr-only" htmlFor="home-search">Buscar animales</label>
              <input id="home-search" name="q" placeholder="¿Qué animal, raza o criadero buscas?" />
              <button type="submit">Buscar</button>
            </form>
            <div className="hero-quick-links"><span>Popular:</span><Link href="/venta-de-gallos">gallos</Link><Link href="/marketplace?especie=vacunos">ganado vacuno</Link><Link href="/marketplace?especie=porcinos">lechones</Link></div>
            <div className="commerce-actions"><Link className="button button-gold" href="/marketplace">Ver animales</Link><Link className="button button-outline-light" href="/registro">Publicar gratis</Link></div>
          </div>
          <div className="commerce-hero-image">
            <Image src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=88" alt="Criadero de ganado vacuno en pastoreo" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
            <div className="hero-trust-card"><span className="trust-icon"><Icon name="shield" /></span><div><strong>Compra con más información</strong><small>Identidad · origen · salud · criadero</small></div></div>
          </div>
        </div>
      </section>

      <section className="commerce-benefits"><div className="section-shell benefit-row"><span><Icon name="verified" /> Identidades verificables</span><span><Icon name="tree" /> Genealogía conectada</span><span><Icon name="health" /> Historial sanitario</span><span><Icon name="tag" /> Placa QR individual</span></div></section>

      <section className="section-shell retail-section">
        <div className="retail-heading"><div><span className="eyebrow">Compra por especie</span><h2>Todo el criadero, en un solo lugar</h2></div><Link className="text-link" href="/marketplace">Ver todo el marketplace</Link></div>
        <div className="category-grid">{categories.map((category) => <Link href={category.href} className="category-card" key={category.name}><span>{category.symbol}</span><div><strong>{category.name}</strong><small>{category.detail}</small></div></Link>)}</div>
      </section>

      <section className="retail-featured"><div className="section-shell retail-section">
        <div className="retail-heading"><div><span className="eyebrow">Recién publicados</span><h2>Animales destacados</h2><p>Ejemplos demostrativos del marketplace CRIA360.</p></div><Link className="button button-secondary" href="/marketplace">Explorar todos</Link></div>
        <div className="animal-grid">{featuredAnimals.slice(0, 6).map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div>
      </div></section>

      <section className="section-shell id-showcase">
        <div className="id-showcase-photo"><Image src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=1400&q=88" alt="Gallo de criadero identificado con ficha digital" fill sizes="(max-width: 900px) 100vw, 50vw" /><span className="photo-label">CRIA360 ID · PE-03091</span></div>
        <div className="id-showcase-copy"><span className="eyebrow"><Icon name="tag" /> Placa inteligente CRIA360</span><h2>La historia del animal viaja con él.</h2><p>Al escanear la placa QR se abre una ficha actualizada con la información que el criador autoriza: origen, padres, salud y responsable.</p><ul><li><Icon name="check" /> No requiere instalar una app para escanear</li><li><Icon name="check" /> Información pública y privada por separado</li><li><Icon name="check" /> Código único para cada animal</li></ul><div className="hero-actions"><Link className="button button-primary" href="/placas-inteligentes">Conocer la placa</Link><Link className="text-link" href="/animales/CRIA-PE-03091">Ver ficha de ejemplo</Link></div></div>
      </section>

      <section className="guide-section"><div className="section-shell retail-section">
        <div className="retail-heading"><div><span className="eyebrow light">Guía CRIA360</span><h2>Nutrición, salud y mejor crianza</h2></div><Link className="text-link light-link" href="/blog">Ver todos los artículos</Link></div>
        <div className="article-grid">{blogPosts.slice(0, 3).map((post) => <article className="article-card" key={post.slug}><Link href={`/blog/${post.slug}`} className="article-image"><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 620px) 100vw, 33vw" /></Link><div><span>{post.category} · {post.readingTime}</span><Link href={`/blog/${post.slug}`}><h3>{post.title}</h3></Link><p>{post.description}</p><Link className="article-link" href={`/blog/${post.slug}`}>Leer guía</Link></div></article>)}</div>
      </div></section>

      <section className="section-shell cta-panel commerce-cta"><div><span className="eyebrow light">Empieza con el primer animal</span><h2>Crea la vitrina digital de tu criadero.</h2><p>Publica, documenta la procedencia y conecta con compradores que buscan información clara.</p></div><div className="cta-actions"><Link className="button button-white" href="/registro">Publicar gratis</Link><Link className="button button-ghost" href="/planes">Ver planes</Link></div></section>
    </>
  );
}
