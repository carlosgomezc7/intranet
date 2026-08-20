"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DOCK_NAV_ITEMS } from "@/lib/constants";
import { siteConfig } from "@/lib/config";
import {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  Users,
  FileCheck2,
  Clock,
  Receipt,
  Megaphone,
  Bell,
  Settings,
  LifeBuoy,
  Shield,
  LogOut,
  Layers,
} from "lucide-react";
import { signOutAction } from "@/app/(auth)/login/actions";

const iconMap: { [key: string]: React.ElementType } = {
  LayoutDashboard,
  MessageSquare,
  FolderKanban,
  Layers,
  Users,
  FileCheck2,
  Clock,
  Receipt,
  Megaphone,
  Bell,
  Settings,
  LifeBuoy,
};

export const DockSidebar: React.FC = () => {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside
      className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center py-4 px-2.5 rounded-3xl macos-dock"
      aria-label="Barra de herramientas macOS Dock"
    >
      {/* Top Logo / App Icon */}
      <Link
        href="/dashboard"
        className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-cyan-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 mb-3 hover:scale-110 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label={`${siteConfig.name} Inicio`}
      >
        <Shield className="w-5 h-5" aria-hidden="true" />
      </Link>

      <div className="w-6 h-[1px] bg-sky-500/20 my-1" />

      {/* Dock Nav Items List */}
      <nav className="flex flex-col items-center gap-1.5" aria-label="Navegación del Dock">
        {DOCK_NAV_ITEMS.map((item) => {
          if (item.isSeparator) {
            return (
              <div
                key={item.id}
                className="w-6 h-[1px] bg-sky-500/20 my-1.5"
                role="separator"
              />
            );
          }

          const IconComponent = iconMap[item.icon] || LayoutDashboard;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <div key={item.id} className="relative flex items-center">
              {/* Active Indicator Glow */}
              {isActive && <div className="dock-active-indicator" aria-hidden="true" />}

              <Link
                href={item.href}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`dock-icon-btn relative w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-gradient-to-tr from-sky-600 to-cyan-500 text-white shadow-lg shadow-sky-500/30 border border-cyan-400/40"
                    : "text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 border border-transparent hover:border-sky-500/20"
                } focus:outline-none focus:ring-2 focus:ring-cyan-400`}
                aria-label={item.title}
                aria-current={isActive ? "page" : undefined}
              >
                <IconComponent className="w-5 h-5" aria-hidden="true" />

                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-500/50">
                    {item.badge}
                  </span>
                )}
              </Link>

              {/* Floating Tooltip */}
              {hoveredItem === item.id && (
                <div
                  role="tooltip"
                  className="absolute left-14 px-3 py-1.5 rounded-xl bg-slate-900/90 text-white text-xs font-semibold whitespace-nowrap backdrop-blur-md border border-sky-400/20 shadow-xl shadow-black/50 pointer-events-none z-50 animate-slide-up"
                >
                  {item.title}
                </div>
              )}
            </div>
          );
        })}

        {/* Sign Out Button */}
        <div className="relative flex items-center mt-1">
          <form action={signOutAction}>
            <button
              type="submit"
              onMouseEnter={() => setHoveredItem("signout")}
              onMouseLeave={() => setHoveredItem(null)}
              className="dock-icon-btn w-10 h-10 rounded-2xl flex items-center justify-center text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/30 border border-transparent hover:border-rose-500/30 transition-all focus:outline-none focus:ring-2 focus:ring-rose-400"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" aria-hidden="true" />
            </button>
          </form>

          {hoveredItem === "signout" && (
            <div
              role="tooltip"
              className="absolute left-14 px-3 py-1.5 rounded-xl bg-rose-950/90 text-rose-200 text-xs font-semibold whitespace-nowrap backdrop-blur-md border border-rose-500/30 shadow-xl shadow-black/50 pointer-events-none z-50 animate-slide-up"
            >
              Cerrar Sesión
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};
