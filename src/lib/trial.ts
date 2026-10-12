export const TRIAL_DAYS = 30;
export const LEGAL_VERSION = "2026-10-12";
const DAY_MS = 24 * 60 * 60 * 1000;
export type TrialProfile = { plan: string; trial_started_at: string | null; trial_ends_at: string | null };
export type TrialStatus = { status: "paid" | "active" | "expired" | "unavailable"; daysRemaining: number; canWrite: boolean };
// Display only. Postgres independently enforces the deadline with its own clock.
export function trialStatus(profile: TrialProfile | null, now = Date.now()): TrialStatus {
  if (!profile) return { status: "unavailable", daysRemaining: 0, canWrite: false };
  if (["criador", "profesional"].includes(profile.plan)) return { status: "paid", daysRemaining: 0, canWrite: true };
  const end = profile.trial_ends_at ? Date.parse(profile.trial_ends_at) : NaN;
  if (profile.plan !== "gratis" || !Number.isFinite(end)) return { status: "unavailable", daysRemaining: 0, canWrite: false };
  const remaining = end - now;
  return { status: remaining > 0 ? "active" : "expired", daysRemaining: Math.max(0, Math.ceil(remaining / DAY_MS)), canWrite: remaining > 0 };
}
export function trialDate(date: string) {
  return new Intl.DateTimeFormat("es-PE", { timeZone: "America/Lima", day: "numeric", month: "long", year: "numeric" }).format(new Date(date));
}
