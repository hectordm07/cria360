import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-data";

export const metadata: Metadata = {
  title: "Nutrición, salud y crianza de animales",
  description: "Guías prácticas sobre nutrición animal, salud, compra responsable, genealogía y gestión de criaderos.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return <>
    <section className="editorial-hero"><div className="section-shell"><span className="eyebrow light">Guía CRIA360</span><h1>Aprende a criar, cuidar<br />y comprar mejor.</h1><p>Información práctica para responsables de criaderos y compradores de animales. Los contenidos de salud y nutrición son educativos y no reemplazan una evaluación profesional.</p></div></section>
    <section className="section-shell blog-index">
      <div className="blog-index-head"><div><span>Contenido nuevo y útil</span><h2>Nutrición, sanidad y tecnología</h2></div><div className="topic-pills"><span>Aves</span><span>Ganado</span><span>Compra responsable</span><span>Placas QR</span></div></div>
      <div className="blog-grid">{blogPosts.map((post, index) => <article className={index === 0 ? "blog-card blog-card-featured" : "blog-card"} key={post.slug}><Link href={`/blog/${post.slug}`} className="blog-card-image"><Image src={post.image} alt={post.imageAlt} fill sizes={index === 0 ? "(max-width: 900px) 100vw, 66vw" : "(max-width: 620px) 100vw, 33vw"} /></Link><div className="blog-card-copy"><span>{post.category} · {post.readingTime}</span><Link href={`/blog/${post.slug}`}><h2>{post.title}</h2></Link><p>{post.description}</p><Link className="article-link" href={`/blog/${post.slug}`}>Leer artículo</Link></div></article>)}</div>
    </section>
  </>;
}
