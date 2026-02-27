"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useFavorites } from "@/hooks";
import { Button } from "@/components/ui/button";
import { cn, formatVehiclePrice } from "@/lib/utils";

type AutoDetailActionsProps = {
  slug: string;
  priceArs: number;
  priceUsd: number;
  whatsappHref: string;
  reserveHref: string;
  viewingNow: number;
};

export function AutoDetailActions({
  slug,
  priceArs,
  priceUsd,
  whatsappHref,
  reserveHref,
  viewingNow,
}: AutoDetailActionsProps) {
  const priceLabel = formatVehiclePrice(priceArs, priceUsd);
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
              : "border-border bg-card text-[var(--brand-black)] hover:border-[var(--brand-orange)]/50",
          )}
        >
          <Heart className={cn("size-4", favorite && "fill-current")} aria-hidden />
          Favorito
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <Button asChild className="h-11 rounded-xl bg-[var(--whatsapp-green)] text-sm text-white hover:bg-[var(--whatsapp-green-hover)]">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className="size-4" aria-hidden />
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
          "fixed left-0 right-0 bottom-0 z-40 border-t border-[var(--brand-gray)]/40 bg-card shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out sm:hidden",
          "pt-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] px-3",
          showStickyBar ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto flex min-h-[3.5rem] w-full max-w-screen-xl items-center gap-1.5">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Precio final</p>
            <p className="truncate text-sm font-black text-[var(--brand-black)]">
              {priceLabel}
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
            className="inline-flex h-10 min-w-[2.5rem] items-center justify-center gap-1.5 rounded-lg bg-[var(--whatsapp-green)] px-2.5 text-[11px] font-semibold text-white hover:bg-[var(--whatsapp-green-hover)]"
          >
            <WhatsAppIcon className="size-3.5 shrink-0" aria-hidden />
            WhatsApp
          </a>
        </div>
      </div>
    </>
  );
}
