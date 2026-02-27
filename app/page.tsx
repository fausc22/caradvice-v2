/**
 * Home — Página principal.
 * Orden: hero, tipología, financiación, carrusel de autos, consignación, reseñas.
 */
import Link from "next/link";
import { HeroSection } from "@/components/home/hero-section";
import { TipologiaBanner } from "@/components/home/tipologia-banner";
import { FinancingPromoBanner } from "@/components/home/financing-banner";
import { FeaturedCarsCarousel } from "@/components/home/featured-cars-carousel";
import { ConsignaBanner } from "@/components/home/consigna-banner";
import { ClientReviewsSection } from "@/components/home/client-reviews-section";
import { Button } from "@/components/ui/button";
import { getCatalogFilterMetadata } from "@/lib/catalog";

export default async function Home() {
  const filtersMeta = await getCatalogFilterMetadata();

  return (
    <>
      <HeroSection filtersMeta={filtersMeta} />

      {/* Tipología: grid/carousel de 6 categorías → /catalogo?tipologia=... */}
      <TipologiaBanner />

      {/* Financiación: banner Bancor */}
      <section className="border-t border-border bg-background px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden">
        <div className="container mx-auto max-w-screen-xl min-w-0">
          <FinancingPromoBanner />
        </div>
      </section>

      {/* Carrusel ofertas / destacados / nuevos ingresos + CTA catálogo */}
      <section
        id="ofertas"
        className="border-t border-border bg-background px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden"
      >
        <div className="container mx-auto max-w-screen-xl min-w-0">
          <FeaturedCarsCarousel />
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="h-12 rounded-xl border border-black/10 bg-[var(--brand-orange)] px-7 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[var(--brand-orange-light)] sm:h-14 sm:px-8 sm:text-lg"
            >
              <Link href="/catalogo">Ver catálogo completo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Consignación */}
      <section className="border-t border-border bg-background px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden">
        <div className="container mx-auto max-w-screen-xl min-w-0">
          <ConsignaBanner />
        </div>
      </section>

      <ClientReviewsSection />
    </>
  );
}
