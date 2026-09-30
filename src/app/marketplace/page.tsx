import type { Metadata } from "next";
import { AnimalCard } from "@/components/animal-card";
import { featuredAnimals } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Marketplace", description: "Animales y criaderos con identidad y trazabilidad." };

export default function MarketplacePage() {
  return <>
    <section className="market-hero"><div className="section-shell"><span className="eyebrow light">CRIA360 Market</span><h1>Encuentra animales con<br />una historia verificable.</h1><p>Descubre criaderos, conoce la procedencia y revisa la información antes de contactar.</p><div className="market-search"><input aria-label="Buscar" placeholder="Buscar por animal, raza o criadero" /><select aria-label="Especie" defaultValue=""><option value="">Todas las especies</option><option>Aves</option><option>Porcinos</option><option>Vacunos</option><option>Ovinos</option><option>Equinos</option></select><button>Buscar</button></div></div></section>
    <section className="section-shell market-body"><aside className="filters"><strong>Filtros</strong><label>Ubicación<select><option>Todo el Perú</option><option>Cajamarca</option><option>Lima</option><option>Arequipa</option><option>Piura</option></select></label><label>Sexo<select><option>Todos</option><option>Macho</option><option>Hembra</option></select></label><label className="check-row"><input type="checkbox" /> Solo identidades verificadas</label><button className="filter-reset">Limpiar filtros</button></aside><div className="results"><div className="results-head"><p><strong>{featuredAnimals.length} animales</strong> disponibles</p><select aria-label="Ordenar"><option>Más recientes</option><option>Menor precio</option><option>Mayor precio</option></select></div><div className="animal-grid two-col">{featuredAnimals.map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div></div></section>
  </>;
}
