import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { trialStatus } from "@/lib/trial";
export async function canManageAccount(client: SupabaseClient, userId: string) {
  const { data, error } = await client.from("profiles").select("plan,trial_started_at,trial_ends_at").eq("id", userId).maybeSingle();
  return !error && trialStatus(data).canWrite;
}
