import React from "react";

interface Props {
  filter: "all" | "unread";
  setFilter: (val: "all" | "unread") => void;
  totalCount: number;
  unreadCount: number;
}

export const NotificationsFilters: React.FC<Props> = ({
  filter, setFilter, totalCount, unreadCount
}) => {
  return (
    <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-panel border border-sky-500/15 w-fit">
      <button
        type="button"
        onClick={() => setFilter("all")}
        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
          filter === "all"
            ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/20"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        Todas ({totalCount})
      </button>
      <button
        type="button"
        onClick={() => setFilter("unread")}
        className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
          filter === "unread"
            ? "bg-gradient-to-r from-sky-600 to-cyan-500 text-white shadow-md shadow-sky-600/20"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        No leídas ({unreadCount})
      </button>
    </div>
  );
};
