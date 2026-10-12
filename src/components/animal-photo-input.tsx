"use client";
import { useId, useRef, useState } from "react";
import { Icon } from "@/components/icon";
export function AnimalPhotoInput() {
  const id = useId(); const input = useRef<HTMLInputElement>(null); const [files,setFiles] = useState<string[]>([]);
  return <div className="animal-photo-picker"><input id={id} ref={input} className="sr-only" name="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => setFiles(Array.from(event.target.files ?? []).map(file => file.name))} /><button type="button" className="animal-photo-choose" onClick={() => input.current?.click()} aria-controls={id}><Icon name="spark" /><span>{files.length ? `${files.length} ${files.length === 1 ? "foto seleccionada" : "fotos seleccionadas"}` : "Agregar fotografías"}</span><span aria-hidden="true">+</span></button><p>Hasta 5 fotos · JPG, PNG o WebP · 5 MB por foto.</p>{files.length > 0 && <ul className="animal-selected-photos">{files.map((name,i) => <li key={`${name}-${i}`}>{name}</li>)}</ul>}</div>;
}
