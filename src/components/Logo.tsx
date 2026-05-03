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
          className="h-11 w-11 object-contain"
        />
      ) : (
        <img
          src={logoFull}
          alt="From the Heart Tutoring"
          className="h-11 w-auto object-contain md:h-12"
        />
      )}
    </Link>
  );
}