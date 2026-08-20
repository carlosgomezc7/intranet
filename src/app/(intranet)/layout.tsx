import React from "react";
import { cookies } from "next/headers";
import { DockSidebar } from "@/components/layout/DockSidebar";
import { TopBar } from "@/components/layout/TopBar";
import { DemoModeBanner } from "@/components/layout/DemoModeBanner";
import { MandatoryPasswordModal } from "@/components/intranet/access/MandatoryPasswordModal";
import { createClient } from "@/lib/supabase/server";
import { Profile } from "@/lib/types";
import { isDemoMode, DEMO_PROFILE } from "@/lib/demo";

export default async function IntranetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const hasDemoCookie = Boolean(cookieStore.get("elevate_demo_session")?.value);
  let profile: Profile | null = isDemoMode() || hasDemoCookie ? DEMO_PROFILE : null;

  if (!isDemoMode() && !hasDemoCookie) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
        if (data) {
          profile = data;
        }
      }
    } catch {
      profile = null;
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Mandatory Password Change Modal for Seed / Setup Accounts */}
      <MandatoryPasswordModal isOpen={Boolean(profile?.must_change_password)} />

      {/* Demo Mode Banner (when active) */}
      <DemoModeBanner />

      {/* Background ambient orbs */}
      <div className="orb orb-primary w-96 h-96 top-20 left-10 opacity-20" aria-hidden="true" />
      <div className="orb orb-accent w-[500px] h-[500px] bottom-10 right-10 opacity-15" aria-hidden="true" />

      {/* Persistent macOS Dock Sidebar */}
      <DockSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-24 transition-all duration-300">
        <TopBar profile={profile} />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto focus:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
