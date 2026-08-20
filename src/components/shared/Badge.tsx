import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const variantClasses = {
  default: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  danger: "bg-rose-500/15 text-rose-300 border-rose-500/30",
  info: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  neutral: "bg-slate-700/40 text-slate-300 border-slate-600/40",
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border px-2.5 py-0.5 transition-colors ${variantClasses[variant]} ${
        size === "sm" ? "text-xs px-2 py-0.2" : "text-xs"
      } ${className}`}
    >
      {children}
    </span>
  );
};
