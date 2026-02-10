import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Gauge, CalendarDays } from "lucide-react";
import { featuredCars } from "@/lib/mock-featured-cars";
import { GearboxIcon } from "@/components/icons/gearbox-icon";
import { Button } from "@/components/ui/button";

type AutoDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

const formatCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

const formatNumber = new Intl.NumberFormat("es-AR");

export default async function AutoDetailPage({ params }: AutoDetailPageProps) {
  const { slug } = await params;
  const car = featuredCars.find((item) => item.slug === slug);

  if (!car) {
    notFound();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-screen-lg px-4 py-8 sm:px-6 sm:py-10">
      <Link
        href="/"
        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Volver al inicio
      </Link>

      <article className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="relative aspect-[16/9] w-full">
          <Image
            src={car.imageSrc}
            alt={`${car.title} ${car.version}`}
            fill
            className="object-cover object-center"
            priority
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <div className="space-y-1">
            <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-4xl">
              {car.title}
            </h1>
            <p className="text-base font-medium text-muted-foreground sm:text-lg">
              {car.version}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-sm">
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

          <div className="space-y-3 border-t border-border pt-5">
            <p className="text-sm font-medium text-muted-foreground">Precio final</p>
            <p className="text-4xl font-black tracking-tight text-[var(--brand-black)] sm:text-5xl">
              {formatCurrency.format(car.priceArs)}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild className="h-11 px-6 text-sm">
              <Link href="/catalogo">Ver más en catálogo</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 px-6 text-sm">
              <Link href="/">Volver al home</Link>
            </Button>
          </div>
        </div>
      </article>
    </main>
  );
}
