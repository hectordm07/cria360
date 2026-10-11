import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FinanceChart } from "@/components/dashboard-charts";
import { financeMonths, pen, summarizeFinance } from "@/lib/dashboard-data";
import { readFinance } from "@/lib/dashboard-server";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Ventas, compras y gastos", robots: { index: false, follow: false } };
const labels = { venta: "Ventas", compra: "Compras", gasto: "Gastos" } as const;
const singular = { venta: "venta", compra: "compra", gasto: "gasto" } as const;
type Kind = keyof typeof labels;
type Movement = { id: string; type: Kind; concept: string; amount_pen: number; transaction_date: string; payment_status: string };

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ tipo?: string; ok?: string; error?: string }> }) {
  const params = await searchParams;
  const type: Kind = params.tipo === "compra" || params.tipo === "gasto" ? params.tipo : "venta";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/ingresar");
  const periods = financeMonths();
  const [finance, recent] = await Promise.all([
    readFinance(supabase, user.id, periods),
    supabase.from("farm_transactions").select("id,type,concept,amount_pen,transaction_date,payment_status")
      .eq("owner_id", user.id).eq("type", type).order("transaction_date", { ascending: false }).limit(12),
  ]);
  const financial = summarizeFinance(finance.rows, periods);
  const rows = (recent.data ?? []) as Movement[];
  const date = new Intl.DateTimeFormat("es-PE", { dateStyle: "medium", timeZone: "UTC" });

  return <section className="inventory-page finance-page analytics-finance"><div className="section-shell">
    <div className="inventory-heading"><div><h1>Movimientos de tu granja</h1><p>Consulta tus movimientos y registra uno nuevo.</p></div><Link className="button button-primary" href={`/cuenta/finanzas/nuevo?tipo=${type}`}>Registrar {singular[type]}</Link></div>
    <nav className="finance-tabs" aria-label="Tipo de movimiento">{Object.entries(labels).map(([key, label]) => <Link className={type === key ? "active" : ""} aria-current={type === key ? "page" : undefined} href={`/cuenta/finanzas?tipo=${key}`} key={key}>{label}</Link>)}</nav>
    {params.ok && <p className="form-notice success" role="status">Movimiento registrado.</p>}
    {params.error && <p className="form-notice error" role="alert">No pudimos guardar el movimiento. Revisa el concepto, monto y fecha e inténtalo nuevamente.</p>}
    {finance.error ? <p className="form-notice error" role="alert">No pudimos cargar el resumen económico. <a href={`/cuenta/finanzas?tipo=${type}`}>Recargar movimientos</a></p> : <>
      <div className="finance-metric-grid">
        <article><small>Ventas del mes</small><strong>{pen.format(financial.current.sales)}</strong><span>Pagadas y pendientes</span></article>
        <article><small>Compras y gastos</small><strong>{pen.format(financial.current.purchases + financial.current.expenses)}</strong><span>Egresos registrados este mes</span></article>
        <article className={financial.balance < 0 ? "negative-balance" : "positive-balance"}><small>Balance registrado</small><strong>{pen.format(financial.balance)}</strong><span>Ventas menos compras y gastos</span></article>
        <article><small>Por cobrar</small><strong>{pen.format(financial.pending)}</strong><span>Ventas pendientes de este mes</span></article>
      </div>

    </>}
      <div className="transaction-list"><h2>{labels[type]} recientes</h2>{recent.error ? <p role="alert">No pudimos cargar la lista. Recarga la página.</p> : rows.length ? rows.map(row => <article key={row.id}><div><strong>{row.concept}</strong><small>{date.format(new Date(`${row.transaction_date}T12:00:00Z`))} · {row.payment_status}</small></div><span>{pen.format(Number(row.amount_pen))}</span></article>) : <p>Registra tu primera {singular[type]} para verla aquí.</p>}</div>
    {!finance.error && <details className="finance-history-report"><summary>Ver evolución de los últimos 6 meses</summary><FinanceChart months={financial.months} /></details>}
  </div></section>;
}
