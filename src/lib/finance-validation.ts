export function validTransactionAmount(value: string) {
  return /^\d+(?:\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 9999999999.99;
}

export function validTransactionDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.slice(0, 4) === "0000") return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
