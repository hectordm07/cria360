import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountHomeSummary } from "@/components/account-home-summary";
import { AccountInventorySummary } from "@/components/account-inventory-summary";
import { integer, summarizeDay } from "@/lib/dashboard-data";
import { readDailyFinance, readInventory } from "@/lib/dashboard-server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mi criadero", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/ingresar");
  const now = new Date();
  const [{ data: profile }, { data: breeder }, animals, finance] = await Promise.all([
    supabase.from("profiles").select("full_name").eq("id", data.user.id).maybeSingle(),
    supabase.from("breeders").select("name").eq("owner_id", data.user.id).maybeSingle(),
    readInventory(supabase, data.user.id),
    readDailyFinance(supabase, data.user.id, now),
  ]);
  if (!profile || !breeder) redirect("/registro");
  const firstName = (profile.full_name ?? "").trim().split(/\s+/)[0] || "Criador";
  const dateLabel = new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", day: "numeric", month: "short" }).format(new Date());
  const stat = (count: number) => animals.error ? "—" : integer.format(count);

  return <section className="account-dashboard app-home">
    <AccountHomeSummary firstName={firstName} breederName={breeder.name} dateLabel={dateLabel} summary={finance.error ? null : summarizeDay(finance.rows, now)} />
    {animals.error && <p className="form-notice error" role="alert">No pudimos cargar el inventario. <a href="/cuenta">Volver a intentar</a></p>}
    <AccountInventorySummary total={stat(animals.rows.length)} active={stat(animals.rows.filter(animal => animal.inventory_status === "activo").length)} published={stat(animals.rows.filter(animal => animal.publication_status === "publicado").length)} />
  </section>;
}

