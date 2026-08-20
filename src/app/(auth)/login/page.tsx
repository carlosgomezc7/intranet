"use client";

import React, { useState, use } from "react";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginAlerts } from "@/components/auth/LoginAlerts";
import { LoginForm } from "@/components/auth/LoginForm";
import { LoginToggle } from "@/components/auth/LoginToggle";

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const resolvedParams = use(searchParams);
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="glass-card-elevated p-8 sm:p-10 rounded-3xl border border-sky-500/25 shadow-2xl backdrop-blur-2xl">
      <LoginHeader isSignUp={isSignUp} />
      
      <LoginAlerts error={resolvedParams?.error} message={resolvedParams?.message} />

      <LoginForm isSignUp={isSignUp} />

      <LoginToggle isSignUp={isSignUp} onToggle={() => setIsSignUp(!isSignUp)} />
    </div>
  );
}
