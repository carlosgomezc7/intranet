export interface RequestItem {
  id: string;
  title: string;
  type: string;
  requester: string;
  department: string;
  status: "pending" | "in_review" | "approved" | "rejected";
  current_step: number;
  total_steps: number;
  created_at: string;
  approvers: string[];
}

export const MOCK_REQUESTS: RequestItem[] = [
  {
    id: "req-101",
    title: "Solicitud de Vacaciones de Verano (5 días)",
    type: "Vacaciones",
    requester: "Administrador",
    department: "Tecnología",
    status: "in_review",
    current_step: 2,
    total_steps: 2,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    approvers: ["Mariana Silva (Aprobado)", "Alejandro Morales (Pendiente)"],
  },
  {
    id: "req-102",
    title: "Permiso por Cita Médica Especializada",
    type: "Permiso Personal",
    requester: "Administrador",
    department: "Tecnología",
    status: "approved",
    current_step: 2,
    total_steps: 2,
    created_at: new Date(Date.now() - 3600000 * 96).toISOString(),
    approvers: ["Mariana Silva (Aprobado)", "Alejandro Morales (Aprobado)"],
  },
  {
    id: "req-103",
    title: "Aprobación de Reembolso de Viáticos por Capacitación",
    type: "Gastos",
    requester: "Diego Hernández",
    department: "Tecnología",
    status: "pending",
    current_step: 1,
    total_steps: 3,
    created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
    approvers: ["Administrador (Pendiente)", "Sofía Valenzuela", "Dirección General"],
  },
  {
    id: "req-104",
    title: "Solicitud de Acceso a Base de Datos de Producción",
    type: "Accesos",
    requester: "Diego Hernández",
    department: "Tecnología",
    status: "approved",
    current_step: 2,
    total_steps: 2,
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(),
    approvers: ["Administrador (Aprobado)", "Seguridad de la Información (Aprobado)"],
  },
];

export const STATUS_FILTERS = ["Todos", "pending", "in_review", "approved", "rejected"];

export const statusConfig: { [key: string]: { label: string; variant: "warning" | "info" | "success" | "danger" } } = {
  pending: { label: "Pendiente", variant: "warning" },
  in_review: { label: "En Revisión", variant: "info" },
  approved: { label: "Aprobada", variant: "success" },
  rejected: { label: "Rechazada", variant: "danger" },
};
