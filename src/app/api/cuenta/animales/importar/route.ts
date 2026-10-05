import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ImportRow = Record<string, unknown>;

const planLimits: Record<string, number> = {
  criador: 150,
  profesional: 1000,
};

function normalizeKey(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function read(row: ImportRow, aliases: string[]) {
  const entries = Object.entries(row);
  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);
    const found = entries.find(([key]) => normalizeKey(key) === normalizedAlias);
    if (found) return String(found[1] ?? "").trim();
  }
  return "";
}

function nullable(value: string) {
  return value ? value : null;
}

function numberOrNull(value: string) {
  if (!value) return null;
  const normalized = value.replace(/\s/g, "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

function dateOrNull(value: string) {
  if (!value) return null;
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`;

  const local = value.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{4})$/);
  if (!local) return null;
  const day = local[1].padStart(2, "0");
  const month = local[2].padStart(2, "0");
  return `${local[3]}-${month}-${day}`;
}

function sexValue(value: string) {
  const normalized = normalizeKey(value);
  if (normalized === "macho") return "macho";
  if (normalized === "hembra") return "hembra";
  return "sin_especificar";
}

function inventoryValue(value: string) {
  const normalized = normalizeKey(value);
  return ["activo","reservado","vendido","transferido","fallecido"].includes(normalized) ? normalized : "activo";
}

function publicationValue(value: string) {
  const normalized = normalizeKey(value);
  return ["borrador","publicado","pausado"].includes(normalized) ? normalized : "borrador";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sesión no válida." }, { status: 401 });

  const [{ data: profile }, { data: breeder }, { count }] = await Promise.all([
    supabase.from("profiles").select("plan").eq("id", user.id).maybeSingle(),
    supabase.from("breeders").select("id").eq("owner_id", user.id).maybeSingle(),
    supabase.from("animals").select("id", { count: "exact", head: true }).eq("owner_id", user.id),
  ]);

  if (!profile || !breeder) return NextResponse.json({ error: "Criadero no disponible." }, { status: 400 });

  const limit = planLimits[profile.plan];
  if (!limit) {
    return NextResponse.json({ error: "La carga masiva requiere un plan de pago.", code: "paid_plan_required" }, { status: 403 });
  }

  let body: { fileName?: string; rows?: ImportRow[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Archivo no válido." }, { status: 400 });
  }

  const rows = Array.isArray(body.rows) ? body.rows.slice(0, 1000) : [];
  if (!rows.length) return NextResponse.json({ error: "No encontramos filas para importar." }, { status: 400 });
  if ((body.fileName ?? "").length > 180) return NextResponse.json({ error: "Nombre de archivo no válido." }, { status: 400 });

  const remaining = Math.max(0, limit - (count ?? 0));
  if (!remaining) {
    return NextResponse.json({ error: "Tu plan ya alcanzó el límite de animales. Mejora el plan para continuar." }, { status: 409 });
  }

  const rawPlates = rows.map((row) => read(row, ["Código placa QR NFC","Codigo placa QR NFC","Placa","plate_code"])).filter(Boolean);
  const uniquePlates = [...new Set(rawPlates)];
  const existingPlates = new Set<string>();

  for (let index = 0; index < uniquePlates.length; index += 200) {
    const slice = uniquePlates.slice(index, index + 200);
    const { data } = await supabase.from("animals").select("plate_code").eq("owner_id", user.id).in("plate_code", slice);
    for (const animal of data ?? []) if (animal.plate_code) existingPlates.add(animal.plate_code);
  }

  const seenBatchPlates = new Set<string>();
  const insertRows: Record<string, unknown>[] = [];
  let skipped = 0;
  let errors = 0;

  for (const row of rows) {
    const name = read(row, ["Nombre animal","Nombre","name"]);
    const species = read(row, ["Especie","species"]);
    const plateCode = read(row, ["Código placa QR NFC","Codigo placa QR NFC","Placa","plate_code"]);

    if (!name || !species) {
      errors += 1;
      continue;
    }

    if (plateCode && (existingPlates.has(plateCode) || seenBatchPlates.has(plateCode))) {
      skipped += 1;
      continue;
    }

    if (insertRows.length >= remaining) {
      skipped += 1;
      continue;
    }

    if (plateCode) seenBatchPlates.add(plateCode);

    insertRows.push({
      owner_id: user.id,
      breeder_id: breeder.id,
      name: name.slice(0, 100),
      species: species.slice(0, 80),
      breed: nullable(read(row, ["Raza","breed"]).slice(0, 100)),
      sex: sexValue(read(row, ["Sexo","sex"])),
      birth_date: dateOrNull(read(row, ["Fecha nacimiento","Fecha de nacimiento","birth_date"])),
      color: nullable(read(row, ["Color o señas","Color o senas","Color","color"]).slice(0, 120)),
      weight_kg: numberOrNull(read(row, ["Peso kg","Peso","weight_kg"])),
      identification: nullable(read(row, ["Identificación","Identificacion","N.º de identificación","identification"]).slice(0, 140)),
      plate_code: nullable(plateCode.slice(0, 140)),
      father_name: nullable(read(row, ["Padre","father_name"]).slice(0, 100)),
      mother_name: nullable(read(row, ["Madre","mother_name"]).slice(0, 100)),
      health_status: nullable(read(row, ["Estado sanitario","Salud","health_status"]).slice(0, 180)),
      description: nullable(read(row, ["Descripción","Descripcion","Observaciones","description"]).slice(0, 2000)),
      price_pen: numberOrNull(read(row, ["Precio S/","Precio","price_pen"])),
      inventory_status: inventoryValue(read(row, ["Estado inventario","inventory_status"])),
      publication_status: publicationValue(read(row, ["Estado publicación","Estado publicacion","publication_status"])),
    });
  }

  let imported = 0;
  for (let index = 0; index < insertRows.length; index += 100) {
    const chunk = insertRows.slice(index, index + 100);
    const { error } = await supabase.from("animals").insert(chunk);
    if (error) {
      errors += chunk.length;
    } else {
      imported += chunk.length;
    }
  }

  await supabase.from("animal_import_batches").insert({
    owner_id: user.id,
    breeder_id: breeder.id,
    file_name: (body.fileName || "carga.xlsx").slice(0, 180),
    total_rows: rows.length,
    imported_rows: imported,
    skipped_rows: skipped,
    error_rows: errors,
  });

  return NextResponse.json({
    total: rows.length,
    imported,
    skipped,
    errors,
    remaining: Math.max(0, remaining - imported),
  });
}
