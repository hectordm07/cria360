import Link from "next/link";
import { DailySummary } from "./daily-summary";
import { Icon } from "./icon";
import type { summarizeDay } from "@/lib/dashboard-data";

export function AccountHomeSummary({ firstName, breederName, dateLabel, summary, illustrative = false }: {
  firstName: string;
  breederName: string;
  dateLabel: string;
  summary: ReturnType<typeof summarizeDay> | null;
  illustrative?: boolean;
}) {
  return <>
    <header className="dashboard-topbar"><div><h1>Hola, {firstName}</h1><p>{breederName} · Resumen de tu criadero</p></div><Link className="button button-primary" href="/cuenta/animales/nuevo"><Icon name="spark" size={16} />Registrar animal</Link></header>
    <div className="dashboard-today-layout">
      {summary ? <DailySummary summary={summary} dateLabel={dateLabel} illustrative={illustrative} /> : <p className="form-notice error" role="alert">No pudimos cargar el resumen de hoy. <a href="/cuenta">Recargar</a></p>}
      <nav className="daily-quick-actions" aria-label="Acciones de tu criadero">
        <Link href="/cuenta/animales"><Icon name="store" /><span>Inventario</span></Link>
        <Link href="/cuenta/finanzas/nuevo?tipo=gasto"><Icon name="tag" /><span>Nuevo gasto</span></Link>
        <Link href="/cuenta/finanzas/nuevo?tipo=compra"><Icon name="spark" /><span>Nueva compra</span></Link>
        <Link href="/cuenta/escanear"><Icon name="scan" /><span>Escanear QR</span></Link>
      </nav>
    </div>
  </>;
}
