"use client";

import { useFormStatus } from "react-dom";

export function SubmitAnimalButton() {
  const { pending } = useFormStatus();

  return (
    <button
      aria-live="polite"
      className="button button-primary"
      disabled={pending}
      type="submit"
    >
      {pending ? "Guardando animal…" : "Guardar animal"}
    </button>
  );
}
