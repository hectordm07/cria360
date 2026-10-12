import Link from "next/link";
import { trialDate, trialStatus, type TrialProfile } from "@/lib/trial";
export function AccountTrial({ profile }: { profile: TrialProfile | null }) {
  const trial = trialStatus(profile);
  if (trial.status === "paid") return null;
  const expired = trial.status === "expired";
  return <aside className={`account-trial-strip${expired ? " expired" : ""}`} aria-label="Estado de tu prueba">
    <div><span><strong>{trial.status === "active" ? `Prueba gratis · ${trial.daysRemaining} ${trial.daysRemaining === 1 ? "día restante" : "días restantes"}` : expired ? "Tu prueba de 30 días terminó" : "No pudimos verificar tu plan"}</strong>
      <small>{trial.status === "active" && profile?.trial_ends_at ? `Termina el ${trialDate(profile.trial_ends_at)}. Sin cobros automáticos.` : expired ? "Tus datos siguen disponibles para consulta y descarga." : "Vuelve a intentarlo o contacta con soporte antes de guardar."}</small></span>
      <Link href={expired ? "/cuenta/mi-cuenta" : "/planes"}>{expired ? "Ver opciones" : "Ver planes"}</Link></div>
  </aside>;
}
