"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function updateSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");

  const legalName = value(formData, "legal_name");
  const contactEmail = value(formData, "contact_email") || null;
  const whatsappNumber = value(formData, "whatsapp_number").replace(/\D/g, "") || null;
  const googleBusinessUrl = value(formData, "google_business_url") || null;

  if (!legalName || legalName.length > 140 || (contactEmail && !contactEmail.includes("@"))) {
    redirect("/cuenta/configuracion?error=datos");
  }

  const { error } = await supabase.from("site_settings").update({
    legal_name: legalName,
    contact_email: contactEmail,
    whatsapp_number: whatsappNumber,
    google_business_url: googleBusinessUrl,
    updated_at: new Date().toISOString(),
  }).eq("id", 1).eq("owner_id", user.id);

  if (error) redirect("/cuenta/configuracion?error=guardar");
  revalidatePath("/", "layout");
  redirect("/cuenta/configuracion?ok=1");
}
