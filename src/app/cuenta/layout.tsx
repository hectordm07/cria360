import { redirect } from "next/navigation";
import { AccountSidebar } from "@/components/account-sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");
  const [{ data: profile }, { data: breeder }] = await Promise.all([
    supabase.from("profiles").select("plan, onboarding_completed").eq("id", data.user.id).maybeSingle(),
    supabase.from("breeders").select("name").eq("owner_id", data.user.id).maybeSingle(),
  ]);
  if (!profile?.onboarding_completed || !breeder) redirect("/registro");
  const planLabel = profile.plan === "criador" ? "Granja" : profile.plan === "profesional" ? "Granja Pro" : "Gratis";
  return <div className="account-app-shell"><AccountSidebar breederName={breeder.name} plan={planLabel} /><div className="account-app-content">{children}</div></div>;
}
