import React from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  error?: string;
  message?: string;
}

export const LoginAlerts: React.FC<Props> = ({ error, message }) => {
  return (
    <>
      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{decodeURIComponent(error)}</span>
        </div>
      )}

      {message && (
        <div
          role="status"
          aria-live="polite"
          className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          <span>{decodeURIComponent(message)}</span>
        </div>
      )}
    </>
  );
};
