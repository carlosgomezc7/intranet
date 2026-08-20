"use client";

import React, { useState } from "react";
import { RequestHeader } from "@/components/intranet/requests/RequestHeader";
import { RequestFilters } from "@/components/intranet/requests/RequestFilters";
import { RequestList } from "@/components/intranet/requests/RequestList";
import { NewRequestModal } from "@/components/intranet/requests/NewRequestModal";
import { MOCK_REQUESTS } from "@/components/intranet/requests/data";

export default function RequestsPage() {
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredRequests = MOCK_REQUESTS.filter((req) => {
    const matchesSearch =
      req.title.toLowerCase().includes(search.toLowerCase()) ||
      req.type.toLowerCase().includes(search.toLowerCase()) ||
      req.requester.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      selectedStatus === "Todos" || req.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-slide-up">
      <RequestHeader onNewRequest={() => setIsModalOpen(true)} />
      
      <RequestFilters 
        search={search}
        setSearch={setSearch}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
      />

      <RequestList 
        requests={filteredRequests} 
        onNewRequest={() => setIsModalOpen(true)} 
      />

      <NewRequestModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
