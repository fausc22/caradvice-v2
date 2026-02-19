"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Heart, MessageCircle } from "lucide-react";
import { useFavorites } from "@/hooks";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AutoDetailActionsProps = {
  slug: string;
  priceArs: number;
  whatsappHref: string;
  reserveHref: string;
  viewingNow: number;
};

const formatCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function AutoDetailActions({
  slug,
  priceArs,
  whatsappHref,
  reserveHref,
  viewingNow,
}: AutoDetailActionsProps) {
  const { isFavorite, toggleFavorite, isHydrated } = useFavorites();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const favorite = isFavorite(slug);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 260);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const favoriteLabel = useMemo(() => {
    if (!isHydrated) return "Cargando favoritos";
    return favorite ? "Quitar de favoritos" : "Guardar en favoritos";
  }, [favorite, isHydrated]);

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
        <p className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Eye className="size-4 text-[var(--brand-orange)]" aria-hidden />
          {viewingNow} personas viendo este auto
        </p>
        <button
          type="button"
          onClick={() => toggleFavorite(slug)}
          aria-label={favoriteLabel}
          aria-pressed={favorite}
          className={cn(
            "inline-flex h-10 items-center gap-2 rounded-full border px-3 text-xs font-semibold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2",
            favorite
              ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]"
              : "border-border bg-white text-[var(--brand-black)] hover:border-[var(--brand-orange)]/50",
          )}
        >
          <Heart className={cn("size-4", favorite && "fill-current")} aria-hidden />
          Favorito
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Button asChild className="h-11 rounded-xl bg-emerald-600 text-sm text-white hover:bg-emerald-500">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden />
            Consultar por WhatsApp
          </a>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-xl text-sm">
          <a href={reserveHref} target="_blank" rel="noopener noreferrer">
            Reservar ahora
          </a>
        </Button>
      </div>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] pt-3 shadow-[0_-8px_24px_rgba(0,0,0,0.08)] backdrop-blur transition-transform duration-300 sm:hidden",
          showStickyBar ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto flex w-full max-w-screen-xl items-center gap-1.5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Precio final</p>
            <p className="truncate text-sm font-black text-[var(--brand-black)]">
              {formatCurrency.format(priceArs)}
            </p>
          </div>
          <a
            href={reserveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-lg border border-black/15 px-2.5 text-[11px] font-semibold text-[var(--brand-black)]"
          >
            Reservar
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center justify-center rounded-lg bg-emerald-600 px-2.5 text-[11px] font-semibold text-white"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
