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

type OpportunityBadgeKind = "oportunidad" | "novedad" | "destacado";

function getOpportunityBadgeClasses(kind: OpportunityBadgeKind) {
  // Colores suaves por tipo de badge
  switch (kind) {
    case "novedad":
      // Amarillo suave
      return "border border-amber-300 bg-amber-50 text-amber-800";
    case "destacado":
      // Marrón suave (alineado al gradiente del catálogo)
      return "border border-amber-400 bg-amber-100 text-[#7c2d12]";
    case "oportunidad":
    default:
      // Verde suave
      return "border border-emerald-300 bg-emerald-50 text-emerald-800";
  }
}

function getOpportunityBadgeKind(label: string): OpportunityBadgeKind {
  const normalized = label.toLowerCase();
  if (
    normalized.includes("novedad") ||
    normalized.includes("nuevo ingreso") ||
    normalized.includes("nuevo") ||
    normalized.includes("nueva")
  ) {
    return "novedad";
  }
  if (
    normalized.includes("destacado") ||
    normalized.includes("premium") ||
    normalized.includes("seleccionado")
  ) {
    return "destacado";
  }
  return "oportunidad";
}

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
  const opportunityBadges = isOportunidad
    ? (car.opportunityBadges ?? []).filter(Boolean)
    : [];
  const primaryOpportunityBadge = opportunityBadges[0];
  const extraOpportunityBadgesCount = Math.max(opportunityBadges.length - 1, 0);
  const logoMaskStyle = {
    WebkitMaskImage: 'url("/04 Iso Negro.png")',
    maskImage: 'url("/04 Iso Negro.png")',
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskSize: "contain",
    maskSize: "contain",
  } as const;

  return (
    <article
      className={cn(
        "group relative flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-card border border-[var(--brand-gray)]/30 shadow-[0_2px_12px_rgba(0,0,0,0.06)] transition-[box-shadow] duration-200 ease-out hover:shadow-[0_8px_28px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <Link
        href={detailHref ?? `/autos/${car.slug}`}
        className="group/link relative flex min-h-0 min-w-0 flex-1 flex-col"
      >
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-2xl">
          <CardImageCarousel
            images={car.images}
            alt={`${car.title} ${car.version}`}
            imageSizes={imageSizes}
            overlay={
              isVendido ? (
                <div
                  className="absolute inset-0 z-[8] flex items-center justify-center overflow-hidden"
                  aria-hidden
                >
                  <div
                    className="flex min-w-[140%] items-center justify-center bg-[var(--brand-black)]/80 py-2 shadow-lg"
                    style={{ transform: "rotate(-12deg)" }}
                  >
                    <span className="text-sm font-black uppercase tracking-[0.2em] text-red-800 sm:text-base">
                      {soldLabelText}
                    </span>
                  </div>
                </div>
              ) : undefined
            }
          />

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

        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Bloque título + versión: reserva altura para 2 líneas de título y 1 de versión */}
            <div className="min-h-[3.5rem]">
              <h3 className="line-clamp-2 text-base font-bold leading-tight tracking-tight text-[var(--brand-black)] sm:text-lg">
                {car.title}
              </h3>
              <p className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                {car.version}
              </p>
            </div>

            {/* Specs: siempre ocupa una línea de altura similar */}
            <p className="mt-1.5 min-h-[1.25rem] text-xs text-muted-foreground" aria-hidden>
              {specsLine}
            </p>

            {/* Badges: el contenedor mantiene altura aunque no haya badge */}
            <div className="mt-2 min-h-[1.5rem] flex flex-wrap items-center gap-1.5">
              {primaryOpportunityBadge && (
                <>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase leading-tight tracking-wide sm:text-[11px]",
                      getOpportunityBadgeClasses(getOpportunityBadgeKind(primaryOpportunityBadge)),
                    )}
                    aria-hidden
                  >
                    {primaryOpportunityBadge}
                  </span>
                  {extraOpportunityBadgesCount > 0 && (
                    <span
                      className="inline-flex rounded-full border border-[var(--brand-gray)]/40 bg-muted/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--brand-dark)] sm:text-[11px]"
                      aria-hidden
                    >
                      +{extraOpportunityBadgesCount} beneficio{extraOpportunityBadgesCount > 1 ? "s" : ""}
                    </span>
                  )}
                </>
              )}
            </div>

            {/* Bloque precio/oferta: tachado arriba, precio oficial + badge abajo en ofertas */}
            <div className="mt-2 flex min-h-[3.25rem] flex-col content-start gap-y-1 sm:min-h-[3.5rem]">
              {isVendido && (
                <span
                  className="inline-flex w-fit rounded-full border border-red-300 bg-red-50 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-red-800"
                  aria-hidden
                >
                  {soldLabelText}
                </span>
              )}
              {isOferta && showOriginalPrice && (
                <p
                  className="text-xs font-medium text-[var(--brand-gray)] line-through sm:text-sm"
                  aria-hidden
                >
                  {originalPriceFormatted}
                </p>
              )}
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <p
                  className={cn(
                    "text-xl font-bold tracking-tight sm:text-2xl",
                    isVendido ? "text-[var(--brand-gray)]" : "text-[var(--brand-black)]",
                  )}
                >
                  {formatVehiclePrice(car.priceArs, car.priceUsd)}
                </p>
                {isOferta &&
                  car.discountPercent != null &&
                  car.discountPercent >= 3 && (
                  <span
                    className="inline-flex rounded-full bg-[var(--brand-orange)] px-2.5 py-0.5 text-xs font-bold text-white"
                    aria-hidden
                  >
                    -{car.discountPercent}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <span
            className={cn(
              "mt-3 inline-grid h-11 min-w-0 w-full grid-cols-[1.125rem_minmax(0,1fr)_1.125rem] items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-[border-color,background-color,color,transform] duration-200 ease-out",
              "border-[var(--brand-gray)]/50 bg-[var(--brand-offwhite)] text-[var(--brand-black)] shadow-[inset_0_-1px_0_rgba(0,0,0,0.04)]",
              "group-hover:border-[var(--brand-orange)]/55 group-hover:bg-[var(--brand-orange)]/8 group-hover:text-[var(--brand-orange)]",
              "group-active/link:border-[var(--brand-orange)]/60 group-active/link:bg-[var(--brand-orange)]/10 group-active/link:text-[var(--brand-orange)]"
            )}
          >
            <span
              className="h-[18px] w-[18px] shrink-0 bg-[var(--brand-orange)] transition-transform duration-200 ease-out group-hover:scale-[1.03] group-active/link:scale-100"
              style={logoMaskStyle}
              aria-hidden
            />
            <span className="min-w-0 truncate text-center">Explorar vehículo</span>
            <span
              className="h-[18px] w-[18px] justify-self-end bg-[var(--brand-orange)] transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-active/link:translate-x-0"
              style={logoMaskStyle}
              aria-hidden
            />
          </span>
        </div>
      </Link>
    </article>
  );
}
