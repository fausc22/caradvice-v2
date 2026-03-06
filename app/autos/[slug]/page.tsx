import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Gauge } from "lucide-react";
import {
  catalogCars,
  getCatalogCarBySlug,
  getCardVariant,
  getSoldLabelDisplay,
  hasOriginalPrice,
} from "@/lib/catalog";
import { AutoDetailActions } from "@/components/cars/auto-detail-actions";
import { AutoDetailPlanForm } from "@/components/cars/auto-detail-plan-form";
import { AutoDetailSpecs } from "@/components/cars/auto-detail-specs";
import { GearboxIcon } from "@/components/icons/gearbox-icon";
import { AutoImageGallery } from "@/components/cars/auto-image-gallery";
import { SimilarCarsCarousel } from "@/components/cars/similar-cars-carousel";
import { ContactLeadForm } from "@/components/home/contact-lead-form";
import { Button } from "@/components/ui/button";
import { WHATSAPP_DIRECT_LINK } from "@/lib/constants";
import { toFeaturedCar } from "@/lib/mock-featured-cars";
import { cn, formatVehiclePrice } from "@/lib/utils";

type AutoDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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

function normalizeText(value: string): string {
  return value.trim().toLowerCase();
}

function getAlternativeCars(slug: string) {
  const current = catalogCars.find((item) => item.slug === slug);
  if (!current) return [];

  const currentModel = normalizeText(current.model);
  const currentBrand = normalizeText(current.brand);
  const currentTipologia = current.tipologia;
  const currentPrice = current.priceArs > 0 ? current.priceArs : current.priceUsd * 1300;

  return catalogCars
    .filter((item) => item.slug !== slug)
    .map((item) => {
      const itemModel = normalizeText(item.model);
      const itemBrand = normalizeText(item.brand);
      const itemVariant = getCardVariant(item);
      const itemPrice = item.priceArs > 0 ? item.priceArs : item.priceUsd * 1300;
      const priceGap = Math.abs(itemPrice - currentPrice);
      let score = 0;

      // Prioridad 1: mismo modelo.
      if (itemModel === currentModel) score += 220;
      // Prioridad 2: misma marca + tipología.
      if (itemBrand === currentBrand) score += 110;
      if (item.tipologia === currentTipologia) score += 90;
      // Priorizamos unidades disponibles cuando corresponde.
      if (itemVariant !== "vendido") score += 50;
      // Prioridad 3: rango de precio cercano.
      if (priceGap <= 2_000_000) score += 40;
      else if (priceGap <= 5_000_000) score += 25;
      else if (priceGap <= 10_000_000) score += 10;

      return { item, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.item.year - a.item.year;
    })
    .slice(0, 8)
    .map(({ item }) => item);
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

  const variant = getCardVariant(car);
  const isOferta = variant === "oferta";
  const isOportunidad = variant === "oportunidad";
  const isVendido = variant === "vendido";

  const whatsappMessage = encodeURIComponent(
    isVendido
      ? `Hola Car Advice, vi vendido el ${car.brand} ${car.model} ${car.version} (${car.year}). ¿Tienen otra unidad del mismo modelo o alternativas similares?`
      : `Hola Car Advice, me interesa el ${car.brand} ${car.model} ${car.version} (${car.year}) que vi en el catálogo.`,
  );
  const whatsappHref = `${WHATSAPP_DIRECT_LINK}?text=${whatsappMessage}`;
  const reserveMessage = encodeURIComponent(
    `Hola Car Advice, quiero reservar el ${car.brand} ${car.model} ${car.version} (${car.year}). ¿Me comparten los próximos pasos?`,
  );
  const reserveHref = `${WHATSAPP_DIRECT_LINK}?text=${reserveMessage}`;
  const viewingNow = getViewingNowCount(car.slug);

  const similarCars = getAlternativeCars(car.slug);
  const sameModelAvailableCars = catalogCars
    .filter(
      (item) =>
        item.slug !== car.slug &&
        normalizeText(item.model) === normalizeText(car.model) &&
        getCardVariant(item) !== "vendido",
    )
    .slice(0, 6);
  const alternativeCarsWithoutSameModel = similarCars.filter(
    (item) => normalizeText(item.model) !== normalizeText(car.model),
  );
  const modelCatalogHref = `/catalogo?marca=${encodeURIComponent(car.brand)}&modelo=${encodeURIComponent(car.model)}`;

  const showOriginalPrice = hasOriginalPrice(car);
  const originalPriceFormatted = showOriginalPrice
    ? formatVehiclePrice(car.priceOriginalArs ?? 0, car.priceOriginalUsd ?? 0)
    : "";
  const soldLabelText = getSoldLabelDisplay(car.soldLabel);
  const opportunityBadges = isOportunidad
    ? (car.opportunityBadges ?? []).filter(Boolean)
    : [];
  const primaryOpportunityBadge = opportunityBadges[0];
  const extraOpportunityBadgesCount = Math.max(opportunityBadges.length - 1, 0);
  const availabilityLabel = isVendido
    ? "Unidad vendida"
    : isOferta
      ? "Oferta activa"
      : "Disponible";

  return (
    <main className="mx-auto w-full max-w-screen-xl px-4 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] pt-6 sm:px-6 sm:pt-8 lg:pb-10">
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
          cardVariant={car.cardVariant}
          soldLabel={car.soldLabel}
        />

        <article className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_40px_rgba(0,0,0,0.08)] sm:p-6">
          <div className="space-y-1">
            <p
              className={cn(
                "text-xs font-semibold uppercase tracking-[0.08em]",
                isVendido
                  ? "text-[var(--brand-black)]"
                  : isOferta
                    ? "text-[var(--brand-orange)]"
                    : "text-[var(--brand-orange)]",
              )}
            >
              {availabilityLabel}
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-4xl">
              {car.brand} {car.model}
            </h1>
            <p className="text-base font-medium text-muted-foreground sm:text-lg">{car.version}</p>
          </div>

          {primaryOpportunityBadge && (
            <div className="mt-4 rounded-2xl border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/8 p-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--brand-dark)]">
                Beneficios de esta unidad
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex rounded-full border border-[var(--brand-orange)]/35 bg-[var(--brand-orange)]/14 px-3 py-1 text-xs font-bold uppercase leading-tight tracking-wide text-[var(--brand-orange)]">
                  {primaryOpportunityBadge}
                </span>
                {extraOpportunityBadgesCount > 0 && (
                  <span className="inline-flex rounded-full border border-[var(--brand-gray)]/45 bg-card px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--brand-dark)]">
                    +{extraOpportunityBadgesCount} beneficio{extraOpportunityBadgesCount > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          )}

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

          <div className="mt-6 space-y-3 rounded-2xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-4">
            <p className="text-sm font-medium text-muted-foreground">
              {isVendido ? "Precio de referencia" : "Precio final"}
            </p>
            <div className="flex flex-wrap items-baseline gap-3">
              {isOferta && showOriginalPrice && (
                <p
                  className="text-2xl font-medium text-[var(--brand-gray)] line-through sm:text-3xl"
                  aria-hidden
                >
                  {originalPriceFormatted}
                </p>
              )}
              <p className="text-4xl font-black tracking-tight text-[var(--brand-black)] sm:text-5xl">
                {formatVehiclePrice(car.priceArs, car.priceUsd)}
              </p>
              {isOferta && car.discountPercent != null && car.discountPercent > 0 && (
                <span
                  className="inline-flex rounded-full bg-[var(--brand-orange)] px-3 py-1 text-sm font-bold text-white"
                  aria-hidden
                >
                  -{car.discountPercent}%
                </span>
              )}
              {isVendido && (
                <span
                  className="inline-flex rounded-full border border-[var(--brand-orange)]/45 bg-[var(--brand-orange)]/10 px-3 py-1 text-sm font-semibold uppercase tracking-wide text-[var(--brand-black)]"
                  aria-hidden
                >
                  {soldLabelText}
                </span>
              )}
            </div>
            {!isVendido && (
              <p className="text-sm text-muted-foreground">
                Consultá financiación, permutas y disponibilidad inmediata.
              </p>
            )}
            {isVendido && (
              <p className="text-sm text-muted-foreground">
                Esta unidad ya fue vendida. Te ayudamos a encontrar otra opción del mismo modelo o segmento.
              </p>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {isVendido ? "Información del modelo" : "Información destacada"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {car.color && (
                <span className="inline-flex items-center rounded-full border border-[var(--brand-gray)]/50 bg-card px-3 py-1 text-xs font-medium text-[var(--brand-black)]">
                  Color: {car.color}
                </span>
              )}
              <span className="inline-flex items-center rounded-full border border-[var(--brand-gray)]/50 bg-card px-3 py-1 text-xs font-medium text-[var(--brand-black)]">
                Condición: {formatLabel(car.condicion)}
              </span>
              {car.extras?.slice(0, 4).map((extra) => (
                <span
                  key={extra}
                  className="inline-flex items-center rounded-full border border-[var(--brand-gray)]/50 bg-card px-3 py-1 text-xs font-medium text-[var(--brand-black)]"
                >
                  {extra}
                </span>
              ))}
            </div>
          </div>

          <AutoDetailActions
            slug={car.slug}
            priceArs={car.priceArs}
            priceUsd={car.priceUsd}
            whatsappHref={whatsappHref}
            reserveHref={reserveHref}
            viewingNow={viewingNow}
            isSold={isVendido}
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

      {isVendido ? (
        <section className="mt-6 rounded-3xl border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/8 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:gap-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl">
              Esta unidad ya fue vendida
            </h2>
            <p className="max-w-3xl text-sm text-[var(--brand-dark)] sm:text-base">
              Seguimos teniendo opciones para vos. Te recomendamos empezar por el mismo modelo y, si no, explorar alternativas de la misma marca o tipología.
            </p>
            <div className="flex flex-wrap gap-2.5">
              {sameModelAvailableCars.length > 0 && (
                <Button asChild className="rounded-xl">
                  <Link href={modelCatalogHref}>Ver unidades de {car.model}</Link>
                </Button>
              )}
              <Button asChild variant="outline" className="rounded-xl">
                <Link href="/catalogo">Seguir viendo catálogo</Link>
              </Button>
            </div>
            {sameModelAvailableCars.length > 0 && (
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-dark)]">
                Encontramos {sameModelAvailableCars.length} unidad{sameModelAvailableCars.length > 1 ? "es" : ""} disponible{sameModelAvailableCars.length > 1 ? "s" : ""} del mismo modelo
              </p>
            )}
          </div>
        </section>
      ) : (
        <>
          <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <AutoDetailSpecs car={car} />

            <aside className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="mb-3 text-xl font-black uppercase tracking-tight text-[var(--brand-black)]">
                Te asesoramos
              </h2>
              <ContactLeadForm />
            </aside>
          </section>

          <AutoDetailPlanForm
            vehicleLabel={`${car.brand} ${car.model} ${car.version} (${car.year})`}
            priceArs={car.priceArs}
            priceUsd={car.priceUsd}
          />
        </>
      )}

      {isVendido && sameModelAvailableCars.length > 0 && (
        <section className="mt-8 rounded-3xl border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/6 p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl">
              Mismo modelo disponible
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Estas unidades de {car.model} son la mejor alternativa si buscabas este modelo puntual.
            </p>
          </div>
          <SimilarCarsCarousel
            cars={sameModelAvailableCars.map(toFeaturedCar)}
            returnTo={returnTo}
          />
          <div className="mt-6 flex justify-center">
            <Button asChild className="rounded-xl">
              <Link href={modelCatalogHref}>Ver más unidades de {car.model}</Link>
            </Button>
          </div>
        </section>
      )}

      <section className="mt-8 rounded-3xl border border-border bg-background p-4 sm:p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-3xl">
            {isVendido ? "Otras alternativas recomendadas" : "Vehículos similares"}
          </h2>
          {isVendido && (
            <p className="mt-1 text-sm text-muted-foreground">
              También te mostramos opciones de la misma marca o tipología, con rango de precio cercano.
            </p>
          )}
        </div>
        <SimilarCarsCarousel
          cars={(isVendido ? alternativeCarsWithoutSameModel : similarCars).map(toFeaturedCar)}
          returnTo={returnTo}
        />
        <div className="mt-6 flex justify-center">
          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/catalogo">Ver todo el catálogo</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
