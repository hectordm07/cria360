"use client";
import { useEffect } from "react";

export function ScrollImageMotion() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("photo-arrived");
        observer.unobserve(entry.target);
      }
    }, { threshold: 0.15 });
    const photos = document.querySelectorAll(".landing-page .landing-species-photo, .landing-page .animal-photo, .landing-page .article-image");
    photos.forEach(photo => observer.observe(photo));
    return () => observer.disconnect();
  }, []);
  return null;
}
