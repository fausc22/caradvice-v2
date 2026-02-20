import Image from "next/image";
import Link from "next/link";
import { MessageCircle, X } from "lucide-react";
import type { CatalogCar } from "@/lib/catalog/types";
import { Button } from "@/components/ui/button";
import { formatVehiclePrice } from "@/lib/utils";
import { WHATSAPP_DIRECT_LINK } from "@/lib/constants";

type CompareTopBlockProps = {
  vehicles: CatalogCar[];
  removeHrefBySlug: Record<string, string>;
};

function buildWhatsAppHref(car: CatalogCar): string {
  const message = encodeURIComponent(
    `Hola Car Advice, me interesa el ${car.brand} ${car.model} ${car.version} (${car.year}) que vi en el catálogo.`,
  );
  return `${WHATSAPP_DIRECT_LINK}?text=${message}`;
}

export function CompareTopBlock({ vehicles, removeHrefBySlug }: CompareTopBlockProps) {
  return (
    <section className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card shadow-[0_12px_36px_rgba(0,0,0,0.06)] overflow-hidden">
      <header className="border-b border-[var(--brand-gray)]/40 px-4 py-4 sm:px-6">
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-2xl">
          Vehículos seleccionados
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Comparando {vehicles.length} de 5 vehículos.
        </p>
      </header>

      {/* Móvil: una columna (todo apilado, sin scroll horizontal). Desktop: grid 2–5 columnas */}
      <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {vehicles.map((car) => (
          <article
            key={car.slug}
            className="min-w-0 overflow-hidden rounded-2xl border border-[var(--brand-gray)]/40 bg-card shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
          >
            <div className="relative h-40 w-full sm:h-44">
              <Image
                src={car.coverImage}
                alt={`${car.brand} ${car.model} ${car.version}`}
                fill
                sizes="(max-width: 640px) 84vw, (max-width: 1024px) 50vw, 20vw"
                className="object-cover object-center"
              />
              <Button
                asChild
                size="icon-xs"
                variant="secondary"
                className="absolute right-2 top-2 rounded-full bg-white/90 hover:bg-white"
                aria-label={`Quitar ${car.brand} ${car.model} del comparador`}
              >
                <Link href={removeHrefBySlug[car.slug]}>
                  <X aria-hidden />
                </Link>
              </Button>
            </div>

            <div className="space-y-3 p-3 sm:p-4">
              <div>
                <p className="truncate text-sm font-black uppercase tracking-tight text-[var(--brand-black)]">
                  {car.brand} {car.model}
                </p>
                <p className="truncate text-xs text-muted-foreground">{car.version}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {car.year} • {car.km.toLocaleString("es-AR")} km
                </p>
              </div>

              <p className="text-xl font-black tracking-tight text-[var(--brand-black)]">
                {formatVehiclePrice(car.priceArs, car.priceUsd)}
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button asChild size="sm" variant="outline" className="rounded-lg">
                  <Link
                    href={`/autos/${car.slug}`}
                    aria-label={`Ver detalle de ${car.brand} ${car.model}`}
                  >
                    Ver detalle
                  </Link>
                </Button>
                <Button asChild size="sm" className="rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">
                  <a
                    href={buildWhatsAppHref(car)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Consultar ${car.brand} ${car.model} por WhatsApp`}
                  >
                    <MessageCircle className="size-4 shrink-0" aria-hidden />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
