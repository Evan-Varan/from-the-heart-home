import { Link } from "@tanstack/react-router";
import logoFull from "@/assets/logo-full.png";
import logoMark from "@/assets/logo-mark.png";

export function Logo({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mark";
}) {
  return (
    <Link
      to="/"
      className={`flex items-center ${className}`}
      aria-label="From the Heart Tutoring home"
    >
      {variant === "mark" ? (
        <img
          src={logoMark}
          alt="From the Heart Tutoring"
          width={790}
          height={790}
          className="h-12 w-12 object-contain md:h-12 md:w-12"
        />
      ) : (
        <img
          src={logoFull}
          alt="From the Heart Tutoring"
          width={1620}
          height={437}
          className="h-14 w-auto object-contain md:h-14"
        />
      )}
    </Link>
  );
}
