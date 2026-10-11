import { matchesAnimalCategory } from "./category-data";
import type { Animal } from "./demo-data";

export type MarketplaceFilters = { query: string; species: string; location: string; sex: string; price: string; verified: boolean; sort: string };

export function filterMarketplace(animals: Animal[], filters: MarketplaceFilters) {
  const query = filters.query.trim().toLocaleLowerCase("es-PE");
  return animals.filter(animal => {
    const searchable = `${animal.name} ${animal.id} ${animal.breed} ${animal.breeder} ${animal.species} ${animal.location}`.toLocaleLowerCase("es-PE");
    const matchesPrice = !filters.price || (animal.priceValue != null && (filters.price === "2500" ? animal.priceValue <= 2500 : filters.price === "8000" ? animal.priceValue > 2500 && animal.priceValue <= 8000 : animal.priceValue > 8000));
    return (!query || searchable.includes(query)) && (!filters.species || matchesAnimalCategory(filters.species, animal.species)) && (!filters.location || animal.location === filters.location) && (!filters.sex || animal.sex === filters.sex) && matchesPrice && (!filters.verified || animal.verified);
  }).sort((a, b) => filters.sort === "price-asc" ? (a.priceValue ?? Infinity) - (b.priceValue ?? Infinity) : filters.sort === "price-desc" ? (b.priceValue ?? -1) - (a.priceValue ?? -1) : 0);
}

export function marketplacePageSize(columns: number) {
  return Math.max(1, Math.min(3, columns)) * 3;
}
