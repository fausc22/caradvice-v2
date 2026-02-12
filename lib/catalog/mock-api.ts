import { catalogCars } from "@/lib/catalog/mock-cars";
import type {
  CatalogCar,
  CatalogFilterMetadata,
  CatalogListResponse,
  CatalogQueryParams,
} from "@/lib/catalog/types";

function contains(source: string, search: string): boolean {
  return source.toLowerCase().includes(search.toLowerCase());
}

function sortCatalogCars(items: CatalogCar[], sort: CatalogQueryParams["sort"]): CatalogCar[] {
  const copy = [...items];

  switch (sort) {
    case "precio-asc":
      return copy.sort((a, b) => a.priceArs - b.priceArs);
    case "precio-desc":
      return copy.sort((a, b) => b.priceArs - a.priceArs);
    case "anio-desc":
      return copy.sort((a, b) => b.year - a.year || a.km - b.km);
    case "km-asc":
      return copy.sort((a, b) => a.km - b.km || b.year - a.year);
    case "recomendados":
    default:
      return copy.sort((a, b) => {
        if (a.isFeatured !== b.isFeatured) return Number(b.isFeatured) - Number(a.isFeatured);
        if (a.year !== b.year) return b.year - a.year;
        return a.km - b.km;
      });
  }
}

export async function searchCatalogCars(
  params: CatalogQueryParams,
): Promise<CatalogListResponse> {
  const filtered = catalogCars.filter((car) => {
    if (params.tipo && car.type !== params.tipo) return false;
    if (params.marca && !contains(car.brand, params.marca)) return false;
    if (params.modelo && !contains(car.model, params.modelo)) return false;
    if (params.transmision && !contains(car.transmission, params.transmision)) return false;
    if (params.anioMin !== undefined && car.year < params.anioMin) return false;
    if (params.anioMax !== undefined && car.year > params.anioMax) return false;
    if (params.precioMin !== undefined && car.priceArs < params.precioMin) return false;
    if (params.precioMax !== undefined && car.priceArs > params.precioMax) return false;
    if (params.kmMax !== undefined && car.km > params.kmMax) return false;

    if (params.q) {
      const haystack = `${car.brand} ${car.model} ${car.version} ${car.slug}`;
      if (!contains(haystack, params.q)) return false;
    }

    return true;
  });

  const sorted = sortCatalogCars(filtered, params.sort);
  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / params.perPage));
  const page = Math.min(params.page, totalPages);

  const start = (page - 1) * params.perPage;
  const end = start + params.perPage;
  const items = sorted.slice(start, end);

  return {
    items,
    total,
    page,
    perPage: params.perPage,
    totalPages,
    appliedParams: { ...params, page },
  };
}

export async function getCatalogCarBySlug(slug: string): Promise<CatalogCar | null> {
  const car = catalogCars.find((item) => item.slug === slug);
  return car ?? null;
}

export async function getCatalogFilterMetadata(): Promise<CatalogFilterMetadata> {
  const brands = Array.from(new Set(catalogCars.map((car) => car.brand))).sort();
  const transmissions = Array.from(
    new Set(catalogCars.map((car) => car.transmission)),
  ).sort();

  const modelsByBrand: Record<string, string[]> = {};
  for (const brand of brands) {
    modelsByBrand[brand] = Array.from(
      new Set(catalogCars.filter((car) => car.brand === brand).map((car) => car.model)),
    ).sort();
  }

  const years = catalogCars.map((car) => car.year);
  const prices = catalogCars.map((car) => car.priceArs);
  const kms = catalogCars.map((car) => car.km);

  return {
    brands,
    modelsByBrand,
    transmissions,
    yearRange: {
      min: Math.min(...years),
      max: Math.max(...years),
    },
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices),
    },
    kmRange: {
      min: Math.min(...kms),
      max: Math.max(...kms),
    },
  };
}
