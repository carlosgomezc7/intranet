import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";
import { siteConfig } from "@/lib/config";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Dynamic company name from user metadata or site configuration
  const companyName =
    user.user_metadata?.company_name ||
    user.user_metadata?.company ||
    siteConfig.name;

  return (
    <div className="min-h-screen bg-[#080e1a] flex flex-col items-center justify-center p-6 text-slate-100 relative overflow-hidden">
      {/* Ambient background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="glass-card rounded-2xl p-8 sm:p-10 max-w-lg w-full text-center relative z-10 border border-white/10">
        {/* Company Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
          Intranet Corporativa
        </div>

        {/* Check Icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2 tracking-tight">
          ¡Bienvenido a {companyName}!
        </h1>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Has accedido correctamente al portal interno de la empresa.
        </p>

        {/* User Info Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 mb-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user.email}</p>
              <p className="text-blue-400/80 text-xs font-medium">
                Empresa: <span className="text-slate-200">{companyName}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-white/20 hover:bg-white/[0.05] transition-all flex items-center justify-center gap-2"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Ir al Sitio de Servicios Públicos
          </Link>

          <form action={logout}>
            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/[0.05] transition-all flex items-center justify-center gap-2"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
