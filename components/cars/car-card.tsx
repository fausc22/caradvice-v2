"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { FeaturedCar } from "@/lib/mock-featured-cars";
import { useFavorites } from "@/hooks";
import { cn, formatVehiclePrice } from "@/lib/utils";

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
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={car.imageSrc}
            alt={`${car.title} ${car.version}`}
            fill
            sizes={imageSizes}
            quality={90}
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
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

          <p className="mt-4 text-xl font-bold tracking-tight text-[var(--brand-black)] sm:text-2xl">
            {formatVehiclePrice(car.priceArs, car.priceUsd)}
          </p>

          <span className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[var(--brand-orange)] text-sm font-semibold text-white transition-colors duration-200 group-hover:bg-[var(--brand-orange-light)]">
            Ver detalles
          </span>
        </div>
      </Link>
    </article>
  );
}
