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
    case "anio-asc":
      return copy.sort((a, b) => a.year - b.year || a.km - b.km);
    case "km-asc":
      return copy.sort((a, b) => a.km - b.km || b.year - a.year);
    case "km-desc":
      return copy.sort((a, b) => b.km - a.km || b.year - a.year);
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
  const useUsd = params.moneda === "dolares";
  const priceMin = params.precioMin;
  const priceMax = params.precioMax;

  const filtered = catalogCars.filter((car) => {
    if (params.tipo && car.type !== params.tipo) return false;
    if (params.tipologia && car.tipologia !== params.tipologia) return false;
    if (params.condicion && car.condicion !== params.condicion) return false;
    if (params.marca && !contains(car.brand, params.marca)) return false;
    if (params.modelo && !contains(car.model, params.modelo)) return false;
    if (params.version && !contains(car.version, params.version)) return false;
    if (params.transmision && !contains(car.transmission, params.transmision)) return false;
    if (params.combustible && !contains(car.fuel, params.combustible)) return false;
    if (params.anioMin !== undefined && car.year < params.anioMin) return false;
    if (params.anioMax !== undefined && car.year > params.anioMax) return false;

    if (priceMin !== undefined) {
      const carPrice = useUsd ? car.priceUsd : car.priceArs;
      if (carPrice < priceMin) return false;
    }
    if (priceMax !== undefined) {
      const carPrice = useUsd ? car.priceUsd : car.priceArs;
      if (carPrice > priceMax) return false;
    }

    if (params.kmMin !== undefined && car.km < params.kmMin) return false;
    if (params.kmMax !== undefined && car.km > params.kmMax) return false;
    if (params.color && car.color && !contains(car.color, params.color)) return false;
    if (params.puertas !== undefined && car.puertas !== undefined && car.puertas !== params.puertas) return false;
    if (params.extras) {
      const carExtras = car.extras ?? [];
      const searchExtras = params.extras.toLowerCase().split(/\s*,\s*/).filter(Boolean);
      const hasAll = searchExtras.every((ex) =>
        carExtras.some((ce) => ce.toLowerCase().includes(ex))
      );
      if (!hasAll) return false;
    }

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
  const combustibles = Array.from(new Set(catalogCars.map((car) => car.fuel))).sort();
  const colores = Array.from(
    new Set(catalogCars.flatMap((car) => (car.color ? [car.color] : []))),
  ).sort();
  const puertas = Array.from(
    new Set(catalogCars.flatMap((car) => (car.puertas !== undefined ? [car.puertas] : []))),
  ).sort((a, b) => a - b);
  const extras = Array.from(
    new Set(catalogCars.flatMap((car) => car.extras ?? [])),
  ).sort();

  const modelsByBrand: Record<string, string[]> = {};
  for (const brand of brands) {
    modelsByBrand[brand] = Array.from(
      new Set(catalogCars.filter((car) => car.brand === brand).map((car) => car.model)),
    ).sort();
  }

  const versionesByModelo: Record<string, string[]> = {};
  for (const car of catalogCars) {
    const key = `${car.brand}|${car.model}`;
    if (!versionesByModelo[key]) versionesByModelo[key] = [];
    if (!versionesByModelo[key].includes(car.version)) {
      versionesByModelo[key].push(car.version);
    }
  }
  for (const key of Object.keys(versionesByModelo)) {
    versionesByModelo[key].sort();
  }

  const pricesArs = catalogCars.map((car) => car.priceArs);
  const pricesUsd = catalogCars.map((car) => car.priceUsd);
  const kms = catalogCars.map((car) => car.km);

  return {
    brands,
    modelsByBrand,
    versionesByModelo,
    transmissions,
    combustibles,
    colores,
    puertas,
    extras,
    yearRange: { min: 1980, max: 2026 },
    priceRange: { min: Math.min(...pricesArs), max: Math.max(...pricesArs) },
    priceRangeUsd: { min: Math.min(...pricesUsd), max: Math.max(...pricesUsd) },
    kmRange: { min: Math.min(...kms), max: Math.max(...kms) },
  };
}
