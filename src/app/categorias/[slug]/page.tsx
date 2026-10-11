import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimalCard } from "@/components/animal-card";
import { Icon } from "@/components/icon";
import { animalCategories, getCategory, matchesAnimalCategory } from "@/lib/category-data";
import { featuredAnimals } from "@/lib/demo-data";

export function generateStaticParams() { return animalCategories.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const category = getCategory((await params).slug);
  if (!category) return {};
  return { title: `${category.name} de criaderos en Perú`, description: `${category.description} Explora publicaciones con identidad, procedencia y responsable.`, alternates: { canonical: `/categorias/${category.slug}` } };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const category = getCategory((await params).slug);
  if (!category) notFound();
  const animals = featuredAnimals.filter((animal) => matchesAnimalCategory(category.slug, animal.species));
  return <>
    <section className={`category-hero tone-${category.tone}`}><div className="section-shell category-hero-grid"><div><span className="eyebrow light">Categoría CRIA360</span><h1>{category.name}</h1><p>{category.description} Toda publicación debe cumplir las normas sanitarias y de tenencia aplicables.</p><div className="hero-actions"><Link className="button button-gold" href={`/marketplace?especie=${category.slug}`}>Ver publicaciones</Link><Link className="button button-outline-light" href="/registro">Publicar un animal</Link></div></div><div className="category-hero-photo"><Image src={category.image} alt={category.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 44vw" /><span>{category.symbol}</span></div></div></section>
    <section className="section-shell category-listing"><div className="retail-heading"><div><span className="eyebrow">Marketplace responsable</span><h2>{animals.length ? `${category.name} disponibles` : "Próximamente nuevas publicaciones"}</h2><p>Identidad, procedencia, estado sanitario declarado y datos del criadero en una sola ficha.</p></div><Link className="text-link" href="/marketplace">Explorar todas las especies</Link></div>{animals.length ? <div className="animal-grid">{animals.map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div> : <div className="market-empty"><strong>Sé el primer criadero en esta categoría</strong><p>Registra el animal, completa su información y publica cuando esté listo.</p><Link className="button button-primary" href="/registro">Crear publicación</Link></div>}</section>
    <section className="responsible-band"><div className="section-shell responsible-band-grid"><Icon name="shield" size={38} /><div><strong>Comercio legal y responsable</strong><p>CRIA360 no admite fauna silvestre protegida, especies prohibidas, peleas, apuestas, maltrato ni publicaciones sin documentación obligatoria.</p></div><Link href="/blog/como-verificar-un-animal-antes-de-comprar">Conocer criterios</Link></div></section>
  </>;
}

