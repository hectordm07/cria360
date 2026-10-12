import { supabasePublishableKey, supabaseUrl } from "@/lib/supabase/config";

export type PublicSiteSettings = {
  legal_name: string;
  contact_email: string | null;
  legal_ruc: string | null;
  legal_address: string | null;
  complaints_url: string | null;
  whatsapp_number: string | null;
  google_business_url: string | null;
};

const fallback: PublicSiteSettings = {
  legal_name: "CRIA360",
  contact_email: null,
  legal_ruc: null,
  legal_address: null,
  complaints_url: null,
  whatsapp_number: null,
  google_business_url: null,
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/site_settings?id=eq.1&select=legal_name,contact_email,whatsapp_number,google_business_url,legal_ruc,legal_address,complaints_url`,
      {
        headers: {
          apikey: supabasePublishableKey,
          Authorization: `Bearer ${supabasePublishableKey}`,
        },
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return fallback;
    const rows = (await response.json()) as PublicSiteSettings[];
    return rows[0] ?? fallback;
  } catch {
    return fallback;
  }
}

