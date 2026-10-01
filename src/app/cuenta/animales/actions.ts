"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createAnimal(formData: FormData) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) redirect("/ingresar");

  const { data: breeder } = await supabase
    .from("breeders")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!breeder) redirect("/registro");

  const name = text(formData, "name");
  const species = text(formData, "species");
  if (!name || !species) redirect("/cuenta/animales/nuevo?error=campos");

  const numberOrNull = (key: string) => {
    const raw = text(formData, key);
    return raw ? Number(raw) : null;
  };
  const nullable = (key: string) => text(formData, key) || null;

  const { error } = await supabase.from("animals").insert({
    owner_id: user.id,
    breeder_id: breeder.id,
    name,
    species,
    breed: nullable("breed"),
    sex: text(formData, "sex") || "sin_especificar",
    birth_date: nullable("birth_date"),
    color: nullable("color"),
    weight_kg: numberOrNull("weight_kg"),
    identification: nullable("identification"),
    plate_code: nullable("plate_code"),
    father_name: nullable("father_name"),
    mother_name: nullable("mother_name"),
    health_status: nullable("health_status"),
    description: nullable("description"),
    price_pen: numberOrNull("price_pen"),
    inventory_status: text(formData, "inventory_status") || "activo",
    publication_status: text(formData, "publication_status") || "borrador",
  });

  if (error) redirect("/cuenta/animales/nuevo?error=guardar");
  revalidatePath("/cuenta");
  revalidatePath("/cuenta/animales");
  redirect("/cuenta/animales?created=1");
}
