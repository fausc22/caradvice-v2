export const CATALOG_TIPO_VALUES = ["usados", "nuevos", "motos"] as const;
export type CatalogTipo = (typeof CATALOG_TIPO_VALUES)[number];

export const CATALOG_TIPOLOGIA_VALUES = [
  "sedan",
  "hatchback",
  "coupe",
  "convertible",
  "suv",
  "pickup",
  "familiar",
  "van",
  "motos",
] as const;
export type CatalogTipologia = (typeof CATALOG_TIPOLOGIA_VALUES)[number];

export const CATALOG_TIPOLOGIA_LABELS: Record<CatalogTipologia, string> = {
  sedan: "Sedan",
  hatchback: "Hatchback",
  coupe: "Coupé",
  convertible: "Convertible",
  suv: "SUV",
  pickup: "Pickup",
  familiar: "Familiar",
  van: "Van",
  motos: "Motos",
};

export const CATALOG_CONDICION_VALUES = ["0km", "usados", "reventa", "proximo_ingreso"] as const;
export type CatalogCondicion = (typeof CATALOG_CONDICION_VALUES)[number];

export const CATALOG_MONEDA_VALUES = ["pesos", "dolares"] as const;
export type CatalogMoneda = (typeof CATALOG_MONEDA_VALUES)[number];

export const CATALOG_SORT_VALUES = [
  "recomendados",
  "precio-asc",
  "precio-desc",
  "anio-desc",
  "anio-asc",
  "km-asc",
  "km-desc",
] as const;
export type CatalogSort = (typeof CATALOG_SORT_VALUES)[number];

export type CatalogSearchParamsInput = Record<
  string,
  string | string[] | undefined
>;

export type CatalogQueryParams = {
  q?: string;
  tipo?: CatalogTipo;
  tipologia?: CatalogTipologia;
  condicion?: CatalogCondicion;
  marca?: string;
  modelo?: string;
  version?: string;
  moneda?: CatalogMoneda;
  anioMin?: number;
  anioMax?: number;
  precioMin?: number;
  precioMax?: number;
  kmMin?: number;
  kmMax?: number;
  transmision?: string;
  combustible?: string;
  color?: string;
  puertas?: number;
  extras?: string;
  sort: CatalogSort;
  page: number;
  perPage: number;
};

export type CatalogCar = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  version: string;
  type: CatalogTipo;
  tipologia: CatalogTipologia;
  condicion: CatalogCondicion;
  year: number;
  km: number;
  priceArs: number;
  priceUsd: number;
  transmission: string;
  fuel: string;
  color?: string;
  puertas?: number;
  extras?: string[];
  coverImage: string;
  images: string[];
  isFeatured: boolean;
};

export type CatalogListResponse = {
  items: CatalogCar[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  appliedParams: CatalogQueryParams;
};

export type CatalogFilterMetadata = {
  brands: string[];
  modelsByBrand: Record<string, string[]>;
  versionesByModelo: Record<string, string[]>;
  transmissions: string[];
  combustibles: string[];
  colores: string[];
  puertas: number[];
  extras: string[];
  yearRange: { min: number; max: number };
  priceRange: { min: number; max: number };
  priceRangeUsd: { min: number; max: number };
  kmRange: { min: number; max: number };
};
