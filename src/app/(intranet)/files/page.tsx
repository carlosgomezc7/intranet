"use client";

import React, { useState } from "react";
import { FilesHeader } from "@/components/intranet/files/FilesHeader";
import { FilesSearch } from "@/components/intranet/files/FilesSearch";
import { FoldersSection } from "@/components/intranet/files/FoldersSection";
import { RecentFilesTable } from "@/components/intranet/files/RecentFilesTable";
import { KnowledgeGovernanceBanner } from "@/components/intranet/files/KnowledgeGovernanceBanner";
import { MOCK_FOLDERS, MOCK_FILES } from "@/components/intranet/files/data";

export default function FilesPage() {
  const [search, setSearch] = useState("");

  const filteredFolders = MOCK_FOLDERS.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.dept.toLowerCase().includes(search.toLowerCase())
  );
  
  const filteredFiles = MOCK_FILES.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.tags?.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
    f.owner?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-slide-up">
      <FilesHeader />
      <KnowledgeGovernanceBanner />
      <FilesSearch search={search} setSearch={setSearch} />
      <FoldersSection folders={filteredFolders} />
      <RecentFilesTable files={filteredFiles} />
    </div>
  );
}
