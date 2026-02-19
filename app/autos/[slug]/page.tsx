import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Gauge } from "lucide-react";
import { catalogCars, getCatalogCarBySlug } from "@/lib/catalog";
import { AutoDetailActions } from "@/components/cars/auto-detail-actions";
import { AutoDetailCalculators } from "@/components/cars/auto-detail-calculators";
import { AutoDetailSpecs } from "@/components/cars/auto-detail-specs";
import { GearboxIcon } from "@/components/icons/gearbox-icon";
import { AutoImageGallery } from "@/components/cars/auto-image-gallery";
import { CarCard } from "@/components/cars/car-card";
import { ContactLeadForm } from "@/components/home/contact-lead-form";
import { Button } from "@/components/ui/button";
import { WHATSAPP_DIRECT_LINK } from "@/lib/constants";
import { toFeaturedCar } from "@/lib/mock-featured-cars";

type AutoDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const formatCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatNumber = new Intl.NumberFormat("es-AR");

function getSafeReturnTo(value?: string): string {
  if (!value) return "/catalogo";
  if (!value.startsWith("/catalogo")) return "/catalogo";
  return value;
}

function formatLabel(value: string): string {
  if (value === "0km") return "0 km";
  return value.replaceAll("_", " ");
}

function getViewingNowCount(slug: string): number {
  const hash = slug.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return (hash % 14) + 3;
}

export default async function AutoDetailPage({ params, searchParams }: AutoDetailPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const rawReturnTo = Array.isArray(search.returnTo) ? search.returnTo[0] : search.returnTo;
  const returnTo = getSafeReturnTo(rawReturnTo);
  const car = await getCatalogCarBySlug(slug);

  if (!car) {
    notFound();
  }

  const whatsappMessage = encodeURIComponent(
    `Hola Car Advice, me interesa el ${car.brand} ${car.model} ${car.version} (${car.year}) que vi en el catálogo.`,
  );
  const whatsappHref = `${WHATSAPP_DIRECT_LINK}?text=${whatsappMessage}`;
  const reserveMessage = encodeURIComponent(
    `Hola Car Advice, quiero reservar el ${car.brand} ${car.model} ${car.version} (${car.year}). ¿Me comparten los próximos pasos?`,
  );
  const reserveHref = `${WHATSAPP_DIRECT_LINK}?text=${reserveMessage}`;
  const viewingNow = getViewingNowCount(car.slug);

  const similarCars = catalogCars
    .filter((item) => item.slug !== car.slug && (item.brand === car.brand || item.type === car.type))
    .slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-screen-xl px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:pb-10">
      <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
        <Link href="/" className="transition-colors hover:text-foreground">
          Inicio
        </Link>
        <span aria-hidden>/</span>
        <Link href={returnTo} className="transition-colors hover:text-foreground">
          Catálogo
        </Link>
        <span aria-hidden>/</span>
        <span className="font-medium text-foreground">{car.brand} {car.model}</span>
      </div>
      <Link
        href={returnTo}
        className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver al catálogo
      </Link>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
        <AutoImageGallery
          images={car.images}
          fallbackImage={car.coverImage}
          alt={`${car.brand} ${car.model} ${car.version}`}
          typeLabel={car.type}
          conditionLabel={formatLabel(car.condicion)}
        />

        <article className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-6">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-orange)]">
              Vehículo disponible
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-4xl">
              {car.brand} {car.model}
            </h1>
            <p className="text-base font-medium text-muted-foreground sm:text-lg">{car.version}</p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5">
              <CalendarDays className="size-4 text-[var(--brand-orange)]" />
              {car.year}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5">
              <Gauge className="size-4 text-[var(--brand-orange)]" />
              {formatNumber.format(car.km)} km
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/30 px-3 py-1.5">
              <GearboxIcon className="size-4 text-[var(--brand-orange)]" />
              {car.transmission}
            </span>
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-black/10 bg-muted/20 p-4">
            <p className="text-sm font-medium text-muted-foreground">Precio final</p>
            <p className="text-4xl font-black tracking-tight text-[var(--brand-black)] sm:text-5xl">
              {formatCurrency.format(car.priceArs)}
            </p>
            <p className="text-sm text-muted-foreground">
              Consultá financiación, permutas y disponibilidad inmediata.
            </p>
          </div>

          <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Información destacada
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {car.color && (
                <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-[var(--brand-black)]">
                  Color: {car.color}
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-[var(--brand-black)]">
                Condición: {formatLabel(car.condicion)}
              </span>
              {car.extras?.slice(0, 4).map((extra) => (
                <span
                  key={extra}
                  className="inline-flex items-center rounded-full border border-border bg-white px-3 py-1 text-xs font-medium text-[var(--brand-black)]"
                >
                  {extra}
                </span>
              ))}
            </div>
          </div>

          <AutoDetailActions
            slug={car.slug}
            priceArs={car.priceArs}
            whatsappHref={whatsappHref}
            reserveHref={reserveHref}
            viewingNow={viewingNow}
          />
          <div className="mt-3">
            <Link
              href={returnTo}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Volver al catálogo
            </Link>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <AutoDetailSpecs car={car} />

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-xl font-black uppercase tracking-tight text-[var(--brand-black)]">
            Te asesoramos
          </h2>
          <ContactLeadForm />
        </aside>
      </section>

      <AutoDetailCalculators
        vehicleLabel={`${car.brand} ${car.model} ${car.version} (${car.year})`}
        priceArs={car.priceArs}
      />

      <section className="mt-8 rounded-3xl border border-border bg-muted/20 p-4 sm:p-6">
        <div>
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl">
                Vehículos similares
              </h2>
              <p className="text-sm text-muted-foreground">
                Más opciones relacionadas para seguir comparando.
              </p>
            </div>
            <Button asChild variant="outline" className="hidden rounded-xl sm:inline-flex">
              <Link href="/catalogo">Ver todo el catálogo</Link>
            </Button>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {similarCars.map((similarCar) => (
              <CarCard
                key={similarCar.slug}
                car={toFeaturedCar(similarCar)}
                className="h-full"
                imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                detailHref={`/autos/${similarCar.slug}?returnTo=${encodeURIComponent(returnTo)}`}
              />
            ))}
          </div>
          <Button asChild variant="outline" className="mt-4 rounded-xl sm:hidden">
            <Link href="/catalogo">Ver todo el catálogo</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
