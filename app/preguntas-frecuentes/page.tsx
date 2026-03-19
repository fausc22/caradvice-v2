import type { Metadata } from "next";
import {
  AnimatedSection,
} from "@/components/ui/animated-section";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { FAQ_SECTIONS } from "@/lib/faq-content";

export async function generateMetadata(): Promise<Metadata> {
  const title = "Preguntas frecuentes | CAR ADVICE";
  const description =
    "Resolvé tus dudas sobre compra, financiación, venta de tu usado y documentación. Garantía, contacto por WhatsApp, transferencia y más.";

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: "https://caradvice.com.ar/preguntas-frecuentes",
      siteName: "CAR ADVICE",
      title,
      description,
      images: [
        {
          url: "https://caradvice.com.ar/IMG/logo_transparente.png",
          width: 1200,
          height: 630,
          alt: "CAR ADVICE - Preguntas frecuentes",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://caradvice.com.ar/IMG/logo_transparente.png"],
    },
    alternates: { canonical: "https://caradvice.com.ar/preguntas-frecuentes" },
  };
}

function buildFaqSchema() {
  const mainEntity = FAQ_SECTIONS.flatMap((section) =>
    section.items.map((item) => ({
      "@type": "Question" as const,
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: typeof item.answer === "string" ? item.answer : "",
      },
    })),
  );

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity,
  };
}

export default function PreguntasFrecuentesPage() {
  const faqSchema = buildFaqSchema();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen bg-background">
        {/* Encabezado con imagen de fondo (ruta + paisaje) */}
        <section
          className="relative flex min-h-[180px] flex-col justify-end overflow-hidden border-b border-[var(--brand-gray)]/20 bg-[var(--brand-dark)] sm:min-h-[200px] md:min-h-[220px]"
          aria-label="Título de la página"
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/WhatsApp%20Image%202026-03-09%20at%2015.24.47.jpeg')",
            }}
          />
          <div className="absolute inset-0 bg-black/50" />
          <div className="container relative z-10 mx-auto px-4 pb-6 pt-8 sm:px-6 sm:pb-8 sm:pt-10">
            <AnimatedSection
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="mx-auto max-w-3xl text-center"
            >
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl md:text-4xl">
                Preguntas frecuentes
              </h1>
              <p className="text-sm leading-relaxed text-white/90 sm:text-base">
                Resolvé dudas sobre la compra, financiación, venta de tu usado y documentación.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Bloques de FAQ por sección */}
        <section className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 md:py-12">
          <div className="mx-auto max-w-3xl space-y-10 sm:space-y-12">
            {FAQ_SECTIONS.map((section, sectionIndex) => (
              <AnimatedSection
                key={section.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: sectionIndex * 0.05 }}
              >
                <h2 className="mb-4 text-lg font-semibold text-[var(--brand-black)] sm:mb-5 sm:text-xl">
                  {section.title}
                </h2>
                <FaqAccordion items={section.items} />
              </AnimatedSection>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
