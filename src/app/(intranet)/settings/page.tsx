/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { SettingsHeader } from "@/components/intranet/settings/SettingsHeader";
import { SettingsSuccess } from "@/components/intranet/settings/SettingsSuccess";
import { SettingsProfileCard } from "@/components/intranet/settings/SettingsProfileCard";
import { SettingsForm } from "@/components/intranet/settings/SettingsForm";

export default function SettingsPage() {
  const { profile } = useUser();
  const supabase = createClient();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setPhone(profile.phone || "");
      setTheme(profile.settings_json?.theme || "dark");
      setNotifications(profile.settings_json?.notifications_enabled !== false);
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          phone,
          settings_json: {
            theme,
            notifications_enabled: notifications,
          },
        })
        .eq("id", profile.id);

      if (!error) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
      <SettingsHeader />

      {savedSuccess && <SettingsSuccess />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SettingsProfileCard fullName={fullName} profile={profile} />

        <SettingsForm
          profile={profile}
          fullName={fullName}
          setFullName={setFullName}
          phone={phone}
          setPhone={setPhone}
          notifications={notifications}
          setNotifications={setNotifications}
          saving={saving}
          onSubmit={handleSave}
        />
      </div>
    </div>
  );
}
