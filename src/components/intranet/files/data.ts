export interface FolderItem {
  id: string;
  name: string;
  items: string;
  dept: string;
  visibility: string;
}

export interface FileItem {
  id: string;
  name: string;
  size: string;
  updated: string;
  type: string;
  version?: string;
  owner?: string;
  reviewStatus?: "active" | "needs_review" | "compliant";
  daysUntilReview?: number;
  tags?: string[];
}

export const MOCK_FOLDERS: FolderItem[] = [
  { id: "f1", name: "SOPs & Procedimientos Operativos", items: "8 documentos", dept: "Operaciones", visibility: "Organización" },
  { id: "f2", name: "Políticas & Cumplimiento LFPDPPP", items: "6 normativas", dept: "Recursos Humanos", visibility: "Organización" },
  { id: "f3", name: "Arquitectura Cloud & Ciberseguridad", items: "14 guías", dept: "Tecnología", visibility: "Departamento" },
  { id: "f4", name: "Formatos Oficiales & Plantillas", items: "12 formatos", dept: "General", visibility: "Organización" },
];

export const MOCK_FILES: FileItem[] = [
  {
    id: "doc-1",
    name: "SOP_Seguridad_Informacion_ZeroTrust.pdf",
    size: "2.4 MB",
    updated: "Hace 12 días",
    type: "pdf",
    version: "v2.1",
    owner: "Carlos Gómez (Cloud Architect)",
    reviewStatus: "compliant",
    daysUntilReview: 78,
    tags: ["SOP", "Seguridad", "ISO 27001", "Cloud"],
  },
  {
    id: "doc-2",
    name: "Manual_Induccion_Nuevos_Ingresos_2026.pdf",
    size: "4.1 MB",
    updated: "Hace 5 días",
    type: "pdf",
    version: "v3.0",
    owner: "Alejandro Morales (RH)",
    reviewStatus: "compliant",
    daysUntilReview: 85,
    tags: ["Onboarding", "Cultura", "RH"],
  },
  {
    id: "doc-3",
    name: "Guia_Despliegue_Continuo_AWS_Nextjs.pdf",
    size: "1.8 MB",
    updated: "Hace 88 días",
    type: "pdf",
    version: "v1.4",
    owner: "Diego Hernández (Tech Lead)",
    reviewStatus: "needs_review",
    daysUntilReview: 2,
    tags: ["DevOps", "CI/CD", "AWS"],
  },
  {
    id: "doc-4",
    name: "Politica_Gastos_Viaje_Viaticos_2026.xlsx",
    size: "450 KB",
    updated: "Hace 20 días",
    type: "excel",
    version: "v2.0",
    owner: "Sofía Valenzuela (Finanzas)",
    reviewStatus: "compliant",
    daysUntilReview: 70,
    tags: ["Finanzas", "Viáticos", "SOP"],
  },
];
