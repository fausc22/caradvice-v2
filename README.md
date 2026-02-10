# Car Advice — Frontend

Frontend del sitio de la concesionaria **Car Advice**: catálogo de vehículos, conversión a consultas (no venta online). Enfoque **mobile-first**.

## Stack

- **Next.js 16** (App Router)
- **Tailwind CSS v4** + **shadcn/ui** (componentes)
- **clsx** + **tailwind-merge** (clases, utilidad `cn` en `@/lib/utils`)
- **Framer Motion** (animaciones, listo para usar)
- **React Hook Form** + **Zod** (formularios y validación; esquemas en `@/lib/schemas`)
- **TanStack React Query** (datos del catálogo; provider en `app/providers.tsx`, cliente en `@/lib/query-client`)
- **next/image** y **next/font** (optimización de imágenes y fuentes)

## Cómo correr

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Estructura relevante

- `app/` — Rutas y layouts (home en `/`, metadata y viewport en `layout.tsx`)
- `app/providers.tsx` — React Query y otros providers de cliente
- `components/layout/` — Header y pie (según wireframe)
- `components/ui/` — Componentes shadcn (Button, Input, Sheet, etc.)
- `lib/utils.ts` — `cn()` para clases
- `lib/query-client.ts` — Cliente de React Query
- `lib/schemas.ts` — Esquemas Zod para formularios
- `hooks/` — Hooks personalizados (vacío por ahora)

## Build

```bash
npm run build
```
