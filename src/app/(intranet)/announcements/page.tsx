"use client";

import React, { useState } from "react";
import { AnnouncementsHeader } from "@/components/intranet/announcements/AnnouncementsHeader";
import { AnnouncementsFilters } from "@/components/intranet/announcements/AnnouncementsFilters";
import { AnnouncementsList } from "@/components/intranet/announcements/AnnouncementsList";
import { MOCK_ANNOUNCEMENTS } from "@/components/intranet/announcements/data";

export default function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredAnnouncements = MOCK_ANNOUNCEMENTS.filter((ann) => {
    const matchesSearch =
      ann.title.toLowerCase().includes(search.toLowerCase()) ||
      ann.content.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      selectedCategory === "Todos" || ann.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <AnnouncementsHeader />
      
      <AnnouncementsFilters
        search={search}
        setSearch={setSearch}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <AnnouncementsList announcements={filteredAnnouncements} />
    </div>
  );
}
