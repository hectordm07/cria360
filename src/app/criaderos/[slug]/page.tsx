import type { Metadata } from "next";
import Link from "next/link";
import { AnimalCard } from "@/components/animal-card";
import { Icon } from "@/components/icon";
import { featuredAnimals } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Perfil de criadero", description: "Historia, reputación y animales de un criadero en CRIA360." };

export default async function BreederPage({ params }: { params: Promise<{ slug: string }> }) {
  await params;
  return <>
    <section className="breeder-cover"><div className="section-shell breeder-head"><span className="breeder-logo">ER</span><div><span className="verified-title"><h1>Hacienda El Roble</h1><Icon name="verified" /></span><p><Icon name="pin" size={16} /> Cajamarca, Perú · Desde 2012</p></div><button className="button button-white">Contactar</button></div></section>
    <section className="section-shell breeder-layout"><div className="breeder-main"><article className="story-card"><span className="eyebrow">Nuestra historia</span><h2>Genética seleccionada con respeto por cada generación.</h2><p>Somos un criadero familiar dedicado al mejoramiento responsable de ganado Brown Swiss. Registramos el origen, la salud y el desarrollo de cada ejemplar para que su historia acompañe siempre su valor.</p><div className="breeder-stats"><div><strong>14</strong><span>Años criando</span></div><div><strong>82</strong><span>Animales registrados</span></div><div><strong>4.9</strong><span>Reputación</span></div></div></article><div className="section-heading row-heading small-heading"><div><h2>Animales disponibles</h2></div><Link className="text-link" href="/marketplace">Ver marketplace →</Link></div><div className="animal-grid two-col">{featuredAnimals.slice(0, 2).map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div></div><aside className="breeder-side"><article className="verification-card"><Icon name="shield" size={32} /><h3>Criadero verificado</h3><p>Identidad y ubicación revisadas por CRIA360.</p><ul><li><Icon name="check" size={16} /> Identidad del titular</li><li><Icon name="check" size={16} /> Ubicación del criadero</li><li><Icon name="check" size={16} /> Documentos vigentes</li></ul></article><article className="contact-card"><small>Especialidad</small><strong>Vacunos Brown Swiss</strong><small>Atención</small><strong>Lun – Sáb, 8:00 a 17:00</strong></article></aside></section>
  </>;
}
