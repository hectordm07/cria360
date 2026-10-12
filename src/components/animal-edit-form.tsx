"use client";
import { useActionState } from "react";
import { updateAnimal } from "@/app/cuenta/animales/actions";
import { AnimalFormFields } from "./animal-form-fields";
import { SubmitAnimalButton } from "./submit-animal-button";
import type { AnimalFormValues } from "@/lib/animal-form-data";
export function AnimalEditForm({animal,readOnly=false}: {animal: AnimalFormValues;readOnly?:boolean}) {
  const [state,action] = useActionState(updateAnimal,{error:""});
  return <form action={action} className="animal-form"><input type="hidden" name="animal_id" value={animal.id} /><input type="hidden" name="updated_at" value={animal.updated_at} />{readOnly ? <fieldset className="animal-readonly" disabled><AnimalFormFields animal={animal}/></fieldset> : <AnimalFormFields animal={animal} />}{state.error && <p role="alert" className="form-error">{state.error}</p>}{!readOnly && <SubmitAnimalButton />}</form>;
}
