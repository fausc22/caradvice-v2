"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Heart } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { useFavorites } from "@/hooks";
import { Button } from "@/components/ui/button";
import { cn, formatVehiclePrice } from "@/lib/utils";

const PLAN_SECTION_ID = "armatuplan";
const PLAN_FOCUS_ID = "plan-nombre";

function scrollToPlanAndFocus() {
  const el = document.getElementById(PLAN_SECTION_ID);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    document.getElementById(PLAN_FOCUS_ID)?.focus();
  }, 450);
}

type AutoDetailActionsProps = {
  slug: string;
  priceArs: number;
  priceUsd: number;
  /** Solo para unidades vendidas: WhatsApp directo a alternativas */
  whatsappHref?: string;
  viewingNow: number;
  isSold?: boolean;
};

export function AutoDetailActions({
  slug,
  priceArs,
  priceUsd,
  whatsappHref,
  viewingNow,
  isSold = false,
}: AutoDetailActionsProps) {
  const priceLabel = formatVehiclePrice(priceArs, priceUsd);
  const { isFavorite, toggleFavorite, isHydrated } = useFavorites();
  const [showStickyBar, setShowStickyBar] = useState(false);
  const favorite = isFavorite(slug);
  const demandLabel = isSold
    ? viewingNow >= 12
      ? "Modelo muy buscado"
      : "Interés por este modelo"
    : viewingNow >= 12
      ? "Alta demanda"
      : viewingNow >= 8
        ? "Interés activo"
        : "Consultas activas";

  const onConsultarWhatsApp = useCallback(() => {
    scrollToPlanAndFocus();
  }, []);

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
      {!isSold && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2.5">
          <p
            className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--brand-black)] sm:text-sm"
            aria-live="polite"
          >
            <span
              className="relative flex size-2.5 items-center justify-center"
              aria-hidden
            >
              <span className="absolute inline-flex size-2.5 animate-ping rounded-full bg-[var(--brand-orange)]/45" />
              <span className="relative inline-flex size-1.5 rounded-full bg-[var(--brand-orange)]" />
            </span>
            <Eye className="size-3.5 text-[var(--brand-orange)] sm:size-4" aria-hidden />
            {demandLabel}: {viewingNow} personas mirando ahora
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
      )}

      <div className={cn("mt-4", !isSold ? "" : "mt-5")}>
        {isSold && whatsappHref ? (
          <Button
            asChild
            className="h-11 w-full rounded-xl bg-[var(--whatsapp-green)] text-sm text-white hover:bg-[var(--whatsapp-green-hover)]"
          >
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="size-4" aria-hidden />
              Quiero alternativas por WhatsApp
            </a>
          </Button>
        ) : (
          <Button
            type="button"
            onClick={onConsultarWhatsApp}
            className="h-11 w-full rounded-xl bg-[var(--whatsapp-green)] text-sm text-white hover:bg-[var(--whatsapp-green-hover)]"
          >
            <WhatsAppIcon className="size-4" aria-hidden />
            Consultar por WhatsApp
          </Button>
        )}
      </div>
      {!isSold && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Te llevamos al formulario para completar anticipo, plazo y contacto.
        </p>
      )}

      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--brand-gray)]/40 bg-card shadow-[0_-8px_24px_rgba(0,0,0,0.08)] transition-transform duration-300 ease-out sm:hidden",
          "px-3 pt-3 pb-[max(env(safe-area-inset-bottom),0.5rem)]",
          showStickyBar ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="mx-auto flex min-h-[3.5rem] w-full max-w-screen-xl items-center gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {isSold ? "Precio de referencia" : "Precio final"}
            </p>
            <p className="truncate text-sm font-black text-[var(--brand-black)]">
              {priceLabel}
            </p>
          </div>
          {isSold && whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 min-w-[2.5rem] shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--whatsapp-green)] px-2.5 text-[11px] font-semibold text-white hover:bg-[var(--whatsapp-green-hover)]"
            >
              <WhatsAppIcon className="size-3.5 shrink-0" aria-hidden />
              WhatsApp
            </a>
          ) : (
            <button
              type="button"
              onClick={onConsultarWhatsApp}
              className="inline-flex h-10 min-w-0 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--whatsapp-green)] px-3 text-[11px] font-semibold text-white hover:bg-[var(--whatsapp-green-hover)]"
            >
              <WhatsAppIcon className="size-3.5 shrink-0" aria-hidden />
              Completar plan
            </button>
          )}
        </div>
      </div>
    </>
  );
}
