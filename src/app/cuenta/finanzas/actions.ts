"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { validTransactionAmount, validTransactionDate } from "@/lib/finance-validation";
import { createClient } from "@/lib/supabase/server";
import { canManageAccount } from "@/lib/trial-server";

export async function createTransaction(_state: { error: string }, formData: FormData): Promise<{ error: string }> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/ingresar");
  if (!(await canManageAccount(supabase, user.id))) return { error: "Tu prueba terminó o no pudimos verificar tu plan. Consulta Mi cuenta para continuar; tus datos están conservados." };
  const type = String(formData.get("type") ?? "");
  if (!["venta", "compra", "gasto"].includes(type)) return { error: "Selecciona venta, compra o gasto y vuelve a intentarlo." };
  const concept = String(formData.get("concept") ?? "").trim();
  const amount = String(formData.get("amount_pen") ?? "").trim();
  const date = String(formData.get("transaction_date") ?? "");
  if (concept.length < 2 || concept.length > 120) return { error: "Escribe un concepto de entre 2 y 120 caracteres." };
  if (!validTransactionAmount(amount)) return { error: "Escribe un monto mayor que cero, con hasta dos decimales." };
  if (!validTransactionDate(date)) return { error: "Selecciona una fecha válida para el movimiento." };
  const { data: breeder, error: breederError } = await supabase.from("breeders").select("id").eq("owner_id", user.id).maybeSingle();
  if (breederError || !breeder) return { error: "No pudimos cargar tu criadero. Tus datos siguen aquí; vuelve a intentarlo." };
  const { error } = await supabase.from("farm_transactions").insert({ owner_id: user.id, breeder_id: breeder.id, type, concept, amount_pen: Number(amount), transaction_date: date, payment_status: String(formData.get("payment_status")) === "pendiente" ? "pendiente" : "pagado", notes: String(formData.get("notes") ?? "").trim().slice(0, 2000) || null });
  if (error) return { error: "No pudimos guardar el movimiento. Tus datos siguen aquí; vuelve a intentarlo." };
  revalidatePath("/cuenta");
  revalidatePath("/cuenta/finanzas");
  redirect(`/cuenta/finanzas?tipo=${type}&ok=1`);
}

