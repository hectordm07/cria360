const fallbackUrl = "https://kyzxcccexuulxqohqtzu.supabase.co";
const fallbackPublishableKey = "sb_publishable_Tewet03oiJSXoFdk5Eu84A_ZMeaRfd2";

export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? fallbackUrl;
export const supabasePublishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? fallbackPublishableKey;
