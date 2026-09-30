import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/blog-data";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Artículo no encontrado" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { title: post.title, description: post.description, type: "article", publishedTime: post.publishedAt, modifiedTime: post.updatedAt, images: [{ url: post.image, alt: post.imageAlt }] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "CRIA360" },
    publisher: { "@type": "Organization", name: "CRIA360" },
    mainEntityOfPage: `https://cria360.vercel.app/blog/${post.slug}`,
  };

  return <article className="article-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }} />
    <header className="article-page-head section-shell"><div className="breadcrumb"><Link href="/blog">Guía CRIA360</Link><span>›</span><span>{post.category}</span></div><span className="eyebrow">{post.category}</span><h1>{post.title}</h1><p>{post.description}</p><div className="article-byline"><span>Equipo CRIA360</span><span>{post.readingTime} de lectura</span><time dateTime={post.publishedAt}>30 de septiembre de 2026</time></div></header>
    <div className="article-cover section-shell"><Image src={post.image} alt={post.imageAlt} fill priority sizes="(max-width: 1200px) 100vw, 1140px" /></div>
    <div className="article-layout section-shell"><div className="article-content"><p className="article-intro">{post.description}</p>{post.sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.bullets && <ul>{section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>}</section>)}<aside className="professional-note"><strong>Importante</strong><p>La información es educativa. Las dietas, tratamientos, vacunación y movilización deben ser definidos o validados por profesionales y autoridades competentes.</p></aside></div><aside className="article-side"><strong>Da identidad a tus animales</strong><p>Registra origen, salud y genealogía; comparte solo la información que autorices.</p><Link className="button button-primary" href="/registro">Crear cuenta gratis</Link><Link className="text-link" href="/placas-inteligentes">Conocer la placa QR</Link></aside></div>
  </article>;
}
