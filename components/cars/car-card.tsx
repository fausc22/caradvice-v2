"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Gauge, CalendarDays } from "lucide-react";
import type { FeaturedCar } from "@/lib/mock-featured-cars";
import { GearboxIcon } from "@/components/icons/gearbox-icon";
import { useFavorites } from "@/hooks";
import { cn } from "@/lib/utils";

type CarCardProps = {
  car: FeaturedCar;
  className?: string;
  imageSizes?: string;
  detailHref?: string;
};

const formatCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatNumber = new Intl.NumberFormat("es-AR");

export function CarCard({
  car,
  className,
  imageSizes = "(max-width: 640px) 90vw, (max-width: 1024px) 360px, 390px",
  detailHref,
}: CarCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(car.slug);

  const handleFavoriteToggle = () => {
    toggleFavorite(car.slug);
  };

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_14px_34px_rgba(0,0,0,0.12)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <Image
          src={car.imageSrc}
          alt={`${car.title} ${car.version}`}
          fill
          sizes={imageSizes}
          quality={95}
          className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
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
            "absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-black/10 bg-white/90 text-[var(--brand-black)] backdrop-blur transition-all hover:bg-white",
            favorite && "border-[var(--brand-orange)] text-[var(--brand-orange)]",
          )}
        >
          <Heart className={cn("size-5", favorite && "fill-current")} aria-hidden />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="min-h-12 space-y-1">
          <h3 className="line-clamp-2 text-base font-black uppercase leading-tight tracking-tight text-[var(--brand-black)] sm:line-clamp-1 sm:text-lg">
            {car.title}
          </h3>
          <p className="line-clamp-1 text-sm font-medium text-muted-foreground">
            {car.version}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-1.5 text-[10px] text-[var(--brand-black)] sm:text-xs">
          <span className="inline-flex min-w-0 items-center justify-center gap-1 rounded-full border border-border bg-muted/30 px-1.5 py-1 sm:px-2">
            <CalendarDays className="size-3.5 shrink-0 text-[var(--brand-orange)] sm:size-4" />
            <span className="whitespace-nowrap">{car.year}</span>
          </span>
          <span className="inline-flex min-w-0 items-center justify-center gap-1 rounded-full border border-border bg-muted/30 px-1.5 py-1 sm:px-2">
            <Gauge className="size-3.5 shrink-0 text-[var(--brand-orange)] sm:size-4" />
            <span className="whitespace-nowrap">
              {formatNumber.format(car.km)} km
            </span>
          </span>
          <span className="inline-flex min-w-0 items-center justify-center gap-1 rounded-full border border-border bg-muted/30 px-1.5 py-1 sm:px-2">
            <GearboxIcon className="size-3.5 shrink-0 text-[var(--brand-orange)] sm:size-4" />
            <span className="whitespace-nowrap">{car.transmission}</span>
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-border pt-3">
          <p className="text-[clamp(1.6rem,6.2vw,2rem)] font-black leading-none tracking-tight text-[var(--brand-black)]">
            {formatCurrency.format(car.priceArs)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={detailHref ?? `/autos/${car.slug}`}
            className="inline-flex h-10 flex-1 items-center justify-center rounded-xl bg-[var(--brand-orange)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-orange-light)]"
          >
            Ver detalles
          </Link>
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
              "inline-flex h-10 w-12 items-center justify-center rounded-xl border border-border bg-white text-[var(--brand-black)] transition-colors hover:bg-muted/40",
              favorite && "border-[var(--brand-orange)] text-[var(--brand-orange)]",
            )}
          >
            <Heart className={cn("size-5", favorite && "fill-current")} aria-hidden />
          </button>
        </div>
      </div>
    </article>
  );
}
