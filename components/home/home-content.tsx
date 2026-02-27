"use client";

/**
 * Contenido de la home en un solo componente cliente.
 * Centraliza el estado del modal de consignación para que tanto el Hero como el
 * banner de consignación lo abran (Fase 5).
 */
import { useState } from "react";
import Link from "next/link";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";
import { HeroSection } from "@/components/home/hero-section";
import { TipologiaBanner } from "@/components/home/tipologia-banner";
import { FinancingPromoBanner } from "@/components/home/financing-banner";
import { FeaturedCarsCarousel } from "@/components/home/featured-cars-carousel";
import { ConsignaBanner } from "@/components/home/consigna-banner";
import { ClientReviewsSection } from "@/components/home/client-reviews-section";
import { Button } from "@/components/ui/button";

export type HomeContentProps = {
  filtersMeta: CatalogFilterMetadata;
};

export function HomeContent({ filtersMeta }: HomeContentProps) {
  const [consignacionModalOpen, setConsignacionModalOpen] = useState(false);

  return (
    <>
      <HeroSection
        filtersMeta={filtersMeta}
        consignacionModalOpen={consignacionModalOpen}
        onConsignacionModalOpenChange={setConsignacionModalOpen}
      />

      <TipologiaBanner />

      <section className="border-t border-border bg-background px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden">
        <div className="container mx-auto max-w-screen-xl min-w-0">
          <FinancingPromoBanner />
        </div>
      </section>

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

      <section className="border-t border-border bg-background px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden">
        <div className="container mx-auto max-w-screen-xl min-w-0">
          <ConsignaBanner onConsignarClick={() => setConsignacionModalOpen(true)} />
        </div>
      </section>

      <ClientReviewsSection />
    </>
  );
}
