"use client";

import { useMemo, useState } from "react";
import { AnimalCard } from "@/components/animal-card";
import { featuredAnimals } from "@/lib/demo-data";
import { animalCategories } from "@/lib/category-data";

export function MarketplaceBrowser() {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState("");
  const [location, setLocation] = useState("");
  const [sex, setSex] = useState("");
  const [price, setPrice] = useState("");
  const [verified, setVerified] = useState(false);
  const [sort, setSort] = useState("recent");

  const results = useMemo(() => {
    const normalized = query.toLocaleLowerCase("es");
    const category = animalCategories.find((item) => item.slug === species);
    const filtered = featuredAnimals.filter((animal) => {
      const searchable = `${animal.name} ${animal.breed} ${animal.breeder} ${animal.species}`.toLocaleLowerCase("es");
      const matchesSpecies = !category || category.marketplaceSpecies.includes(animal.species);
      const matchesPrice = !price || (animal.priceValue != null && (price === "2500" ? animal.priceValue <= 2500 : price === "8000" ? animal.priceValue > 2500 && animal.priceValue <= 8000 : animal.priceValue > 8000));
      return (!normalized || searchable.includes(normalized)) && matchesSpecies && (!location || animal.location === location) && (!sex || animal.sex === sex) && matchesPrice && (!verified || animal.verified);
    });
    return [...filtered].sort((a, b) => sort === "price-asc" ? (a.priceValue ?? Infinity) - (b.priceValue ?? Infinity) : sort === "price-desc" ? (b.priceValue ?? -1) - (a.priceValue ?? -1) : 0);
  }, [location, price, query, sex, sort, species, verified]);

  const clear = () => { setQuery(""); setSpecies(""); setLocation(""); setSex(""); setPrice(""); setVerified(false); };

  return <>
    <section className="market-hero market-hero-modern"><div className="section-shell"><span className="eyebrow light">Marketplace multiespecie</span><h1>Animales con identidad,<br />origen y responsable.</h1><p>Explora publicaciones legales de criaderos. Compara información antes de contactar o acordar una compra.</p><div className="market-search modern-search"><input aria-label="Buscar" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Animal, raza o criadero" /><select aria-label="Especie" value={species} onChange={(event) => setSpecies(event.target.value)}><option value="">Todas las especies</option>{animalCategories.map((category) => <option value={category.slug} key={category.slug}>{category.name}</option>)}</select><button type="button">{results.length} resultados</button></div></div></section>
    <section className="section-shell market-body"><aside className="filters modern-filters"><div><strong>Filtrar animales</strong><small>Encuentra el ejemplar adecuado</small></div><label>Ubicación<select value={location} onChange={(event) => setLocation(event.target.value)}><option value="">Todo el Perú</option>{[...new Set(featuredAnimals.map((animal) => animal.location))].map((item) => <option key={item}>{item}</option>)}</select></label><label>Sexo<select value={sex} onChange={(event) => setSex(event.target.value)}><option value="">Todos</option><option>Macho</option><option>Hembra</option></select></label><label>Precio<select value={price} onChange={(event) => setPrice(event.target.value)}><option value="">Cualquier precio</option><option value="2500">Hasta S/ 2,500</option><option value="8000">S/ 2,501 a S/ 8,000</option><option value="more">Más de S/ 8,000</option></select></label><label className="check-row"><input type="checkbox" checked={verified} onChange={(event) => setVerified(event.target.checked)} /> Identidad verificada</label><button className="filter-reset" onClick={clear} type="button">Limpiar filtros</button></aside><div className="results"><div className="results-head"><div><span className="eyebrow">Publicaciones disponibles</span><p><strong>{results.length} animales</strong> encontrados</p></div><select aria-label="Ordenar" value={sort} onChange={(event) => setSort(event.target.value)}><option value="recent">Más recientes</option><option value="price-asc">Menor precio</option><option value="price-desc">Mayor precio</option></select></div>{results.length ? <div className="animal-grid two-col">{results.map((animal) => <AnimalCard animal={animal} key={animal.id} />)}</div> : <div className="market-empty"><strong>No encontramos publicaciones con esos filtros</strong><p>Prueba otra especie, ubicación o rango de precio.</p><button className="button button-secondary" onClick={clear} type="button">Ver todos los animales</button></div>}</div></section>
  </>;
}
