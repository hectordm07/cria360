"use client";

import { useState } from "react";
import Link from "next/link";

const sizes = [{ name: "Compacto", width: 360 }, { name: "Estándar", width: 390 }, { name: "Grande", width: 430 }];

export function MobilePreview() {
  const [width, setWidth] = useState(390);
  const [wide, setWide] = useState(false);
  const ratio = width / 980;
  return <section className="mobile-preview-page section-shell">
    <span className="eyebrow">CRIA360 en tu celular</span>
    <h1>Así se ve tu mini app.</h1>
    <p>Ejemplo del panel de cuenta en tres tamaños de celular. Usa los mismos componentes de la app; los importes de ejemplo no son datos de tu cuenta.</p>
    <div className="mobile-preview-controls" aria-label="Tamaño de la vista móvil">{sizes.map(size => <button key={size.width} type="button" aria-pressed={width === size.width} onClick={() => setWidth(size.width)}>{size.name}</button>)}</div>
    <div className="mobile-preview-mode-controls" aria-label="Comprobación de escala"><button type="button" aria-pressed={!wide} onClick={() => setWide(false)}>Celular</button><button type="button" aria-pressed={wide} onClick={() => setWide(true)}>Escala amplia corregida</button></div>
    <div className="mobile-preview-device" style={{ width }}><iframe key={`${width}-${wide}`} src={wide ? `/vista-app?escala=amplia&ancho=${width}` : "/vista-app"} title="Panel de cuenta de CRIA360 en tamaño móvil" sandbox="allow-scripts allow-same-origin" style={wide ? { width: 980, height: 740 / ratio, transform: `scale(${ratio})`, transformOrigin: "top left" } : undefined} /></div>
    <div className="mobile-preview-links"><Link className="button button-primary" href="/instalar">Añadir a mi celular</Link><Link className="button button-secondary" href="/cuenta">Abrir mi criadero</Link></div>
  </section>;
}

