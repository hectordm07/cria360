"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// A request enters the owner's existing private contact inbox.
// No account or animal is deleted until the owner verifies the requester.
export async function requestAccountDeletion(formData: FormData) {
  const text = (key: string) => String(formData.get(key) ?? "").trim();
  if (text("company")) redirect("/eliminar-cuenta?ok=1");
  const startedAt = Number(text("started_at"));
  if (!Number.isFinite(startedAt) || startedAt <= 0 || Date.now() - startedAt < 1800) redirect("/eliminar-cuenta?error=datos");
  const name = text("name");
  const email = text("email");
  const reason = text("reason");
  if (name.length < 2 || name.length > 100 || email.length > 180 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || reason.length > 1500 || text("confirm") !== "yes") {
    redirect("/eliminar-cuenta?error=datos");
  }
  const supabase = await createClient();
  const { error } = await supabase.from("public_contact_messages").insert({
    name,
    email,
    subject: "Solicitud de eliminación de cuenta CRIA360",
    message: `Solicito eliminar mi cuenta CRIA360 y los datos personales asociados, previa verificación de mi identidad. Correo de la cuenta: ${email}.${reason ? ` Información adicional: ${reason}` : ""}`,
  });
  if (error) redirect("/eliminar-cuenta?error=guardar");
  redirect("/eliminar-cuenta?ok=1");
}
