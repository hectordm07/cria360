"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageAccount } from "@/lib/trial-server";
import { parseAnimalFields } from "@/lib/animal-form-data";
import { inventoryType } from "@/lib/inventory-data";

function text(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function createAnimal(formData: FormData) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) redirect("/ingresar");

  if (!(await canManageAccount(supabase, user.id))) redirect("/cuenta/mi-cuenta?aviso=prueba");

  const { data: breeder } = await supabase
    .from("breeders")
    .select("id")
    .eq("owner_id", user.id)
    .single();
  if (!breeder) redirect("/registro");

  const parsed = parseAnimalFields(formData);
  if (!parsed.fields) redirect("/cuenta/animales/nuevo?error=campos");
  const { species } = parsed.fields;

  const photos = formData.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
  if (photos.length > 5 || photos.some((photo) => photo.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(photo.type))) {
    redirect("/cuenta/animales/nuevo?error=fotos");
  }
  const uploadedPaths: string[] = [];
  const imageUrls: string[] = [];
  for (const photo of photos) {
    const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string,string>)[photo.type];
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
    ...parsed.fields,
    image_urls: imageUrls,
  });

  if (error) {
    if (uploadedPaths.length) await supabase.storage.from("animal-photos").remove(uploadedPaths);
    if (error.message.includes("trial_expired")) redirect("/cuenta/mi-cuenta?aviso=prueba");
    if (error.message.includes("plan_limit")) redirect("/cuenta/animales/nuevo?error=limite");
    redirect("/cuenta/animales/nuevo?error=guardar");
  }
  revalidatePath("/cuenta", "layout");
  revalidatePath("/marketplace");
  revalidatePath("/animales", "layout");
  revalidatePath("/criaderos", "layout");
  redirect(`/cuenta/animales?tipo=${encodeURIComponent(inventoryType(species).key)}&created=1`);
}


export async function exitAnimal(formData: FormData) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;
  if (!user) redirect("/ingresar");

  if (!(await canManageAccount(supabase, user.id))) redirect("/cuenta/mi-cuenta?aviso=prueba");

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

  revalidatePath("/cuenta", "layout");
  revalidatePath("/marketplace");
  revalidatePath("/animales", "layout");
  revalidatePath("/criaderos", "layout");
  redirect(`/cuenta/escanear?exit=1${returnCode ? `&code=${encodeURIComponent(returnCode)}` : ""}`);
}


export async function updateAnimal(_state: { error: string }, form: FormData) {
  const client = await createClient();
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) return { error: "Tu sesión terminó. Vuelve a ingresar." };
  const userId = auth.user.id;
  if (!(await canManageAccount(client, userId))) return { error: "Tu prueba terminó. Revisa los planes para continuar editando." };
  const id = text(form,"animal_id");
  const { data: current, error: readError } = await client.from("animals").select("id,species,image_urls,updated_at").eq("id",id).eq("owner_id",userId).maybeSingle();
  if (readError || !current) return { error: "No pudimos encontrar tu animal." };
  if (current.updated_at !== text(form,"updated_at")) return { error: "La ficha cambió. Recarga la página antes de editar." };
  const parsed = parseAnimalFields(form,current.species);
  if (!parsed.fields) return { error: parsed.error! };
  const removed = new Set(form.getAll("remove_photos").map(String));
  const retained: string[] = (current.image_urls ?? []).filter((url: string) => !removed.has(url));
  const photos = form.getAll("photos").filter((value): value is File => value instanceof File && value.size > 0);
  if (retained.length + photos.length > 5 || photos.some(p => p.size > 5*1024*1024 || !["image/jpeg","image/png","image/webp"].includes(p.type))) return { error: "Usa hasta 5 fotos JPG, PNG o WebP, de máximo 5 MB cada una." };
  const paths: string[] = []; const urls: string[] = [];
  for (const photo of photos) {
    const extension = ({"image/jpeg":"jpg","image/png":"png","image/webp":"webp"} as Record<string,string>)[photo.type];
    const path = `${userId}/${crypto.randomUUID()}.${extension}`;
    const { error } = await client.storage.from("animal-photos").upload(path,photo,{upsert:false});
    if (error) { if (paths.length) await client.storage.from("animal-photos").remove(paths); return { error: "No pudimos subir las fotos. Inténtalo nuevamente." }; }
    paths.push(path); urls.push(client.storage.from("animal-photos").getPublicUrl(path).data.publicUrl);
  }
  const { data: saved, error } = await client.from("animals").update({...parsed.fields,image_urls:[...retained,...urls]}).eq("id",id).eq("owner_id",userId).eq("updated_at",current.updated_at).select("id").maybeSingle();
  if (error || !saved) {
    if (paths.length) await client.storage.from("animal-photos").remove(paths);
    return { error: error?.message.includes("plan_limit") ? "Alcanzaste el límite de tu plan." : "No pudimos guardar. Recarga la ficha y vuelve a intentarlo." };
  }
  revalidatePath("/cuenta", "layout"); revalidatePath("/marketplace"); revalidatePath("/animales", "layout"); revalidatePath("/criaderos", "layout");
  redirect(`/cuenta/animales?tipo=${encodeURIComponent(inventoryType(parsed.fields.species).key)}&updated=1`);
}

export async function deleteAnimal(_state: { error: string }, form: FormData) {
  const client = await createClient();
  const { data: auth } = await client.auth.getUser();
  if (!auth.user) return { error: "Tu sesión terminó. Vuelve a ingresar." };
  if (text(form,"confirm") !== "eliminar") return { error: "Confirma la eliminación." };
  const id = text(form,"animal_id");
  const { data: animal, error } = await client.from("animals").delete().eq("id",id).eq("owner_id",auth.user.id).select("species").maybeSingle();
  if (error || !animal) return { error: "No pudimos eliminar tu animal. Recarga la lista y vuelve a intentarlo." };
  revalidatePath("/cuenta", "layout"); revalidatePath("/marketplace"); revalidatePath("/animales", "layout"); revalidatePath("/criaderos", "layout");
  redirect(`/cuenta/animales?tipo=${encodeURIComponent(inventoryType(animal.species).key)}&deleted=1`);
}
