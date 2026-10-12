"use client";
import type { ReactNode } from "react";
export function PreviewAnimalForm({children}: {children:ReactNode}) {
 return <form className="animal-form" onSubmit={event=>event.preventDefault()}>{children}<button type="submit" className="button button-primary" disabled>Guardar animal · Vista de ejemplo</button></form>;
}
