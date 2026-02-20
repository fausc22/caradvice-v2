"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Scale, Trash2 } from "lucide-react";
import { featuredCars } from "@/lib/mock-featured-cars";
import { useFavorites } from "@/hooks";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { formatVehiclePrice } from "@/lib/utils";

const MAX_COMPARE_VEHICLES = 5;

type FavoritesOverlayProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function useIsMobile(maxWidth = 767) {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.matchMedia(`(max-width: ${maxWidth}px)`).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    mediaQuery.addEventListener("change", onChange);

    return () => mediaQuery.removeEventListener("change", onChange);
  }, [maxWidth]);

  return isMobile;
}

function FavoritesOverlayContent({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const { favoriteSlugs, favoriteCount, removeFavorite, clearFavorites } =
    useFavorites();

  const favoriteCars = useMemo(
    () =>
      favoriteSlugs
        .map((slug) => featuredCars.find((car) => car.slug === slug))
        .filter((item): item is (typeof featuredCars)[number] => Boolean(item)),
    [favoriteSlugs],
  );
  const compareSlugs = useMemo(
    () => favoriteSlugs.slice(0, MAX_COMPARE_VEHICLES),
    [favoriteSlugs],
  );

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {favoriteCount} {favoriteCount === 1 ? "vehículo guardado" : "vehículos guardados"}
        </p>
        {favoriteCount > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Limpiar todos
          </button>
        )}
      </div>

      {favoriteCars.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--brand-gray)] bg-[var(--brand-cream)]/25 p-6 text-center">
          <Heart className="mb-3 size-8 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">
            Todavía no guardaste favoritos
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Tocá el corazón en una card y se guardará acá.
          </p>
          <Button
            asChild
            className="mt-4 h-10 rounded-xl bg-[var(--brand-orange)] px-5 text-sm font-semibold text-white hover:bg-[var(--brand-orange-light)]"
            onClick={() => onOpenChange(false)}
          >
            <Link href="/catalogo">Ir al catálogo</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex-1 space-y-3 overflow-y-auto pr-1">
            {favoriteCars.map((car) => (
              <article
                key={car.slug}
                className="flex items-center gap-3 rounded-2xl border border-[var(--brand-gray)]/40 bg-card p-3 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              >
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={car.imageSrc}
                    alt={`${car.title} ${car.version}`}
                    fill
                    sizes="112px"
                    quality={90}
                    className="object-cover object-center"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black uppercase text-[var(--brand-black)]">
                    {car.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{car.version}</p>
                  <p className="mt-2 truncate text-lg font-black text-[var(--brand-black)]">
                    {formatVehiclePrice(car.priceArs, car.priceUsd)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    asChild
                    size="sm"
                    className="h-8 rounded-lg bg-[var(--brand-orange)] px-3 text-xs text-white hover:bg-[var(--brand-orange-light)]"
                    onClick={() => onOpenChange(false)}
                  >
                    <Link href={`/autos/${car.slug}`}>Ver</Link>
                  </Button>
                  <button
                    type="button"
                    onClick={() => removeFavorite(car.slug)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                    aria-label={`Quitar ${car.title} de favoritos`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* CTA Comparar: solo con 2+ favoritos; con 1 se muestra mensaje y botón deshabilitado */}
          <div className="mt-4 border-t border-border pt-4">
            {favoriteCount >= 2 ? (
              <div className="space-y-2">
                <Button
                  asChild
                  className="h-10 w-full rounded-xl bg-[var(--brand-orange)] px-4 text-sm font-semibold text-white hover:bg-[var(--brand-orange-light)]"
                  onClick={() => onOpenChange(false)}
                >
                  <Link
                    href={`/comparar?vehiculos=${encodeURIComponent(compareSlugs.join(","))}`}
                    aria-label="Ir a comparar vehículos seleccionados"
                  >
                    <Scale className="size-4 shrink-0" aria-hidden />
                    Comparar vehículos
                  </Link>
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Compará hasta {MAX_COMPARE_VEHICLES} vehículos.
                  {favoriteCount > MAX_COMPARE_VEHICLES ? " Se usarán los primeros 5." : ""}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-center text-xs text-muted-foreground">
                  Agregá otro vehículo a favoritos para poder comparar.
                </p>
                <Button
                  disabled
                  className="h-10 w-full rounded-xl text-sm font-semibold"
                  aria-disabled="true"
                >
                  <Scale className="size-4 shrink-0" aria-hidden />
                  Comparar vehículos
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function FavoritesOverlay({ open, onOpenChange }: FavoritesOverlayProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="inset-0 h-dvh w-full max-w-none rounded-none border-0 p-4 pt-6"
        >
          <SheetHeader className="px-0 pb-2">
            <SheetTitle className="text-xl font-black uppercase tracking-tight">
              Favoritos
            </SheetTitle>
            <SheetDescription>
              Tus autos guardados en esta sesión del navegador.
            </SheetDescription>
          </SheetHeader>
          <FavoritesOverlayContent onOpenChange={onOpenChange} />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[82vh] max-w-3xl overflow-hidden rounded-2xl border-black/10 p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight">
            Favoritos
          </DialogTitle>
          <DialogDescription>
            Tus autos guardados en esta sesión del navegador.
          </DialogDescription>
        </DialogHeader>
        <FavoritesOverlayContent onOpenChange={onOpenChange} />
      </DialogContent>
    </Dialog>
  );
}
