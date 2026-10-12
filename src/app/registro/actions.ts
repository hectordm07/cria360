"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LEGAL_VERSION } from "@/lib/trial";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "criadero";
}

export async function completeRegistration(formData: FormData) {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  const user = authData.user;

  if (authError || !user || !user.email) redirect("/ingresar");

  const fullName = value(formData, "full_name");
  const breederName = value(formData, "breeder_name");
  const primarySpecies = value(formData, "primary_species");
  const phone = value(formData, "phone") || null;

  if (!fullName || fullName.length > 140 || !breederName || breederName.length > 140 || !["Aves","Porcinos","Vacunos","Ovinos","Caprinos","Equinos","Otro"].includes(primarySpecies) || (phone && phone.length > 35)) {
    redirect("/registro?error=campos");
  }

  if (formData.get("accept_terms") !== "on") redirect("/registro?error=terminos");
  const { data: existingProfile, error: profileReadError } = await supabase.from("profiles").select("terms_accepted_at").eq("id", user.id).maybeSingle();
  if (profileReadError) redirect("/registro?error=perfil");

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email,
    full_name: fullName,
    phone,
    onboarding_completed: true,
    updated_at: new Date().toISOString(),
    ...(!existingProfile?.terms_accepted_at ? { terms_accepted_at: new Date().toISOString(), terms_version: LEGAL_VERSION } : {}),
  });

  if (profileError) redirect("/registro?error=perfil");

  const { data: existingBreeder } = await supabase
    .from("breeders")
    .select("id, slug")
    .eq("owner_id", user.id)
    .maybeSingle();

  const slug = existingBreeder?.slug ?? `${slugify(breederName)}-${user.id.slice(0, 6)}`;
  const breederPayload = {
    owner_id: user.id,
    name: breederName,
    slug,
    primary_species: primarySpecies,
    department: value(formData, "department").slice(0,80) || null,
    is_public: formData.get("publish_breeder") === "on",
    updated_at: new Date().toISOString(),
  };

  const { error: breederError } = existingBreeder
    ? await supabase.from("breeders").update(breederPayload).eq("id", existingBreeder.id)
    : await supabase.from("breeders").insert(breederPayload);

  if (breederError) redirect("/registro?error=criadero");
  redirect("/cuenta");
}

