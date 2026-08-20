import React from "react";
import * as Icons from "lucide-react";

interface EmptyStateProps {
  icon?: keyof typeof Icons;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "FolderOpen",
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const IconComponent = (Icons[icon] as React.ElementType) || Icons.FolderOpen;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-panel rounded-2xl border border-sky-500/10 max-w-md mx-auto my-6">
      <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-center text-sky-400 mb-4 shadow-lg shadow-sky-500/5">
        <IconComponent className="w-7 h-7" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-5 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-sky-600 to-cyan-500 text-white hover:from-sky-500 hover:to-cyan-400 shadow-md shadow-sky-600/20 transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
