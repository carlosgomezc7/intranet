"use client";

import React from "react";
import { WelcomeBanner } from "@/components/intranet/dashboard/WelcomeBanner";
import { KPIGrid } from "@/components/intranet/dashboard/KPIGrid";
import { QuickActions } from "@/components/intranet/dashboard/QuickActions";
import { RecentActivity } from "@/components/intranet/dashboard/RecentActivity";
import { AnnouncementsPreview } from "@/components/intranet/dashboard/AnnouncementsPreview";
import { SupportFeedbackCard } from "@/components/intranet/dashboard/SupportFeedbackCard";
import { GovernanceKPIs } from "@/components/intranet/dashboard/GovernanceKPIs";
import { CultureKudosFeed } from "@/components/intranet/dashboard/CultureKudosFeed";
import { OnboardingMilestoneCard } from "@/components/intranet/dashboard/OnboardingMilestoneCard";

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <WelcomeBanner />
      <KPIGrid />

      {/* Governance & Adoption Metrics for 200-Employee Scale */}
      <GovernanceKPIs />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <CultureKudosFeed />
          <QuickActions />
          <RecentActivity />
        </div>

        <div className="space-y-6">
          <OnboardingMilestoneCard />
          <AnnouncementsPreview />
          <SupportFeedbackCard />
        </div>
      </div>
    </div>
  );
}
