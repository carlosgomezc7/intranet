import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/app/login/actions";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#080e1a] flex items-center justify-center p-6">
      <div className="glass-card rounded-2xl p-10 max-w-lg w-full text-center">
        {/* Check icon */}
        <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/20">
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

        <h1 className="text-2xl font-bold text-white mb-2">
          Bienvenido a la Intranet
        </h1>
        <p className="text-slate-400 text-sm mb-1">
          Has iniciado sesión exitosamente.
        </p>
        <p className="text-blue-400/80 text-sm font-mono mb-8">
          {user.email}
        </p>

        {/* User info card */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 mb-8 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user.email}</p>
              <p className="text-slate-500 text-xs">Rol: Empleado</p>
            </div>
          </div>
        </div>

        {/* Logout */}
        <form action={logout}>
          <button
            type="submit"
            className="w-full py-3 rounded-xl text-sm font-medium text-slate-300 border border-white/10 hover:border-red-500/30 hover:text-red-400 hover:bg-red-500/[0.05] transition-all"
          >
            Cerrar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}
