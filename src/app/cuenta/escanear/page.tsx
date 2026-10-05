import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AnimalScanner } from "@/components/animal-scanner";
import { createClient } from "@/lib/supabase/server";
import { exitAnimal } from "../animales/actions";

export const metadata: Metadata = {
  title: "Escanear animal",
  robots: { index: false, follow: false },
};

type AnimalResult = {
  id: string;
  public_code: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  inventory_status: string;
  publication_status: string;
  plate_code: string | null;
  identification: string | null;
};

function normalizedCode(raw?: string) {
  const value = (raw ?? "").trim();
  if (!value) return "";

  try {
    const url = new URL(value);
    const queryCode = url.searchParams.get("code");
    if (queryCode) return queryCode.trim();
    const parts = url.pathname.split("/").filter(Boolean);
    return decodeURIComponent(parts.at(-1) ?? value).trim();
  } catch {
    return value;
  }
}

async function findOwnedAnimal(code: string, userId: string): Promise<AnimalResult | null> {
  if (!code) return null;
  const supabase = await createClient();
  const select = "id, public_code, name, species, breed, sex, inventory_status, publication_status, plate_code, identification";

  const byPublicCode = await supabase
    .from("animals")
    .select(select)
    .eq("owner_id", userId)
    .eq("public_code", code.toUpperCase())
    .maybeSingle();
  if (byPublicCode.data) return byPublicCode.data as AnimalResult;

  const byPlate = await supabase
    .from("animals")
    .select(select)
    .eq("owner_id", userId)
    .eq("plate_code", code)
    .maybeSingle();
  if (byPlate.data) return byPlate.data as AnimalResult;

  const byIdentification = await supabase
    .from("animals")
    .select(select)
    .eq("owner_id", userId)
    .eq("identification", code)
    .maybeSingle();
  return (byIdentification.data as AnimalResult | null) ?? null;
}

export default async function ScanAnimalPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; exit?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");

  const params = await searchParams;
  const code = normalizedCode(params.code);
  const animal = code ? await findOwnedAnimal(code, data.user.id) : null;
  const canExit = animal && ["activo", "reservado"].includes(animal.inventory_status);

  return (
    <section className="inventory-page scanner-page">
      <div className="section-shell narrow-shell">
        <div className="inventory-heading scanner-heading">
          <div>
            <span className="eyebrow">Inventario móvil</span>
            <h1>Escanear animal</h1>
            <p>Busca por QR, NFC, código CRIA360, placa o identificación.</p>
          </div>
          <Link className="button button-secondary" href="/cuenta/animales">Inventario</Link>
        </div>

        {params.exit && <p className="form-success" role="status">Salida de inventario registrada correctamente.</p>}
        {params.error && <p className="form-error" role="alert">No pudimos registrar la salida. Inténtalo nuevamente.</p>}

        <AnimalScanner />

        {code && !animal && (
          <div className="scanner-result scanner-result-empty">
            <strong>No encontramos este animal</strong>
            <p>Verifica el código o confirma que pertenezca a tu criadero.</p>
          </div>
        )}

        {animal && (
          <article className="scanner-result animal-scan-result">
            <div className="scan-result-head">
              <div>
                <span className="inventory-code">{animal.public_code}</span>
                <h2>{animal.name}</h2>
                <p>{[animal.species, animal.breed, animal.sex].filter(Boolean).join(" · ")}</p>
              </div>
              <span className={`scan-status status-${animal.inventory_status}`}>{animal.inventory_status}</span>
            </div>

            <dl className="scan-result-facts">
              <div><dt>Placa</dt><dd>{animal.plate_code || "Sin placa vinculada"}</dd></div>
              <div><dt>Identificación</dt><dd>{animal.identification || "Sin identificación adicional"}</dd></div>
              <div><dt>Publicación</dt><dd>{animal.publication_status}</dd></div>
            </dl>

            {canExit ? (
              <form action={exitAnimal} className="inventory-exit-card">
                <input type="hidden" name="animal_id" value={animal.id} />
                <input type="hidden" name="return_code" value={code} />
                <div>
                  <strong>Salida de inventario</strong>
                  <p>Al confirmar, el animal deja de contabilizarse como activo y su publicación se pausa.</p>
                </div>
                <label>Motivo
                  <select name="reason" defaultValue="vendido" required>
                    <option value="vendido">Vendido</option>
                    <option value="transferido">Transferido</option>
                    <option value="fallecido">Fallecido</option>
                  </select>
                </label>
                <label>Observación
                  <textarea name="note" rows={3} maxLength={500} placeholder="Opcional: comprador, destino o detalle" />
                </label>
                <button className="button button-primary full-button" type="submit">Confirmar salida</button>
              </form>
            ) : (
              <div className="inventory-exit-closed">
                Este animal ya figura como <strong>{animal.inventory_status}</strong> y no está en el stock activo.
              </div>
            )}
          </article>
        )}
      </div>
    </section>
  );
}
