import { countryCurrencies } from "./country-currencies";

export const basePrices = {
  granjaMonthly: 9.99, granjaAnnual: 95.90,
  proMonthly: 19.99, proAnnual: 191.90,
  plateQr: 9, plateNfc: 15, platePack: 75,
};
// Regional launch prices are fixed commercial tariffs, not daily FX conversions.
const regionalPlans: Record<string, { currency: string; granjaMonthly: number; granjaAnnual: number; proMonthly: number; proAnnual: number }> = {
  PE: { currency: "PEN", granjaMonthly: 34.99, granjaAnnual: 335.90, proMonthly: 69.99, proAnnual: 671.90 },
  US: { currency: "USD", granjaMonthly: 9.99, granjaAnnual: 95.90, proMonthly: 19.99, proAnnual: 191.90 },
  EC: { currency: "USD", granjaMonthly: 9.99, granjaAnnual: 95.90, proMonthly: 19.99, proAnnual: 191.90 },
  MX: { currency: "MXN", granjaMonthly: 199.99, granjaAnnual: 1919.90, proMonthly: 399.99, proAnnual: 3839.90 },
  CO: { currency: "COP", granjaMonthly: 39900, granjaAnnual: 383040, proMonthly: 79900, proAnnual: 767040 },
  CL: { currency: "CLP", granjaMonthly: 9990, granjaAnnual: 95900, proMonthly: 19990, proAnnual: 191900 },
};
const euroCountries = new Set(["AT","BE","CY","DE","EE","ES","FI","FR","GR","HR","IE","IT","LT","LU","LV","MT","NL","PT","SI","SK"]);
function regionalPlan(country: string | null) {
  if (country && regionalPlans[country]) return regionalPlans[country];
  if (country && euroCountries.has(country)) return { currency: "EUR", granjaMonthly: 9.99, granjaAnnual: 95.90, proMonthly: 19.99, proAnnual: 191.90 };
  return null;
}
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
  const fixed = regionalPlan(country);
  if (fixed) {
    const { currency, ...plans } = fixed;
    const platePrices = currency === "USD" ? {plateQr:basePrices.plateQr,plateNfc:basePrices.plateNfc,platePack:basePrices.platePack} : null;
    // Plan prices are always fixed. Physical plate prices may still use a fresh exchange rate.
    const feed = data && typeof data === "object" ? data as {result?:string;base_code?:string;time_last_update_unix?:number;rates?:Record<string,number>} : null;
    const time = Number(feed?.time_last_update_unix)*1000;
    const rate = feed?.rates?.[currency];
    const validRate = feed?.result === "success" && feed?.base_code === "USD" && Number.isFinite(time) && now-time <= 72*3600_000 && time-now <= 3600_000 && Number.isFinite(rate) && Number(rate)>0;
    const plates = platePrices ?? (validRate ? {plateQr:roundPrice(basePrices.plateQr*Number(rate),currency),plateNfc:roundPrice(basePrices.plateNfc*Number(rate),currency),platePack:roundPrice(basePrices.platePack*Number(rate),currency)} : {plateQr:basePrices.plateQr,plateNfc:basePrices.plateNfc,platePack:basePrices.platePack});
    // If a plate rate is unavailable, avoid implying that USD numerical prices are in local currency.
    return {country,source,currency,status:"base",updatedAt:null,prices:{...plans,...plates}};
  }
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
