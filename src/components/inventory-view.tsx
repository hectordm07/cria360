"use client";

import { useMemo, useState } from "react";
import { inventoryGroups, inventoryType, type InventoryAnimal } from "@/lib/inventory-data";
import { integer, pen } from "@/lib/dashboard-data";

const statuses: Record<string, string> = { activo: "Activo", reservado: "Reservado", vendido: "Vendido", transferido: "Transferido", fallecido: "Fallecido", publicado: "Publicado", borrador: "Borrador", pausado: "Pausado" };
const sexes: Record<string, string> = { macho: "Macho", hembra: "Hembra", sin_especificar: "Sexo sin especificar" };

export function InventoryView({ animals }: { animals: InventoryAnimal[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [visible, setVisible] = useState(20);
  const groups = useMemo(() => inventoryGroups(animals), [animals]);
  const filtered = useMemo(() => selected ? animals.filter(animal => inventoryType(animal.species).key === selected) : animals, [animals, selected]);
  const label = groups.find(group => group.key === selected)?.label ?? "Todos los animales";

  function selectType(key: string | null) {
    setSelected(key);
    setVisible(20);
  }

  return <>
    <section className="inventory-types" aria-labelledby="inventory-types-title">
      <div className="inventory-section-heading"><div><h2 id="inventory-types-title">Tu inventario por tipo de animal</h2><p>Selecciona una tarjeta para ver sus ejemplares.</p></div><button className="inventory-all-filter" type="button" aria-pressed={selected === null} onClick={() => selectType(null)}>Todos · {integer.format(animals.length)}</button></div>
      <div className="inventory-type-grid">{groups.map(group => <button key={group.key} type="button" className={`inventory-type-card tone-${group.tone}`} aria-pressed={selected === group.key} aria-controls="inventory-results" onClick={() => selectType(group.key)}>
        <span className="inventory-type-top"><span className="inventory-type-symbol" aria-hidden="true">{group.symbol}</span><span className="inventory-type-selected" aria-hidden="true">{selected === group.key ? "✓" : "↗"}</span></span>
        <span className="inventory-type-label">{group.label}</span><span className="inventory-type-total">{integer.format(group.total)} <span>{group.total === 1 ? "ejemplar" : "ejemplares"}</span></span>
        <span className="inventory-type-states"><span>{integer.format(group.active)} activos</span><span>{integer.format(group.reserved)} reservados</span></span>
      </button>)}</div>
    </section>
    <section id="inventory-results" className="inventory-results" aria-labelledby="inventory-results-title">
      <div className="inventory-section-heading"><h2 id="inventory-results-title">{label}</h2><p role="status" aria-live="polite">{integer.format(filtered.length)} {filtered.length === 1 ? "ejemplar registrado" : "ejemplares registrados"}</p></div>
      <div className="inventory-list">{filtered.slice(0, visible).map(animal => <article key={animal.id}><div><span className="inventory-code">{animal.public_code}</span><h3>{animal.name}</h3><p>{[animal.species, animal.breed, sexes[animal.sex] ?? animal.sex].filter(Boolean).join(" · ")}</p></div><div className="inventory-badges"><span>{statuses[animal.inventory_status] ?? animal.inventory_status}</span><span className={animal.publication_status === "publicado" ? "is-public" : ""}>{statuses[animal.publication_status] ?? animal.publication_status}</span></div><strong>{animal.price_pen == null ? "Sin precio" : pen.format(Number(animal.price_pen))}</strong></article>)}</div>
      {filtered.length > visible && <button className="button button-secondary inventory-show-more" type="button" onClick={() => setVisible(count => count + 20)}>Mostrar más animales</button>}
    </section>
  </>;
}
