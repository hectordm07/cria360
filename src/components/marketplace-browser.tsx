"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimalCard } from "@/components/animal-card";
import { featuredAnimals } from "@/lib/demo-data";
import { animalCategories } from "@/lib/category-data";
import { filterMarketplace, marketplacePageSize, type MarketplaceFilters } from "@/lib/marketplace-data";
import { Icon } from "./icon";

const emptyFilters: MarketplaceFilters = { query: "", species: "", location: "", sex: "", price: "", verified: false, sort: "recent" };
const locations = [...new Set(featuredAnimals.map(animal => animal.location))].sort((a, b) => a.localeCompare(b, "es"));
const screenQueries = ["(max-width: 359px)", "(max-width: 1050px)"];
const subscribeColumns = (callback: () => void) => {
  const queries = screenQueries.map(query => window.matchMedia(query));
  queries.forEach(query => query.addEventListener("change", callback));
  return () => queries.forEach(query => query.removeEventListener("change", callback));
};
const getColumns = () => window.matchMedia(screenQueries[0]).matches ? 1 : window.matchMedia(screenQueries[1]).matches ? 2 : 3;

export function MarketplaceBrowser({ initialSpecies = "", initialQuery = "" }: { initialSpecies?: string; initialQuery?: string }) {
  const [filters, setFilters] = useState<MarketplaceFilters>({ ...emptyFilters, species: initialSpecies, query: initialQuery });
  const [page, setPage] = useState(1);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const columns = useSyncExternalStore(subscribeColumns, getColumns, () => 3);
  const pageSize = marketplacePageSize(columns);
  const results = useMemo(() => filterMarketplace(featuredAnimals, filters), [filters]);
  const totalPages = Math.max(1, Math.ceil(results.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const visibleResults = results.slice(start, start + pageSize);
  const activeCount = [filters.location, filters.sex, filters.price, filters.verified].filter(Boolean).length;
  const speciesLabel = animalCategories.find(category => category.slug === filters.species)?.shortName ?? "Todas las especies";

  function update<Key extends keyof MarketplaceFilters>(key: Key, value: MarketplaceFilters[Key]) {
    setFilters(previous => ({ ...previous, [key]: value }));
    setPage(1);
  }
  function clear() { setFilters(emptyFilters); setPage(1); }
  function changePage(value: number) {
    setPage(value);
    resultsHeading.current?.focus({ preventScroll: true });
    resultsHeading.current?.scrollIntoView({ block: "start", behavior: "auto" });
  }

  return <div className="marketplace-page">
    <section className="market-hero market-hero-modern"><div className="section-shell"><div className="market-intro"><div><span className="eyebrow light">Marketplace CRIA360</span><h1>Encuentra el animal<br />para tu criadero.</h1><p>Explora por especie, compara sus fichas y conoce al criadero.</p></div><Link className="button button-outline-light" href="/registro">Publicar un animal <span aria-hidden="true">↗</span></Link></div>
      <form className="market-search modern-search" onSubmit={event => { event.preventDefault(); resultsHeading.current?.scrollIntoView({ block: "start", behavior: "auto" }); }}><label className="market-query"><Icon name="search" /><span className="sr-only">Buscar animales</span><input value={filters.query} onChange={event => update("query", event.target.value)} placeholder="Animal, raza, código o criadero" /></label><label><span className="sr-only">Tipo de animal</span><select value={filters.species} onChange={event => update("species", event.target.value)}><option value="">Todas las especies</option>{animalCategories.map(category => <option value={category.slug} key={category.slug}>{category.name}</option>)}</select></label><button type="submit">Buscar</button></form>
      <div className="market-quick-types" aria-label="Tipos de animal"><button type="button" aria-pressed={!filters.species} onClick={() => update("species", "")}>Todas</button>{animalCategories.filter(category => category.slug !== "otras-especies").map(category => <button key={category.slug} type="button" aria-pressed={filters.species === category.slug} onClick={() => update("species", category.slug)}>{category.shortName}</button>)}</div>
    </div></section>
    <section className="section-shell market-body">
      <details className="market-filter-panel"><summary><span>Filtrar animales</span><span>{activeCount ? `${activeCount} filtros` : "Refinar búsqueda"}</span><Icon name="menu" size={18} /></summary><div className="filters modern-filters">
        <label>Ubicación<select value={filters.location} onChange={event => update("location", event.target.value)}><option value="">Todo el Perú</option>{locations.map(item => <option key={item}>{item}</option>)}</select></label>
        <label>Sexo<select value={filters.sex} onChange={event => update("sex", event.target.value)}><option value="">Todos</option><option>Macho</option><option>Hembra</option></select></label>
        <label>Precio<select value={filters.price} onChange={event => update("price", event.target.value)}><option value="">Cualquier precio</option><option value="2500">Hasta S/ 2,500</option><option value="8000">Más de S/ 2,500 a S/ 8,000</option><option value="more">Más de S/ 8,000</option></select></label>
        <label className="check-row"><input type="checkbox" checked={filters.verified} onChange={event => update("verified", event.target.checked)} /> Identidad verificada</label><button className="filter-reset" onClick={clear} type="button">Limpiar filtros</button>
      </div></details>
      <div className="results"><div className="results-head"><div><span className="eyebrow">Explora el catálogo</span><h2 ref={resultsHeading} tabIndex={-1}>{speciesLabel}</h2><p role="status" aria-live="polite">{results.length} {results.length === 1 ? "animal encontrado" : "animales encontrados"}</p></div><label><span className="sr-only">Ordenar publicaciones</span><select value={filters.sort} onChange={event => update("sort", event.target.value)}><option value="recent">Destacados</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option></select></label></div>
        <p className="market-demo-note">Catálogo de muestra · Fichas e imágenes ilustrativas.</p>
        {results.length ? <><div className="animal-grid marketplace-grid">{visibleResults.map(animal => <AnimalCard animal={animal} key={animal.id} />)}</div><nav className="market-pagination" aria-label="Páginas del catálogo"><p>{start + 1}–{Math.min(start + pageSize, results.length)} de {results.length}</p>{totalPages > 1 && <div><button className="button button-secondary" type="button" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} aria-label="Página anterior">←</button><span>Página {currentPage} de {totalPages}</span><button className="button button-secondary" type="button" disabled={currentPage === totalPages} onClick={() => changePage(currentPage + 1)} aria-label="Página siguiente">→</button></div>}</nav></> : <div className="market-empty"><Icon name="search" size={30} /><strong>No encontramos animales</strong><p>Prueba otro tipo, ubicación o precio.</p><button className="button button-secondary" onClick={clear} type="button">Limpiar filtros</button></div>}
      </div>
    </section>
  </div>;
}
