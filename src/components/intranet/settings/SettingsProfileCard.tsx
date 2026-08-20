import React from "react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { Shield } from "lucide-react";
import { Profile } from "@/lib/types";
import { USER_ROLES } from "@/lib/constants";

interface Props {
  fullName: string;
  profile: Profile | null;
}

export const SettingsProfileCard: React.FC<Props> = ({ fullName, profile }) => {
  const roleInfo = profile?.role ? USER_ROLES[profile.role] : USER_ROLES.employee;

  return (
    <div className="glass-card-elevated p-6 rounded-3xl border border-sky-500/20 text-center flex flex-col items-center justify-center">
      <Avatar
        name={fullName || "Colaborador"}
        src={profile?.avatar_url}
        size="xl"
        className="mb-4"
      />
      <h2 className="text-lg font-bold text-white truncate max-w-[200px]">
        {fullName || "Colaborador"}
      </h2>
      <p className="text-xs text-slate-400 mb-3 truncate max-w-[200px]">
        {profile?.email || "usuario@empresa.com"}
      </p>

      <Badge variant="info" size="md" className="mb-4">
        <Shield className="w-3.5 h-3.5" aria-hidden="true" />
        <span>{roleInfo?.label || "Colaborador"}</span>
      </Badge>

      <p className="text-[11px] text-slate-500 leading-relaxed">
        {roleInfo?.description}
      </p>
    </div>
  );
};
