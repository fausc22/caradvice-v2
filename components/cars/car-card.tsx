"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { FeaturedCar } from "@/lib/mock-featured-cars";
import { getCardVariant, getSoldLabelDisplay, hasOriginalPrice } from "@/lib/catalog/card-variant";
import { useFavorites } from "@/hooks";
import { cn, formatVehiclePrice } from "@/lib/utils";
import { CardImageCarousel } from "@/components/cars/card-image-carousel";

type CarCardProps = {
  car: FeaturedCar;
  className?: string;
  imageSizes?: string;
  detailHref?: string;
};

export function CarCard({
  car,
  className,
  imageSizes = "(max-width: 640px) 90vw, (max-width: 1024px) 360px, 390px",
  detailHref,
}: CarCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(car.slug);

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.slug);
  };

  const specsLine = [
    car.year,
    `${car.km.toLocaleString("es-AR")} km`,
    car.transmission,
  ].join(" · ");

  const variant = getCardVariant(car);
  const isOferta = variant === "oferta";
  const isOportunidad = variant === "oportunidad";
  const isVendido = variant === "vendido";
  const showOriginalPrice = hasOriginalPrice(car);
  const originalPriceFormatted = showOriginalPrice
    ? formatVehiclePrice(
        car.priceOriginalArs ?? 0,
        car.priceOriginalUsd ?? 0,
      )
    : "";
  const soldLabelText = getSoldLabelDisplay(car.soldLabel);

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-2xl bg-card border border-[var(--brand-gray)]/30 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-all duration-300 ease-out hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <Link
        href={detailHref ?? `/autos/${car.slug}`}
        className="relative flex flex-col flex-1 min-h-0"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
          <CardImageCarousel
            images={car.images}
            alt={`${car.title} ${car.version}`}
            imageSizes={imageSizes}
            overlay={
              isVendido ? (
                <div
                  className="absolute inset-0 z-[8] flex items-center justify-center bg-[var(--brand-black)]/50"
                  aria-hidden
                >
                  <span className="rounded-lg border-2 border-white/90 bg-[var(--brand-black)]/90 px-4 py-2 text-lg font-black uppercase tracking-wider text-white backdrop-blur sm:px-5 sm:py-2.5 sm:text-xl">
                    {soldLabelText.toUpperCase()}
                  </span>
                </div>
              ) : undefined
            }
          />

          {isOportunidad && (car.opportunityBadges?.length ?? 0) > 0 && (
            <div className="absolute left-3 top-3 z-[8] flex flex-wrap items-center gap-2">
              {car.opportunityBadges!.map((badge) => (
                <span
                  key={badge}
                  className="inline-flex rounded-full border border-white/35 bg-[var(--brand-orange)] px-2.5 py-1 text-[10px] font-bold uppercase leading-tight tracking-wide text-white shadow-sm sm:px-3 sm:py-1.5 sm:text-xs"
                >
                  {badge}
                </span>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleFavoriteToggle}
            aria-label={
              favorite
                ? `Quitar ${car.title} de favoritos`
                : `Agregar ${car.title} a favoritos`
            }
            aria-pressed={favorite}
            className={cn(
              "absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-[var(--brand-offwhite)]/95 text-[var(--brand-black)] shadow-sm backdrop-blur-sm transition-all duration-200 hover:bg-card hover:scale-105",
              favorite && "bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]",
            )}
          >
            <Heart
              className={cn("size-4", favorite && "fill-current")}
              aria-hidden
            />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <h3 className="line-clamp-2 text-base font-bold leading-tight tracking-tight text-[var(--brand-black)] sm:text-lg">
            {car.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
            {car.version}
          </p>

          <p className="mt-2 text-xs text-muted-foreground" aria-hidden>
            {specsLine}
          </p>

          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            {isOferta && showOriginalPrice && (
              <p
                className="text-base font-medium text-[var(--brand-gray)] line-through sm:text-lg"
                aria-hidden
              >
                {originalPriceFormatted}
              </p>
            )}
            <p className="text-xl font-bold tracking-tight text-[var(--brand-black)] sm:text-2xl">
              {formatVehiclePrice(car.priceArs, car.priceUsd)}
            </p>
            {isOferta && car.discountPercent != null && car.discountPercent > 0 && (
              <span
                className="inline-flex rounded-full bg-[var(--brand-orange)] px-2.5 py-0.5 text-xs font-bold text-white"
                aria-hidden
              >
                -{car.discountPercent}%
              </span>
            )}
            {isVendido && (
              <span
                className="inline-flex rounded-full border border-[var(--brand-gray)]/60 bg-[var(--brand-gray)]/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-[var(--brand-dark)]"
                aria-hidden
              >
                {soldLabelText}
              </span>
            )}
          </div>

          <span
            className={cn(
              "mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border text-sm font-semibold transition-colors duration-200",
              "border-[var(--brand-gray)]/50 bg-[var(--brand-offwhite)] text-[var(--brand-black)]",
              "group-hover:border-[var(--brand-orange)]/60 group-hover:text-[var(--brand-orange)]"
            )}
          >
            Ver detalles
          </span>
        </div>
      </Link>
    </article>
  );
}
