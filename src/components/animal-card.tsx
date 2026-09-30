import Link from "next/link";
import Image from "next/image";
import type { Animal } from "@/lib/demo-data";
import { Icon } from "./icon";

export function AnimalCard({ animal }: { animal: Animal }) {
  return <article className="animal-card"><Link href={`/animales/${animal.id}`} className="animal-photo"><Image src={animal.image} alt={animal.imageAlt} fill sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw" /> <span className="species-pill">{animal.species}</span>{animal.verified && <span className="verified-chip"><Icon name="verified" /> Identidad verificada</span>}</Link><div className="animal-content"><div className="animal-topline"><span>{animal.id}</span><strong>{animal.price}</strong></div><Link href={`/animales/${animal.id}`}><h3>{animal.name}</h3></Link><p>{animal.breed} · {animal.sex} · {animal.age}</p><div className="animal-meta"><span><Icon name="pin" size={15} /> {animal.location}</span><Link href={`/criaderos/${animal.breederSlug}`}>{animal.breeder}</Link></div></div></article>;
}
