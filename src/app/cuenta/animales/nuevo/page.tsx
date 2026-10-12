import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitAnimalButton } from "@/components/submit-animal-button";
import { createAnimal } from "../actions";
import { animalCategories } from "@/lib/category-data";
import { canManageAccount } from "@/lib/trial-server";

export const metadata: Metadata = { title: "Registrar animal", robots: { index: false, follow: false } };

export default async function NewAnimalPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/ingresar");
  if (!(await canManageAccount(supabase, data.user.id))) redirect("/cuenta/mi-cuenta?aviso=prueba");
  const { data: breeder } = await supabase.from("breeders").select("primary_species").eq("owner_id", data.user.id).maybeSingle();
  if (!breeder) redirect("/registro");
  const params = await searchParams;

  return <section className="inventory-page"><div className="section-shell narrow-shell">
    <div className="inventory-heading"><div><span className="eyebrow">Mi inventario</span><h1>Registrar animal</h1><p>Crea su identidad, historial y publicación desde una sola ficha.</p></div><Link className="button button-secondary" href="/cuenta/animales">Volver</Link></div>
    {params.error && <p className="form-error" role="alert">{params.error === "fotos" ? "Carga hasta 5 fotos JPG, PNG o WebP de máximo 5 MB cada una." : params.error === "limite" ? "Alcanzaste la capacidad de animales, publicaciones o placas de tu plan. Revisa tus fichas o compara los planes para ampliar capacidad." : "No pudimos guardar el animal. Revisa los datos obligatorios e inténtalo nuevamente."}</p>}
    <form action={createAnimal} className="animal-form">
      <fieldset className="photo-upload-fieldset"><legend>Galería del animal</legend><label className="photo-dropzone"><strong>Agregar fotografías</strong><span>Hasta 5 imágenes · JPG, PNG o WebP · máximo 5 MB cada una</span><input name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple /></label></fieldset>
      <fieldset><legend>Datos principales</legend><div className="form-grid">
        <label>Nombre del animal<input name="name" required placeholder="Ej. Tornado" /></label><label>Tipo de animal<select name="species" defaultValue={breeder.primary_species} required>{animalCategories.map(category => <option key={category.slug} value={category.marketplaceSpecies.at(-1)}>{category.shortName}</option>)}</select></label>
        <label>Raza<input name="breed" placeholder="Ej. Holstein" /></label><label>Sexo<select name="sex" defaultValue="sin_especificar"><option value="macho">Macho</option><option value="hembra">Hembra</option><option value="sin_especificar">Sin especificar</option></select></label>
        <label>Fecha de nacimiento<input name="birth_date" type="date" /></label><label>Color o señas<input name="color" /></label><label>Peso (kg)<input name="weight_kg" type="number" min="0" step="0.01" /></label><label>N.º de identificación<input name="identification" placeholder="Arete, anillo u otro" /></label>
      </div></fieldset>
      <fieldset><legend>Genealogía y salud</legend><div className="form-grid"><label>Código de placa QR o NFC<input name="plate_code" placeholder="Opcional" /></label><label>Estado sanitario<input name="health_status" placeholder="Ej. Vacunas al día" /></label><label>Padre<input name="father_name" /></label><label>Madre<input name="mother_name" /></label></div><label>Descripción y observaciones<textarea name="description" rows={4} placeholder="Origen, vacunas, controles y características importantes" /></label></fieldset>
      <fieldset><legend>Inventario y venta</legend><div className="form-grid"><label>Estado en inventario<select name="inventory_status" defaultValue="activo"><option value="activo">Activo</option><option value="reservado">Reservado</option><option value="vendido">Vendido</option><option value="transferido">Transferido</option><option value="fallecido">Fallecido</option></select></label><label>Estado de publicación<select name="publication_status" defaultValue="borrador"><option value="borrador">Borrador</option><option value="publicado">Publicado</option><option value="pausado">Pausado</option></select></label><label>Precio de venta (S/)<input name="price_pen" type="number" min="0" step="0.01" /></label></div></fieldset>
      <p className="form-notice">Al elegir Publicado, la ficha del animal, fotografías, precio, descripción, genealogía y salud declaradas aparecerán en el marketplace. Tu correo y teléfono de cuenta no se publican.</p>
      <SubmitAnimalButton />
    </form>
  </div></section>;
}


