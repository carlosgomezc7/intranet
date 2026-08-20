import React from "react";
import { SearchBar } from "@/components/shared/SearchBar";

interface Props {
  search: string;
  setSearch: (val: string) => void;
}

export const FilesSearch: React.FC<Props> = ({ search, setSearch }) => {
  return (
    <div className="glass-panel p-4 rounded-2xl border border-sky-500/15">
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Buscar carpetas o documentos institucionales..."
      />
    </div>
  );
};
