// ==============================================================================
// ELEVATE INTRANET B2B — Site Configuration
// ==============================================================================

export const siteConfig = {
  name: "Elevate",
  legalName: "Elevate Enterprise Solutions S.A. de C.V.",
  description: "Plataforma de Intranet Corporativa B2B de alto rendimiento para gestión empresarial integral, flujos de aprobación multi-nivel y comunicación en tiempo real.",
  seoTitle: "Elevate — Intranet Corporativa Empresarial B2B",
  seoDescription: "Espacio de trabajo digital para organizaciones modernas: comunicación en tiempo real, gestión documental, aprobaciones multi-nivel y nóminas.",
  tagline: "El espacio de trabajo digital unificado para tu organización.",
  contactEmail: "contacto@elevate.com.mx",
  supportEmail: "soporte@elevate.com.mx",
  phone: "+52 (55) 8900-3400",
  address: "Av. Paseo de la Reforma 480, Piso 24, Cuauhtémoc, CDMX, México",
  
  branding: {
    primaryColor: "#0284c7", // Sky 600
    accentColor: "#06b6d4", // Cyan 500
    darkBg: "#030712", // Gray 950
    cardBg: "rgba(15, 23, 42, 0.75)", // Slate 900 translucent
    borderColor: "rgba(56, 189, 248, 0.15)",
  },

  services: [
    {
      id: "comunicacion-realtime",
      title: "Comunicación en Tiempo Real",
      description: "Canales de chat corporativo, mensajes directos, hilos y menciones organizadas por área y proyecto.",
      icon: "MessageSquare",
      features: [
        "Canales públicos y privados por área",
        "Menciones con notificaciones instantáneas",
        "Hilos de conversación e historial seguro",
        "Reacciones y adjuntos protegidos"
      ]
    },
    {
      id: "flujos-aprobacion",
      title: "Flujos de Aprobación Multi-Nivel",
      description: "Automatización de solicitudes (vacaciones, permisos, gastos, recursos) con trazabilidad completa paso a paso.",
      icon: "FileCheck2",
      features: [
        "Cadenas de aprobación configurables",
        "Trazabilidad y timeline en tiempo real",
        "Firma digital y registro de decisiones",
        "Alertas por correo y push ante demoras"
      ]
    },
    {
      id: "asistencias-nominas",
      title: "Asistencias y Recibos de Nómina",
      description: "Monitoreo de checadas biométricas y consulta confidencial de recibos de nómina timbrados (CFDI / PDF / XML).",
      icon: "Receipt",
      features: [
        "Historial de asistencias e incidencias",
        "Integración con CONTPAQi y sistemas biométricos",
        "Descarga cifrada de recibos de nómina",
        "Acceso seguro con aislamiento por empleado"
      ]
    },
    {
      id: "documentos-directorio",
      title: "Gestión Documental y Directorio",
      description: "Repositorio institucional centralizado con control de versiones y directorio interactivo del personal.",
      icon: "FolderKanban",
      features: [
        "Carpetas con permisos por departamento",
        "Búsqueda instantánea de colaboradores",
        "Visualización de organigrama jerárquico",
        "Aislamiento Zero-Trust y cifrado en reposo"
      ]
    }
  ]
};
