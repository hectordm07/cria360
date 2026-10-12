import type { Metadata } from "next";
import Link from "next/link";
import { notFound,redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { canManageAccount } from "@/lib/trial-server";
import { inventoryType } from "@/lib/inventory-data";
import { AnimalEditForm } from "@/components/animal-edit-form";
export const metadata: Metadata = {title:"Editar animal",robots:{index:false,follow:false}};
export default async function EditAnimalPage({params}: {params: Promise<{id:string}>}) {
 const client = await createClient(); const {data:auth} = await client.auth.getUser();
 if (!auth.user) redirect("/ingresar");
 if (!(await canManageAccount(client,auth.user.id))) redirect("/cuenta/mi-cuenta?aviso=prueba");
 const {id} = await params;
 const {data:animal,error} = await client.from("animals").select("id,public_code,name,species,breed,sex,birth_date,color,weight_kg,identification,plate_code,father_name,mother_name,health_status,description,price_pen,inventory_status,publication_status,image_urls,updated_at").eq("id",id).eq("owner_id",auth.user.id).maybeSingle();
 if (error || !animal) notFound();
 return <section className="inventory-page animal-editor"><div className="section-shell narrow-shell"><Link className="animal-back" href={`/cuenta/animales?tipo=${encodeURIComponent(inventoryType(animal.species).key)}`}>← Volver a la lista</Link><div className="inventory-heading"><div><h1>Editar animal</h1><p>{animal.public_code} · Actualiza su ficha.</p></div></div><AnimalEditForm animal={animal} /></div></section>;
}
