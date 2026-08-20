"use client";

import React from "react";
import { ProjectsHeader } from "@/components/intranet/projects/ProjectsHeader";
import { ProjectHubCard } from "@/components/intranet/projects/ProjectHubCard";
import { ProjectHub } from "@/lib/types";

const MOCK_PROJECTS: ProjectHub[] = [
  {
    id: "proj-1",
    org_id: "default",
    title: "Implementación de Certificación ISO/IEC 27001",
    description: "Iniciativa conjunta entre Tecnología, Operaciones y Legal para estandarizar la seguridad de la información y gobernanza de datos en toda la organización.",
    status: "in_progress",
    target_departments: ["Tecnología", "Operaciones", "Dirección"],
    roadmap_json: [
      { id: "m1", milestone: "Auditoría de Brechas y Riesgos", dueDate: "30 Jun", completed: true },
      { id: "m2", milestone: "Redacción de Políticas y SOPs", dueDate: "15 Ago", completed: true },
      { id: "m3", milestone: "Capacitación a 200 Empleados", dueDate: "15 Sep", completed: false },
      { id: "m4", milestone: "Auditoría Externa de Certificación", dueDate: "30 Oct", completed: false },
    ],
    agreements_json: [
      { id: "a1", title: "Validar cifrado de base de datos Supabase SSR", assignedTo: "Carlos Gómez", date: "14 Ago" },
    ],
    lead: {
      id: "usr-1",
      org_id: "default",
      email: "admin@elevate.com.mx",
      full_name: "Carlos Gómez",
      avatar_url: null,
      role: "admin",
      department_id: null,
      job_title: "Cloud Architect",
      phone: null,
      hire_date: "2024-01-01",
      is_active: true,
      settings_json: {},
      created_at: "",
      updated_at: "",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-2",
    org_id: "default",
    title: "Automatización de Inducción & Onboarding 2026",
    description: "Diseño y despliegue del nuevo portal de bienvenida para acelerar el tiempo de activación de nuevos ingresos a menos de 48 horas.",
    status: "in_progress",
    target_departments: ["Recursos Humanos", "Tecnología"],
    roadmap_json: [
      { id: "m1", milestone: "Mapeo de Rutas de Aprendizaje", dueDate: "10 Jul", completed: true },
      { id: "m2", milestone: "Integración de Buddy / Mentor System", dueDate: "05 Ago", completed: true },
      { id: "m3", milestone: "Lanzamiento Piloto", dueDate: "20 Ago", completed: false },
    ],
    agreements_json: [
      { id: "a1", title: "Definir matriz de mentores por departamento", assignedTo: "Valeria Castillo", date: "12 Ago" },
    ],
    lead: {
      id: "usr-3",
      org_id: "default",
      email: "alejandro.m@elevate.com.mx",
      full_name: "Alejandro Morales",
      avatar_url: null,
      role: "hr_manager",
      department_id: null,
      job_title: "Gerente de RH",
      phone: null,
      hire_date: "2024-01-01",
      is_active: true,
      settings_json: {},
      created_at: "",
      updated_at: "",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "proj-3",
    org_id: "default",
    title: "Optimización de Procesos Financieros & CFDI 4.0",
    description: "Integración bidireccional de recibos timbrados con CONTPAQi y portal de autoservicio de comprobantes para colaboradores.",
    status: "completed",
    target_departments: ["Finanzas", "Tecnología"],
    roadmap_json: [
      { id: "m1", milestone: "Conector API CONTPAQi", dueDate: "01 Jun", completed: true },
      { id: "m2", milestone: "Validación de XML y PDF", dueDate: "15 Jul", completed: true },
      { id: "m3", milestone: "Puesta en Marcha en Intranet", dueDate: "01 Ago", completed: true },
    ],
    agreements_json: [
      { id: "a1", title: "Cierre de timbrado quincenal sin incidencias", assignedTo: "Sofía Valenzuela", date: "01 Ago" },
    ],
    lead: {
      id: "usr-4",
      org_id: "default",
      email: "sofia.v@elevate.com.mx",
      full_name: "Sofía Valenzuela",
      avatar_url: null,
      role: "manager",
      department_id: null,
      job_title: "Coordinadora de Nóminas",
      phone: null,
      hire_date: "2024-01-01",
      is_active: true,
      settings_json: {},
      created_at: "",
      updated_at: "",
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8 animate-slide-up">
      <ProjectsHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_PROJECTS.map((project) => (
          <ProjectHubCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
