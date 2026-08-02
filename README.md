<div align="center">

# 🌐 CTI Soluciones — Intranet Enterprise SaaS Platform

**La plataforma integral de gestión de datos, comunicación interna y autenticación segura para empresas de alto rendimiento.**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR_Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Proprietary-red.svg?style=for-the-badge)](#licencia)

[Solicitar Demo](#contacto--soporte-comercial) • [Características](#-características-clave) • [Arquitectura](#%EF%B8%8F-arquitectura-técnica) • [Despliegue](#-despliegue-rápido--guía-de-desarrollo) • [Roadmap](#%EF%B8%8F-roadmap-de-producto-comercial)

---

</div>

## 📌 Visión del Producto

**CTI Soluciones Intranet Enterprise** es una solución web de vanguardia diseñada para modernizar la colaboración interna, la gestión de accesos y la centralización de datos corporativos. 

Con una arquitectura basada en **Next.js 16 (App Router)**, **Supabase SSR** y una interfaz ultramoderna con diseño **Glassmorphism**, la plataforma ofrece una experiencia fluida, ultra rápida y extremadamente segura tanto para los empleados como para el equipo de administración de TI.

---

## ✨ Características Clave

### 🔒 Autenticación & Seguridad Enterprise
- **Control de Acceso Basado en Roles (RBAC):** Gestión granular de permisos para administradores, gerentes y colaboradores.
- **Supabase SSR & JWT Tokens:** Sesiones seguras mediante Server-Side Rendering y cookies `HttpOnly` blindadas contra ataques XSS y CSRF.
- **Flujos de Autenticación Completos:** Inicio de sesión, registro corporativo y recuperación segura de contraseñas.

### 🎨 Experiencia de Usuario de Clase Mundial (UI/UX)
- **Diseño Glassmorphism Premium:** Interfaz oscura, elegante y dinámica diseñada para maximizar la productividad y reducir la fatiga visual.
- **Diseño 100% Responsivo:** Adaptabilidad total para equipos de escritorio, tablets y dispositivos móviles.
- **Animaciones Micro-interactivas:** Respuestas visuales fluidas impulsadas por Tailwind CSS v4 y animaciones CSS optimizadas.

### ⚡ Rendimiento Extraordinario
- **Renderizado Híbrido (Server & Client Components):** Tiempos de carga mínimos aprovechando las capacidades avanzadas de React 19.
- **Optimización de Fuentes y Recursos:** Integración nativa de tipografías optimizadas y assets ligeros.

---

## 🛠️ Arquitectura Técnica

La plataforma está desarrollada con las mejores prácticas del ecosistema moderno de TypeScript y Next.js:

```
intranet/
├── src/
│   ├── app/                # App Router (Next.js 16)
│   │   ├── dashboard/      # Panel principal protegido para usuarios autenticados
│   │   ├── login/          # Portal de autenticación (Login/Signup con SSR)
│   │   ├── layout.tsx      # Configuración global de layout y metadatos
│   │   └── page.tsx        # Redirección inteligente de sesión
│   ├── components/         # Sistema de componentes de interfaz (UI/Shadcn)
│   ├── lib/                # Clientes de Supabase (Server, Client, Middleware)
│   └── middleware.ts       # Protección global de rutas en Edge Runtime
├── public/                 # Archivos estáticos y recursos multimedia
└── tailwind.config.mjs     # Sistema de diseño y tokens de color
```

---

## 🚀 Despliegue Rápido & Guía de Desarrollo

### Requisitos Previos
- **Node.js** v20.x o superior
- **npm**, **pnpm** o **bun**
- Proyecto configurado en **Supabase** (URL y Llave Anónima)

### 1. Clonar el Repositorio
```bash
git clone https://github.com/carlosgomezc7/intranet.git
cd intranet
```

### 2. Configurar Variables de Entorno
Crea un archivo `.env.local` basado en `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Configura tus credenciales del backend:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-de-supabase
```

### 3. Instalar Dependencias
```bash
npm install
```

### 4. Ejecutar en Modo Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la intranet en funcionamiento.

---

## 📦 Comandos Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo en `localhost:3000` |
| `npm run build` | Compila la aplicación optimizada para producción |
| `npm run start` | Arranca el servidor en modo producción |
| `npm run lint` | Ejecuta ESLint para validar el código |

---

## 🗺️ Roadmap de Producto Comercial

- [x] **Fase 1:** Portal de Autenticación SSR con Supabase & Dashboard Base.
- [x] **Fase 2:** Sistema de UI Glassmorphism & Modo Oscuro Empresarial.
- [ ] **Fase 3:** Módulo de Gestión de Documentos y Archivos Compartidos (Cloud Drive Interno).
- [ ] **Fase 4:** Centro de Comunicaciones, Anuncios Corporativos y Notificaciones Push.
- [ ] **Fase 5:** Directorio Interactivo de Empleados y Organigrama Dinámico.
- [ ] **Fase 6:** Integración Single Sign-On (SSO) con Google Workspace y Microsoft Azure AD.

---

## 📄 Licencia

Este proyecto es software propietario desarrollado por **CTI Soluciones**. Todos los derechos reservados. Prohibida su reproducción, distribución o uso no autorizado fuera de los términos comerciales acordados.

---

## 📞 Contacto & Soporte Comercial

¿Interesado en implementar **CTI Soluciones Intranet** en tu empresa o solicitar una demostración personalizada?

- **Sitio Web:** [ctisoluciones.com](https://ctisoluciones.com)
- **Correo Comercial:** ventas@ctisoluciones.com
- **Soporte Técnico:** soporte@ctisoluciones.com

<div align="center">
  <sub>Construido con ❤️ por el equipo de tecnología de CTI Soluciones.</sub>
</div>
