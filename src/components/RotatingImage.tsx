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
          loading="eager"
          decoding="async"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
            i === idx ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}
