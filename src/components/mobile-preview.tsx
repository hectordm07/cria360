"use client";

import { useState } from "react";
import Link from "next/link";

const sizes = [{ name: "Compacto", width: 360 }, { name: "Estándar", width: 390 }, { name: "Grande", width: 430 }];

export function MobilePreview() {
  const [width, setWidth] = useState(390);
  return <section className="mobile-preview-page section-shell">
    <span className="eyebrow">CRIA360 en tu celular</span>
    <h1>Una vista pensada para tu mano.</h1>
    <p>Vista de la portada en tres tamaños de celular. Para entrar a tu cuenta o instalarla, abre la mini app directamente.</p>
    <div className="mobile-preview-controls" aria-label="Tamaño de la vista móvil">{sizes.map(size => <button key={size.width} type="button" aria-pressed={width === size.width} onClick={() => setWidth(size.width)}>{size.name}</button>)}</div>
    <div className="mobile-preview-device" style={{ width }}><iframe src="/" title="Portada de CRIA360 en tamaño móvil" sandbox="allow-scripts allow-same-origin" /></div>
    <div className="mobile-preview-links"><Link className="button button-primary" href="/instalar">Añadir a mi celular</Link><Link className="button button-secondary" href="/cuenta">Abrir mi criadero</Link></div>
  </section>;
}
