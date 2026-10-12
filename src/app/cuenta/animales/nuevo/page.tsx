import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitAnimalButton } from "@/components/submit-animal-button";
import { createAnimal } from "../actions";
import { getCategory } from "@/lib/category-data";
import { AnimalFormFields } from "@/components/animal-form-fields";
import { canManageAccount } from "@/lib/trial-server";

export const metadata: Metadata = { title: "Registrar animal", robots: { index: false, follow: false } };

export default async function NewAnimalPage({ searchParams }: { searchParams: Promise<{ error?: string; tipo?: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");
  if (!(await canManageAccount(supabase, data.user.id))) redirect("/cuenta/mi-cuenta?aviso=prueba");
  const { data: breeder } = await supabase.from("breeders").select("primary_species").eq("owner_id", data.user.id).maybeSingle();
  if (!breeder) redirect("/registro");
  const params = await searchParams;

  return <section className="inventory-page animal-editor"><div className="section-shell narrow-shell">
    <div className="inventory-heading"><div><span className="eyebrow">Mi inventario</span><h1>Registrar animal</h1><p>Crea su identidad, historial y publicación desde una sola ficha.</p></div><Link className="animal-back" href="/cuenta/animales">← Volver a carpetas</Link></div>
    {params.error && <p className="form-error" role="alert">{params.error === "fotos" ? "Carga hasta 5 fotos JPG, PNG o WebP de máximo 5 MB cada una." : params.error === "limite" ? "Alcanzaste la capacidad de animales, publicaciones o placas de tu plan. Revisa tus fichas o compara los planes para ampliar capacidad." : "No pudimos guardar el animal. Revisa los datos obligatorios e inténtalo nuevamente."}</p>}
    <form action={createAnimal} className="animal-form">
      <AnimalFormFields species={getCategory(params.tipo ?? "")?.marketplaceSpecies.at(-1) ?? breeder.primary_species ?? "Aves"} />
      <SubmitAnimalButton />
    </form>
  </div></section>;
}


