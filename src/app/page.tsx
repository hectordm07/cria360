import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { AnimalCard } from "@/components/animal-card";
import { DailySummary } from "@/components/daily-summary";
import { ScrollImageMotion } from "@/components/scroll-image-motion";
import { Icon } from "@/components/icon";
import { blogPosts } from "@/lib/blog-data";
import { animalCategories } from "@/lib/category-data";
import { featuredAnimals } from "@/lib/demo-data";

const title = "App para criaderos: inventario, ventas y QR en Perú";
const description = "Organiza tu criadero desde el celular con CRIA360: inventario por especie, ventas, compras, gastos y fichas QR/NFC. Empieza gratis con hasta 5 animales.";
const shareImage = { url: "/images/hero-granja-movil-v2.webp", alt: "Gestiona tu criadero desde el celular con CRIA360" };
export const metadata: Metadata = {
  title: { absolute: `${title} | CRIA360` }, description, alternates: { canonical: "/" },
  openGraph: { title: `${title} | CRIA360`, description, url: "/", type: "website", locale: "es_PE", siteName: "CRIA360", images: [shareImage] },
  twitter: { card: "summary_large_image", title: `${title} | CRIA360`, description, images: [shareImage.url] },
};
const questions = [
  { question: "¿Qué incluye la prueba gratis de 30 días?", answer: "Durante 30 días desde el primer registro de tu correo puedes registrar hasta 5 animales, añadir fotografías y mantener una publicación activa. Sin tarjeta ni cobro automático. Al terminar puedes consultar y descargar tus datos; para seguir registrando necesitas un plan de pago. Las placas físicas QR y NFC se adquieren por separado." },
  { question: "¿Puedo usar CRIA360 desde el celular?", answer: "Sí. Accede desde el navegador de tu celular o computadora. Puedes añadir CRIA360 a la pantalla de inicio para entrar directamente a tu panel, sin descargar una app de la tienda." },
  { question: "¿Puedo registrar ventas y gastos?", answer: "Sí. Registra ventas, compras y gastos con monto, concepto, fecha y estado del pago. El panel muestra el resumen del día y la evolución de los últimos 6 meses." },
  { question: "¿Cómo se organiza el inventario por especie?", answer: "Las tarjetas se crean según los animales de tu criadero: aves, patos, vacunos y otras especies. Cada tipo muestra su fotografía representativa y permite consultar sus fichas." },
];

export default function Home() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cria360.vercel.app";
  const application = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "CRIA360", url: siteUrl, description, applicationCategory: "BusinessApplication", operatingSystem: "Web", inLanguage: "es-PE", offers: { "@type": "Offer", name: "Plan Inicial", price: 0, priceCurrency: "PEN", url: `${siteUrl}/planes` }, featureList: ["Inventario por especie", "Registro de ventas, compras y gastos", "Identidad QR y NFC", "Genealogía e historial sanitario"] };
  return <div className="landing-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(application).replace(/</g, "\\u003c") }} />
    <ScrollImageMotion />
    <section className="landing-hero">
      <div className="section-shell landing-hero-grid">
        <div className="landing-hero-copy">
          <span className="landing-app-label"><Icon name="store" size={16} /> Tu mini app para el criadero</span>
          <h1>Tu criadero,<br /><em>en la palma de tu mano.</em></h1>
          <p>Organiza tus animales, registra ventas y gastos y consulta su historia con QR o NFC. Todo desde el celular, en un solo lugar.</p>
          <div className="landing-hero-actions"><Link className="button button-gold" href="/registro" data-analytics-cta="crear-granja-hero">Empezar gratis<Icon name="spark" size={16} /></Link><Link className="button button-outline-light" href="/instalar">Añadir a mi celular</Link></div>
          <ul className="landing-hero-points"><li><Icon name="check" size={16} /> 30 días gratis · hasta 5 animales</li><li><Icon name="check" size={16} /> Desde tu celular o computadora</li></ul>
        </div>
        <figure className="landing-hero-photo">
          <Image src="/images/hero-granja-movil-v2.webp" alt="Productor avícola consultando su celular junto a los animales de su granja" fill preload sizes="(max-width: 1000px) 100vw, 50vw" />
          <figcaption><Icon name="tag" size={20} /><div><strong>Tu granja, conectada.</strong><span>Una placa. Una ficha siempre actualizada.</span></div></figcaption>
        </figure>
      </div>
    </section>

    <div className="landing-benefits"><ul className="section-shell"><li><Icon name="store" /> Inventario organizado</li><li><Icon name="tree" /> Genealogía conectada</li><li><Icon name="health" /> Historial sanitario</li><li><Icon name="scan" /> Identidad QR + NFC</li></ul></div>

    <section className="section-shell landing-overview" id="gestion">
      <div className="landing-overview-copy"><h2>Tu criadero,<br /><em>de un vistazo.</em></h2><p>Menos registros dispersos. Más claridad para cuidar tus animales y organizar el trabajo de cada día.</p>
        <dl className="landing-feature-list"><div><dt>Un inventario que puedes consultar</dt><dd>Fichas, fotografías y estados de cada animal.</dd></div><div><dt>Información que acompaña su crianza</dt><dd>Procedencia, padres y registros de salud en un solo lugar.</dd></div><div><dt>Las cifras de tu negocio, ordenadas</dt><dd>Resumen diario, registro rápido de movimientos y gráficos de los últimos 6 meses.</dd></div></dl>
        <Link className="text-link" href="/cuenta">Entrar al panel <span aria-hidden="true">→</span></Link>
      </div>
      <div className="landing-overview-visual"><div className="landing-phone-stage"><div className="landing-phone"><div className="landing-phone-top"><div><strong>Mi criadero</strong><span>CRIA360 · Inicio</span></div><Icon name="shield" size={22} /></div><div className="landing-phone-screen"><DailySummary summary={{ sales: 320, purchases: 60, expenses: 30, balance: 230, change: null }} dateLabel="Hoy" illustrative /><div className="daily-quick-actions"><Link href="/registro"><Icon name="store" /><span>Inventario</span></Link><Link href="/registro"><Icon name="tag" /><span>Nuevo gasto</span></Link></div><span className="landing-phone-footer" aria-hidden="true" /></div></div></div><p className="landing-preview-caption">Vista ilustrativa del panel móvil. En tu cuenta verás tus propios datos.</p><Link className="text-link" href="/instalar">Añadir CRIA360 a mi celular <span aria-hidden="true">→</span></Link></div>
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

    <section className="section-shell landing-start" aria-labelledby="start-title"><div><h2 id="start-title">Empieza gratis.<br /><em>Crece a tu ritmo.</em></h2><p>Prueba CRIA360 gratis durante 30 días con el plan Inicial: hasta 5 animales, ficha básica, fotografías y una publicación activa.</p><p>Cuando tu criadero lo necesite, elige Granja o Granja Pro para ampliar capacidad y acceder a la carga masiva desde Excel.</p><Link className="text-link" href="/planes">Comparar planes y precios <span aria-hidden="true">→</span></Link></div><div className="landing-start-detail"><strong>Plan Inicial</strong><span className="landing-start-price">30 días gratis</span><ul><li><Icon name="check" size={18} />Hasta 5 animales</li><li><Icon name="check" size={18} />Ficha básica y fotografías</li><li><Icon name="check" size={18} />1 publicación activa</li></ul><Link className="button button-primary" href="/registro" data-analytics-cta="plan-inicial-landing">Probar gratis 30 días</Link><small>Desde el primer registro de tu correo. Sin tarjeta ni cobros automáticos. Las placas físicas se adquieren por separado.</small></div></section>

    <section className="section-shell landing-faq" aria-labelledby="faq-title"><div><h2 id="faq-title">Antes de empezar.</h2><p>Lo esencial para gestionar tu criadero con CRIA360.</p><Link className="text-link" href="/planes">Conocer los planes <span aria-hidden="true">→</span></Link></div><div>{questions.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div></section>

    <section className="landing-final"><div className="section-shell"><div><h2>Empieza con<br /><em>tu primer animal.</em></h2><p>Crea la vitrina digital de tu criadero y conecta cada ficha con su origen.</p></div><div><Link className="button button-gold" href="/registro" data-analytics-cta="crear-granja-final">Empezar gratis</Link><Link className="text-link" href="/planes">Conocer los planes <span aria-hidden="true">→</span></Link></div></div></section>
  </div>;
}

