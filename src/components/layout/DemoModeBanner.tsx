"use client";

import React from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { isDemoMode } from "@/lib/demo";

export const DemoModeBanner: React.FC = () => {
  if (!isDemoMode()) return null;

  return (
    <aside
      role="status"
      aria-live="polite"
      className="w-full bg-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-amber-200 text-xs font-medium flex items-center justify-center gap-2 backdrop-blur-md sticky top-0 z-50 shadow-sm"
    >
      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" aria-hidden="true" />
      <span>
        <strong>Modo Demostración Activo:</strong> Estás navegando con credenciales y datos simulados locales. Los cambios no se persisten en Supabase.
      </span>
      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0 hidden sm:inline" aria-hidden="true" />
    </aside>
  );
};
