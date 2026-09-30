import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnimalCard } from "@/components/animal-card";
import { Icon } from "@/components/icon";
import { featuredAnimals } from "@/lib/demo-data";

export const metadata: Metadata = {
  title: "Venta de gallos de criaderos en Perú",
  description: "Encuentra gallos y aves de criaderos en Perú con procedencia, genealogía, salud e identidad CRIA360. Contacta al criador directamente.",
  alternates: { canonical: "/venta-de-gallos" },
};

const poultry = featuredAnimals.filter((animal) => animal.species === "Ave");

export default function VentaDeGallosPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "¿Cómo comprar un gallo de forma responsable?", acceptedAnswer: { "@type": "Answer", text: "Revisa la identidad del ejemplar, procedencia, edad, estado sanitario, restricciones, documentación y datos del criadero antes de acordar una entrega." } },
      { "@type": "Question", name: "¿Qué significa identidad verificada en CRIA360?", acceptedAnswer: { "@type": "Answer", text: "Significa que la plataforma diferencia los datos declarados por el criador de los documentos o registros validados por un tercero autorizado." } },
    ],
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }} />
    <section className="seo-commerce-hero"><div className="section-shell seo-commerce-grid"><div><span className="eyebrow light">Aves de criadores registrados</span><h1>Venta de gallos con origen e historia visible.</h1><p>Explora gallos y aves de criadero en Perú. Compara raza, edad, procedencia y salud antes de contactar al responsable.</p><div className="hero-actions"><Link className="button button-gold" href="#publicaciones">Ver gallos disponibles</Link><Link className="button button-outline-light" href="/registro">Publicar mi gallo</Link></div><div className="seo-trust-list"><span><Icon name="verified" /> Criadero identificado</span><span><Icon name="tree" /> Genealogía disponible</span><span><Icon name="health" /> Salud documentada</span></div></div><div className="seo-hero-photo"><Image src="https://images.unsplash.com/photo-1685032236350-3873c9035ee0?auto=format&fit=crop&w=1400&q=88" alt="Gallo de criadero disponible en Perú" fill priority sizes="(max-width: 900px) 100vw, 45vw" /></div></div></section>
    <section className="section-shell sales-layout" id="publicaciones"><aside className="sales-sidebar"><strong>Buscar gallos</strong><label>Raza<select><option>Todas las razas</option><option>Brahma</option><option>Ameraucana</option><option>Orpington</option></select></label><label>Ubicación<select><option>Todo el Perú</option><option>Lima</option><option>Arequipa</option><option>La Libertad</option></select></label><label>Edad<select><option>Cualquier edad</option><option>Hasta 6 meses</option><option>7 a 12 meses</option><option>Más de 1 año</option></select></label><label className="check-row"><input type="checkbox" /> Solo verificados</label></aside><div><div className="results-head"><div><span className="eyebrow">Marketplace avícola</span><h2>Gallos disponibles</h2><p><strong>{poultry.length} publicación de demostración</strong> · Próximamente más criaderos</p></div><select aria-label="Ordenar"><option>Más recientes</option><option>Menor precio</option><option>Mayor precio</option></select></div><div className="animal-grid two-col">{poultry.map((animal) => <AnimalCard animal={animal} key={animal.id} />)}<article className="publish-card"><span>+</span><h3>Publica el primer ejemplar de tu criadero</h3><p>Crea una ficha con fotos, procedencia, padres y estado sanitario.</p><Link className="button button-primary" href="/registro">Publicar gratis</Link></article></div></div></section>
    <section className="responsible-section"><div className="section-shell responsible-grid"><div><span className="eyebrow light">Compra responsable</span><h2>Qué revisar antes de contactar</h2></div><div className="responsible-points"><article><span>01</span><h3>Identidad</h3><p>Código único, fotos actuales, edad, sexo y datos del criadero.</p></article><article><span>02</span><h3>Procedencia</h3><p>Padre, madre, línea de crianza y documentos disponibles.</p></article><article><span>03</span><h3>Salud y traslado</h3><p>Controles, vacunas, restricciones y condiciones legales aplicables.</p></article></div></div></section>
    <section className="section-shell seo-copy"><h2>Gallos de criadero: información antes que improvisación</h2><p>CRIA360 busca que cada anuncio de venta de gallos tenga información comparable y trazable. La plataforma está diseñada para crianza, reproducción, exposición y comercio responsable. No ofrece apuestas, coordinación de enfrentamientos ni servicios que promuevan maltrato animal.</p><div className="faq-grid"><article><h3>¿Cómo comprar un gallo de forma responsable?</h3><p>Confirma la identidad, procedencia, salud, condiciones de entrega y responsable del criadero. Solicita los documentos que correspondan a la movilización o finalidad del animal.</p></article><article><h3>¿Qué significa “verificado”?</h3><p>La ficha distingue los datos declarados por el criador de los que fueron revisados por un veterinario, asociación u organización autorizada.</p></article></div></section>
  </>;
}
