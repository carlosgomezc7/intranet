import { Announcement } from "@/lib/types";

export const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann-1",
    org_id: "default",
    author_id: "usr-1",
    title: "Actualización de Protocolos de Seguridad y Accesos a la Intranet",
    content: `Estimado equipo de Elevate,

A partir de esta semana, todos los accesos a la intranet cuentan con autenticación reforzada y verificación de sesiones. Los puntos principales son:

1. **Sesiones Seguras:** Las credenciales están protegidas bajo el esquema Zero-Trust.
2. **Navegación Intuitiva:** Ya está disponible la barra lateral estilo macOS Dock con accesos a chat, asistencias y nóminas.
3. **Soporte Continuo:** Ante cualquier anomalía, pueden utilizar el módulo de 'Reportar Fallo o Mejora'.

Agradecemos su compromiso con la seguridad de la información institucional.`,
    category: "general",
    priority: "urgent",
    is_pinned: true,
    target_departments: [],
    expires_at: null,
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    author: {
      id: "usr-1",
      org_id: "default",
      email: "rh@elevate.com.mx",
      full_name: "Recursos Humanos",
      avatar_url: null,
      role: "hr_manager",
      department_id: null,
      job_title: "Gerencia de RH",
      phone: null,
      hire_date: "2024-01-01",
      is_active: true,
      settings_json: {},
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "ann-2",
    org_id: "default",
    author_id: "usr-2",
    title: "Calendario de Mantenimiento de Servidores y Despliegues",
    content: `El equipo de DevOps e Infraestructura informa que el próximo sábado de 02:00 a 04:00 hrs se llevará a cabo una ventana de mantenimiento programado en los servidores AWS EC2 y bases de datos SQL Server.

Durante esta ventana no habrá interrupción en la recepción de checadas pero el acceso web podría presentar breves latencias.`,
    category: "it",
    priority: "high",
    is_pinned: false,
    target_departments: [],
    expires_at: null,
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    author: {
      id: "usr-2",
      org_id: "default",
      email: "carlos.gomez@elevate.com.mx",
      full_name: "Administrador",
      avatar_url: null,
      role: "admin",
      department_id: null,
      job_title: "Administrador",
      phone: null,
      hire_date: "2024-01-15",
      is_active: true,
      settings_json: {},
      created_at: "",
      updated_at: "",
    },
  },
  {
    id: "ann-3",
    org_id: "default",
    author_id: "usr-3",
    title: "Integración de Recibos de Nómina con CONTPAQi Timbrado",
    content: `Les recordamos que los recibos de nómina correspondientes a la quincena en curso ya se encuentran cargados en la sección 'Mi Nómina' para su consulta y descarga en formato PDF / XML.`,
    category: "hr",
    priority: "normal",
    is_pinned: false,
    target_departments: [],
    expires_at: null,
    created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 72).toISOString(),
    author: {
      id: "usr-3",
      org_id: "default",
      email: "finanzas@elevate.com.mx",
      full_name: "Sofía Valenzuela",
      avatar_url: null,
      role: "manager",
      department_id: null,
      job_title: "Coordinación de Nóminas",
      phone: null,
      hire_date: "2024-03-01",
      is_active: true,
      settings_json: {},
      created_at: "",
      updated_at: "",
    },
  },
];

export const CATEGORIES = ["Todos", "general", "hr", "it", "events"];

export const priorityVariants: { [key: string]: "danger" | "warning" | "info" | "neutral" } = {
  urgent: "danger",
  high: "warning",
  normal: "info",
  low: "neutral",
};
