import { animalCategories } from "@/lib/category-data";

export type InventoryAnimal = {
  id: string;
  public_code: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  inventory_status: string;
  publication_status: string;
  price_pen: number | string | null;
  created_at: string;
};

const normalize = (value: string) => value.trim().toLocaleLowerCase("es-PE");

export function inventoryType(species: string) {
  const category = animalCategories.find(item => item.marketplaceSpecies.some(value => normalize(value) === normalize(species)));
  return category
    ? { key: category.slug, label: category.shortName, symbol: category.symbol, tone: category.tone }
    : { key: `species:${normalize(species)}`, label: species.trim() || "Sin especificar", symbol: "+", tone: "slate" };
}

export function inventoryGroups(animals: InventoryAnimal[]) {
  const groups = new Map<string, ReturnType<typeof inventoryType> & { total: number; active: number; reserved: number }>();
  for (const animal of animals) {
    const type = inventoryType(animal.species);
    const group = groups.get(type.key) ?? { ...type, total: 0, active: 0, reserved: 0 };
    group.total++;
    if (animal.inventory_status === "activo") group.active++;
    if (animal.inventory_status === "reservado") group.reserved++;
    groups.set(type.key, group);
  }
  return [...groups.values()].sort((a, b) => a.label.localeCompare(b.label, "es"));
}
