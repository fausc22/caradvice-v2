import { cn } from "@/lib/utils";

/**
 * Skeleton de tarjeta de auto. Misma estructura visual que CarCard
 * para usarse en loading del catálogo y carruseles.
 */
export function CarCardSkeleton({ className }: { className?: string }) {
  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--brand-gray)]/30 bg-card shadow-[0_2px_12px_rgba(0,0,0,0.06)]",
        className,
      )}
    >
      <div className="relative flex flex-1 flex-col min-h-0">
        <div className="aspect-[16/10] w-full animate-pulse bg-muted/50" />
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <div className="h-5 w-3/4 animate-pulse rounded bg-muted/60" />
          <div className="mt-2 h-4 w-1/2 animate-pulse rounded bg-muted/50" />
          <div className="mt-2 h-3 w-full max-w-[180px] animate-pulse rounded bg-muted/40" />
          <div className="mt-4 h-7 w-1/3 animate-pulse rounded bg-muted/60" />
          <div className="mt-4 h-11 w-full animate-pulse rounded-xl bg-muted/50" />
        </div>
      </div>
    </article>
  );
}
