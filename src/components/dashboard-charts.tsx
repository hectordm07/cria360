import Link from "next/link";
import type { CSSProperties } from "react";
import { integer, pen, type FinanceMonth } from "@/lib/dashboard-data";

export type ChartItem = { label: string; value: number; color: string };

export function SpeciesChart({ items }: { items: ChartItem[] }) {
  const max = Math.max(...items.map(item => item.value), 1);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  return <article className="report-card">
    <header className="report-heading"><div><h2>Inventario por especie</h2><p>Todos los animales registrados</p></div><Link href="/cuenta/animales">Ver inventario</Link></header>
    {total ? <div className="species-bars" role="list">{items.map(item => <div className="species-bar-row" role="listitem" key={item.label}>
      <div><span>{item.label}</span><strong>{integer.format(item.value)}</strong></div>
      <div className="bar-track" aria-hidden="true"><span style={{ width: `${item.value / max * 100}%`, backgroundColor: item.color }} /></div>
    </div>)}</div> : <div className="report-empty"><p>Tu primer registro dará vida a este gráfico.</p><Link href="/cuenta/animales/nuevo">Registrar un animal</Link></div>}
  </article>;
}

export function InventoryStatusChart({ items }: { items: ChartItem[] }) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const gradient = items.filter(item => item.value > 0).map(item => {
    const start = offset; offset += item.value / total * 100;
    return `${item.color} ${start}% ${offset}%`;
  }).join(", ");
  const style = { "--chart-ring": total ? `conic-gradient(${gradient})` : "#e4ebe5" } as CSSProperties;
  return <article className="report-card">
    <header className="report-heading"><div><h2>Estado del inventario</h2><p>Activos, reservas y salidas</p></div></header>
    <div className="status-chart-layout">
      <div className="status-donut" style={style}><div><strong>{integer.format(total)}</strong><span>animales en total</span></div></div>
      <ul className="chart-legend">{items.map(item => <li key={item.label}><span className="legend-dot" style={{ backgroundColor: item.color }} aria-hidden="true" /><span>{item.label}</span><strong>{integer.format(item.value)}</strong><small>{total ? Math.round(item.value / total * 100) : 0}%</small></li>)}</ul>
    </div>
    {!total && <p className="report-footnote">El gráfico se completa al registrar animales.</p>}
  </article>;
}

export function FinanceChart({ months, illustrative = false }: { months: FinanceMonth[]; illustrative?: boolean }) {
  const maximum = Math.max(...months.flatMap(month => [month.sales, month.purchases, month.expenses]), 1);
  const ceiling = Math.ceil(maximum / (maximum > 1000 ? 500 : maximum > 100 ? 100 : 10)) * (maximum > 1000 ? 500 : maximum > 100 ? 100 : 10);
  const compact = new Intl.NumberFormat("es-PE", { notation: "compact", maximumFractionDigits: 1 });
  const hasData = months.some(month => month.sales || month.purchases || month.expenses);
  const series = [{ key: "sales", label: "Ventas", color: "#23664d" }, { key: "purchases", label: "Compras", color: "#ae7333" }, { key: "expenses", label: "Gastos", color: "#738795" }] as const;
  return <article className={illustrative ? "report-card finance-report is-illustrative" : "report-card finance-report"}>
    <header className="report-heading"><div><h2>{illustrative ? "Ventas, compras y gastos" : "Tu actividad económica"}</h2><p>{illustrative ? "Vista ilustrativa del panel · importes de ejemplo" : "Últimos 6 meses · movimientos registrados en soles"}</p></div>{!illustrative && <Link href="/cuenta/finanzas">Ver movimientos</Link>}</header>
    <ul className="finance-chart-legend">{series.map(item => <li key={item.key}><span className="legend-dot" style={{ backgroundColor: item.color }} aria-hidden="true" />{item.label}</li>)}</ul>
    {hasData ? <><svg className="finance-chart-svg" viewBox="0 0 640 260" role="img" aria-label={illustrative ? "Gráfico ilustrativo de ventas, compras y gastos. Los datos son ejemplos." : "Comparación de ventas, compras y gastos por mes. Los importes exactos están disponibles en Ver datos."}>
      {[0, .25, .5, .75, 1].map(fraction => <g key={fraction}><line x1="60" x2="630" y1={210 - fraction * 180} y2={210 - fraction * 180} stroke="#dce5df" strokeDasharray={fraction ? "3 5" : undefined} /><text x="50" y={214 - fraction * 180} textAnchor="end" className="chart-axis">{compact.format(ceiling * fraction)}</text></g>)}
      {months.map((month, index) => <g key={month.key}>
        {series.map((item, seriesIndex) => { const value = month[item.key]; const height = value / ceiling * 180; return <rect key={item.key} x={76 + index * 94 + seriesIndex * 19} y={210 - height} width="15" height={height} rx="3" fill={item.color}><title>{month.label} · {item.label}: {pen.format(value)}</title></rect>; })}
        <text x={104 + index * 94} y="238" textAnchor="middle" className="chart-axis">{month.label}</text>
      </g>)}
    </svg><div className="finance-chart-mobile" role="img" aria-label={illustrative ? "Comparación mensual ilustrativa. Importes de ejemplo en la tabla Ver datos de ejemplo." : "Comparación mensual de ventas, compras y gastos. Importes exactos en la tabla Ver datos."}>
      <p className="mobile-chart-scale">Escala: 0 a {pen.format(ceiling)}</p>
      <div className="mobile-month-grid">{months.map(month => <div className="mobile-month" key={month.key}><div className="mobile-month-bars">{series.map(item => <span key={item.key} style={{ height: `${month[item.key] / ceiling * 100}%`, backgroundColor: item.color }} />)}</div><span>{month.label}</span></div>)}</div>
    </div></> : <div className="report-empty"><p>Registra una venta, compra o gasto para ver tu evolución.</p><Link href="/cuenta/finanzas">Registrar movimiento</Link></div>}
    {hasData && <details className="chart-data"><summary>Ver datos{illustrative ? " de ejemplo" : ""}</summary><div className="chart-table-scroll" tabIndex={0} role="region" aria-label="Importes mensuales"><table><caption className="sr-only">Movimientos por mes en soles{illustrative ? ", ejemplo ilustrativo" : ""}</caption><thead><tr><th scope="col">Mes</th>{series.map(item => <th key={item.key} scope="col">{item.label}</th>)}</tr></thead><tbody>{months.map(month => <tr key={month.key}><th scope="row">{month.label}</th>{series.map(item => <td key={item.key} data-label={item.label}>{pen.format(month[item.key])}</td>)}</tr>)}</tbody></table></div></details>}
    {!illustrative && <p className="report-footnote">Incluye movimientos pagados y pendientes. El balance registrado no representa el efectivo disponible.</p>}
  </article>;
}
