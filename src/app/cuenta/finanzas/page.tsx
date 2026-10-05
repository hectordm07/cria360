import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Ventas, compras y gastos", robots: { index: false, follow: false } };

const labels = { venta: "Ventas", compra: "Compras", gasto: "Gastos" } as const;

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ tipo?: string }> }) {
  const params = await searchParams;
  const type = params.tipo === "compra" || params.tipo === "gasto" ? params.tipo : "venta";
  return <section className="inventory-page finance-page"><div className="section-shell">
    <div className="inventory-heading"><div><span className="eyebrow">Control económico</span><h1>Movimientos de la granja</h1><p>Registra ingresos y egresos para conocer la rentabilidad real de tu operación.</p></div><button className="button button-primary" type="button">+ Registrar {labels[type].slice(0,-1).toLowerCase()}</button></div>
    <nav className="finance-tabs" aria-label="Tipo de movimiento">{Object.entries(labels).map(([key,label]) => <Link className={type === key ? "active" : ""} href={`/cuenta/finanzas?tipo=${key}`} key={key}>{label}</Link>)}</nav>
    <div className="finance-summary"><article><small>{labels[type]} del mes</small><strong>S/ 0.00</strong><span>Sin movimientos registrados</span></article><article><small>Balance mensual</small><strong>S/ 0.00</strong><span>Ingresos menos compras y gastos</span></article><article><small>Por cobrar</small><strong>S/ 0.00</strong><span>Pagos pendientes de clientes</span></article></div>
    <div className="empty-inventory"><strong>Aún no hay {labels[type].toLowerCase()}</strong><p>El formulario de registro quedará conectado a caja, inventario y reportes por galpón.</p><button className="button button-primary" type="button">Registrar primer movimiento</button></div>
  </div></section>;
}
