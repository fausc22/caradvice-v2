"use client";

import TrustindexWidget from "@/components/trustindex/TrustindexWidget";

export function ClientReviewsSection() {
  return (
    <section className="border-t border-border bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="container mx-auto max-w-screen-xl">
        <div className="rounded-3xl bg-[var(--brand-cream)]/40 px-4 py-6 sm:px-8 sm:py-8">
          <div className="mb-5 flex justify-center">
            <h2 className="text-2xl font-black tracking-tight text-[var(--brand-black)] sm:text-4xl">
              Nuestros clientes dicen
            </h2>
          </div>

          <TrustindexWidget />
        </div>
      </div>
    </section>
  );
}
