import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icon";
import { createClient } from "@/lib/supabase/server";
import { completeRegistration } from "./actions";

export const metadata: Metadata = { title: "Crear cuenta", description: "Registra tu criadero en CRIA360." };

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar?next=/registro");

  const [{ data: profile }, { data: breeder }, params] = await Promise.all([
    supabase.from("profiles").select("full_name, phone").eq("id", data.user.id).maybeSingle(),
    supabase.from("breeders").select("name, primary_species").eq("owner_id", data.user.id).maybeSingle(),
    searchParams,
  ]);
  const metadataName = typeof data.user.user_metadata.full_name === "string" ? data.user.user_metadata.full_name : "";

  return <section className="register-page"><div className="register-copy"><span className="eyebrow light">Únete a CRIA360</span><h1>Tu criadero,<br />listo para crecer.</h1><p>Crea tu identidad digital y administra tus animales desde un inventario seguro.</p><ul><li><Icon name="check" /> Inventario de animales</li><li><Icon name="check" /> Genealogía, salud y placa QR</li><li><Icon name="check" /> Publicaciones para venta</li></ul></div><div className="register-form"><span className="plan-pill">Plan Gratis</span><h2>Crea tu cuenta</h2><p>Primero cuéntanos quién eres.</p>{params.error && <p className="form-error">No pudimos guardar los datos. Revisa los campos e inténtalo nuevamente.</p>}<form action={completeRegistration}><label>Nombre completo<input name="full_name" defaultValue={profile?.full_name ?? metadataName} placeholder="Tu nombre y apellido" required /></label><label>Correo electrónico<input name="email" type="email" value={data.user.email ?? ""} readOnly /></label><label>Teléfono o WhatsApp <span>(opcional)</span><input name="phone" type="tel" defaultValue={profile?.phone ?? ""} placeholder="Ej. 999 999 999" /></label><label>Nombre del criadero<input name="breeder_name" defaultValue={breeder?.name ?? ""} placeholder="Ej. Hacienda El Roble" required /></label><label>Especie principal<select name="primary_species" defaultValue={breeder?.primary_species ?? ""} required><option value="" disabled>Selecciona una opción</option><option>Aves</option><option>Porcinos</option><option>Vacunos</option><option>Ovinos</option><option>Caprinos</option><option>Equinos</option><option>Otro</option></select></label><button className="button button-primary full-button" type="submit">Guardar y continuar</button></form><small>Al continuar aceptas los términos y la política de privacidad.</small><Link href="/planes">Comparar planes</Link></div></section>;
}
