import { NextRequest, NextResponse } from "next/server";
import { quoteForRate, validCountry } from "@/lib/commercial-pricing";
import { countryCurrencies } from "@/lib/country-currencies";

export async function GET(request: NextRequest) {
  const selected = request.nextUrl.searchParams.get("pais");
  const manualCountry = validCountry(selected);
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };
  if (selected !== null && !manualCountry) return NextResponse.json({ error: "País no válido" }, { status: 400, headers });
  const detected = validCountry(request.headers.get("x-vercel-ip-country"));
  const country = manualCountry ?? detected;
  const source = manualCountry ? "selected" : detected ? "automatic" : "unknown";
  let data: unknown = null;
  if (country && countryCurrencies[country] !== "USD") {
    try {
      // Only the shared server requests rates; no user IP or account data is sent.
      const response = await fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 86400 }, signal: AbortSignal.timeout(8000) });
      if (response.ok) data = await response.json();
    } catch { /* Keep base USD prices and clearly disclose an unavailable rate. */ }
  }
  // Return our converted product prices, never redistribute the provider's feed.
  return NextResponse.json(quoteForRate(country, source, data), { headers });
}
