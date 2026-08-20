# 🚀 Elevate — Intranet Corporativa Empresarial B2B

> **Plataforma integral de gestión digital, gobernanza del conocimiento y orquestación de la comunicación interna para organizaciones de 200+ colaboradores.**

---

## 🏛️ Fundamento Organizacional & Dinámica Sociotécnica

El escalamiento de una organización hasta alcanzar los 200 colaboradores representa un punto de inflexión estructural. Al superar la barrera de los 150 individuos (**Límite de Dunbar**), la capacidad de mantener vínculos directos espontáneos se satura. Para una plantilla de $n = 200$, la red teórica de comunicación bilateral asciende a:

$$r = \frac{n(n - 1)}{2} = \frac{200 \times 199}{2} = 19,900 \text{ canales posibles}$$

**Elevate** transforma esta dispersión en eficiencia operativa: neutraliza los silos funcionales, erradica la saturación por correos masivos indiscriminados y establece una **única fuente canónica de verdad institucional** con gobernanza rigurosa y agilidad cultural.

---

## 💻 Stack Tecnológico de Última Generación

| Capa | Tecnología | Versión | Propósito |
|---|---|---|---|
| **Framework** | [Next.js (App Router)](https://nextjs.org/) | 16.2.x (Turbopack) | Server Components (RSC), Server Actions y Server-Side Rendering |
| **Biblioteca UI** | [React](https://react.dev/) | 19.2.x | Interfaces concurrentes, hooks modernos y renderizado optimizado |
| **Lenguaje** | [TypeScript](https://www.typescriptlang.org/) | ^5.0 (Strict Mode) | Tipado estricto de datos, interfaces y contratos de API |
| **Estilos & Animaciones** | [Tailwind CSS v4](https://tailwindcss.com/) + `@tailwindcss/animate` | v4.x | Design tokens, glassmorphism, micro-animaciones y alto rendimiento CSS |
| **Componentes & Accesibilidad** | [Shadcn UI](https://ui.shadcn.com/) (base-nova) + [Lucide React](https://lucide.dev/) | ^4.16.x / ^1.28.x | Primitivos accesibles WCAG 2.2 AA y set completo de iconografía |
| **Backend & Base de Datos** | [Supabase SSR](https://supabase.com/) | ^2.111.x | PostgreSQL, Row Level Security (RLS), Auth SSR con cookies HttpOnly y Storage |
| **Metodología de Desarrollo** | [OpenSpec](https://openspec.dev/) | SDD | Spec-Driven Development con propuestas, deltas de specs y tareas verificables |

---

## 🎨 Características de Diseño & Accesibilidad

- **Identidad Visual:** Dark mode de alto impacto en tonos azul profundo (`#030712`, `#0f172a`) y acentos cyan vibrante (`#06b6d4`, `#38bdf8`), con superficies translúcidas (*glassmorphism*) y orbs de iluminación ambiental.
- **macOS Dock Navigation Sidebar:** Barra de navegación vertical con efecto de expansión en hover, tooltip flotante contextual, badge de notificaciones e indicador visual de ruta activa.
- **Accesibilidad Estricta (WCAG 2.2 AA):**
  - Contraste visual mínimo de 4.5:1 en todos los textos y badges.
  - Anillo de enfoque de alto contraste (`focus-visible:ring-2 focus-visible:ring-cyan-400`).
  - Navegabilidad completa por teclado (`Tab`, `Shift+Tab`, `Esc`, `Enter`).
  - Atributos semánticos ARIA (`role="status"`, `aria-live="polite"`, `role="separator"`).
  - Enlaces de salto al contenido principal (*Skip Links*).

---

## 🌟 Matriz de Capacidades y Módulos Funcionales

### 1. 📢 Comunicaciones Corporativas & Segmentación Inteligente
- **Micro-Targeting de Audiencias:** Difusión segmentada por departamentos, roles y jerarquías operativas para eliminar la fatiga por correo masivo.
- **Acuse de Recibo Obligatorio (*Read Receipts*):** Confirmación interactiva de lectura para comunicados críticos, con contador en tiempo real de colaboradores confirmados.
- **Priorización & Fijado:** Etiquetas de prioridad (`urgent`, `high`, `normal`, `low`) y avisos fijados con distintivos de advertencia.
- **Micro-Videos Institucionales:** Soporte para cápsulas multimedia breves (<90s) para humanizar la comunicación directiva.

### 2. 👥 Directorio de Talento, Competencias & Organigrama Dinámico
- **Organigrama Interactivo en Tiempo Real:** Visualización jerárquica en árbol de directores, gerentes, líderes de equipo y reportes directos.
- **Motor de Búsqueda por Habilidades (*Skill-Tagging*):** Búsqueda instantánea de colaboradores por competencias técnicas (`#AWS`, `#Next.js`, `#CONTPAQi`, `#ISO27001`).
- **Fichas de Perfil Profesional:** Información de contacto directa (`tel:`, `mailto:`), departamento, certificaciones oficiales y recuento de reportes directos.

### 3. 📚 Repositorio de Conocimiento & Gobernanza (Norma 90 Días)
- **Base Centralizada de SOPs & Normativas:** Procedimientos estándar, manuales de cumplimiento LFPDPPP y guías técnicas departamentales.
- **Ciclo de Vida & Frescura Documental:** Detección y alertas automáticas de caducidad cada 90 días para evitar ejecución con normativas obsoletas.
- **Control de Versiones & Propietarios:** Asignación estricta de propietario por documento, histórico de cambios y versiones (`v1.0`, `v2.1`).
- **Búsqueda Semántica:** Indexación mediante PostgreSQL Full-Text Search (`tsvector`) y filtros facetados por etiquetas y categoría.

### 4. 🗂️ Project Hubs & Colaboración Cruzada
- **Espacios de Trabajo Multidisciplinarios:** Alineación entre áreas (ej. Tecnología + Finanzas + Operaciones) para neutralizar silos.
- **Seguimiento de Hitos & Roadmaps:** Porcentaje de avance de proyecto y fechas límite en barras de progreso dinámicas.
- **Actas de Acuerdos Interdepartamentales:** Registro de compromisos clave, responsables y fechas de entrega.

### 5. 🏆 Muro de Reconocimiento (Kudos) & Inducción (Onboarding)
- **Peer-to-Peer Kudos:** Reconocimiento público entre pares asociado a valores corporativos (*Innovación*, *Colaboración*, *Excelencia*, *Compromiso*, *Liderazgo*, *Integridad*).
- **Itinerario de Inducción Guiado (Onboarding Journey):** Checklist automatizado para días 1, 7 y 30 con asignación de mentor (*Buddy System*) y objetivo de activación en $< 48\text{h}$.
- **Celebración de Hitos:** Detección automática y felicitación de aniversarios de servicio y promociones internas.

### 6. 📊 Dashboard Ejecutivo & Métricas de Adopción
- **Salud Sociotécnica y KPIs en Tiempo Real:**
  - **Usuarios Activos Semanales (WAU):** Meta $\ge 75\% - 80\%$ (Monitoreo de 200 colaboradores).
  - **Índice de Adherencia (Stickiness DAU/MAU):** Meta $\ge 60\%$.
  - **Efectividad de Búsqueda:** Meta $\ge 85\%$ de clics en primeros resultados.
  - **Frescura Documental (90 Días):** Meta $\ge 70\%$ de repositorio vigente.
  - **SLA de Activación Onboarding:** Meta $< 48\text{ horas}$.
- **Widgets Operativos:** Resumen de solicitudes pendientes, checador de asistencia, actividad reciente y accesos directos.

### 7. 🔒 Autenticación, Seguridad & Modo Demostración
- **Aislamiento Multi-Tenant:** Columna `org_id` en todas las tablas con políticas RLS basadas en `get_user_org_id()`.
- **RBAC de 6 Niveles:** `super_admin` > `admin` > `hr_manager` > `manager` > `team_lead` > `employee`.
- **Modo Demo Controlado (`NEXT_PUBLIC_DEMO_MODE`):** Capacidad de presentación y navegación offline con perfil simulado y banner de advertencia accesible sin comprometer la seguridad en producción.

---

## 📂 Estructura del Proyecto

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                  # Layout centrado glassmorphism para login
│   │   └── login/
│   │       ├── actions.ts              # Server Actions (loginAction, signupAction, signOutAction)
│   │       └── page.tsx                # Pantalla de acceso / registro con toggle
│   ├── (intranet)/                     # Rutas protegidas (con DockSidebar + TopBar + DemoBanner)
│   │   ├── layout.tsx                  # Layout con orbs ambientales y verificación de sesión
│   │   ├── dashboard/page.tsx          # Dashboard modular con KPIs de gobernanza y Kudos
│   │   ├── directory/page.tsx          # Directorio con switch de Fichas / Organigrama
│   │   ├── files/page.tsx              # Repositorio de conocimiento y gobernanza 90 días
│   │   ├── projects/page.tsx           # Project Hubs de colaboración transversal
│   │   ├── chat/                       # Chat en tiempo real por canales y DMs
│   │   ├── requests/                   # Flujos de aprobación de solicitudes
│   │   ├── attendance/                 # Control de asistencias y checador
│   │   ├── payroll/                    # Recibos de nómina (PDF/XML)
│   │   ├── announcements/page.tsx      # Comunicados con Acuse de Recibo
│   │   ├── notifications/page.tsx      # Centro de notificaciones
│   │   ├── settings/page.tsx           # Configuración de perfil y preferencias
│   │   └── report/page.tsx             # Buzón de incidencias y reportes
│   ├── globals.css                     # Tokens de diseño, animaciones y glassmorphism
│   ├── layout.tsx                      # Root layout con Inter font y skip link
│   └── page.tsx                        # Landing page pública modularizada
├── components/
│   ├── auth/                           # LoginHeader, LoginForm, LoginAlerts, LoginToggle
│   ├── intranet/
│   │   ├── announcements/              # AnnouncementsList, ReadReceiptButton, Filters
│   │   ├── dashboard/                  # GovernanceKPIs, CultureKudosFeed, OnboardingMilestoneCard, KPIGrid...
│   │   ├── directory/                  # DirectoryGrid, OrgChartTree, DirectoryFilters...
│   │   ├── files/                      # KnowledgeGovernanceBanner, RecentFilesTable, FoldersSection...
│   │   ├── projects/                   # ProjectHubCard, ProjectsHeader...
│   │   ├── attendance/                 # LiveClockWidget, AttendanceHistoryTable, KpiCard...
│   │   ├── payroll/                    # LatestReceiptCard, HistoricalPayrollTable, PayrollBreakdown...
│   │   ├── requests/                   # RequestList, RequestFilters, NewRequestModal...
│   │   ├── settings/                   # SettingsForm, SettingsProfileCard, SettingsSuccess...
│   │   └── report/                     # ReportForm, ReportSuccess, ReportHeader...
│   ├── landing/                        # Header, Hero, Services, About, Contact, Footer
│   ├── layout/                         # DockSidebar, TopBar, UserMenu, DemoModeBanner
│   └── shared/                         # Avatar, Badge, SearchBar, EmptyState
├── hooks/                              # useUser, usePermissions, useChat, useNotifications, useRealtime
└── lib/
    ├── config.ts                       # Metadatos del portal y branding
    ├── constants.ts                    # Roles RBAC y rutas del macOS Dock
    ├── demo.ts                         # Helper de modo demostración y perfil sintético
    ├── types.ts                        # Interfaces TypeScript del sistema
    └── supabase/
        ├── client.ts                   # Cliente Supabase para Browser Components
        ├── server.ts                   # Cliente Supabase SSR para Server Components y Actions
        ├── middleware.ts               # Protección de rutas y refresh de cookies JWT
        └── schema/                     # Migraciones SQL numeradas
            ├── 001_core.sql            # Organizaciones, Departamentos, Perfiles y RLS
            ├── 002_chat.sql            # Canales, Mensajes, Hilos y Reacciones
            ├── 003_workflows.sql       # Cadenas de Aprobación y Solicitudes
            ├── 004_attendance.sql      # Registros de Asistencia e Importaciones
            ├── 005_payroll.sql         # Recibos de Nómina y Conectores CONTPAQi
            ├── 007_notifications.sql   # Comunicados y Centro de Alertas
            ├── 009_seed.sql            # Datos Semilla Idempotentes (20 colaboradores, 4 deptos)
            └── 010_enterprise_scale.sql# Escalamiento 200 Empleados (Kudos, SOPs 90d, Acuse)
```

---

## 🗄️ Esquema de Base de Datos (Migraciones SQL)

Las migraciones están diseñadas de forma modular y numerada en `src/lib/supabase/schema/`:

1. **`001_core.sql`**: Extensión UUID, tablas `organizations`, `departments` (jerárquicos con `head_user_id`), `profiles`, `teams`, `bug_reports` y funciones de seguridad RLS (`get_user_org_id()`, `get_user_role()`, `get_user_department_id()`).
2. **`002_chat.sql`**: Canales de chat (`public`, `private`, `dm`), membresías, mensajes con soporte de hilos (`parent_message_id`), reacciones y archivos adjuntos.
3. **`003_workflows.sql`**: Tipos de solicitud configurables, cadenas de aprobación multi-paso, solicitudes con máquina de estados y decisiones por aprobador.
4. **`004_attendance.sql`**: Checadas web/biométricas con estados (`on_time`, `late`, `absent`, `justified`) e importación de lotes CSV/Excel.
5. **`005_payroll.sql`**: Recibos de nómina timbrados con URLs de PDF y XML (CFDI 4.0) y tabla de integraciones externas (CONTPAQi, NOI).
6. **`007_notifications.sql`**: Comunicados institucionales con `target_departments[]` y notificaciones en tiempo real con URL de acción.
7. **`009_seed.sql`**: Carga de datos iniciales con la organización *"Elevate Enterprise Solutions"*, 4 departamentos, perfiles para los 6 roles y comunicados iniciales.
8. **`010_enterprise_scale.sql`**: Tablas para `knowledge_articles` con ciclo de 90 días, `document_revisions`, `announcement_read_receipts` (*Acuse de Recibo*), `peer_kudos`, `onboarding_journeys`, `project_hubs` e índices de búsqueda Full-Text/GIN.

---

## 🚀 Guía de Puesta en Marcha Local

### 1. Requisitos Previos
- **Node.js:** Versión 18.18+ o 20+ recomendada.
- **Gestor de paquetes:** `npm` (o `pnpm` / `yarn`).
- **Proyecto Supabase:** Cuenta activa en [supabase.com](https://supabase.com/).

### 2. Clonar el Repositorio e Instalar Dependencias
```bash
git clone https://github.com/carlosgomezc7/intranet.git
cd intranet
npm install
```

### 3. Configuración de Variables de Entorno
Copia el archivo de plantilla a tu entorno local:
```bash
cp .env.local.example .env.local
```

Configura tus credenciales en `.env.local`:
```env
# Supabase Credentials
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Modo Demo (Opcional - habilita acceso offline y datos simulados para presentaciones)
NEXT_PUBLIC_DEMO_MODE=false
```

### 4. Ejecución de Migraciones de Base de Datos
En el **SQL Editor** de tu panel de control de Supabase, ejecuta secuencialmente los scripts ubicados en `src/lib/supabase/schema/`:
- `001_core.sql`
- `002_chat.sql`
- `003_workflows.sql`
- `004_attendance.sql`
- `005_payroll.sql`
- `007_notifications.sql`
- `009_seed.sql` *(Opcional: carga colaboradores y departamentos de ejemplo)*
- `010_enterprise_scale.sql`

### 5. Iniciar el Servidor de Desarrollo
```bash
npm run dev
```
Abre tu navegador en [http://localhost:3000](http://localhost:3000).

---

## 🧪 Comandos Útiles

```bash
# Iniciar servidor de desarrollo en Turbopack
npm run dev

# Compilar proyecto para producción (TypeScript + Linting)
npm run build

# Iniciar servidor de producción local
npm run start

# Validar especificaciones con OpenSpec CLI
npx openspec validate --all
```

---

## 👥 Equipo & Liderazgo Técnico

- **Líder Técnico & Cloud Architecture:** Carlos Gómez (*DevOps, Cloud Infrastructure, Backend & Databases*)
- **Asistencia & Copiloto:** Antigravity (*UI/UX, Arquitectura de Información, Accesibilidad WCAG 2.2 AA, OpenSpec Governance*)
- **Organización:** Elevate Enterprise Solutions

---

*Desarrollado con altos estándares de ingeniería, accesibilidad universal y arquitectura escalable.*
