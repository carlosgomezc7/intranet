import React from "react";
import { User, Mail, Phone, Save, Bell } from "lucide-react";
import { Profile } from "@/lib/types";

interface Props {
  profile: Profile | null;
  fullName: string;
  setFullName: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const SettingsForm: React.FC<Props> = ({
  profile,
  fullName, setFullName,
  phone, setPhone,
  notifications, setNotifications,
  saving, onSubmit
}) => {
  return (
    <div className="md:col-span-2 glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/15">
      <form onSubmit={onSubmit} className="space-y-6">
        <h3 className="text-base font-bold text-white border-b border-sky-500/10 pb-3">
          Información Personal
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="settings-fullname" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Nombre Completo *
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
              <input
                id="settings-fullname"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="settings-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
              Correo Electrónico (No modificable)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500 pointer-events-none" aria-hidden="true" />
              <input
                id="settings-email"
                type="email"
                disabled
                value={profile?.email || ""}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/50 border border-slate-800 rounded-xl text-slate-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="settings-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
            Número Telefónico
          </label>
          <div className="relative">
            <Phone className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
            <input
              id="settings-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 55 1234 5678"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
            />
          </div>
        </div>

        <h3 className="text-base font-bold text-white border-b border-sky-500/10 pb-3 pt-2">
          Preferencias
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/40 border border-sky-500/10">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-sky-400" aria-hidden="true" />
              <div>
                <span className="text-xs font-semibold text-white block">Notificaciones Push</span>
                <span className="text-[11px] text-slate-400">Recibir alertas de solicitudes y comunicados</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
              aria-label="Habilitar notificaciones push"
              className="w-4 h-4 rounded text-sky-500 focus:ring-sky-400 border-slate-700 bg-slate-900"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 to-cyan-500 hover:from-sky-500 hover:to-cyan-400 shadow-xl shadow-sky-600/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Save className="w-4 h-4" aria-hidden="true" />
          <span>{saving ? "Guardando..." : "Guardar Cambios"}</span>
        </button>
      </form>
    </div>
  );
};
