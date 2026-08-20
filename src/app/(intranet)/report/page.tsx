/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { ReportHeader } from "@/components/intranet/report/ReportHeader";
import { ReportSuccess } from "@/components/intranet/report/ReportSuccess";
import { ReportForm } from "@/components/intranet/report/ReportForm";

export default function ReportPage() {
  const { profile } = useUser();
  const supabase = createClient();

  const [name, setName] = useState(profile?.full_name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [type, setType] = useState<"bug" | "improvement" | "suggestion">("improvement");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (profile) {
      if (!name) setName(profile.full_name || "");
      if (!email) setEmail(profile.email || "");
      if (!phone) setPhone(profile.phone || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await supabase.from("bug_reports").insert({
        name,
        email,
        phone,
        type,
        description,
        reporter_id: profile?.id || null,
        org_id: profile?.org_id || null,
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting report:", err);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setDescription("");
    setFileName(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-slide-up">
      <ReportHeader />

      <div className="glass-card-elevated p-8 sm:p-10 rounded-3xl border border-sky-500/25 shadow-2xl">
        {submitted ? (
          <ReportSuccess onReset={handleReset} />
        ) : (
          <ReportForm
            name={name} setName={setName}
            email={email} setEmail={setEmail}
            phone={phone} setPhone={setPhone}
            type={type} setType={setType}
            description={description} setDescription={setDescription}
            fileName={fileName} setFileName={setFileName}
            loading={loading}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
