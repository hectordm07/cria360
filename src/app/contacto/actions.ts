"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function value(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function sendPublicContact(formData: FormData) {
  const name = value(formData, "name");
  const email = value(formData, "email");
  const subject = value(formData, "subject");
  const message = value(formData, "message");
  const honeypot = value(formData, "company");
  const startedAt = Number(value(formData, "started_at"));

  if (honeypot) redirect("/contacto?ok=1");
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1800) redirect("/contacto?error=spam");
  if (name.length < 2 || email.length < 5 || subject.length < 3 || message.length < 10) {
    redirect("/contacto?error=datos");
  }

  const supabase = await createClient();
  const { error } = await supabase.from("public_contact_messages").insert({
    name: name.slice(0, 100),
    email: email.slice(0, 180),
    subject: subject.slice(0, 140),
    message: message.slice(0, 2500),
  });

  if (error) redirect("/contacto?error=guardar");
  redirect("/contacto?ok=1");
}
