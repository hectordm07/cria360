import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createTicket } from "./actions";

export const metadata: Metadata = { title: "Soporte", robots: { index: false, follow: false } };

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const params = await searchParams; const supabase = await createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) redirect("/ingresar");
  const { data: tickets } = await supabase.from("support_tickets").select("id,subject,category,status,created_at").eq("owner_id", user.id).order("created_at", { ascending: false });
  return <section className="inventory-page finance-page"><div className="section-shell"><div className="inventory-heading"><div><span className="eyebrow">Centro de ayuda</span><h1>Soporte CRIA360</h1><p>Tu solicitud queda guardada y puedes seguir su estado.</p></div></div>{params.ok && <p className="form-notice success">Solicitud enviada correctamente.</p>}{params.error && <p className="form-notice error">Revisa los datos e inténtalo nuevamente.</p>}<div className="support-grid"><form action={createTicket} className="finance-form"><label>Asunto<input name="subject" required minLength={3} maxLength={120} /></label><label>Categoría<select name="category"><option value="general">Consulta general</option><option value="inventario">Inventario</option><option value="placas">Placas QR / NFC</option><option value="pagos">Pagos</option><option value="cuenta">Mi cuenta</option></select></label><label>Mensaje<textarea name="message" required minLength={10} maxLength={2000} rows={6} /></label><button className="button button-primary" type="submit">Enviar solicitud</button></form><div className="transaction-list"><h2>Mis solicitudes</h2>{tickets?.length ? tickets.map(ticket => <article key={ticket.id}><div><strong>{ticket.subject}</strong><small>{ticket.category} · {new Date(ticket.created_at).toLocaleDateString("es-PE")}</small></div><span>{ticket.status.replace("_", " ")}</span></article>) : <p>Aún no tienes solicitudes.</p>}</div></div></div></section>;
}
