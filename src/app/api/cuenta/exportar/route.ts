import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const client = await createClient();
  const { data: { user }, error } = await client.auth.getUser();
  const headers = { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow" };
  if (error || !user) return NextResponse.json({ error: "Inicia sesión para descargar tus datos." }, { status: 401, headers });
  async function ownedRows(table: string, column = "owner_id") {
    const rows: Record<string, unknown>[] = [];
    // Stable pagination prevents silently truncated exports beyond Supabase's 1,000-row default.
    for (let offset = 0; ; offset += 1000) {
      const { data, error: queryError } = await client.from(table).select("*").eq(column, user!.id).order("id").range(offset, offset + 999);
      if (queryError) throw new Error("export_unavailable");
      rows.push(...(data ?? []));
      if (!data || data.length < 1000) return rows;
      if (offset >= 99000) throw new Error("export_too_large");
    }
  }
  try {
    const [profile, breeders, animals, transactions, inventoryMovements, importBatches, supportTickets] = await Promise.all([
      ownedRows("profiles", "id"), ownedRows("breeders"), ownedRows("animals"), ownedRows("farm_transactions"),
      ownedRows("animal_inventory_movements"), ownedRows("animal_import_batches"), ownedRows("support_tickets"),
    ]);
    return NextResponse.json({ format: "cria360-export-v1", exported_at: new Date().toISOString(), profile, breeders, animals, transactions, inventory_movements: inventoryMovements, import_batches: importBatches, support_tickets: supportTickets },
      { headers: { ...headers, "Content-Disposition": `attachment; filename="cria360-datos-${new Date().toISOString().slice(0,10)}.json"` } });
  } catch {
    return NextResponse.json({ error: "No pudimos generar una descarga completa. Reintenta o solicita una copia a soporte." }, { status: 503, headers });
  }
}
