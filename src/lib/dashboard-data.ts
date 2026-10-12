export type FinanceMovement = {
  type: "venta" | "compra" | "gasto";
  amount_pen: number | string;
  transaction_date: string;
  payment_status: string;
};

export type FinanceMonth = { key: string; label: string; sales: number; purchases: number; expenses: number };
export const pen = new Intl.NumberFormat("es-PE", { style: "currency", currency: "PEN", maximumFractionDigits: 2 });
export const integer = new Intl.NumberFormat("es-PE", { maximumFractionDigits: 0 });

export function limaDate(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function dailyFinanceDates(now = new Date()) {
  const today = limaDate(now);
  const yesterday = new Date(`${today}T12:00:00Z`);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const previousDate = yesterday.toISOString().slice(0, 10);
  return { today, previousDate };
}

export function summarizeDay(rows: FinanceMovement[], now = new Date()) {
  const { today, previousDate } = dailyFinanceDates(now);
  let sales = 0, previousSales = 0, purchases = 0, expenses = 0;
  for (const row of rows) {
    const amount = Number(row.amount_pen);
    if (!Number.isFinite(amount) || amount <= 0) continue;
    if (row.transaction_date === previousDate && row.type === "venta") previousSales += amount;
    if (row.transaction_date !== today) continue;
    if (row.type === "venta") sales += amount;
    if (row.type === "compra") purchases += amount;
    if (row.type === "gasto") expenses += amount;
  }
  const round = (amount: number) => Math.round(amount * 100) / 100;
  return { sales: round(sales), purchases: round(purchases), expenses: round(expenses), balance: round(sales - purchases - expenses),
    change: previousSales > 0 ? Math.round((sales - previousSales) / previousSales * 1000) / 10 : null };
}

export function financeMonths(now = new Date()): FinanceMonth[] {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit" }).formatToParts(now);
  const year = Number(parts.find(part => part.type === "year")?.value);
  const month = Number(parts.find(part => part.type === "month")?.value) - 1;
  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 5 + index, 15, 12));
    return {
      key: date.toISOString().slice(0, 7),
      label: new Intl.DateTimeFormat("es-PE", { month: "short", year: "2-digit", timeZone: "UTC" }).format(date),
      sales: 0, purchases: 0, expenses: 0,
    };
  });
}

export function summarizeFinance(rows: FinanceMovement[], periods = financeMonths()) {
  const months = periods.map(month => ({ ...month }));
  const index = new Map(months.map(month => [month.key, month]));
  let pending = 0;
  for (const row of rows) {
    const month = index.get(row.transaction_date.slice(0, 7));
    const amount = Number(row.amount_pen);
    if (!month || !Number.isFinite(amount) || amount < 0) continue;
    if (row.type === "venta") month.sales += amount;
    if (row.type === "compra") month.purchases += amount;
    if (row.type === "gasto") month.expenses += amount;
    if (row.type === "venta" && row.payment_status === "pendiente" && month.key === months.at(-1)?.key) pending += amount;
  }
  for (const month of months) {
    month.sales = Math.round(month.sales * 100) / 100;
    month.purchases = Math.round(month.purchases * 100) / 100;
    month.expenses = Math.round(month.expenses * 100) / 100;
  }
  const current = months.at(-1)!;
  return { months, current, balance: Math.round((current.sales - current.purchases - current.expenses) * 100) / 100, pending: Math.round(pending * 100) / 100 };
}

