import Link from "next/link";
import { Icon } from "@/components/icon";
import { pen, type summarizeDay } from "@/lib/dashboard-data";

export function DailySummary({ summary, dateLabel, illustrative = false }: { summary: ReturnType<typeof summarizeDay>; dateLabel: string; illustrative?: boolean }) {
  return <section className="daily-summary" aria-label={illustrative ? "Ejemplo de resumen diario" : "Resumen de hoy"}>
    <div className="daily-summary-heading"><h2>Tu criadero hoy</h2><span>{dateLabel}</span></div>
    <div className="daily-sales"><div><span>Ventas de hoy</span><strong>{pen.format(summary.sales)}</strong></div>
      {summary.change !== null && <span className={`daily-trend ${summary.change < 0 ? "down" : "up"}`}>{summary.change > 0 ? "+" : ""}{summary.change.toLocaleString("es-PE")}%<small>vs. ayer</small></span>}
    </div>
    <dl className="daily-balance"><div><dt>Balance registrado</dt><dd className={summary.balance < 0 ? "daily-negative" : "daily-positive"}>{pen.format(summary.balance)}</dd></div><div><dt>Compras y gastos</dt><dd>{pen.format(summary.purchases + summary.expenses)}</dd></div></dl>
    <Link className="button button-primary daily-sale-button" href={illustrative ? "/registro" : "/cuenta/finanzas/nuevo?tipo=venta"}><Icon name="spark" size={18} />Registrar venta</Link>
    <p className="daily-summary-note">Ventas pagadas y pendientes, menos compras y gastos. No equivale al efectivo disponible.</p>
  </section>;
}
