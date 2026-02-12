import {
  CATALOG_SORT_VALUES,
  CATALOG_TIPO_VALUES,
  type CatalogQueryParams,
  type CatalogSearchParamsInput,
  type CatalogSort,
  type CatalogTipo,
} from "@/lib/catalog/types";

export const CATALOG_DEFAULT_SORT: CatalogSort = "recomendados";
export const CATALOG_DEFAULT_PAGE = 1;
export const CATALOG_DEFAULT_PER_PAGE = 12;
const CATALOG_ALLOWED_PER_PAGE = new Set([12, 18, 24]);
const MAX_QUERY_LENGTH = 80;

function getFirstValue(
  input: URLSearchParams | CatalogSearchParamsInput,
  key: string,
): string | undefined {
  if (input instanceof URLSearchParams) {
    const value = input.get(key);
    return value ?? undefined;
  }

  const raw = input[key];
  if (Array.isArray(raw)) return raw[0];
  return raw;
}

function parsePositiveInt(value?: string): number | undefined {
  if (!value) return undefined;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0) return undefined;
  return parsed;
}

function parseTipo(value?: string): CatalogTipo | undefined {
  if (!value) return undefined;
  return CATALOG_TIPO_VALUES.includes(value as CatalogTipo)
    ? (value as CatalogTipo)
    : undefined;
}

function parseSort(value?: string): CatalogSort {
  if (!value) return CATALOG_DEFAULT_SORT;
  return CATALOG_SORT_VALUES.includes(value as CatalogSort)
    ? (value as CatalogSort)
    : CATALOG_DEFAULT_SORT;
}

function cleanString(value?: string): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  return trimmed;
}

function normalizeRange(
  min?: number,
  max?: number,
): { min?: number; max?: number } {
  if (min === undefined || max === undefined) {
    return { min, max };
  }
  return min <= max ? { min, max } : { min: max, max: min };
}

export function parseCatalogParams(
  input: URLSearchParams | CatalogSearchParamsInput,
): CatalogQueryParams {
  const qRaw = cleanString(getFirstValue(input, "q"))?.slice(0, MAX_QUERY_LENGTH);

  const pageRaw = parsePositiveInt(getFirstValue(input, "page"));
  const perPageRaw = parsePositiveInt(getFirstValue(input, "perPage"));

  const marca = cleanString(getFirstValue(input, "marca"));
  const modelo = cleanString(getFirstValue(input, "modelo"));
  const transmision = cleanString(getFirstValue(input, "transmision"));
  const tipo = parseTipo(cleanString(getFirstValue(input, "tipo")));
  const sort = parseSort(cleanString(getFirstValue(input, "sort")));

  const anioLegacy = parsePositiveInt(getFirstValue(input, "anio"));
  const anioMinRaw = parsePositiveInt(getFirstValue(input, "anioMin")) ?? anioLegacy;
  const anioMaxRaw = parsePositiveInt(getFirstValue(input, "anioMax")) ?? anioLegacy;
  const anioRange = normalizeRange(anioMinRaw, anioMaxRaw);

  const precioRange = normalizeRange(
    parsePositiveInt(getFirstValue(input, "precioMin")),
    parsePositiveInt(getFirstValue(input, "precioMax")),
  );

  const page = pageRaw && pageRaw > 0 ? pageRaw : CATALOG_DEFAULT_PAGE;
  const perPage =
    perPageRaw && CATALOG_ALLOWED_PER_PAGE.has(perPageRaw)
      ? perPageRaw
      : CATALOG_DEFAULT_PER_PAGE;

  return {
    q: qRaw,
    tipo,
    marca,
    modelo,
    anioMin: anioRange.min,
    anioMax: anioRange.max,
    precioMin: precioRange.min,
    precioMax: precioRange.max,
    kmMax: parsePositiveInt(getFirstValue(input, "kmMax")),
    transmision,
    sort,
    page,
    perPage,
  };
}

type SerializeOptions = {
  includeDefaults?: boolean;
};

export function serializeCatalogParams(
  params: CatalogQueryParams,
  options: SerializeOptions = {},
): URLSearchParams {
  const includeDefaults = options.includeDefaults ?? false;
  const search = new URLSearchParams();

  if (params.q) search.set("q", params.q);
  if (params.tipo) search.set("tipo", params.tipo);
  if (params.marca) search.set("marca", params.marca);
  if (params.modelo) search.set("modelo", params.modelo);
  if (params.anioMin !== undefined) search.set("anioMin", String(params.anioMin));
  if (params.anioMax !== undefined) search.set("anioMax", String(params.anioMax));
  if (params.precioMin !== undefined) search.set("precioMin", String(params.precioMin));
  if (params.precioMax !== undefined) search.set("precioMax", String(params.precioMax));
  if (params.kmMax !== undefined) search.set("kmMax", String(params.kmMax));
  if (params.transmision) search.set("transmision", params.transmision);

  if (includeDefaults || params.sort !== CATALOG_DEFAULT_SORT) {
    search.set("sort", params.sort);
  }
  if (includeDefaults || params.page !== CATALOG_DEFAULT_PAGE) {
    search.set("page", String(params.page));
  }
  if (includeDefaults || params.perPage !== CATALOG_DEFAULT_PER_PAGE) {
    search.set("perPage", String(params.perPage));
  }

  return search;
}

export function toCatalogQueryString(
  params: CatalogQueryParams,
  options: SerializeOptions = {},
): string {
  return serializeCatalogParams(params, options).toString();
}

export function buildCatalogUrl(
  params: CatalogQueryParams,
  options: SerializeOptions = {},
): string {
  const query = toCatalogQueryString(params, options);
  return query ? `/catalogo?${query}` : "/catalogo";
}
