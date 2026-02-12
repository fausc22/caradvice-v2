export const CATALOG_TIPO_VALUES = ["usados", "nuevos", "motos"] as const;
export type CatalogTipo = (typeof CATALOG_TIPO_VALUES)[number];

export const CATALOG_SORT_VALUES = [
  "recomendados",
  "precio-asc",
  "precio-desc",
  "anio-desc",
  "km-asc",
] as const;
export type CatalogSort = (typeof CATALOG_SORT_VALUES)[number];

export type CatalogSearchParamsInput = Record<
  string,
  string | string[] | undefined
>;

export type CatalogQueryParams = {
  q?: string;
  tipo?: CatalogTipo;
  marca?: string;
  modelo?: string;
  anioMin?: number;
  anioMax?: number;
  precioMin?: number;
  precioMax?: number;
  kmMax?: number;
  transmision?: string;
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
  year: number;
  km: number;
  priceArs: number;
  transmission: string;
  fuel: string;
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
  transmissions: string[];
  yearRange: {
    min: number;
    max: number;
  };
  priceRange: {
    min: number;
    max: number;
  };
  kmRange: {
    min: number;
    max: number;
  };
};
