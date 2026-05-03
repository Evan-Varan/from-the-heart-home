import { useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  className?: string;
  intervalMs?: number;
};

export function RotatingImage({ images, alt, className = "", intervalMs = 4500 }: Props) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % images.length), intervalMs);
    return () => clearInterval(t);
  }, [images.length, intervalMs]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? alt : ""}
          aria-hidden={i === idx ? undefined : true}
          loading={i === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {/* spacer to preserve aspect ratio set by parent via aspect-* classes */}
      <img src={images[0]} alt="" aria-hidden className="invisible h-full w-full object-cover" />
    </div>
  );
}
