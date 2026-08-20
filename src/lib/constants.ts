// ==============================================================================
// ELEVATE INTRANET B2B — Constants & Navigation Configuration
// ==============================================================================

import { NavItem, UserRole } from './types';

export const USER_ROLES: { [key in UserRole]: { label: string; level: number; description: string } } = {
  super_admin: {
    label: 'Super Administrador',
    level: 0,
    description: 'Control total de la plataforma y configuraciones globales',
  },
  admin: {
    label: 'Administrador',
    level: 1,
    description: 'Gestión de usuarios, departamentos, equipos y reportes',
  },
  hr_manager: {
    label: 'Recursos Humanos',
    level: 2,
    description: 'Gestión de personal, nóminas, asistencias y aprobaciones',
  },
  manager: {
    label: 'Gerente de Área',
    level: 2,
    description: 'Aprobación de solicitudes de área y anuncios de departamento',
  },
  team_lead: {
    label: 'Líder de Equipo',
    level: 3,
    description: 'Coordinación de proyectos y aprobación de primer nivel',
  },
  employee: {
    label: 'Colaborador',
    level: 3,
    description: 'Acceso a sus propios datos, chat, solicitudes y directorio',
  },
};

// macOS Dock Sidebar Navigation Items
export const DOCK_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
  },
  {
    id: 'chat',
    title: 'Chat Corporativo',
    href: '/chat',
    icon: 'MessageSquare',
    badge: 'Pro',
  },
  {
    id: 'files',
    title: 'Documentos & Archivos',
    href: '/files',
    icon: 'FolderKanban',
  },
  {
    id: 'projects',
    title: 'Project Hubs',
    href: '/projects',
    icon: 'Layers',
  },
  {
    id: 'directory',
    title: 'Directorio de Personal',
    href: '/directory',
    icon: 'Users',
  },
  {
    id: 'requests',
    title: 'Solicitudes & Permisos',
    href: '/requests',
    icon: 'FileCheck2',
  },
  {
    id: 'attendance',
    title: 'Control de Asistencias',
    href: '/attendance',
    icon: 'Clock',
  },
  {
    id: 'payroll',
    title: 'Recibos de Nómina',
    href: '/payroll',
    icon: 'Receipt',
  },
  {
    id: 'feed',
    title: 'Muro Social',
    href: '/feed',
    icon: 'MessageCircleHeart',
  },
  {
    id: 'manuals',
    title: 'Manuales & SOPs',
    href: '/manuals',
    icon: 'BookOpenCheck',
  },
  {
    id: 'ideas',
    title: 'Buzón de Ideas',
    href: '/ideas',
    icon: 'Lightbulb',
  },
  {
    id: 'townhalls',
    title: 'Town Hall',
    href: '/townhalls',
    icon: 'Radio',
  },
  {
    id: 'announcements',
    title: 'Comunicados',
    href: '/announcements',
    icon: 'Megaphone',
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    href: '/notifications',
    icon: 'Bell',
  },
  {
    id: 'separator-bottom',
    title: 'Separador',
    href: '#',
    icon: 'Minus',
    isSeparator: true,
  },
  {
    id: 'settings',
    title: 'Configuración',
    href: '/settings',
    icon: 'Settings',
  },
  {
    id: 'report',
    title: 'Reportar Fallo o Mejora',
    href: '/report',
    icon: 'LifeBuoy',
  },
];
