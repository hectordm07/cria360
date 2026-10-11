import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icon";
import { featuredAnimals } from "@/lib/demo-data";

export function generateStaticParams() {
  return featuredAnimals.map((animal) => ({ id: animal.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const animal = featuredAnimals.find((item) => item.id === id);
  if (!animal) return { title: "Animal no encontrado" };
  const description = `${animal.name}, ${animal.breed} en ${animal.location}. Consulta identidad, criadero, genealogía y salud en CRIA360.`;
  return { title: `${animal.name} · Ficha de ejemplo`, robots: { index: false, follow: true }, description, alternates: { canonical: `/animales/${animal.id}` }, openGraph: { title: `${animal.name} · ${animal.breed}`, description, images: [{ url: animal.image, alt: animal.imageAlt }] } };
}

export default async function AnimalProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const animal = featuredAnimals.find((item) => item.id === id);
  if (!animal) notFound();
  return <section className="profile-page section-shell">
    <p className="form-notice" role="note">Ficha de ejemplo. Los animales, criaderos y registros de esta demostración son ilustrativos; no constituyen una oferta de venta.</p>
    <div className="breadcrumb"><Link href="/marketplace">Marketplace</Link><span>›</span><span>{animal.id}</span></div>
    <div className="animal-profile-grid">
      <div><div className="profile-main-photo"><Image src={animal.image} alt={animal.imageAlt} fill priority sizes="(max-width: 900px) 100vw, 55vw" /><span className="verified-chip"><Icon name="verified" /> Identidad verificada</span></div><div className="public-notice"><Icon name="shield" /><p><strong>Ficha pública protegida</strong><br />Los datos personales del propietario no se muestran sin autorización.</p></div></div>
      <div className="profile-information"><span className="mini-label">{animal.id}</span><h1>{animal.name}</h1><p className="profile-subtitle">{animal.breed} · {animal.species}</p><div className="profile-stat-grid"><div><small>Sexo</small><strong>{animal.sex}</strong></div><div><small>Nacimiento</small><strong>14 Mar 2025</strong></div><div><small>Color</small><strong>Pardo</strong></div><div><small>Estado</small><strong>Activo</strong></div></div><div className="owner-row"><span className="owner-avatar">ER</span><div><small>Criador registrado</small><Link href={`/criaderos/${animal.breederSlug}`}>{animal.breeder} <Icon name="verified" size={16} /></Link><p><Icon name="pin" size={14} /> {animal.location}, Perú</p></div></div><Link href="/registro" className="button button-primary full-button">Crear mi propia ficha</Link></div>
    </div>
    <div className="record-grid"><article className="record-card wide"><div className="card-title"><span className="icon-box"><Icon name="tree" /></span><div><h2>Genealogía</h2><p>Procedencia declarada por el criadero</p></div></div><div className="family-tree"><div><small>PADRE</small><strong>Artemis 091</strong><span>CRIA-PE-00109</span></div><div className="family-root"><span>{animal.mark}</span><strong>{animal.name}</strong></div><div><small>MADRE</small><strong>Luna 214</strong><span>CRIA-PE-00214</span></div></div></article><article className="record-card"><div className="card-title"><span className="icon-box"><Icon name="health" /></span><div><h2>Salud</h2><p>Últimos registros</p></div></div><ul className="health-list"><li><span className="status-dot" /><div><strong>Vacunación al día</strong><small>Actualizado 08 Sep 2026</small></div></li><li><span className="status-dot" /><div><strong>Control veterinario</strong><small>Sin observaciones</small></div></li><li><span className="status-dot neutral" /><div><strong>Restricciones</strong><small>Ninguna declarada</small></div></li></ul></article></div>
    <p className="data-disclaimer">CRIA360 identifica si un dato fue declarado por el criador o validado por un profesional. Esta ficha no reemplaza certificados sanitarios oficiales.</p>
  </section>;
}

