import { toCatalogQueryString } from "@/lib/catalog/params";
import type { CatalogQueryParams } from "@/lib/catalog/types";

export const catalogQueryKeys = {
  all: ["catalogo"] as const,
  list: (params: CatalogQueryParams) =>
    ["catalogo", "list", toCatalogQueryString(params, { includeDefaults: true })] as const,
  detail: (slug: string) => ["catalogo", "detail", slug] as const,
  filtersMeta: () => ["catalogo", "filters-meta"] as const,
};
