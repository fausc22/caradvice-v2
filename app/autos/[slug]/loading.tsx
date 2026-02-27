/**
 * Skeleton de la ficha de auto. Misma estructura que la página de detalle:
 * breadcrumb, galería + datos, especificaciones, similares.
 */
export default function AutoDetailLoading() {
  return (
    <main
      className="mx-auto w-full max-w-screen-xl px-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pt-6 sm:px-6 sm:pt-8 lg:pb-10"
      aria-busy="true"
      aria-label="Cargando detalle del vehículo"
    >
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
        <div className="h-4 w-12 animate-pulse rounded bg-muted/50" />
        <span aria-hidden>/</span>
        <div className="h-4 w-16 animate-pulse rounded bg-muted/50" />
        <span aria-hidden>/</span>
        <div className="h-4 w-24 animate-pulse rounded bg-muted/60" />
      </div>
      <div className="mb-5 flex items-center gap-2">
        <div className="size-4 animate-pulse rounded bg-muted/50" />
        <div className="h-4 w-32 animate-pulse rounded bg-muted/50" />
      </div>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        {/* Galería skeleton */}
        <article className="overflow-hidden rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-3 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-muted/40">
            <div className="absolute inset-0 animate-pulse bg-muted/50" />
          </div>
          <div className="mt-3 flex gap-2 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[4/3] w-[72px] shrink-0 animate-pulse rounded-lg bg-muted/40 sm:w-[88px]"
              />
            ))}
          </div>
        </article>

        {/* Card datos skeleton */}
        <article className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-6">
          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded bg-muted/50" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-muted/60 sm:h-9" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-muted/40" />
          </div>
          <div className="mt-5 flex flex-wrap gap-2.5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-9 w-20 animate-pulse rounded-full bg-muted/40" />
            ))}
          </div>
          <div className="mt-6 space-y-2 rounded-2xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-4">
            <div className="h-4 w-20 animate-pulse rounded bg-muted/50" />
            <div className="h-10 w-2/3 animate-pulse rounded bg-muted/60" />
            <div className="h-3 w-full max-w-[200px] animate-pulse rounded bg-muted/40" />
          </div>
          <div className="mt-5 rounded-2xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-4">
            <div className="h-3 w-36 animate-pulse rounded bg-muted/50" />
            <div className="mt-3 flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-6 w-16 animate-pulse rounded-full bg-muted/40" />
              ))}
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
            <div className="h-4 w-40 animate-pulse rounded bg-muted/40" />
            <div className="h-10 w-24 animate-pulse rounded-full bg-muted/40" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <div className="h-11 animate-pulse rounded-xl bg-muted/50" />
            <div className="h-11 animate-pulse rounded-xl bg-muted/40" />
          </div>
          <div className="mt-3 h-4 w-32 animate-pulse rounded bg-muted/30" />
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="h-6 w-48 animate-pulse rounded bg-muted/60 sm:h-7" />
              <div className="mt-1 h-4 w-64 animate-pulse rounded bg-muted/40" />
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-3"
              >
                <div className="h-3 w-24 animate-pulse rounded bg-muted/50" />
                <div className="mt-1 h-4 w-20 animate-pulse rounded bg-muted/40" />
              </div>
            ))}
          </div>
        </article>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="h-6 w-32 animate-pulse rounded bg-muted/60" />
          <div className="mt-3 space-y-3">
            <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
            <div className="h-10 w-full animate-pulse rounded-xl bg-muted/40" />
            <div className="h-24 animate-pulse rounded-xl bg-muted/30" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted/50" />
          </div>
        </aside>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <article
            key={i}
            className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6"
          >
            <div className="flex items-center gap-2">
              <div className="size-5 animate-pulse rounded bg-muted/50" />
              <div className="h-5 w-40 animate-pulse rounded bg-muted/60" />
            </div>
            <div className="mt-1 h-4 w-56 animate-pulse rounded bg-muted/40" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[1, 2, 3, 4].map((j) => (
                <div key={j} className="h-11 animate-pulse rounded-lg bg-muted/40" />
              ))}
            </div>
            <div className="mt-4 h-20 animate-pulse rounded-2xl bg-muted/30" />
            <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-muted/50" />
          </article>
        ))}
      </section>

      <section className="mt-8 rounded-3xl border border-border bg-background p-4 sm:p-6">
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <div className="h-7 w-56 animate-pulse rounded bg-muted/60 sm:h-8" />
            <div className="mt-1 h-4 w-72 animate-pulse rounded bg-muted/40" />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <article
              key={i}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-gray)]/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
            >
              <div className="aspect-[16/10] w-full animate-pulse bg-muted/50" />
              <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="h-5 w-3/4 animate-pulse rounded bg-muted/60" />
                <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted/50" />
                <div className="mt-2 h-3 w-full max-w-[180px] animate-pulse rounded bg-muted/40" />
                <div className="mt-4 h-7 w-1/3 animate-pulse rounded bg-muted/60" />
                <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-muted/50" />
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
