import React from "react";
import { User, Mail, Phone, Paperclip, X, Send } from "lucide-react";

interface Props {
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  type: "bug" | "improvement" | "suggestion";
  setType: (v: "bug" | "improvement" | "suggestion") => void;
  description: string;
  setDescription: (v: string) => void;
  fileName: string | null;
  setFileName: (v: string | null) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const ReportForm: React.FC<Props> = ({
  name, setName,
  email, setEmail,
  phone, setPhone,
  type, setType,
  description, setDescription,
  fileName, setFileName,
  loading, onSubmit
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6" aria-label="Formulario de reporte">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("improvement")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
            type === "improvement"
              ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-sky-500/10"
          }`}
        >
          Proponer Mejora
        </button>
        <button
          type="button"
          onClick={() => setType("bug")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 ${
            type === "bug"
              ? "bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md shadow-rose-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-sky-500/10"
          }`}
        >
          Reportar Fallo
        </button>
        <button
          type="button"
          onClick={() => setType("suggestion")}
          className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            type === "suggestion"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/20"
              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-sky-500/10"
          }`}
        >
          Sugerencia
        </button>
      </div>

      <div>
        <label htmlFor="report-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Nombre *
        </label>
        <div className="relative">
          <User className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
          <input
            id="report-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre completo"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="report-email" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Correo *
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
          <input
            id="report-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="correo@empresa.com"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="report-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Teléfono
        </label>
        <div className="relative">
          <Phone className="absolute left-3.5 top-3 w-4 h-4 text-sky-400/60 pointer-events-none" aria-hidden="true" />
          <input
            id="report-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+52 55 1234 5678"
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      <div>
        <label htmlFor="report-desc" className="block text-xs font-semibold text-slate-300 mb-1.5">
          Descripción *
        </label>
        <div className="relative">
          <textarea
            id="report-desc"
            required
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detalla con claridad la propuesta de mejora o el fallo presentado..."
            className="w-full p-3.5 bg-slate-900/70 border border-sky-500/20 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all resize-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Fotografía o Archivo Adjunto (Opcional)
        </label>
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/80 border border-sky-500/30 hover:border-sky-400 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer transition-colors focus-within:ring-2 focus-within:ring-sky-400">
            <Paperclip className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <span>Seleccionar archivo</span>
            <input
              type="file"
              onChange={handleFileChange}
              className="sr-only"
              accept="image/*,.pdf,.doc,.docx,.zip"
            />
          </label>
          {fileName && (
            <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/40 px-3 py-1.5 rounded-xl border border-cyan-500/30">
              <span className="truncate max-w-[200px]">{fileName}</span>
              <button
                type="button"
                onClick={() => setFileName(null)}
                className="text-slate-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 p-0.5 rounded-md"
                aria-label="Quitar archivo adjunto"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-sky-600 via-cyan-600 to-sky-500 hover:from-sky-500 hover:to-cyan-400 shadow-xl shadow-sky-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
      >
        <Send className="w-4 h-4" aria-hidden="true" />
        <span>{loading ? "Enviando reporte..." : "Enviar Reporte"}</span>
      </button>
    </form>
  );
};
