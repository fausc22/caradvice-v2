/**
 * Home — Página principal.
 * Secciones: hero (filtros + CTAs WhatsApp), ofertas, banners, contacto, footer.
 * Los datos de ofertas/destacados vendrán del backend (ej. React Query en /catalogo y aquí).
 */
import Image from "next/image";
import Link from "next/link";
import { Search, DollarSign, Wallet, Car } from "lucide-react";
import { HeroFilters } from "@/components/home/hero-filters";
import { TipologiaBanner } from "@/components/home/tipologia-banner";
import { FeaturedCarsCarousel } from "@/components/home/featured-cars-carousel";
import { FinancingBanner } from "@/components/home/financing-banner";
import { ContactLeadForm } from "@/components/home/contact-lead-form";
import { ClientReviewsSection } from "@/components/home/client-reviews-section";
import { Button } from "@/components/ui/button";
import {
  WHATSAPP_LINK_COMPRAR,
  WHATSAPP_LINK_VENDER,
  WHATSAPP_LINK_CONSIGNAR,
} from "@/lib/constants";
import { getCatalogFilterMetadata } from "@/lib/catalog";

export default async function Home() {
  const filtersMeta = await getCatalogFilterMetadata();

  return (
    <>
      {/* Hero: imagen, eslogan, filtros (→ /catalogo?tipo=...&marca=...&q=...) y CTAs WhatsApp */}
      <section className="relative min-h-[50vh] w-full overflow-hidden sm:min-h-[60vh] md:min-h-[70vh]" aria-label="Hero">
        <div className="absolute inset-0">
          <Image
            src="/hero-image.jpg"
            alt="Car Advice - Tu próximo destino comienza acá"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          <div
            className="absolute inset-0 bg-[var(--brand-black)]/50"
            aria-hidden
          />
        </div>
        <div className="relative flex min-h-[50vh] flex-col items-center justify-center px-4 py-12 text-center sm:min-h-[60vh] sm:py-16 md:min-h-[70vh]">
          <p className="mb-10 max-w-2xl text-xl font-semibold leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] sm:mb-12 sm:text-2xl md:mb-14 md:text-3xl md:leading-snug">
            Tu próximo destino comienza acá...
          </p>
          <HeroFilters filtersMeta={filtersMeta} />

          {/* CTAs: abren WhatsApp (links en lib/constants) */}
          <div className="mt-8 flex w-full max-w-2xl flex-row flex-wrap justify-center gap-3 sm:mt-10 sm:gap-5">
            <p className="w-full text-center text-sm font-medium text-white/80 sm:mb-1">
              ¿Qué querés hacer?
            </p>
            <a
              href={WHATSAPP_LINK_COMPRAR}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border-2 border-[var(--brand-orange)] bg-transparent px-3 py-2 text-sm font-semibold text-[var(--brand-orange)] transition-all hover:bg-[var(--brand-orange)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:bg-[var(--brand-orange)] active:text-white sm:min-h-[48px] sm:px-5 sm:py-3 sm:text-base"
            >
              <span className="flex h-4 w-0 shrink-0 items-center justify-center gap-0.5 overflow-hidden opacity-0 transition-[width,opacity] duration-200 group-hover:w-9 group-hover:opacity-100 group-focus-visible:w-9 group-focus-visible:opacity-100 group-active:w-9 group-active:opacity-100 sm:h-5 sm:group-hover:w-11 sm:group-focus-visible:w-11 sm:group-active:w-11">
                <Search className="size-4 shrink-0 sm:size-5" aria-hidden />
                <DollarSign className="size-4 shrink-0 sm:size-5" aria-hidden />
              </span>
              Comprar
            </a>
            <a
              href={WHATSAPP_LINK_VENDER}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border-2 border-[var(--brand-orange)] bg-transparent px-3 py-2 text-sm font-semibold text-[var(--brand-orange)] transition-all hover:bg-[var(--brand-orange)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:bg-[var(--brand-orange)] active:text-white sm:min-h-[48px] sm:px-5 sm:py-3 sm:text-base"
            >
              <span className="flex h-4 w-0 shrink-0 items-center overflow-hidden opacity-0 transition-[width,opacity] duration-200 group-hover:w-4 group-hover:opacity-100 group-focus-visible:w-4 group-focus-visible:opacity-100 group-active:w-4 group-active:opacity-100 sm:h-5 sm:group-hover:w-5 sm:group-focus-visible:w-5 sm:group-active:w-5">
                <Wallet className="size-4 sm:size-5" aria-hidden />
              </span>
              Vender
            </a>
            <a
              href={WHATSAPP_LINK_CONSIGNAR}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-[40px] items-center justify-center gap-2 rounded-xl border-2 border-[var(--brand-orange)] bg-transparent px-3 py-2 text-sm font-semibold text-[var(--brand-orange)] transition-all hover:bg-[var(--brand-orange)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 active:bg-[var(--brand-orange)] active:text-white sm:min-h-[48px] sm:px-5 sm:py-3 sm:text-base"
            >
              <span className="flex h-4 w-0 shrink-0 items-center overflow-hidden opacity-0 transition-[width,opacity] duration-200 group-hover:w-4 group-hover:opacity-100 group-focus-visible:w-4 group-focus-visible:opacity-100 group-active:w-4 group-active:opacity-100 sm:h-5 sm:group-hover:w-5 sm:group-focus-visible:w-5 sm:group-active:w-5">
                <Car className="size-4 sm:size-5" aria-hidden />
              </span>
              Consignar
            </a>
          </div>
        </div>
        </section>

      {/* Buscá por tipología: grid de 6 categorías → /catalogo?tipologia=... */}
      <TipologiaBanner />

      {/* Ofertas / Destacados: listado desde API (React Query) — placeholder por ahora */}
      <section
        id="ofertas"
        className="border-t border-border bg-muted/20 px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden"
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
          <FinancingBanner />
        </div>
      </section>

      {/* Contacto: formulario visual (sin envío real por ahora) */}
      <section className="border-t border-border bg-muted/20 px-4 py-8 sm:px-6 sm:py-12 overflow-x-hidden">
        <div className="container mx-auto max-w-3xl min-w-0">
          <h2 className="mb-4 text-center text-2xl font-black tracking-tight sm:text-3xl">
            Te ayudamos a encontrar tu vehículo
          </h2>
          <ContactLeadForm />
        </div>
      </section>

      <ClientReviewsSection />
    </>
  );
}
