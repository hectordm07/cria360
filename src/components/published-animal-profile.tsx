import Link from "next/link";
import { AnimalPhoto } from "@/components/animal-photo";
import { publicAnimalCard, type PublicAnimalRow } from "@/lib/public-animals";
import { categoryForSpecies } from "@/lib/category-data";

export function PublishedAnimalProfile({ row }: { row: PublicAnimalRow }) {
  const animal = publicAnimalCard(row);
  return <section className="profile-page section-shell">
    <div className="breadcrumb"><Link href="/marketplace">Marketplace</Link><span>›</span><span>{animal.id}</span></div>
    <p className="form-notice" role="note">Publicación del criador. La ficha registra información declarada y no sustituye la documentación sanitaria o de procedencia.</p>
    <div className="animal-profile-grid"><div><div className="profile-main-photo"><AnimalPhoto src={animal.image} alt={animal.imageAlt} fallbackSrc={categoryForSpecies(animal.species)?.image} sizes="(max-width: 900px) 100vw, 55vw" /></div><p className="data-disclaimer">{animal.imageAlt.startsWith("Imagen de referencia") ? "El criador aún no añadió una foto: la imagen representa la especie." : "Fotografía añadida por el titular de la publicación."}</p></div>
      <div className="profile-information"><span className="mini-label">{animal.id}</span><h1>{animal.name}</h1><p className="profile-subtitle">{animal.breed} · {animal.species}</p><div className="profile-stat-grid"><div><small>Sexo</small><strong>{animal.sex}</strong></div><div><small>Edad</small><strong>{animal.age}</strong></div><div><small>Precio declarado</small><strong>{animal.price}</strong></div><div><small>Ubicación</small><strong>{animal.location}</strong></div></div><p>{animal.breederSlug ? <Link href={`/criaderos/${animal.breederSlug}`}>{animal.breeder}</Link> : animal.breeder}</p><Link href={`/contacto?asunto=${encodeURIComponent(`Consulta sobre ${animal.id}`)}`} className="button button-primary full-button">Solicitar información</Link><p className="data-disclaimer">La solicitud se registra con CRIA360 para coordinar la consulta. No implica una compra ni garantiza disponibilidad.</p></div></div>
    <div className="record-grid"><article className="record-card"><h2>Sobre el animal</h2><p>{row.description || "El criador no añadió una descripción."}</p></article><article className="record-card"><h2>Genealogía y salud declaradas</h2><p>Padre: {row.father_name || "Sin registrar"}</p><p>Madre: {row.mother_name || "Sin registrar"}</p><p>Salud: {row.health_status || "Sin registrar"}</p></article></div>
  </section>;
}
