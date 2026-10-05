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

  const photos = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
  if (photos.length > 5 || photos.some((photo) => photo.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(photo.type))) {
    redirect("/cuenta/animales/nuevo?error=fotos");
  }
  const uploadedPaths: string[] = [];
  const imageUrls: string[] = [];
  for (const photo of photos) {
    const extension = photo.name.split(".").pop()?.toLowerCase() || "jpg";
    const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from("animal-photos").upload(path, photo, { cacheControl: "3600", upsert: false });
    if (uploadError) {
      if (uploadedPaths.length) await supabase.storage.from("animal-photos").remove(uploadedPaths);
      redirect("/cuenta/animales/nuevo?error=fotos");
    }
    uploadedPaths.push(path);
    imageUrls.push(supabase.storage.from("animal-photos").getPublicUrl(path).data.publicUrl);
  }

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
    image_urls: imageUrls,
  });

  if (error) {
    if (uploadedPaths.length) await supabase.storage.from("animal-photos").remove(uploadedPaths);
    redirect("/cuenta/animales/nuevo?error=guardar");
  }
  revalidatePath("/cuenta");
  revalidatePath("/cuenta/animales");
  redirect("/cuenta/animales?created=1");
}


export async function exitAnimal(formData: FormData) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) redirect("/ingresar");

  const animalId = text(formData, "animal_id");
  const reason = text(formData, "reason");
  const note = text(formData, "note");
  const returnCode = text(formData, "return_code");

  if (!animalId || !["vendido", "transferido", "fallecido"].includes(reason)) {
    redirect("/cuenta/escanear?error=salida");
  }

  const { error } = await supabase.rpc("register_animal_inventory_exit", {
    p_animal_id: animalId,
    p_reason: reason,
    p_note: note || null,
  });

  if (error) redirect("/cuenta/escanear?error=salida");

  revalidatePath("/cuenta");
  revalidatePath("/cuenta/animales");
  redirect(`/cuenta/escanear?exit=1${returnCode ? `&code=${encodeURIComponent(returnCode)}` : ""}`);
}
