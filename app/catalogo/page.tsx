import { featuredCars } from "@/lib/mock-featured-cars";
import { CarCard } from "@/components/cars/car-card";

export default function CatalogPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-screen-xl px-4 py-8 sm:px-6 sm:py-10">
      <header className="mb-8 space-y-2">
        <h1 className="text-3xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-4xl">
          Catálogo
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Vehículos destacados y oportunidades seleccionadas.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {featuredCars.map((car) => (
          <CarCard
            key={car.slug}
            car={car}
            className="h-full"
            imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ))}
      </section>
    </main>
  );
}
