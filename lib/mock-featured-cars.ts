import { catalogCars } from "@/lib/catalog/static-data";
import type { CatalogCar, CardVariant, SoldLabel } from "@/lib/catalog/types";

export type FeaturedCar = {
  slug: string;
  title: string;
  version: string;
  year: number;
  km: number;
  priceArs: number;
  priceUsd: number;
  transmission: string;
  imageSrc: string;
  /** Lista de imágenes para carrusel en card; si no viene, se usa [coverImage]. */
  images: string[];
  cardVariant?: CardVariant;
  priceOriginalArs?: number;
  priceOriginalUsd?: number;
  discountPercent?: number;
  opportunityBadges?: string[];
  soldLabel?: SoldLabel;
};

export function toFeaturedCar(car: CatalogCar): FeaturedCar {
  return {
    slug: car.slug,
    title: `${car.brand} ${car.model}`,
    version: car.version,
    year: car.year,
    km: car.km,
    priceArs: car.priceArs,
    priceUsd: car.priceUsd,
    transmission: car.transmission,
    imageSrc: car.coverImage,
    images: car.images?.length ? car.images : [car.coverImage],
    cardVariant: car.cardVariant,
    priceOriginalArs: car.priceOriginalArs,
    priceOriginalUsd: car.priceOriginalUsd,
    discountPercent: car.discountPercent,
    opportunityBadges: car.opportunityBadges,
    soldLabel: car.soldLabel,
  };
}

export const featuredCars: FeaturedCar[] = catalogCars.map(toFeaturedCar);
