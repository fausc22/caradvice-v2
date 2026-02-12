import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Fuel, Gauge, MessageCircle } from "lucide-react";
import { catalogCars, getCatalogCarBySlug } from "@/lib/catalog";
import { GearboxIcon } from "@/components/icons/gearbox-icon";
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

  const similarCars = catalogCars
    .filter((item) => item.slug !== car.slug && (item.brand === car.brand || item.type === car.type))
    .slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-screen-xl px-4 py-6 sm:px-6 sm:py-8">
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
        <article className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={car.coverImage}
              alt={`${car.brand} ${car.model} ${car.version}`}
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 64vw"
            />
            <span className="absolute left-4 top-4 inline-flex rounded-full border border-white/35 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur">
              {car.type}
            </span>
          </div>
        </article>

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

          <div className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <Button asChild className="h-11 rounded-xl text-sm">
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="size-4" aria-hidden />
                Consultar por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl text-sm">
              <Link href={returnTo}>Volver al catálogo</Link>
            </Button>
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <article className="rounded-3xl border border-black/10 bg-white p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6">
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-2xl">
            Especificaciones principales
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Información relevante para comparar este vehículo.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Marca / Modelo
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">
                {car.brand} {car.model}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Versión</p>
              <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">{car.version}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Año</p>
              <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">{car.year}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Kilometraje
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">
                {formatNumber.format(car.km)} km
              </p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Transmisión
              </p>
              <p className="mt-1 text-sm font-semibold text-[var(--brand-black)]">{car.transmission}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Combustible
              </p>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--brand-black)]">
                <Fuel className="size-4 text-[var(--brand-orange)]" aria-hidden />
                {car.fuel}
              </p>
            </div>
          </div>
        </article>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <h2 className="mb-3 text-xl font-black uppercase tracking-tight text-[var(--brand-black)]">
            Te asesoramos
          </h2>
          <ContactLeadForm />
        </aside>
      </section>

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
