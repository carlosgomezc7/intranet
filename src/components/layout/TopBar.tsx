"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { siteConfig } from "@/lib/config";
import { SearchBar } from "@/components/shared/SearchBar";
import { UserMenu } from "@/components/layout/UserMenu";
import { Bell, Shield } from "lucide-react";

interface TopBarProps {
  profile?: Profile | null;
}

export const TopBar: React.FC<TopBarProps> = ({ profile }) => {
  const [search, setSearch] = useState("");

  return (
    <header className="sticky top-0 z-30 w-full bg-slate-950/60 backdrop-blur-xl border-b border-sky-500/10 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile brand trigger */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
          <Shield className="w-4 h-4" aria-hidden="true" />
        </div>
        <span className="text-base font-bold text-white tracking-wide">
          {siteConfig.name}
        </span>
      </div>

      {/* Global Search Bar */}
      <div className="hidden sm:block flex-1 max-w-md">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Buscar compañeros, archivos, comunicados..."
        />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 ml-auto">
        {/* Notification Bell */}
        <Link
          href="/notifications"
          aria-label="Ver notificaciones"
          className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-transparent hover:border-sky-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          <Bell className="w-5 h-5" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400" />
        </Link>

        {/* User Dropdown */}
        <UserMenu profile={profile} />
      </div>
    </header>
  );
};
