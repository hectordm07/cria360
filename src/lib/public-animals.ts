import "server-only";
import { cache } from "react";
import type { Animal } from "@/lib/demo-data";
import { categoryForSpecies } from "@/lib/category-data";
import { supabaseUrl, supabasePublishableKey } from "@/lib/supabase/config";

type PublicBreeder = { name: string; slug: string; department: string | null; primary_species: string; description: string | null };
export type PublicAnimalRow = { public_code: string; name: string; species: string; breed: string | null; sex: string; birth_date: string | null; price_pen: number | null; image_urls: string[]; description: string | null; health_status: string | null; father_name: string | null; mother_name: string | null; breeders: PublicBreeder | null };
async function publicRows<T>(table: string, params: Record<string, string>): Promise<T[]> {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${new URLSearchParams(params)}`, {
    headers: { apikey: supabasePublishableKey, Authorization: `Bearer ${supabasePublishableKey}` }, cache: "no-store",
  });
  if (!response.ok) throw new Error("public_catalogue_unavailable");
  return response.json() as Promise<T[]>;
}
const animalFields = "public_code,name,species,breed,sex,birth_date,price_pen,image_urls,description,health_status,father_name,mother_name,breeders(name,slug,department,primary_species,description)";
export const getPublishedAnimal = cache(async (code: string) => {
  if (!/^CRIA-[A-Z0-9-]{1,40}$/.test(code)) return null;
  const rows = await publicRows<PublicAnimalRow>("animals", { select: animalFields, public_code: `eq.${code}`, publication_status: "eq.publicado", limit: "1" });
  return rows[0] ?? null;
});
type PublicCardRow = Pick<PublicAnimalRow, "public_code" | "name" | "species" | "breed" | "sex" | "birth_date" | "price_pen" | "image_urls" | "breeders">;
export async function getPublishedAnimals() {
  const rows: PublicCardRow[] = [];
  for (let offset = 0; ; offset += 1000) {
    const page = await publicRows<PublicCardRow>("animals", { select: "public_code,name,species,breed,sex,birth_date,price_pen,image_urls,breeders(name,slug,department)", publication_status: "eq.publicado", order: "created_at.desc,id.asc", limit: "1000", offset: String(offset) });
    rows.push(...page);
    if (page.length < 1000) return rows;
    if (offset >= 99000) throw new Error("catalogue_pagination_required");
  }
}
export async function getPublicBreeder(slug: string) {
  if (!/^[a-z0-9-]{1,160}$/.test(slug)) return null;
  const rows = await publicRows<PublicBreeder>("breeders", { select: "name,slug,department,primary_species,description", slug: `eq.${slug}`, is_public: "eq.true", limit: "1" });
  return rows[0] ?? null;
}
export function publicAnimalCard(row: PublicCardRow): Animal {
  const category = categoryForSpecies(row.species);
  const price = row.price_pen == null ? null : Number(row.price_pen);
  const photos = row.image_urls ?? [];
  const image = photos.find(src => src.startsWith(`${supabaseUrl}/storage/v1/object/public/animal-photos/`)) || category?.image || "/icons/granja-conectada-512.png";
  return { id: row.public_code, name: row.name, species: row.species, breed: row.breed || "Raza sin especificar", sex: row.sex === "macho" ? "Macho" : row.sex === "hembra" ? "Hembra" : "Sin especificar", age: row.birth_date ? `Nació el ${row.birth_date.split("-").reverse().join("/")}` : "Edad sin especificar", location: row.breeders?.department || "Ubicación sin publicar", price: price != null && Number.isFinite(price) ? `S/ ${price.toLocaleString("es-PE", { maximumFractionDigits: 2 })}` : "Consultar", priceValue: price ?? undefined, breeder: row.breeders?.name || "Criadero con perfil privado", breederSlug: row.breeders?.slug || "", tone: category?.tone || "green", mark: category?.symbol || "A", image, imageAlt: photos.includes(image) ? `Fotografía de ${row.name}` : `Imagen de referencia de ${row.species}`, verified: false, isDemo: false };
}
