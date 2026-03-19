import { cn } from "@/lib/utils";

/**
 * Skeleton de tarjeta de auto. Alineado a CarCard compacta (catálogo / carruseles).
 */
export function CarCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-gray)]/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="aspect-[16/10] w-full animate-pulse bg-muted/50" />
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <div className="flex flex-1 flex-col">
            <div className="h-[2.125rem] w-3/4 animate-pulse rounded bg-muted/60" />
            <div className="mt-1 h-3.5 w-1/2 animate-pulse rounded bg-muted/50" />
            <div className="mt-1 h-3 w-full max-w-[160px] animate-pulse rounded bg-muted/40" />
            <div className="mt-2 space-y-1">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted/60" />
              <div className="h-6 w-2/3 animate-pulse rounded bg-muted/60" />
            </div>
          </div>
          <div className="mt-2 h-9 w-full animate-pulse rounded-lg bg-muted/50 sm:h-10" />
        </div>
      </div>
    </article>
  );
}
