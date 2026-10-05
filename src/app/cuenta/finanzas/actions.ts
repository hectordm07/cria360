"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function createTransaction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");
  const type = String(formData.get("type") ?? "");
  if (!["venta", "compra", "gasto"].includes(type)) redirect("/cuenta/finanzas?error=tipo");
  const concept = String(formData.get("concept") ?? "").trim();
  const amount = Number(formData.get("amount_pen"));
  const date = String(formData.get("transaction_date") ?? "");
  if (concept.length < 2 || !Number.isFinite(amount) || amount <= 0 || !date) redirect(`/cuenta/finanzas?tipo=${type}&error=datos`);
  const { data: breeder } = await supabase.from("breeders").select("id").eq("owner_id", user.id).maybeSingle();
  const { error } = await supabase.from("farm_transactions").insert({ owner_id: user.id, breeder_id: breeder?.id ?? null, type, concept, amount_pen: amount, transaction_date: date, payment_status: String(formData.get("payment_status")) === "pendiente" ? "pendiente" : "pagado", notes: String(formData.get("notes") ?? "").trim() || null });
  if (error) redirect(`/cuenta/finanzas?tipo=${type}&error=guardar`);
  revalidatePath("/cuenta"); revalidatePath("/cuenta/finanzas");
  redirect(`/cuenta/finanzas?tipo=${type}&ok=1`);
}
