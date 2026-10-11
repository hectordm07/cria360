import { createClient } from "@/lib/supabase/server";
import { type FinanceMovement, type FinanceMonth } from "@/lib/dashboard-data";
import type { InventoryAnimal } from "@/lib/inventory-data";

export type StockAnimal = { species: string; inventory_status: string; publication_status: string; view_count: number };

export async function readInventoryDetails(client: Awaited<ReturnType<typeof createClient>>, ownerId: string) {
  const rows: InventoryAnimal[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from("animals")
      .select("id,public_code,name,species,breed,sex,inventory_status,publication_status,price_pen,created_at")
      .eq("owner_id", ownerId).order("created_at", { ascending: false }).order("id", { ascending: true })
      .range(offset, offset + 999);
    if (error) return { rows: [], error: true };
    rows.push(...(data ?? []) as InventoryAnimal[]);
    if (!data || data.length < 1000) break;
  }
  return { rows, error: false };
}

export async function readInventory(client: Awaited<ReturnType<typeof createClient>>, ownerId: string) {
  const rows: StockAnimal[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from("animals")
      .select("species,inventory_status,publication_status,view_count")
      .eq("owner_id", ownerId).order("id", { ascending: true }).range(offset, offset + 999);
    if (error) return { rows: [], error: true };
    rows.push(...(data ?? []) as StockAnimal[]);
    if (!data || data.length < 1000) break;
  }
  return { rows, error: false };
}

export async function readFinance(client: Awaited<ReturnType<typeof createClient>>, ownerId: string, periods: FinanceMonth[]) {
  const last = new Date(`${periods.at(-1)!.key}-01T12:00:00Z`);
  last.setUTCMonth(last.getUTCMonth() + 1);
  const rows: FinanceMovement[] = [];
  for (let offset = 0; ; offset += 1000) {
    const { data, error } = await client.from("farm_transactions")
      .select("type,amount_pen,transaction_date,payment_status")
      .eq("owner_id", ownerId).gte("transaction_date", `${periods[0].key}-01`)
      .lt("transaction_date", last.toISOString().slice(0, 10))
      .order("transaction_date", { ascending: true }).order("id", { ascending: true })
      .range(offset, offset + 999);
    if (error) return { rows: [], error: true };
    rows.push(...(data ?? []) as FinanceMovement[]);
    if (!data || data.length < 1000) break;
  }
  return { rows, error: false };
}
