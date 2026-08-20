"use client";

import React from "react";
import Link from "next/link";
import { GroupsList } from "@/components/intranet/access/GroupsList";
import { Group } from "@/lib/types";
import { ArrowLeft, Users } from "lucide-react";

const SAMPLE_GROUPS: Group[] = [
  {
    id: "g1",
    org_id: "demo-org-1",
    name: "Comité de Dirección & Estrategia",
    slug: "comite_direccion",
    description: "Equipo directivo responsable de la gobernanza, inversiones y directrices corporativas.",
    member_count: 8,
  },
  {
    id: "g2",
    org_id: "demo-org-1",
    name: "Líderes Técnicos & Arquitectura",
    slug: "lideres_tecnicos",
    description: "Ingenieros principales encargados de infraestructura cloud, seguridad y arquitectura de software.",
    member_count: 14,
  },
  {
    id: "g3",
    org_id: "demo-org-1",
    name: "Comité de Seguridad y LFPDPPP",
    slug: "seguridad_privacidad",
    description: "Responsables del cumplimiento de políticas de protección de datos, auditorías ISO 27001 y RLS.",
    member_count: 6,
  },
];

export default function GroupsPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <div>
        <Link
          href="/settings/access"
          className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-semibold mb-2 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver a Roles & Permisos</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Users className="w-8 h-8 text-cyan-400" />
          <span>Grupos de Usuarios Organizacionales</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Crea y administra grupos lógicos de colaboradores para difusión de comunicados y asignación de políticas.
        </p>
      </div>

      <GroupsList groups={SAMPLE_GROUPS} />
    </div>
  );
}
