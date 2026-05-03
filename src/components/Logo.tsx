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
          className="h-12 w-12 object-contain md:h-14 md:w-14"
        />
      ) : (
        <img
          src={logoFull}
          alt="From the Heart Tutoring"
          className="h-14 w-auto object-contain md:h-16"
        />
      )}
    </Link>
  );
}