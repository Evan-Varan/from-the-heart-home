import { useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  intervalMs?: number;
  priority?: boolean;
};

export function RotatingImage({
  images,
  alt,
  className = "",
  intervalMs = 4500,
  priority = false,
}: Props) {
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
    if (images.length <= 1 || prefersReducedMotion) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(t);
  }, [images.length, intervalMs, prefersReducedMotion]);

  const src = images[idx] ?? images[0];

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        key={src}
        src={src}
        alt={idx === 0 ? alt : ""}
        aria-hidden={idx === 0 ? undefined : true}
        loading={priority && idx === 0 ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority && idx === 0 ? "high" : "auto"}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
