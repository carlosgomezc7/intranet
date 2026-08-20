import React from "react";
import Image from "next/image";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = "md",
  className = "",
}) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "U";

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 font-semibold text-white shadow-md border border-cyan-400/20 overflow-hidden select-none ${sizeClasses[size]} ${className}`}
      aria-label={`Avatar de ${name}`}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
