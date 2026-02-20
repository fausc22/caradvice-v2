import {
  CATALOG_CONDICION_VALUES,
  CATALOG_MONEDA_VALUES,
  CATALOG_SORT_VALUES,
  CATALOG_TIPOLOGIA_VALUES,
  CATALOG_TIPO_VALUES,
  type CatalogCondicion,
  type CatalogMoneda,
  type CatalogQueryParams,
  type CatalogSearchParamsInput,
  type CatalogSort,
  type CatalogTipo,
  type CatalogTipologia,
} from "@/lib/catalog/types";

export const CATALOG_DEFAULT_SORT: CatalogSort = "recomendados";
export const CATALOG_DEFAULT_PAGE = 1;
export const CATALOG_DEFAULT_PER_PAGE = 12;
const CATALOG_ALLOWED_PER_PAGE = new Set([12, 18, 24]);
const MAX_QUERY_LENGTH = 80;

/** Normaliza un string para comparación y uso como clave (trim + lowercase). Fuente de verdad: datos estáticos. */
export function normalizeCatalogString(s: string | undefined): string {
  return String(s ?? "").trim().toLowerCase();
}

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

function parseTipologia(value?: string): CatalogTipologia | undefined {
  if (!value) return undefined;
  return CATALOG_TIPOLOGIA_VALUES.includes(value as CatalogTipologia)
    ? (value as CatalogTipologia)
    : undefined;
}

function parseCondicion(value?: string): CatalogCondicion | undefined {
  if (!value) return undefined;
  return CATALOG_CONDICION_VALUES.includes(value as CatalogCondicion)
    ? (value as CatalogCondicion)
    : undefined;
}

function parseMoneda(value?: string): CatalogMoneda | undefined {
  if (!value) return undefined;
  return CATALOG_MONEDA_VALUES.includes(value as CatalogMoneda)
    ? (value as CatalogMoneda)
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
  const version = cleanString(getFirstValue(input, "version"));
  const transmision = cleanString(getFirstValue(input, "transmision"));
  const combustible = cleanString(getFirstValue(input, "combustible"));
  const color = cleanString(getFirstValue(input, "color"));
  const extras = cleanString(getFirstValue(input, "extras"));
  const tipo = parseTipo(cleanString(getFirstValue(input, "tipo")));
  const tipologia = parseTipologia(cleanString(getFirstValue(input, "tipologia")));
  const condicion = parseCondicion(cleanString(getFirstValue(input, "condicion")));
  const moneda = parseMoneda(cleanString(getFirstValue(input, "moneda")));
  const sort = parseSort(cleanString(getFirstValue(input, "sort")));
  const puertas = parsePositiveInt(getFirstValue(input, "puertas"));

  const anioLegacy = parsePositiveInt(getFirstValue(input, "anio"));
  const anioMinRaw = parsePositiveInt(getFirstValue(input, "anioMin")) ?? anioLegacy;
  const anioMaxRaw = parsePositiveInt(getFirstValue(input, "anioMax")) ?? anioLegacy;
  const anioRange = normalizeRange(anioMinRaw, anioMaxRaw);

  const precioRange = normalizeRange(
    parsePositiveInt(getFirstValue(input, "precioMin")),
    parsePositiveInt(getFirstValue(input, "precioMax")),
  );

  const kmRange = normalizeRange(
    parsePositiveInt(getFirstValue(input, "kmMin")),
    parsePositiveInt(getFirstValue(input, "kmMax")),
  );

  const page = pageRaw && pageRaw > 0 ? pageRaw : CATALOG_DEFAULT_PAGE;
  const perPage =
    perPageRaw && CATALOG_ALLOWED_PER_PAGE.has(perPageRaw)
      ? perPageRaw
      : CATALOG_DEFAULT_PER_PAGE;

  return {
    q: qRaw,
    tipo,
    tipologia,
    condicion,
    marca,
    modelo,
    version,
    moneda,
    anioMin: anioRange.min,
    anioMax: anioRange.max,
    precioMin: precioRange.min,
    precioMax: precioRange.max,
    kmMin: kmRange.min,
    kmMax: kmRange.max,
    transmision,
    combustible,
    color,
    puertas,
    extras,
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
  if (params.tipologia) search.set("tipologia", params.tipologia);
  if (params.condicion) search.set("condicion", params.condicion);
  if (params.marca) search.set("marca", params.marca);
  if (params.modelo) search.set("modelo", params.modelo);
  if (params.version) search.set("version", params.version);
  if (params.moneda) search.set("moneda", params.moneda);
  if (params.anioMin !== undefined) search.set("anioMin", String(params.anioMin));
  if (params.anioMax !== undefined) search.set("anioMax", String(params.anioMax));
  if (params.precioMin !== undefined) search.set("precioMin", String(params.precioMin));
  if (params.precioMax !== undefined) search.set("precioMax", String(params.precioMax));
  if (params.kmMin !== undefined) search.set("kmMin", String(params.kmMin));
  if (params.kmMax !== undefined) search.set("kmMax", String(params.kmMax));
  if (params.transmision) search.set("transmision", params.transmision);
  if (params.combustible) search.set("combustible", params.combustible);
  if (params.color) search.set("color", params.color);
  if (params.puertas !== undefined) search.set("puertas", String(params.puertas));
  if (params.extras) search.set("extras", params.extras);

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
