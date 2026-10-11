"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "./icon";

export function AnimalPhoto({ src, alt, sizes, fallbackSrc }: { src: string | null; alt: string; sizes: string; fallbackSrc?: string }) {
  const [failed, setFailed] = useState<string[]>([]);
  const candidate = src && !failed.includes(src) ? src : fallbackSrc && !failed.includes(fallbackSrc) ? fallbackSrc : null;
  return candidate ? <Image src={candidate} alt={alt} fill sizes={sizes} onError={() => setFailed(values => [...values, candidate])} /> : <span className="animal-photo-placeholder"><Icon name="store" size={30} /><span>Sin fotografía</span></span>;
}
