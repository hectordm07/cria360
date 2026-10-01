import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AnimalCard } from "@/components/animal-card";
import { Icon } from "@/components/icon";
import { blogPosts } from "@/lib/blog-data";
import { animalCategories } from "@/lib/category-data";
import { featuredAnimals } from "@/lib/demo-data";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
            <span className="eyebrow light"><Icon name="verified" /> Marketplace e inventario multiespecie</span>
            <h1>Cada animal merece una <em>identidad confiable.</em></h1>
            <p>Registra, identifica, gestiona y publica animales de comercio permitido. Toda su información, desde el criadero hasta el nuevo propietario.</p>
            <form className="hero-search" action="/marketplace">
              <label className="sr-only" htmlFor="home-search">Buscar animales</label>
              <input id="home-search" name="q" placeholder="¿Qué animal, raza o criadero buscas?" />
              <button type="submit">Buscar</button>
            </form>
            <div className="hero-quick-links"><span>Explorar:</span><Link href="/categorias/aves">aves</Link><Link href="/categorias/vacunos">vacunos</Link><Link href="/categorias/porcinos">porcinos</Link><Link href="/categorias/equinos">equinos</Link></div>
            <div className="commerce-actions"><Link className="button button-gold" href="/marketplace">Explorar animales</Link><Link className="button button-outline-light" href="/registro">Registrar mi criadero</Link></div>
          </div>
          <div className="commerce-hero-image">
            <Image src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=88" alt="Criadero de ganado vacuno en pastoreo" fill priority sizes="(max-width: 900px) 100vw, 48vw" />
            <div className="hero-trust-card"><span className="trust-icon"><Icon name="shield" /></span><div><strong>Información antes de contactar</strong><small>Identidad · origen · salud · responsable</small></div></div>
          </div>
        </div>
      </section>

      <section className="commerce-benefits"><div className="section-shell benefit-row"><span><Icon name="store" /> Marketplace legal</span><span><Icon name="tree" /> Genealogía conectada</span><span><Icon name="health" /> Historial sanitario</span><span><Icon name="tag" /> Identidad QR + NFC</span></div></section>

      <section className="section-shell retail-section species-section" id="especies">
        <div className="retail-heading"><div><span className="eyebrow">Explora por especie</span><h2>Un espacio para cada tipo de crianza</h2><p>Aves, animales de granja, equinos, mascotas permitidas y otras especies autorizadas.</p></div><Link className="text-link" href="/marketplace">Ver todo el marketplace</Link></div>
        <div className="species-grid">{animalCategories.map((category) => <Link href={`/categorias/${category.slug}`} className={`species-card tone-${category.tone}`} key={category.slug}><div className="species-card-photo"><Image src={category.image} alt={category.imageAlt} fill sizes="(max-width: 620px) 50vw, 25vw" /></div><div><span>{category.symbol}</span><strong>{category.shortName}</strong><small>{category.description}</small></div></Link>)}</div>
      </section>

      <section className="platform-flow"><div className="section-shell"><div className="retail-heading"><div><span className="eyebrow light">Una plataforma, todo el ciclo</span><h2>Del registro a la publicación</h2><p>La ficha del animal se actualiza sin reemplazar su placa.</p></div></div><div className="flow-grid"><article><span>01</span><Icon name="store" /><h3>Registra</h3><p>Crea el inventario privado de tu criadero.</p></article><article><span>02</span><Icon name="tag" /><h3>Identifica</h3><p>Vincula un código único, QR y NFC.</p></article><article><span>03</span><Icon name="health" /><h3>Documenta</h3><p>Organiza procedencia, salud y genealogía.</p></article><article><span>04</span><Icon name="spark" /><h3>Publica</h3><p>Comparte solo la información autorizada.</p></article></div></div></section>

      <section className="retail-featured"><div className="section-shell retail-section">
        <div className="retail-heading"><div><span className="eyebrow">Recién publicados</span><h2>Animales destacados</h2><p>Ejemplos demostrativos del marketplace CRIA360.</p></div><Link className="button button-secondary" href="/marketplace">Explorar todos</Link></div>
        <div className="animal-grid">{featuredAnimals.slice(0, 6).map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div>
      </div></section>

      <section className="section-shell id-showcase">
        <div className="id-showcase-photo"><Image src="https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1400&q=88" alt="Equino con identidad digital de criadero" fill sizes="(max-width: 900px) 100vw, 50vw" /><span className="photo-label">CRIA360 ID · QR + NFC</span></div>
        <div className="id-showcase-copy"><span className="eyebrow"><Icon name="tag" /> Identidad inteligente CRIA360</span><h2>Una placa. Una ficha siempre actualizada.</h2><p>El QR y el NFC abren la misma identidad digital. El criadero administra qué información es pública y cuál permanece privada.</p><ul><li><Icon name="check" /> Escaneo desde el navegador, sin instalar una app</li><li><Icon name="check" /> Código único asociado a un solo animal</li><li><Icon name="check" /> Historial que permanece al cambiar la información</li></ul><div className="hero-actions"><Link className="button button-primary" href="/placas-inteligentes">Conocer QR + NFC</Link><Link className="text-link" href="/animales/CRIA-PE-01452">Ver ficha de ejemplo</Link></div></div>
      </section>

      <section className="legal-commerce"><div className="section-shell legal-commerce-grid"><div><span className="eyebrow light"><Icon name="shield" /> Comercio responsable</span><h2>Solo animales y actividades permitidas legalmente.</h2><p>CRIA360 protege la confianza del marketplace con criterios claros para publicar.</p></div><ul><li><Icon name="check" /> Especies de crianza y tenencia autorizadas</li><li><Icon name="check" /> Documentación sanitaria cuando corresponda</li><li><Icon name="check" /> Sin fauna silvestre protegida o comercio prohibido</li><li><Icon name="check" /> Sin peleas, apuestas, maltrato o contenido ilegal</li></ul></div></section>

      <section className="guide-section"><div className="section-shell retail-section">
        <div className="retail-heading"><div><span className="eyebrow light">Guía CRIA360</span><h2>Nutrición, salud y mejor crianza</h2></div><Link className="text-link light-link" href="/blog">Ver todos los artículos</Link></div>
        <div className="article-grid">{blogPosts.slice(0, 3).map((post) => <article className="article-card" key={post.slug}><Link href={`/blog/${post.slug}`} className="article-image"><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 620px) 100vw, 33vw" /></Link><div><span>{post.category} · {post.readingTime}</span><Link href={`/blog/${post.slug}`}><h3>{post.title}</h3></Link><p>{post.description}</p><Link className="article-link" href={`/blog/${post.slug}`}>Leer guía</Link></div></article>)}</div>
      </div></section>

      <section className="section-shell cta-panel commerce-cta"><div><span className="eyebrow light">Empieza con el primer animal</span><h2>Crea la vitrina digital de tu criadero.</h2><p>Publica, documenta la procedencia y conecta con compradores que buscan información clara.</p></div><div className="cta-actions"><Link className="button button-white" href="/registro">Publicar gratis</Link><Link className="button button-ghost" href="/planes">Ver planes</Link></div></section>
    </>
  );
}
