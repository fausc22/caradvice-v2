import Image from "next/image";
import Link from "next/link";

type PromoBannerProps = {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  firstCtaLabel: string;
  firstCtaHref: string;
  secondCtaLabel: string;
  secondCtaHref: string;
  bannerBgClass: string;
  titleColorClass: string;
  leftEffectClass: string;
  rightEffectClass: string;
  buttonBgClass: string;
};

function PromoBanner({
  title,
  description,
  imageSrc,
  imageAlt,
  firstCtaLabel,
  firstCtaHref,
  secondCtaLabel,
  secondCtaHref,
  bannerBgClass,
  titleColorClass,
  leftEffectClass,
  rightEffectClass,
  buttonBgClass,
}: PromoBannerProps) {
  return (
    <div className="space-y-3 sm:space-y-4">
      <article
        className={`relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-[var(--brand-gray)]/40 px-4 py-5 shadow-[0_10px_30px_rgba(0,0,0,0.08)] sm:px-6 sm:py-6 lg:px-7 lg:py-8 ${bannerBgClass}`}
      >
        <div
          className={`pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full blur-2xl ${leftEffectClass}`}
        />
        <div
          className={`pointer-events-none absolute -bottom-20 -right-16 h-56 w-56 rounded-full blur-3xl ${rightEffectClass}`}
        />

        <div className="relative flex flex-col items-center justify-center gap-4 text-center sm:gap-5">
          <div className="flex items-center justify-center">
            <Image
              src="/04%20Iso%20Negro.png"
              alt="Isologo Car Advice"
              width={180}
              height={180}
              className="h-20 w-auto object-contain opacity-85 sm:h-24 lg:h-28"
              sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 112px"
            />
          </div>

          <div>
            <p
              className={`text-2xl font-black uppercase tracking-tight sm:text-3xl lg:text-[2.1rem] ${titleColorClass}`}
            >
              {title}
            </p>
            <p className="mt-2 text-base font-medium text-[var(--brand-black)]/85 sm:text-lg">
              {description}
            </p>
          </div>

          <div className="flex items-center justify-center">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={520}
              height={280}
              className="h-auto w-full max-w-[220px] object-contain sm:max-w-[270px] lg:max-w-[340px]"
              sizes="(max-width: 640px) 220px, (max-width: 1024px) 270px, 340px"
              quality={95}
            />
          </div>
        </div>
      </article>

      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        <Link
          href={firstCtaHref}
          className={`inline-flex min-h-[40px] items-center justify-center rounded-xl border-2 border-black/25 px-4 py-2 text-sm font-semibold text-[var(--brand-black)] transition-all hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-background active:border-[var(--brand-orange)] active:bg-[var(--brand-orange)] active:text-white sm:min-h-[42px] ${buttonBgClass}`}
        >
          {firstCtaLabel}
        </Link>
        <Link
          href={secondCtaHref}
          className={`inline-flex min-h-[40px] items-center justify-center rounded-xl border-2 border-black/25 px-4 py-2 text-sm font-semibold text-[var(--brand-black)] transition-all hover:border-[var(--brand-orange)] hover:bg-[var(--brand-orange)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-2 focus-visible:ring-offset-background active:border-[var(--brand-orange)] active:bg-[var(--brand-orange)] active:text-white sm:min-h-[42px] ${buttonBgClass}`}
        >
          {secondCtaLabel}
        </Link>
      </div>
    </div>
  );
}

export function FinancingBanner() {
  return (
    <section className="mt-8 space-y-8 sm:mt-10 sm:space-y-10">
      <PromoBanner
        title="Financia con Bancor"
        description="Tu usado o 0km 100% financiado"
        imageSrc="/financiacion.png"
        imageAlt="Auto para financiación"
        firstCtaLabel="Mas Info"
        firstCtaHref="/catalogo"
        secondCtaLabel="Contactanos"
        secondCtaHref="/contacto"
        bannerBgClass="bg-[#88ddd5]"
        titleColorClass="text-[var(--brand-orange)]"
        leftEffectClass="bg-[var(--brand-orange)]/10"
        rightEffectClass="bg-black/10"
        buttonBgClass="bg-[#88ddd5]"
      />
      <PromoBanner
        title="Consignacion"
        description="Consigna fisica o virtual"
        imageSrc="/consigna.png"
        imageAlt="Autos para consignación"
        firstCtaLabel="Mas info"
        firstCtaHref="/catalogo"
        secondCtaLabel="Quiero consignar"
        secondCtaHref="/contacto"
        bannerBgClass="bg-[var(--brand-orange)]"
        titleColorClass="text-black"
        leftEffectClass="bg-black/15"
        rightEffectClass="bg-black/20"
        buttonBgClass="bg-[var(--brand-orange)]"
      />
    </section>
  );
}
