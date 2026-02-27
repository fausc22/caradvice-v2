import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Target, Eye, Award, Users } from "lucide-react";
import {
  AnimatedSection,
  AnimatedLink,
} from "@/components/ui/animated-section";

const teamMembers = [
  { name: "Ignacio Schuvarten", role: "ASESOR COMPRAS", email: "ischuvarten@caradvice.com.ar", image: "/IMG/about/ignacio1.jpg" },
  { name: "Fernando Gallardo", role: "ASESOR VENTAS", email: "fgallardo@caradvice.com.ar", image: "/IMG/about/DSC2418.jpg" },
  { name: "Javier Acosta", role: "ASESOR VENTAS", email: "jacosta@caradvice.com.ar", image: "/IMG/about/DSC2626.jpg" },
  { name: "Ignacio Valle", role: "ASESOR VENTAS", email: "ivalle@caradvice.com.ar", image: "/IMG/about/DSC2405.jpg" },
  { name: "Pablo Pedraza", role: "ASESOR VENTAS", email: "ppedraza@caradvice.com.ar", image: "/IMG/about/DSC2359.jpg" },
  { name: "Santiago Panizza", role: "ASESOR VENTAS", email: "spanizza@caradvice.com.ar", image: "/IMG/about/DSC2294.jpg" },
  { name: "Raúl Aranda", role: "ASESOR VENTAS", email: "raranda@caradvice.com.ar", image: "/IMG/about/DSC2542.jpg" },
  { name: "Nicolás Cazal", role: "ASESOR VENTAS", email: "ncazal@caradvice.com.ar", image: "/IMG/about/DSC2531.jpg" },
  { name: "Damian Alterman", role: "ASESOR VENTAS", email: "dalterman@caradvice.com.ar", image: "/IMG/about/IMG_2907.jpg" },
  { name: "Emmanuel Buscarolo", role: "ASESOR VENTAS", email: "ebuscarolo@caradvice.com.ar", image: "/IMG/about/emanuel.jpeg" },
  { name: "Fernando Escudero", role: "ASESOR VENTAS", email: "fescudero@caradvice.com.ar", image: "/IMG/about/IMG_2915.jpg" },
];

export async function generateMetadata(): Promise<Metadata> {
  const title = "Sobre CAR ADVICE | Concesionaria de Autos en Córdoba";
  const description =
    "Conocé CAR ADVICE, concesionaria de autos usados y 0km en Córdoba. Nuestra misión, visión y valores. Equipo profesional a tu servicio.";

  return {
    title,
    description,
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "es_AR",
      url: "https://caradvice.com.ar/nosotros",
      siteName: "CAR ADVICE",
      title,
      description,
      images: [
        {
          url: "https://caradvice.com.ar/IMG/logo_transparente.png",
          width: 1200,
          height: 630,
          alt: "CAR ADVICE - Sobre Nosotros",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["https://caradvice.com.ar/IMG/logo_transparente.png"],
    },
    alternates: { canonical: "https://caradvice.com.ar/nosotros" },
  };
}

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CAR ADVICE",
  url: "https://caradvice.com.ar",
  logo: "https://caradvice.com.ar/IMG/logo_transparente.png",
  description:
    "Concesionaria de autos usados y 0km en Córdoba. Compramos tu usado, vendemos tu auto por vos, financiamos tu auto.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Córdoba",
    addressRegion: "Córdoba",
    addressCountry: "AR",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+543515158848",
    contactType: "customer service",
    email: "consultas@caradvice.com.ar",
  },
  sameAs: ["https://www.instagram.com/caradvicearg/"],
};

export default function NosotrosPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Introducción */}
      <section className="relative min-h-[600px] overflow-hidden md:min-h-[700px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/IMG/about/Caraffa-12.jpg')",
            filter: "blur(8px)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
          <div className="flex justify-center md:justify-end">
            <AnimatedSection
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-2xl sm:p-8 md:p-10 lg:p-12"
            >
              <h1 className="mb-4 text-2xl font-bold tracking-tight text-foreground sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
                Quiénes somos
              </h1>
              <p className="mb-4 text-base leading-relaxed text-muted-foreground sm:mb-6 sm:text-lg md:text-xl">
                En CAR ADVICE nos destacamos por ofrecer{" "}
                <span className="font-bold text-foreground">
                  vehículos rigurosamente seleccionados
                </span>
                , con opciones de{" "}
                <span className="font-bold text-foreground">
                  financiación flexibles
                </span>{" "}
                y un servicio de{" "}
                <span className="font-bold text-foreground">postventa</span> que
                garantiza la satisfacción a largo plazo.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                Nuestra propuesta va más allá de la venta:{" "}
                <span className="font-bold text-foreground">
                  construimos confianza
                </span>{" "}
                a través de un enfoque cercano y transparente. Gracias a la
                estrategia de contenido digital, generamos valor real para nuestra
                comunidad, fidelizando clientes y posicionándonos como referentes en
                el sector.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Misión, Visión, Valores */}
      <section className="border-t border-border bg-background py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6 lg:gap-8">
            <AnimatedSection
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl bg-card p-6 text-center shadow-sm sm:p-8 md:p-10"
            >
              <div className="mb-4 flex justify-center sm:mb-6">
                <div className="flex size-14 items-center justify-center rounded-full bg-[var(--brand-orange)] sm:size-16">
                  <Target className="size-7 text-white" aria-hidden />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground sm:mb-6 sm:text-3xl md:text-4xl">
                Misión
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                Transformar la compra-venta de vehículos usados y 0km en una{" "}
                <span className="font-bold">solución integral</span>, brindando
                una experiencia{" "}
                <span className="font-bold">libre de preocupaciones.</span>
              </p>
            </AnimatedSection>

            <AnimatedSection
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl bg-card p-6 text-center shadow-sm sm:p-8 md:p-10"
            >
              <div className="mb-4 flex justify-center sm:mb-6">
                <div className="flex size-14 items-center justify-center rounded-full bg-[var(--brand-orange)] sm:size-16">
                  <Eye className="size-7 text-white" aria-hidden />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground sm:mb-6 sm:text-3xl md:text-4xl">
                Visión
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base md:text-lg">
                Ser la empresa{" "}
                <span className="font-bold">
                  referente del sector en Córdoba Capital
                </span>
                , en la cual los clientes confíen sus operaciones en nuestra
                experiencia y profesionalidad, a fin de obtener{" "}
                <span className="font-bold">resultados satisfactorios.</span>
              </p>
            </AnimatedSection>

            <AnimatedSection
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl bg-card p-6 text-center shadow-sm sm:p-8 md:p-10"
            >
              <div className="mb-4 flex justify-center sm:mb-6">
                <div className="flex size-14 items-center justify-center rounded-full bg-[var(--brand-orange)] sm:size-16">
                  <Award className="size-7 text-white" aria-hidden />
                </div>
              </div>
              <h2 className="mb-4 text-2xl font-bold text-foreground sm:mb-6 sm:text-3xl md:text-4xl">
                Valores
              </h2>
              <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground sm:space-y-3 sm:text-base md:text-lg">
                <li className="font-bold">Calidad</li>
                <li className="font-bold">Servicio Al Cliente</li>
                <li className="font-bold">Responsabilidad</li>
                <li className="font-bold">Trabajo En Equipo</li>
                <li className="font-bold">Transparencia</li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Nuestro Diferencial */}
      <section className="relative min-h-[600px] overflow-hidden md:min-h-[700px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/IMG/about/Caraffa-17.jpg')",
            filter: "blur(8px)",
            transform: "scale(1.1)",
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="container relative z-10 mx-auto px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:py-24">
          <div className="flex justify-center md:justify-end">
            <AnimatedSection
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-2xl rounded-2xl bg-card p-6 shadow-2xl sm:p-8 md:p-10 lg:p-12"
            >
              <h2 className="mb-3 text-xl font-bold text-foreground sm:mb-4 sm:text-2xl md:text-3xl">
                Nuestro diferencial
              </h2>
              <h3 className="mb-4 text-2xl font-bold text-foreground sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
                Oferta de valor
              </h3>
              <p className="mb-4 text-base leading-relaxed text-muted-foreground sm:mb-6 sm:text-lg md:text-xl">
                En CAR ADVICE nos destacamos por ofrecer{" "}
                <span className="font-bold text-foreground">
                  vehículos rigurosamente seleccionados
                </span>
                , con opciones de{" "}
                <span className="font-bold text-foreground">
                  financiación flexibles
                </span>{" "}
                y un servicio de{" "}
                <span className="font-bold text-foreground">postventa</span> que
                garantiza la satisfacción a largo plazo.
              </p>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
                Nuestra propuesta va más allá de la venta:{" "}
                <span className="font-bold text-foreground">
                  construimos confianza
                </span>{" "}
                a través de un enfoque cercano y transparente. Gracias a la
                estrategia de contenido digital, generamos valor real para nuestra
                comunidad, fidelizando clientes y posicionándonos como referentes
                en el sector.
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Nuestro Equipo */}
      <section className="border-t border-border bg-background py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatedSection
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 text-center sm:mb-10 md:mb-12"
          >
            <div className="mb-4 flex justify-center sm:mb-6">
              <AnimatedSection
                className="flex size-16 items-center justify-center rounded-full bg-[var(--brand-orange)] sm:size-20"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                <Users className="size-8 text-white" aria-hidden />
              </AnimatedSection>
            </div>
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:mb-4 sm:text-3xl md:text-4xl">
              Nuestro Equipo
            </h2>
            <p className="px-4 text-base italic text-muted-foreground sm:text-lg md:text-xl">
              &ldquo;Trabajamos para que la experiencia de nuestro cliente sea única.&rdquo;
            </p>
          </AnimatedSection>

          <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:gap-5 sm:px-6 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {teamMembers.map((member, index) => (
              <AnimatedSection
                key={member.email}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.03,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group overflow-hidden rounded-xl bg-card shadow-md transition-shadow hover:shadow-2xl"
              >
                <div className="relative h-48 overflow-hidden bg-muted sm:h-56 md:h-60 lg:h-64 xl:h-72">
                  {member.image ? (
                    <>
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Users className="size-14 text-muted-foreground" aria-hidden />
                    </div>
                  )}
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-[var(--brand-orange)] sm:text-xl">
                    {member.name}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[var(--brand-orange)] sm:text-sm">
                    {member.role}
                  </p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="relative overflow-hidden bg-[var(--brand-black)] py-12 text-white sm:py-16 md:py-20 lg:py-24">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/IMG/about/Granaderos-18.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative z-10 mx-auto px-4 text-center sm:px-6">
          <AnimatedSection
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="mb-4 text-2xl font-bold tracking-tight sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl">
              ¿Listo para encontrar tu próximo auto?
            </h2>
            <p className="mx-auto mb-6 max-w-2xl px-4 text-base text-white/90 sm:mb-8 sm:text-lg md:text-xl">
              Nuestro equipo está listo para ayudarte en cada paso del proceso
            </p>
            <div className="flex flex-col items-center justify-center gap-3 px-4 sm:flex-row sm:gap-4">
              <AnimatedLink
                href="/catalogo"
                className="inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand-orange)] px-6 py-3 font-bold text-white shadow-lg transition-colors hover:bg-[var(--brand-orange-light)] sm:w-auto sm:px-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver Autos Disponibles
              </AnimatedLink>
              <Link
                href="/contacto"
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/30 bg-white/10 px-6 py-3 font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:w-auto sm:px-8"
              >
                Contactanos
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  );
}
