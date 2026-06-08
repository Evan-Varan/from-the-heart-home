import { useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  intervalMs?: number;
  priority?: boolean;
};

export function RotatingImage({ images, alt, className = "", intervalMs = 4500, priority = false }: Props) {
  const [idx, setIdx] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const preloaders = images.map((src) => {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
      void img.decode?.().catch(() => undefined);
      return img;
    });

    return () => preloaders.forEach((img) => (img.src = ""));
  }, [images]);

  useEffect(() => {
    if (images.length <= 1 || prefersReducedMotion) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(t);
  }, [images.length, intervalMs, prefersReducedMotion]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          aria-hidden={i === idx ? undefined : true}
          loading={priority && i === 0 ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority && i === 0 ? "high" : "auto"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out motion-reduce:transition-none ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
