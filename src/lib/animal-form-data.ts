import { animalCategories } from "@/lib/category-data";
import type { InventoryAnimal } from "@/lib/inventory-data";
export type AnimalFormValues = Partial<InventoryAnimal> & { birth_date?: string | null; color?: string | null; weight_kg?: number | string | null; identification?: string | null; plate_code?: string | null; father_name?: string | null; mother_name?: string | null; health_status?: string | null; description?: string | null; updated_at?: string };
export function parseAnimalFields(form: FormData, existingSpecies?: string) {
  const text = (key: string, max = 140) => String(form.get(key) ?? "").trim().slice(0,max);
  const nullable = (key: string, max = 140) => text(key,max) || null;
  const name = text("name"); const species = text("species");
  if (!name || !species || (!animalCategories.some(c => c.marketplaceSpecies.includes(species)) && species !== existingSpecies)) return { error: "Escribe el nombre y selecciona un tipo de animal válido." };
  const sex = text("sex") || "sin_especificar";
  const inventory_status = text("inventory_status") || "activo";
  const publication_status = text("publication_status") || "borrador";
  if (!["macho","hembra","sin_especificar"].includes(sex) || !["activo","reservado","vendido","transferido","fallecido"].includes(inventory_status) || !["borrador","publicado","pausado"].includes(publication_status)) return { error: "Revisa el sexo y los estados del animal." };
  const numeric = (key: string) => { const raw = text(key).replace(",","."); return raw ? Number(raw) : null; };
  const weight_kg = numeric("weight_kg"); const price_pen = numeric("price_pen");
  if ([weight_kg,price_pen].some(n => n !== null && (!Number.isFinite(n) || n < 0 || n > 999999999))) return { error: "El peso y precio deben ser números positivos o quedar vacíos." };
  const birth_date = nullable("birth_date");
  if (birth_date && (!/^\d{4}-\d{2}-\d{2}$/.test(birth_date) || Number.isNaN(Date.parse(birth_date)) || new Date(birth_date).toISOString().slice(0,10) !== birth_date)) return { error: "Selecciona una fecha de nacimiento válida." };
  return { fields: { name,species,sex,inventory_status,publication_status,weight_kg,price_pen,birth_date,breed:nullable("breed"),color:nullable("color"),identification:nullable("identification"),plate_code:nullable("plate_code"),father_name:nullable("father_name"),mother_name:nullable("mother_name"),health_status:nullable("health_status"),description:nullable("description",2000) } };
}
