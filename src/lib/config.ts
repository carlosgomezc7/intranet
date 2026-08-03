export const siteConfig = {
  name: process.env.NEXT_PUBLIC_COMPANY_NAME || "CTI Soluciones",
  shortName: "CTI Soluciones",
  tagline: "Transformación Digital & Soluciones Tecnológicas de Alto Impacto",
  description:
    "Impulsamos el crecimiento corporativo con software a la medida, consultoría especializada e Intranets inteligentes.",
  contactEmail: "contacto@ctisoluciones.com",
  contactPhone: "+52 (55) 1234-5678",
  address: "Ciudad de México, México",
  services: [
    {
      id: "intranet",
      title: "Intranets Inteligentes con IA",
      description:
        "Búsqueda profunda corporativa, gestión documental centralizada y colaboración de equipos en tiempo real.",
      icon: "brain-circuit",
      features: [
        "Búsqueda semántica impulsada por IA",
        "Control de accesos (RBAC)",
        "Integración SSO y carpetas compartidas",
      ],
    },
    {
      id: "software",
      title: "Desarrollo de Software a la Medida",
      description:
        "Plataformas web, aplicaciones móviles y APIs robustas diseñadas para escalar con tu negocio.",
      icon: "code-2",
      features: [
        "Arquitectura Cloud Native",
        "Alta disponibilidad y seguridad",
        "Diseño UX/UI Premium",
      ],
    },
    {
      id: "cloud",
      title: "Consultoría Cloud & Ciberseguridad",
      description:
        "Migración a la nube, optimización de infraestructura y auditorías de seguridad avanzadas.",
      icon: "shield-check",
      features: [
        "Protección de datos de extremo a extremo",
        "Monitoreo 24/7 de infraestructura",
        "Optimización de costos en AWS/Azure/GCP",
      ],
    },
  ],
};
