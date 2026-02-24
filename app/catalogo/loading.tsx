import { CarCardSkeleton } from "@/components/cars/car-card-skeleton";

/**
 * Skeleton del catálogo mientras se resuelve la página.
 * Misma estructura que CatalogPageShell: header + área de contenido + grid.
 */
export default function CatalogLoading() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden lg:pl-0 lg:pr-4" aria-busy="true" aria-label="Cargando catálogo">
      <section
        className="flex w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#c2410c] to-[#7c2d12] py-12 sm:gap-5 sm:py-16 md:flex-row md:gap-6"
        aria-hidden
      >
        <div className="relative h-14 w-14 shrink-0 rounded-lg bg-white/20 sm:h-16 sm:w-16 md:h-[4.5rem] md:w-[4.5rem]" />
        <h1 className="text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Catálogo de Vehículos
        </h1>
      </section>

      <div className="px-4 py-4 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 sm:py-6">
        <div className="grid min-h-[calc(100vh-8rem)] gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-0">
          {/* Sidebar skeleton (solo desktop) */}
          <aside className="hidden lg:block lg:shrink-0">
            <div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-r-2xl border-y border-r border-l-2 border-l-[var(--brand-orange)]/30 border-[var(--brand-gray)]/40 bg-card py-4 pl-4 pr-3">
              <div className="flex shrink-0 items-center gap-2 border-b border-border px-2 pb-3">
                <div className="size-4 animate-pulse rounded bg-muted/60" />
                <div className="h-4 w-20 animate-pulse rounded bg-muted/50" />
              </div>
              <div className="flex flex-col gap-4 px-2 pt-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
                ))}
              </div>
            </div>
          </aside>

          <section className="flex min-h-0 flex-col lg:pl-8">
            {/* Toolbar móvil + orden */}
            <div className="mb-3 flex items-center justify-between gap-2 lg:justify-end">
              <div className="h-10 w-24 animate-pulse rounded-xl bg-muted/40 lg:hidden" />
              <div className="h-10 min-w-[150px] max-w-[58vw] animate-pulse rounded-xl bg-muted/40 sm:min-w-[200px]" />
            </div>

            {/* Búsqueda */}
            <div className="mb-3 rounded-2xl border border-[var(--brand-gray)]/40 bg-card p-3 shadow-[0_8px_24px_rgba(0,0,0,0.05)] sm:mb-4 sm:p-4">
              <div className="flex min-w-0 items-center gap-2">
                <div className="h-10 flex-1 animate-pulse rounded-xl bg-muted/40 sm:h-11" />
                <div className="h-10 w-14 animate-pulse rounded-xl bg-muted/50 sm:h-11 sm:w-20" />
              </div>
            </div>

            {/* "Mostrando X–Y de Z" */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="h-4 w-40 animate-pulse rounded bg-muted/40" />
            </div>

            {/* Grid de cards skeleton — mismo breakpoint que el catálogo real */}
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CarCardSkeleton key={i} className="h-full" />
              ))}
            </div>

            {/* Paginación skeleton */}
            <div className="mt-8 rounded-2xl border border-[var(--brand-gray)]/40 bg-card p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-24 animate-pulse rounded-lg bg-muted/40" />
                <div className="h-4 w-16 animate-pulse rounded bg-muted/40" />
                <div className="h-10 w-20 animate-pulse rounded-lg bg-muted/40" />
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
