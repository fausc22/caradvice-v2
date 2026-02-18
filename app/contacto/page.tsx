import type { Metadata } from "next";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import {
  AnimatedSection,
  AnimatedLink,
} from "@/components/ui/animated-section";
import { WHATSAPP_LINK, WHATSAPP_PHONE_FORMATTED } from "@/lib/constants";

const sucursales = [
  {
    name: "CAR ADVICE | Casa Central",
    address: "Octavio Pinto 3024, Córdoba",
    map: `https://www.google.com/maps?q=${encodeURIComponent("Octavio Pinto 3024, Córdoba, Argentina")}&output=embed`,
    googleMapsUrl: "https://share.google/Z4OqenVjQoIF7wPGP",
    icon: "🏢",
    image: "/IMG/contacto/octavio_pinto.jpeg",
  },
  {
    name: "CAR ADVICE | Suc. Granaderos",
    address: "Bv. Los Granaderos 3110, X5009 Córdoba",
    map: `https://www.google.com/maps?q=${encodeURIComponent("Bv. Los Granaderos 3110, X5009 Córdoba, Argentina")}&output=embed`,
    googleMapsUrl: "https://share.google/QsggnorrlPRRIB1VR",
    icon: "🚗",
    image: "/IMG/contacto/granaderos.jpeg",
  },
  {
    name: "CAR ADVICE | Suc. Caraffa",
    address: "Av. Emilio Caraffa 2883, X5009 Córdoba",
    map: `https://www.google.com/maps?q=${encodeURIComponent("Av. Emilio Caraffa 2883, X5009 Córdoba, Argentina")}&output=embed`,
    googleMapsUrl: "https://share.google/Nxz0ZmIWATXnwfxhP",
    icon: "🏪",
    image: "/IMG/contacto/caraffa.jpeg",
  },
  {
    name: "CAR ADVICE | Alistaje y Postventa",
    address: "Octavio Pinto 3169, X5009 Córdoba",
    map: `https://www.google.com/maps?q=${encodeURIComponent("Octavio Pinto 3169, X5009 Córdoba, Argentina")}&output=embed`,
    googleMapsUrl: "https://share.google/HU1SMP4DvBeiwqd9Q",
    icon: "🔧",
    image: "/IMG/contacto/posventa.jpeg",
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const title = "Contacto CAR ADVICE | Concesionaria de Autos en Córdoba";
  const description =
    "Contactá con CAR ADVICE en Córdoba. 4 sucursales, horarios de atención y múltiples formas de contacto. Estamos para ayudarte.";

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: "https://caradvice.com.ar/contacto",
      siteName: "CAR ADVICE",
      title,
      description,
      images: [
        {
          url: "https://caradvice.com.ar/IMG/logo_transparente.png",
          width: 1200,
          height: 630,
          alt: "CAR ADVICE - Contacto",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://caradvice.com.ar/IMG/logo_transparente.png"],
    },
    alternates: { canonical: "https://caradvice.com.ar/contacto" },
  };
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  mainEntity: {
    "@type": "AutoDealer",
    name: "CAR ADVICE",
    url: "https://caradvice.com.ar",
    logo: "https://caradvice.com.ar/IMG/logo_transparente.png",
    description:
      "Concesionaria de autos usados y 0km en Córdoba. Compramos tu usado, vendemos tu auto por vos, financiamos tu auto.",
    address: [
      {
        "@type": "PostalAddress",
        streetAddress: "Octavio Pinto 3024",
        addressLocality: "Córdoba",
        addressRegion: "Córdoba",
        postalCode: "X5009",
        addressCountry: "AR",
        name: "CAR ADVICE | Casa Central",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Bv. Los Granaderos 3110",
        addressLocality: "Córdoba",
        addressRegion: "Córdoba",
        postalCode: "X5009",
        addressCountry: "AR",
        name: "CAR ADVICE | Suc. Granaderos",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Av. Emilio Caraffa 2883",
        addressLocality: "Córdoba",
        addressRegion: "Córdoba",
        postalCode: "X5009",
        addressCountry: "AR",
        name: "CAR ADVICE | Suc. Caraffa",
      },
      {
        "@type": "PostalAddress",
        streetAddress: "Octavio Pinto 3169",
        addressLocality: "Córdoba",
        addressRegion: "Córdoba",
        postalCode: "X5009",
        addressCountry: "AR",
        name: "CAR ADVICE | Alistaje y Postventa",
      },
    ],
    areaServed: {
      "@type": "City",
      name: "Córdoba",
      "@id": "https://www.wikidata.org/wiki/Q44210",
    },
    telephone: "+543515158848",
    email: "consultas@caradvice.com.ar",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
    sameAs: ["https://www.instagram.com/caradvicearg/"],
  },
};

export default function ContactoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--brand-black)] py-12 text-white sm:py-16 md:py-20 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/IMG/contacto/Granaderos-8.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <AnimatedSection
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center"
          >
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl">
              Sucursales
            </h1>
            <p className="mx-auto max-w-3xl px-4 text-base text-white/90 sm:text-lg md:text-xl lg:text-2xl">
              Visitanos hoy mismo y descubrí por qué somos la mejor opción para
              satisfacer tus necesidades automotrices.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Sucursales */}
      <section className="container mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20">
        <div className="mx-auto max-w-7xl space-y-10 sm:space-y-12">
          {sucursales.map((sucursal, index) => (
            <AnimatedSection
              key={sucursal.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="space-y-4 sm:space-y-6"
            >
              <h2 className="px-2 text-xl font-bold text-foreground sm:text-2xl md:text-3xl">
                {sucursal.name} | {sucursal.address}
              </h2>

              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <AnimatedSection
                  className="overflow-hidden rounded-2xl shadow-lg bg-card group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-56 overflow-hidden bg-muted sm:h-64 md:h-72 lg:h-80">
                    {sucursal.image ? (
                      <Image
                        src={sucursal.image}
                        alt={sucursal.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-5xl sm:text-6xl">
                          {sucursal.icon}
                        </span>
                      </div>
                    )}
                  </div>
                </AnimatedSection>

                <AnimatedSection
                  className="overflow-hidden rounded-2xl shadow-lg bg-card"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative h-56 bg-muted sm:h-64 md:h-72 lg:h-80">
                    <iframe
                      src={sucursal.map}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={sucursal.name}
                      className="absolute inset-0"
                    />
                  </div>
                </AnimatedSection>
              </div>

              <AnimatedSection className="rounded-2xl bg-card p-5 shadow-lg transition-shadow hover:shadow-xl sm:p-6 md:p-8">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start gap-3">
                    <MapPin
                      className="mt-1 size-5 shrink-0 text-[var(--brand-orange)] sm:size-6"
                      aria-hidden
                    />
                    <div>
                      <h3 className="mb-1 text-base font-bold text-foreground sm:text-lg md:text-xl">
                        {sucursal.name}
                      </h3>
                      <p className="text-sm text-muted-foreground sm:text-base md:text-lg">
                        {sucursal.address}
                      </p>
                    </div>
                  </div>
                  <AnimatedLink
                    href={sucursal.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-xl bg-[var(--brand-orange)] px-5 py-2.5 font-semibold text-white shadow-md transition-colors hover:bg-[var(--brand-orange-light)] hover:shadow-lg sm:py-3 sm:px-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ver en Google Maps
                  </AnimatedLink>
                </div>
              </AnimatedSection>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Formulario + Info contacto */}
      <section className="border-t border-border bg-muted/20 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
            <AnimatedSection
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:mb-4 sm:text-3xl md:text-4xl">
                Envíanos un mensaje
              </h2>
              <p className="mb-6 text-sm text-muted-foreground sm:mb-8 sm:text-base">
                Completá el formulario y nos pondremos en contacto a la brevedad.
              </p>
              <ContactForm />
            </AnimatedSection>

            <AnimatedSection
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h2 className="mb-6 font-bold tracking-tight text-foreground sm:mb-8 sm:text-2xl sm:text-3xl md:text-4xl">
                Contactanos
              </h2>

              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 sm:mb-8">
                <AnimatedLink
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                  whileHover={{ y: -5 }}
                  className="flex cursor-pointer flex-col items-center rounded-xl bg-card p-5 text-center shadow-md transition-shadow hover:shadow-xl sm:p-6"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--brand-orange)] sm:size-16">
                    <Phone className="size-6 text-white" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">
                    Teléfono
                  </h3>
                  <p className="font-semibold text-[var(--brand-orange)] transition-colors hover:text-[var(--brand-orange-light)] sm:text-lg">
                    {WHATSAPP_PHONE_FORMATTED}
                  </p>
                </AnimatedLink>

                <AnimatedLink
                  href="mailto:consultas@caradvice.com.ar"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                  whileHover={{ y: -5 }}
                  className="flex cursor-pointer flex-col items-center rounded-xl bg-card p-5 text-center shadow-md transition-shadow hover:shadow-xl sm:p-6"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--brand-orange)] sm:size-16">
                    <Mail className="size-6 text-white" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">
                    Email
                  </h3>
                  <p className="break-all text-sm font-semibold text-[var(--brand-orange)] transition-colors hover:text-[var(--brand-orange-light)] sm:text-base">
                    consultas@caradvice.com.ar
                  </p>
                </AnimatedLink>

                <AnimatedSection
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                  whileHover={{ y: -5 }}
                  className="flex flex-col items-center rounded-xl bg-card p-5 text-center shadow-md transition-shadow hover:shadow-xl sm:p-6"
                >
                  <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[var(--brand-orange)] sm:size-16">
                    <Clock className="size-6 text-white" aria-hidden />
                  </div>
                  <h3 className="mb-2 text-base font-bold text-foreground sm:text-lg">
                    Horarios
                  </h3>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Lunes a Viernes: 9:00 - 19:00
                    <br />
                    Sábados: 9:00 - 13:00
                  </p>
                </AnimatedSection>
              </div>

              <AnimatedSection
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="rounded-xl bg-card p-6 shadow-md sm:p-8"
              >
                <ul className="space-y-3 sm:space-y-4">
                  {sucursales.map((suc) => (
                    <li
                      key={suc.name}
                      className="flex items-start gap-3 text-sm text-muted-foreground transition-colors hover:text-[var(--brand-orange)] sm:text-base"
                    >
                      <MapPin
                        className="mt-1 size-4 shrink-0 text-[var(--brand-orange)] sm:size-5"
                        aria-hidden
                      />
                      <span>
                        <strong className="text-foreground">{suc.name}</strong>{" "}
                        | {suc.address}
                      </span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA WhatsApp */}
      <section className="relative overflow-hidden bg-gradient-to-br from-green-600 to-green-700 py-10 text-white sm:py-12 md:py-16">
        <div className="container relative z-10 mx-auto px-4 sm:px-6">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center"
          >
            <h2 className="mb-3 text-xl font-bold sm:mb-4 sm:text-2xl md:text-3xl">
              ¿Preferís hablar por WhatsApp?
            </h2>
            <p className="mb-5 px-4 text-base text-green-100 sm:mb-6 sm:text-lg">
              Chateá con nosotros y te respondemos al instante
            </p>
            <AnimatedLink
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-2.5 font-bold text-green-600 shadow-lg transition-colors hover:bg-green-50 sm:py-3 sm:px-8"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="size-6"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Abrir WhatsApp
            </AnimatedLink>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
