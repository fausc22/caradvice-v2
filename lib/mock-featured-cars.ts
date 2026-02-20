import { catalogCars } from "@/lib/catalog/static-data";
import type { CatalogCar } from "@/lib/catalog/types";

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
  };
}

export const featuredCars: FeaturedCar[] = catalogCars.map(toFeaturedCar);
