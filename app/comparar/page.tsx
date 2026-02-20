import Link from "next/link";
import { Scale } from "lucide-react";
import { getCatalogCarBySlug } from "@/lib/catalog";
import type { CatalogCar } from "@/lib/catalog/types";
import { Button } from "@/components/ui/button";
import { CompareTopBlock } from "@/components/compare/compare-top-block";
import { CompareSpecsTable } from "@/components/compare/compare-specs-table";

const MIN_VEHICLES = 2;
const MAX_VEHICLES = 5;

type CompararPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Parsea el query param `vehiculos` (slug1,slug2,...) y devuelve hasta MAX_VEHICLES slugs únicos.
 */
function parseVehiculosParam(
  searchParams: Record<string, string | string[] | undefined>,
): string[] {
  const raw = searchParams.vehiculos;
  if (raw == null) return [];

  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value || typeof value !== "string") return [];

  const slugs = value
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  const unique = Array.from(new Set(slugs));
  return unique.slice(0, MAX_VEHICLES);
}

/**
 * Resuelve slugs a CatalogCar; filtra los que no existen.
 */
async function resolveVehicles(slugs: string[]): Promise<CatalogCar[]> {
  const results = await Promise.all(
    slugs.map((slug) => getCatalogCarBySlug(slug)),
  );
  return results.filter((car): car is CatalogCar => car != null);
}

function buildCompareHref(slugs: string[]): string {
  if (slugs.length === 0) return "/comparar";
  return `/comparar?vehiculos=${encodeURIComponent(slugs.join(","))}`;
}

function CompareEmptyState() {
  return (
    <main className="mx-auto w-full max-w-screen-xl px-4 pb-28 pt-8 sm:px-6 sm:pt-12">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[var(--brand-gray)] bg-[var(--brand-cream)]/30 px-4 py-16 text-center sm:py-24">
        <Scale
          className="mb-4 size-14 text-muted-foreground sm:size-16"
          aria-hidden
        />
        <h1 className="text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl">
          No hay vehículos para comparar
        </h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          Elegí al menos 2 vehículos en el catálogo y agregalos a favoritos. Desde
          el ícono de corazón podrás ir a comparar.
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Podés comparar hasta {MAX_VEHICLES} vehículos al mismo tiempo.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          O pasanos los slugs por la URL:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
            /comparar?vehiculos=slug1,slug2
          </code>
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            asChild
            className="rounded-xl bg-[var(--brand-orange)] px-5 text-white hover:bg-[var(--brand-orange-light)]"
          >
            <Link href="/catalogo">Ir al catálogo</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}

function CompareHeader({ count }: { count: number }) {
  return (
    <div className="border-b border-border bg-background px-4 py-4 sm:px-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
          <Link href="/" className="transition-colors hover:text-foreground">
            Inicio
          </Link>
          <span aria-hidden>/</span>
          <Link href="/catalogo" className="transition-colors hover:text-foreground">
            Catálogo
          </Link>
          <span aria-hidden>/</span>
          <span className="font-medium text-foreground">Comparar</span>
        </div>
        <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl">
          Comparar vehículos
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {count} {count === 1 ? "vehículo" : "vehículos"} seleccionados.
        </p>
      </div>
    </div>
  );
}

function CompareLayout({ vehicles }: { vehicles: CatalogCar[] }) {
  const compareSlugs = vehicles.map((vehicle) => vehicle.slug);
  const removeHrefBySlug = Object.fromEntries(
    compareSlugs.map((slug) => [
      slug,
      buildCompareHref(compareSlugs.filter((current) => current !== slug)),
    ]),
  );

  return (
    <main className="mx-auto w-full max-w-screen-xl px-4 pb-28 pt-2 sm:px-6 sm:pt-4">
      <CompareHeader count={vehicles.length} />

      <section className="mt-6">
        <CompareTopBlock vehicles={vehicles} removeHrefBySlug={removeHrefBySlug} />
      </section>

      <section className="mt-6 sm:mt-8">
        <CompareSpecsTable vehicles={vehicles} />
      </section>
    </main>
  );
}

export const metadata = {
  title: "Comparar vehículos | Car Advice",
  description:
    "Compará especificaciones y precios de los vehículos que te interesan. Agregá al menos 2 a favoritos para comparar.",
};

export default async function CompararPage({ searchParams }: CompararPageProps) {
  const search = await searchParams;
  const slugs = parseVehiculosParam(search);
  const vehicles = await resolveVehicles(slugs);

  if (vehicles.length < MIN_VEHICLES) {
    return <CompareEmptyState />;
  }

  return <CompareLayout vehicles={vehicles} />;
}
