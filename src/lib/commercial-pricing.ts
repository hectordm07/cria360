import { countryCurrencies } from "./country-currencies";

export const basePrices = {
  granjaMonthly: 29, granjaAnnual: 290,
  proMonthly: 69, proAnnual: 690,
  plateQr: 9, plateNfc: 15, platePack: 75,
};
export type PriceKey = keyof typeof basePrices;
export type PricingQuote = {
  country: string | null;
  currency: string;
  source: "automatic" | "selected" | "unknown";
  status: "converted" | "base" | "unavailable";
  updatedAt: string | null;
  prices: Record<PriceKey, number>;
};

export function validCountry(value: string | null): string | null {
  const code = value?.trim().toUpperCase();
  return code && /^[A-Z]{2}$/.test(code) && Object.hasOwn(countryCurrencies, code) ? code : null;
}

export function countryName(country: string | null) {
  return country ? new Intl.DisplayNames(["es"], { type: "region" }).of(country) ?? country : "País sin detectar";
}

export function currencyDigits(currency: string) {
  return new Intl.NumberFormat("es", { style: "currency", currency }).resolvedOptions().maximumFractionDigits ?? 2;
}

export function roundPrice(value: number, currency: string) {
  const scale = 10 ** currencyDigits(currency);
  return Math.round((value + Number.EPSILON) * scale) / scale;
}

export function convertedPrices(rate: number, currency: string): Record<PriceKey, number> {
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("Invalid exchange rate");
  return Object.fromEntries(Object.entries(basePrices).map(([key, value]) => [key, roundPrice(value * rate, currency)])) as Record<PriceKey, number>;
}

export function formatPrice(value: number, currency: string, country: string | null) {
  const locale = country === "BR" ? "pt-BR" : country === "US" ? "en-US" : country ? `es-${country}` : "es";
  const amount = new Intl.NumberFormat(locale, { minimumFractionDigits: currencyDigits(currency), maximumFractionDigits: currencyDigits(currency) }).format(value);
  return `${currency === "PEN" ? "S/" : currency === "USD" ? "US$" : currency} ${amount}`;
}

export function quoteForRate(country: string | null, source: PricingQuote["source"], data: unknown, now = Date.now()): PricingQuote {
  const target = country ? countryCurrencies[country] : "USD";
  const fallback: PricingQuote = { country, source, currency: "USD", status: target === "USD" ? "base" : "unavailable", updatedAt: null, prices: { ...basePrices } };
  if (target === "USD") return fallback;
  if (!data || typeof data !== "object") return fallback;
  const feed = data as { result?: string; base_code?: string; time_last_update_unix?: number; rates?: Record<string, number> };
  const time = Number(feed.time_last_update_unix) * 1000;
  const rate = feed.rates?.[target];
  // Never present missing, stale, future-dated or invalid rates as local prices.
  if (feed.result !== "success" || feed.base_code !== "USD" || !Number.isFinite(time) || now - time > 72 * 3600_000 || time - now > 3600_000 || !Number.isFinite(rate) || Number(rate) <= 0) return fallback;
  return { country, source, currency: target, status: "converted", updatedAt: new Date(time).toISOString(), prices: convertedPrices(Number(rate), target) };
}
