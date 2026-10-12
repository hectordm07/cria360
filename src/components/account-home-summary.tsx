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
    <header className="home-greeting" aria-label={`Inicio de ${breederName}`}><div><h1>Hola, {firstName}</h1><p>¿Qué quieres registrar hoy?</p></div><Link className="home-add-animal" href="/cuenta/animales/nuevo"><span aria-hidden="true">+</span> Animal</Link></header>
    <div className="dashboard-today-layout home-today">
      {summary ? <DailySummary summary={summary} dateLabel={dateLabel} illustrative={illustrative} /> : <p className="form-notice error" role="alert">No pudimos cargar el resumen de hoy. <a href="/cuenta">Recargar</a></p>}
      <nav className="daily-quick-actions home-actions" aria-label="Acciones de tu criadero">
        <Link href="/cuenta/animales"><Icon name="box" /><span>Inventario</span></Link>
        <Link href="/cuenta/finanzas/nuevo?tipo=gasto"><Icon name="tag" /><span>Nuevo gasto</span></Link>
        <Link href="/cuenta/finanzas/nuevo?tipo=compra"><Icon name="spark" /><span>Nueva compra</span></Link>
        <Link href="/cuenta/escanear"><Icon name="scan" /><span>Escanear QR</span></Link>
      </nav>
    </div>
  </>;
}
