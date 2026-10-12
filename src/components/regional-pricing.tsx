"use client";

import { createContext, useContext, useEffect, useId, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { basePrices, countryName, formatPrice, validCountry, type PriceKey, type PricingQuote } from "@/lib/commercial-pricing";
import { countryCurrencies } from "@/lib/country-currencies";

const preferenceKey = "cria360-pricing-country-v1";
const countries = Object.keys(countryCurrencies).filter(code => !["ZZ", "EU", "EZ", "QO", "UN"].includes(code)).map(code => ({ code, name: countryName(code) })).sort((a, b) => a.name.localeCompare(b.name, "es"));
const fallback: PricingQuote = { country: null, currency: "USD", source: "unknown", status: "base", updatedAt: null, prices: { ...basePrices } };
type PricingContextValue = { quote: PricingQuote; loading: boolean; selected: string; changeCountry: (country: string) => void };
const RegionalPricingContext = createContext<PricingContextValue>({ quote: fallback, loading: true, selected: "", changeCountry: () => {} });

export function RegionalPricingProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const active = pathname === "/" || pathname === "/planes";
  const [state, setState] = useState({ quote: fallback, loading: true, selected: "" });
  const [preference, setPreference] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    let saved = "";
    try { saved = validCountry(localStorage.getItem(preferenceKey)) ?? ""; } catch { /* Storage may be disabled. */ }
    const selected = preference ?? saved;
    fetch(`/api/precios${selected ? `?pais=${selected}` : ""}`, { cache: "no-store", signal: controller.signal })
      .then(async response => { if (!response.ok) throw new Error("Pricing unavailable"); return response.json() as Promise<PricingQuote>; })
      .then(quote => { if (!controller.signal.aborted) setState({ quote, loading: false, selected }); })
      .catch(() => { if (!controller.signal.aborted) setState({ quote: { ...fallback, status: "unavailable" }, loading: false, selected }); });
    return () => controller.abort();
  }, [active, preference]);

  function changeCountry(country: string) {
    const selected = validCountry(country) ?? "";
    try { if (selected) localStorage.setItem(preferenceKey, selected); else localStorage.removeItem(preferenceKey); } catch { /* Preference still works for this visit. */ }
    setState(previous => ({ ...previous, loading: true, selected }));
    setPreference(selected);
  }

  return <RegionalPricingContext.Provider value={{ ...state, changeCountry }}>{children}</RegionalPricingContext.Provider>;
}

export function useRegionalPricing() { return useContext(RegionalPricingContext); }

export function LocalizedPrice({ priceKey }: { priceKey: PriceKey }) {
  const { quote } = useRegionalPricing();
  return <>{formatPrice(quote.prices[priceKey], quote.currency, quote.country)}</>;
}

export function PriceRegionSelector() {
  const id = useId();
  const { quote, loading, selected, changeCountry } = useRegionalPricing();
  return <div className="price-region-control">
    <div><span>Precios para</span><strong>{loading ? "Detectando país…" : `${countryName(quote.country)} · ${quote.currency}`}</strong></div>
    <label htmlFor={id}>País de los precios<select id={id} value={selected} onChange={event => changeCountry(event.target.value)}><option value="">Detectar automáticamente</option>{countries.map(country => <option key={country.code} value={country.code}>{country.name} · {countryCurrencies[country.code]}</option>)}</select></label>
    <p role="status">{loading ? "Actualizando moneda y precios…" : quote.status === "unavailable" ? "No pudimos obtener el cambio local. Mostramos el precio base en USD; confirma tu cotización con soporte." : quote.source === "unknown" ? "No pudimos detectar tu país. Selecciónalo para ver su moneda." : selected ? "País elegido por ti. Puedes volver a la detección automática." : "País detectado por tu conexión. Puedes corregirlo si estás de viaje o usas una VPN."}</p>
  </div>;
}

export function RegionalPriceNote() {
  const { quote } = useRegionalPricing();
  return <p className="regional-price-note">{quote.country && quote.status === "base" ? "Tarifas de suscripción fijas para tu región. Los precios de placas son orientativos; soporte confirmará el importe final, impuestos, envío y moneda de cobro." : quote.status === "converted" ? <>Importes convertidos a {quote.currency}. Tipo de cambio del {new Intl.DateTimeFormat("es", { dateStyle: "medium", timeZone: "UTC" }).format(new Date(quote.updatedAt!))}. Conversión referencial; confirma el importe final y la moneda de pago con soporte. <a href="https://www.exchangerate-api.com" target="_blank" rel="noopener noreferrer">Rates By Exchange Rate API</a>.</> : "Precios base en USD. La moneda e importe de pago se confirman con soporte."}</p>;
}
