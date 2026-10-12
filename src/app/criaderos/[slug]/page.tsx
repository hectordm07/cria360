import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnimalCard } from "@/components/animal-card";
import { featuredAnimals } from "@/lib/demo-data";
import { getPublicBreeder, getPublishedAnimals, publicAnimalCard } from "@/lib/public-animals";

export const metadata: Metadata = { title: "Perfil de criadero", description: "Perfil público y publicaciones de un criadero en CRIA360." };
export default async function BreederPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sample = featuredAnimals.find(animal => animal.breederSlug === slug);
  const breeder = sample ? null : await getPublicBreeder(slug);
  if (!sample && !breeder) notFound();
  const name = breeder?.name || sample!.breeder;
  const location = breeder?.department || sample?.location || "Ubicación sin publicar";
  const animals = sample ? featuredAnimals.filter(animal => animal.breederSlug === slug) : (await getPublishedAnimals()).filter(animal => animal.breeders?.slug === slug).map(publicAnimalCard);
  return <>
    <section className="breeder-cover"><div className="section-shell breeder-head"><span className="breeder-logo">{name.slice(0,2).toUpperCase()}</span><div><h1>{name}</h1><p>{location} · {sample ? "Perfil de ejemplo" : "Datos declarados por el criador"}</p></div></div></section>
    <section className="section-shell breeder-layout"><div className="breeder-main">{sample && <p className="form-notice">Criadero de ejemplo. Estos datos y animales son ilustrativos; no constituyen una oferta de venta ni una verificación del titular.</p>}<article className="story-card"><span className="eyebrow">El criadero</span><h2>{breeder?.primary_species || sample?.species}</h2><p>{breeder?.description || (sample ? "Ejemplo de cómo puedes presentar tu criadero y sus animales en CRIA360." : "El titular aún no añadió una descripción pública.")}</p></article><div className="section-heading row-heading small-heading"><h2>{sample ? "Fichas de ejemplo" : "Animales publicados"}</h2><Link className="text-link" href="/marketplace">Ver marketplace →</Link></div>{animals.length ? <div className="animal-grid two-col">{animals.map(animal => <AnimalCard animal={animal} key={animal.id} />)}</div> : <p>Este criadero no tiene publicaciones activas.</p>}</div><aside className="breeder-side"><article className="contact-card"><h3>Antes de acordar una compra</h3><p>Revisa la documentación, procedencia, condiciones sanitarias y disponibilidad directamente con el titular.</p><Link href="/contacto" className="button button-secondary">Solicitar información</Link></article></aside></section>
  </>;
}
