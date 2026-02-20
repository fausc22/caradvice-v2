import { normalizeCatalogString } from "@/lib/catalog/params";
import { catalogCars } from "@/lib/catalog/static-data";
import type {
  CatalogCar,
  CatalogFilterMetadata,
  CatalogListResponse,
  CatalogQueryParams,
} from "@/lib/catalog/types";

function contains(source: string, search: string): boolean {
  if (!source || !search) return false;
  return source.toLowerCase().includes(search.toLowerCase());
}

/** Comparación exacta normalizada: misma regla que los datos estáticos (trim + lowercase). */
function eqNormalized(a: string | undefined, b: string | undefined): boolean {
  return normalizeCatalogString(a) === normalizeCatalogString(b);
}

function sortCatalogCars(
  items: CatalogCar[],
  sort: CatalogQueryParams["sort"],
  moneda?: CatalogQueryParams["moneda"],
): CatalogCar[] {
  const copy = [...items];
  const useUsd = moneda === "dolares";

  switch (sort) {
    case "precio-asc":
      return copy.sort((a, b) => {
        const pa = useUsd ? a.priceUsd : a.priceArs;
        const pb = useUsd ? b.priceUsd : b.priceArs;
        return pa - pb;
      });
    case "precio-desc":
      return copy.sort((a, b) => {
        const pa = useUsd ? a.priceUsd : a.priceArs;
        const pb = useUsd ? b.priceUsd : b.priceArs;
        return pb - pa;
      });
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
    // Filtro por moneda: solo excluir por moneda si el usuario eligió una; si no, mostrar todos
    if (params.moneda === "dolares" && car.priceUsd <= 0) return false;
    if (params.moneda === "pesos" && car.priceArs <= 0) return false;

    if (params.tipo && car.type !== params.tipo) return false;
    if (params.tipologia && car.tipologia !== params.tipologia) return false;
    if (params.condicion && car.condicion !== params.condicion) return false;
    // Marca, modelo y versión: comparación normalizada (regla = datos estáticos)
    if (params.marca && !eqNormalized(String(car.brand ?? ""), params.marca)) return false;
    if (params.modelo && !eqNormalized(String(car.model ?? ""), params.modelo)) return false;
    if (params.version && !eqNormalized(String(car.version ?? ""), params.version)) return false;
    if (params.transmision && !eqNormalized(String(car.transmission ?? ""), params.transmision)) return false;
    if (params.combustible && !eqNormalized(String(car.fuel ?? ""), params.combustible)) return false;
    if (params.anioMin !== undefined && car.year < params.anioMin) return false;
    if (params.anioMax !== undefined && car.year > params.anioMax) return false;

    const carPrice = useUsd ? car.priceUsd : car.priceArs;
    if (priceMin !== undefined && carPrice < priceMin) return false;
    if (priceMax !== undefined && carPrice > priceMax) return false;

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

  const sorted = sortCatalogCars(filtered, params.sort, params.moneda);
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
  // Marcas: una entrada por valor normalizado; valor mostrado = primera aparición en los datos (trimmed)
  const brandByNormalized = new Map<string, string>();
  for (const car of catalogCars) {
    const b = String(car.brand ?? "").trim();
    if (!b) continue;
    const key = normalizeCatalogString(b);
    if (!brandByNormalized.has(key)) brandByNormalized.set(key, b);
  }
  const brands = Array.from(brandByNormalized.values()).sort();

  const transmissions = Array.from(
    new Set(
      catalogCars
        .map((car) => String(car.transmission ?? "").trim())
        .filter(Boolean),
    ),
  ).sort();

  const combustibles = Array.from(
    new Set(
      catalogCars.map((car) => String(car.fuel ?? "").trim()).filter(Boolean),
    ),
  ).sort();

  const colores = Array.from(
    new Set(
      catalogCars.flatMap((car) =>
        car.color && String(car.color).trim() ? [String(car.color).trim()] : [],
      ),
    ),
  ).sort();

  const puertas = Array.from(
    new Set(
      catalogCars.flatMap((car) =>
        car.puertas !== undefined && car.puertas !== null ? [car.puertas] : [],
      ),
    ),
  ).sort((a, b) => a - b);

  const extras = Array.from(
    new Set(catalogCars.flatMap((car) => car.extras ?? [])),
  ).sort();

  // modelsByBrand: clave = marca normalizada (para lookup desde URL/form)
  const modelsByBrand: Record<string, string[]> = {};
  for (const [normBrand, displayBrand] of brandByNormalized) {
    const modelSet = new Map<string, string>();
    for (const car of catalogCars) {
      if (!eqNormalized(car.brand, displayBrand)) continue;
      const m = String(car.model ?? "").trim();
      if (!m) continue;
      const key = normalizeCatalogString(m);
      if (!modelSet.has(key)) modelSet.set(key, m);
    }
    modelsByBrand[normBrand] = Array.from(modelSet.values()).sort();
  }

  // versionesByModelo: clave = "marcaNormalizada|modeloNormalizado"
  const versionesByModelo: Record<string, string[]> = {};
  for (const car of catalogCars) {
    const b = String(car.brand ?? "").trim();
    const m = String(car.model ?? "").trim();
    if (!b || !m) continue;
    const nBrand = normalizeCatalogString(b);
    const nModel = normalizeCatalogString(m);
    const key = `${nBrand}|${nModel}`;
    if (!versionesByModelo[key]) versionesByModelo[key] = [];
    const ver = String(car.version ?? "").trim();
    if (ver) {
      const nVer = normalizeCatalogString(ver);
      const exists = versionesByModelo[key].some((v) => normalizeCatalogString(v) === nVer);
      if (!exists) versionesByModelo[key].push(ver);
    }
  }
  for (const key of Object.keys(versionesByModelo)) {
    versionesByModelo[key].sort();
  }

  const carsArs = catalogCars.filter((c) => c.priceArs > 0);
  const carsUsd = catalogCars.filter((c) => c.priceUsd > 0);
  const pricesArs = carsArs.map((c) => c.priceArs);
  const pricesUsd = carsUsd.map((c) => c.priceUsd);
  const kms = catalogCars.map((car) => car.km);
  const years = catalogCars.map((car) => car.year).filter((y) => y > 0);

  return {
    brands,
    modelsByBrand,
    versionesByModelo,
    transmissions,
    combustibles,
    colores,
    puertas,
    extras,
    yearRange: {
      min: years.length ? Math.min(...years) : 1980,
      max: years.length ? Math.max(...years) : 2026,
    },
    priceRange: {
      min: pricesArs.length ? Math.min(...pricesArs) : 0,
      max: pricesArs.length ? Math.max(...pricesArs) : 0,
    },
    priceRangeUsd: {
      min: pricesUsd.length ? Math.min(...pricesUsd) : 0,
      max: pricesUsd.length ? Math.max(...pricesUsd) : 0,
    },
    kmRange: { min: Math.min(...kms), max: Math.max(...kms) },
  };
}
