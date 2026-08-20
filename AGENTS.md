# Protocolo de Desarrollo y Arquitectura — ELEVATE INTRANET B2B

## 1. Perfil del Proyecto y Liderazgo Técnico
- **Nombre:** Elevate
- **Líder Técnico:** Carlos Gómez (DevOps, Cloud Infrastructure, Backend & Databases)
- **Asistencia & Copiloto:** Antigravity (UI/UX, Arquitectura de Información, Accesibilidad WCAG 2.2 AA, Gobernanza)
- **Metodología:** Spec-Driven Development (SDD) con **OpenSpec** (`openspec/`)

---

## 2. Stack Tecnológico
- **Frontend & Server Components:** Next.js 16 (App Router), React 19, TypeScript
- **Estilos & UI:** Tailwind CSS v4, Lucide React, Shadcn UI base-nova
- **Diseño:** macOS Dock Navigation Sidebar, Dark Mode azul profundo + cyan, Glassmorphism
- **Backend & Base de Datos:** Supabase (Auth SSR con HttpOnly cookies, Realtime WebSockets, Storage, PostgreSQL con RLS)
- **Seguridad:** Zero-Trust, RBAC de 6 niveles (`super_admin`, `admin`, `hr_manager`, `manager`, `team_lead`, `employee`)

---

## 3. Estructura del Código
```
src/
├── app/
│   ├── (auth)/login/        # Rutas de autenticación sin sidebar
│   ├── (intranet)/          # Rutas protegidas con DockSidebar + TopBar
│   │   ├── dashboard/
│   │   ├── directory/
│   │   ├── settings/
│   │   └── report/
│   ├── globals.css          # Design system y tokens
│   ├── layout.tsx           # Root layout con Inter font y skip link
│   └── page.tsx             # Landing pública modularizada
├── components/
│   ├── landing/             # Header, Hero, Services, About, Contact, Footer
│   ├── layout/              # DockSidebar, TopBar, UserMenu
│   └── shared/              # Avatar, Badge, SearchBar, EmptyState
├── hooks/                   # useUser, usePermissions
└── lib/
    ├── config.ts            # Branding y metadatos
    ├── constants.ts         # Roles y navegación Dock
    ├── types.ts             # Interfaces TypeScript
    └── supabase/schema/     # Migraciones numeradas (001_core.sql ...)
```

---

## 4. Reglas Estrictas de Accesibilidad y Código
- **WCAG 2.2 AA:** Contraste mínimo 4.5:1, foco visual de alto contraste (`focus-visible-ring`), navegabilidad completa por teclado (`Tab`, `Shift+Tab`, `Esc`), roles y estados ARIA (`aria-live`, `role="alert"`).
- **Semántica HTML5:** Uso mandatorio de `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`.
- **Modularización:** Prohibidos los archivos monolíticos en páginas (`page.tsx` < 50 líneas, componentes divididos en subdirectorios).
- **OpenSpec:** Todo cambio en requerimientos debe documentarse en `openspec/changes/`.
