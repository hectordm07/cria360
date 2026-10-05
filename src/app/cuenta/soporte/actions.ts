"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTicket(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");

  const honeypot = String(formData.get("website") ?? "").trim();
  const startedAt = Number(String(formData.get("started_at") ?? ""));
  if (honeypot) redirect("/cuenta/soporte?ok=1");
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1500) redirect("/cuenta/soporte?error=rate");

  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const category = String(formData.get("category") ?? "general");
  if (subject.length < 3 || message.length < 10) redirect("/cuenta/soporte?error=datos");

  const cutoff = new Date(Date.now() - 30_000).toISOString();
  const { count } = await supabase
    .from("support_tickets")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .gte("created_at", cutoff);
  if ((count ?? 0) > 0) redirect("/cuenta/soporte?error=rate");

  const allowed = ["general", "inventario", "placas", "pagos", "cuenta"];
  const { error } = await supabase.from("support_tickets").insert({
    owner_id: user.id,
    subject,
    message,
    category: allowed.includes(category) ? category : "general",
  });
  if (error) redirect("/cuenta/soporte?error=guardar");

  revalidatePath("/cuenta/soporte");
  redirect("/cuenta/soporte?ok=1");
}
