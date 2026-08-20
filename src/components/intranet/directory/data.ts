export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  phone: string;
  avatar: string | null;
  status: string;
  skills: string[];
  certifications?: string[];
  managerId?: string | null;
  directReportsCount?: number;
}

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Carlos Gómez",
    email: "admin@elevate.com.mx",
    role: "Líder Técnico & Cloud Architect",
    department: "Tecnología",
    phone: "+52 55 1234 5678",
    avatar: null,
    status: "active",
    skills: ["AWS", "Next.js", "PostgreSQL", "DevOps", "Supabase", "TypeScript"],
    certifications: ["AWS Solutions Architect", "CKA Kubernetes"],
    managerId: "2",
    directReportsCount: 4,
  },
  {
    id: "2",
    name: "Mariana Silva",
    email: "mariana.silva@elevate.com.mx",
    role: "Directora de Operaciones (COO)",
    department: "Dirección",
    phone: "+52 55 2345 6789",
    avatar: null,
    status: "active",
    skills: ["Gestión Estratégica", "Scrum", "Liderazgo", "Transformación Digital"],
    certifications: ["PMP", "Scrum Master"],
    managerId: null,
    directReportsCount: 5,
  },
  {
    id: "3",
    name: "Alejandro Morales",
    email: "alejandro.m@elevate.com.mx",
    role: "Gerente de Recursos Humanos",
    department: "Recursos Humanos",
    phone: "+52 55 3456 7890",
    avatar: null,
    status: "active",
    skills: ["Atracción de Talento", "LFPDPPP", "Cultura Organizacional", "Onboarding"],
    certifications: ["SHRM-CP"],
    managerId: "2",
    directReportsCount: 2,
  },
  {
    id: "4",
    name: "Sofía Valenzuela",
    email: "sofia.v@elevate.com.mx",
    role: "Coordinadora de Nóminas & Finanzas",
    department: "Finanzas",
    phone: "+52 55 4567 8901",
    avatar: null,
    status: "active",
    skills: ["CONTPAQi", "NOI", "CFDI 4.0", "Fiscal México", "Excel Avanzado"],
    certifications: ["Contador Público Certificado"],
    managerId: "2",
    directReportsCount: 1,
  },
  {
    id: "5",
    name: "Diego Hernández",
    email: "diego.h@elevate.com.mx",
    role: "Tech Lead Fullstack",
    department: "Tecnología",
    phone: "+52 55 5678 9012",
    avatar: null,
    status: "active",
    skills: ["React 19", "Node.js", "GraphQL", "Tailwind CSS", "Architecture"],
    certifications: ["Meta Frontend Certified"],
    managerId: "1",
    directReportsCount: 2,
  },
  {
    id: "6",
    name: "Valeria Castillo",
    email: "valeria.c@elevate.com.mx",
    role: "Especialista en Cultura & Capacitación",
    department: "Recursos Humanos",
    phone: "+52 55 6789 0123",
    avatar: null,
    status: "active",
    skills: ["Inducción", "Mentoring", "Comunicación Interna", "Kudos"],
    certifications: ["Facilitador de Grupos"],
    managerId: "3",
    directReportsCount: 0,
  },
];

export const DEPARTMENTS = ["Todos", "Tecnología", "Recursos Humanos", "Finanzas", "Dirección"];
