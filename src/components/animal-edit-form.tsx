"use client";
import { useActionState } from "react";
import { updateAnimal } from "@/app/cuenta/animales/actions";
import { AnimalFormFields } from "./animal-form-fields";
import { SubmitAnimalButton } from "./submit-animal-button";
import type { AnimalFormValues } from "@/lib/animal-form-data";
export function AnimalEditForm({animal}: {animal: AnimalFormValues}) {
  const [state,action] = useActionState(updateAnimal,{error:""});
  return <form action={action} className="animal-form"><input type="hidden" name="animal_id" value={animal.id} /><input type="hidden" name="updated_at" value={animal.updated_at} /><AnimalFormFields animal={animal} />{state.error && <p role="alert" className="form-error">{state.error}</p>}<SubmitAnimalButton /></form>;
}
