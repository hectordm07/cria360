"use client";

import { useMemo, useState } from "react";

type ImportRow = Record<string, unknown>;

type SheetJs = {
  read: (data: ArrayBuffer, options?: Record<string, unknown>) => {
    SheetNames: string[];
    Sheets: Record<string, unknown>;
  };
  utils: {
    sheet_to_json: (sheet: unknown, options?: Record<string, unknown>) => ImportRow[];
    json_to_sheet: (rows: Record<string, unknown>[]) => unknown;
    book_new: () => unknown;
    book_append_sheet: (book: unknown, sheet: unknown, name: string) => void;
  };
  writeFile: (book: unknown, fileName: string) => void;
};

declare global {
  interface Window {
    XLSX?: SheetJs;
    __cria360XlsxPromise?: Promise<SheetJs>;
  }
}

const XLSX_CDN = "https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js";

const sampleRows = [
  {
    "Nombre animal": "Tornado",
    "Especie": "Equinos",
    "Raza": "Peruano de paso",
    "Sexo": "macho",
    "Fecha nacimiento": "15/03/2025",
    "Color o señas": "Castaño",
    "Peso kg": 420,
    "Identificación": "ARETE-001",
    "Código placa QR NFC": "CRIA-PLACA-001",
    "Padre": "Relámpago",
    "Madre": "Estrella",
    "Estado sanitario": "Vacunas al día",
    "Descripción": "Ejemplo de carga. Puedes eliminar esta fila.",
    "Precio S/": 7500,
    "Estado inventario": "activo",
    "Estado publicación": "borrador",
  },
];

function ensureXlsx(): Promise<SheetJs> {
  if (window.XLSX) return Promise.resolve(window.XLSX);
  if (window.__cria360XlsxPromise) return window.__cria360XlsxPromise;

  window.__cria360XlsxPromise = new Promise<SheetJs>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = XLSX_CDN;
    script.async = true;
    script.onload = () => window.XLSX ? resolve(window.XLSX) : reject(new Error("No se pudo iniciar el lector de Excel."));
    script.onerror = () => reject(new Error("No se pudo cargar el lector de Excel."));
    document.head.appendChild(script);
  });

  return window.__cria360XlsxPromise;
}

function normalizeKey(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function valueByAlias(row: ImportRow, aliases: string[]) {
  const entries = Object.entries(row);
  for (const alias of aliases) {
    const normalizedAlias = normalizeKey(alias);
    const found = entries.find(([key]) => normalizeKey(key) === normalizedAlias);
    if (found) return String(found[1] ?? "");
  }
  return "";
}

type ImportResult = {
  imported: number;
  skipped: number;
  errors: number;
  total: number;
  remaining: number;
};

export function BulkAnimalImport({
  planLabel,
  animalLimit,
  currentCount,
}: {
  planLabel: string;
  animalLimit: number;
  currentCount: number;
}) {
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);

  const remaining = Math.max(0, animalLimit - currentCount);
  const preview = useMemo(() => rows.slice(0, 5), [rows]);

  async function readFile(file: File) {
    setMessage("");
    setResult(null);
    setRows([]);
    setFileName(file.name);

    if (!/\.(xlsx|xls|csv)$/i.test(file.name)) {
      setMessage("Usa un archivo .xlsx, .xls o .csv.");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setMessage("El archivo supera 8 MB. Divide la carga en archivos más pequeños.");
      return;
    }

    try {
      const XLSX = await ensureXlsx();
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array", cellDates: true, raw: false });
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) throw new Error("El archivo no contiene hojas.");

      const parsed = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
        defval: "",
        raw: false,
        dateNF: "dd/mm/yyyy",
      });

      const nonEmpty = parsed.filter((row) => Object.values(row).some((value) => String(value ?? "").trim()));
      if (!nonEmpty.length) {
        setMessage("La primera hoja no contiene datos.");
        return;
      }

      if (nonEmpty.length > 1000) {
        setMessage("Máximo 1,000 filas por archivo. Divide la carga y vuelve a intentarlo.");
        return;
      }

      setRows(nonEmpty);
      setMessage(`${nonEmpty.length} filas detectadas. Revisa la vista previa antes de importar.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No pudimos leer el archivo.");
    }
  }

  async function downloadTemplate() {
    setMessage("");
    try {
      const XLSX = await ensureXlsx();
      const sheet = XLSX.utils.json_to_sheet(sampleRows);
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, sheet, "Animales");
      XLSX.writeFile(book, "Plantilla_CRIA360_Carga_Masiva.xlsx");
    } catch {
      setMessage("No pudimos generar la plantilla. Inténtalo nuevamente.");
    }
  }

  async function importRows() {
    if (!rows.length || loading) return;
    setLoading(true);
    setMessage("");
    setResult(null);

    try {
      const response = await fetch("/api/cuenta/animales/importar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName, rows }),
      });
      const payload = await response.json() as ImportResult & { error?: string; code?: string };

      if (!response.ok) {
        if (payload.code === "paid_plan_required") {
          window.location.href = "/planes?feature=excel";
          return;
        }
        setMessage(payload.error || "No pudimos completar la importación.");
        return;
      }

      setResult(payload);
      setRows([]);
      setFileName("");
      setMessage("Carga masiva finalizada.");
    } catch {
      setMessage("No pudimos conectar con el servidor. Inténtalo nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bulk-import-layout">
      <section className="bulk-import-card">
        <div className="bulk-import-plan">
          <span>Plan {planLabel}</span>
          <strong>{currentCount} / {animalLimit} animales</strong>
          <small>{remaining} espacios disponibles</small>
        </div>

        <div className="bulk-import-steps">
          <span><strong>1</strong> Descarga la plantilla</span>
          <span><strong>2</strong> Completa tu Excel</span>
          <span><strong>3</strong> Carga y valida</span>
        </div>

        <button className="button button-secondary full-button" type="button" onClick={downloadTemplate}>
          Descargar plantilla Excel
        </button>

        <label className="bulk-file-drop">
          <strong>Seleccionar Excel</strong>
          <span>.xlsx, .xls o .csv · máximo 8 MB · hasta 1,000 filas</span>
          <input
            type="file"
            accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void readFile(file);
            }}
          />
        </label>

        {message && <p className="bulk-import-message" role="status">{message}</p>}

        {preview.length > 0 && (
          <div className="bulk-preview">
            <div className="bulk-preview-head">
              <strong>Vista previa</strong>
              <span>{rows.length} filas</span>
            </div>
            <div className="bulk-preview-scroll">
              <table>
                <thead><tr><th>Nombre</th><th>Especie</th><th>Raza</th><th>Sexo</th><th>Placa</th></tr></thead>
                <tbody>
                  {preview.map((row, index) => (
                    <tr key={index}>
                      <td>{valueByAlias(row, ["Nombre animal", "Nombre"]) || "—"}</td>
                      <td>{valueByAlias(row, ["Especie"]) || "—"}</td>
                      <td>{valueByAlias(row, ["Raza"]) || "—"}</td>
                      <td>{valueByAlias(row, ["Sexo"]) || "—"}</td>
                      <td>{valueByAlias(row, ["Código placa QR NFC", "Codigo placa QR NFC", "Placa"]) || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="button button-primary full-button"
              type="button"
              disabled={loading || remaining <= 0}
              onClick={importRows}
            >
              {loading ? "Importando…" : `Importar ${rows.length} filas`}
            </button>
          </div>
        )}

        {result && (
          <div className="bulk-import-result">
            <strong>Importación completada</strong>
            <div><span>Importados <b>{result.imported}</b></span><span>Omitidos <b>{result.skipped}</b></span><span>Errores <b>{result.errors}</b></span></div>
            <small>Capacidad restante: {result.remaining} animales.</small>
          </div>
        )}
      </section>

      <aside className="bulk-import-help">
        <span className="eyebrow">Reglas de carga</span>
        <h2>Excel listo para CRIA360</h2>
        <p>Solo <strong>Nombre animal</strong> y <strong>Especie</strong> son obligatorios. El resto puede completarse después.</p>
        <ul>
          <li>No cambies los nombres de las columnas de la plantilla.</li>
          <li>Sexo: macho, hembra o sin_especificar.</li>
          <li>Estado inventario: activo, reservado, vendido, transferido o fallecido.</li>
          <li>Estado publicación: borrador, publicado o pausado.</li>
          <li>Si una placa ya existe, esa fila se omite para proteger la trazabilidad.</li>
        </ul>
      </aside>
    </div>
  );
}
