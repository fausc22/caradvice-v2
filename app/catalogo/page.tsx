import { CatalogPageShell } from "@/components/catalog/catalog-page-shell";
import { getCatalogFilterMetadata, parseCatalogParams, searchCatalogCars } from "@/lib/catalog";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = parseCatalogParams(await searchParams);
  const [result, filtersMeta] = await Promise.all([
    searchCatalogCars(params),
    getCatalogFilterMetadata(),
  ]);

  return <CatalogPageShell result={result} params={params} filtersMeta={filtersMeta} />;
}
