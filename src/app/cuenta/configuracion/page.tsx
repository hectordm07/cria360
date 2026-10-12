import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updateSiteSettings } from "./actions";

export const metadata: Metadata = { title: "Configuración del sitio", robots: { index: false, follow: false } };

export default async function SiteSettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const params = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");

  const { data: settings } = await supabase.from("site_settings")
    .select("legal_name,contact_email,whatsapp_number,google_business_url,legal_ruc,legal_address,complaints_url")
    .eq("id", 1)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!settings) redirect("/cuenta");

  return <section className="inventory-page finance-page"><div className="section-shell narrow-shell">
    <div className="inventory-heading"><div><span className="eyebrow">Sitio público</span><h1>Configuración</h1><p>Completa los datos que se mostrarán públicamente en contacto, WhatsApp y páginas legales.</p></div></div>
    {params.ok && <p className="form-success">Configuración actualizada.</p>}
    {params.error && <p className="form-error">No pudimos guardar los cambios.</p>}
    <form action={updateSiteSettings} className="animal-form site-settings-form">
      <fieldset><legend>Identidad legal y contacto</legend><div className="form-grid">
        <label>Nombre o razón social<input name="legal_name" defaultValue={settings.legal_name} required maxLength={140} /></label>
        <label>RUC del titular<input name="legal_ruc" inputMode="numeric" pattern="[0-9]{11}" maxLength={11} defaultValue={settings.legal_ruc ?? ""} placeholder="11 dígitos" /></label><label>Domicilio legal<input name="legal_address" maxLength={250} defaultValue={settings.legal_address ?? ""} placeholder="Dirección, distrito y departamento" /></label><label>URL de tu Libro de Reclamaciones<input name="complaints_url" type="url" defaultValue={settings.complaints_url ?? ""} placeholder="https://..." /><span>Enlace a tu libro virtual operativo, con copia y seguimiento del reclamo.</span></label><label>Correo público<input name="contact_email" type="email" defaultValue={settings.contact_email ?? ""} placeholder="contacto@cria360.pe" /></label>
        <label>WhatsApp público<input name="whatsapp_number" inputMode="tel" defaultValue={settings.whatsapp_number ?? ""} placeholder="51999999999" /><span>Incluye código de país, sin + ni espacios.</span></label>
        <label>URL de Google Business Profile<input name="google_business_url" type="url" defaultValue={settings.google_business_url ?? ""} placeholder="https://g.page/..." /></label>
      </div></fieldset>
      <button className="button button-primary" type="submit">Guardar configuración</button>
    </form>
  </div></section>;
}

