"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { Avatar } from "@/components/shared/Avatar";
import { signOutAction } from "@/app/(auth)/login/actions";
import { User, Settings, LifeBuoy, LogOut, ChevronDown } from "lucide-react";

interface UserMenuProps {
  profile?: Profile | null;
}

export const UserMenu: React.FC<UserMenuProps> = ({ profile }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const userName = profile?.full_name || "Colaborador";
  const userEmail = profile?.email || "usuario@empresa.com";
  const userRole = profile?.role ? profile.role.replace("_", " ") : "Colaborador";

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Menú de usuario"
        className="flex items-center gap-3 p-1.5 rounded-2xl bg-slate-900/60 border border-sky-500/15 hover:border-sky-400/30 transition-all focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        <Avatar name={userName} src={profile?.avatar_url} size="sm" />
        <div className="hidden sm:block text-left pr-1">
          <span className="block text-xs font-semibold text-white max-w-[120px] truncate">
            {userName}
          </span>
          <span className="block text-[10px] text-sky-400 font-medium uppercase tracking-wider">
            {userRole}
          </span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pr-1" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 glass-card-elevated rounded-2xl border border-sky-500/20 p-2 shadow-2xl z-50 animate-slide-up"
        >
          <div className="px-3 py-2.5 border-b border-sky-500/10 mb-1">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
          </div>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <User className="w-4 h-4 text-sky-400" aria-hidden="true" />
            <span>Mi Perfil</span>
          </Link>

          <Link
            href="/settings"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Settings className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span>Configuración</span>
          </Link>

          <Link
            href="/report"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <LifeBuoy className="w-4 h-4 text-amber-400" aria-hidden="true" />
            <span>Reportar Problema</span>
          </Link>

          <div className="my-1 border-t border-sky-500/10" />

          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
            >
              <LogOut className="w-4 h-4" aria-hidden="true" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
