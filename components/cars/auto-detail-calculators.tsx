"use client";

import { useMemo, useState } from "react";
import { Calculator, CarFront, MessageCircle } from "lucide-react";
import { WHATSAPP_DIRECT_LINK } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AutoDetailCalculatorsProps = {
  vehicleLabel: string;
  priceArs: number;
  priceUsd?: number;
};

const formatCurrency = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

/** Formato argentino: separador de miles con punto (300.000.000) */
function formatThousands(value: number): string {
  if (Number.isNaN(value) || value < 0) return "0";
  return Math.round(value).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

/** Parsea string con o sin puntos a número */
function parseThousands(str: string): number {
  const digits = str.replace(/\D/g, "");
  if (digits === "") return 0;
  return Number(digits);
}

const TODAY = new Date();
const CURRENT_YEAR = TODAY.getFullYear();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function AutoDetailCalculators({
  vehicleLabel,
  priceArs,
  priceUsd = 0,
}: AutoDetailCalculatorsProps) {
  const isUsd = priceUsd > 0;
  const [downPayment, setDownPayment] = useState(Math.round(priceArs * 0.2));
  const [months, setMonths] = useState(48);
  const [annualRate, setAnnualRate] = useState(42);

  const [tradeBasePrice, setTradeBasePrice] = useState(22000000);
  const [tradeYear, setTradeYear] = useState(CURRENT_YEAR - 5);
  const [tradeKm, setTradeKm] = useState(75000);
  const [tradeCondition, setTradeCondition] = useState<"excelente" | "bueno" | "regular">("bueno");
  const [serviceHistory, setServiceHistory] = useState(true);

  const financing = useMemo(() => {
    const validatedDownPayment = clamp(downPayment, 0, priceArs);
    const principal = Math.max(priceArs - validatedDownPayment, 0);
    const safeMonths = clamp(months, 6, 84);
    const monthlyRate = clamp(annualRate, 0, 200) / 100 / 12;

    if (principal === 0) {
      return {
        financed: 0,
        installment: 0,
        total: 0,
        interest: 0,
      };
    }

    const installment =
      monthlyRate === 0
        ? principal / safeMonths
        : (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -safeMonths));
    const total = installment * safeMonths;
    const interest = total - principal;

    return {
      financed: principal,
      installment,
      total,
      interest,
    };
  }, [annualRate, downPayment, months, priceArs]);

  const valuation = useMemo(() => {
    const safeBasePrice = Math.max(tradeBasePrice, 1);
    const safeYear = clamp(tradeYear, 1990, CURRENT_YEAR);
    const safeKm = clamp(tradeKm, 0, 500000);
    const age = Math.max(CURRENT_YEAR - safeYear, 0);

    const yearFactor = clamp(1 - age * 0.055, 0.28, 1);
    const expectedKm = age * 15000;
    const kmDelta = Math.max(safeKm - expectedKm, 0);
    const kmFactor = clamp(1 - kmDelta * 0.0000025, 0.65, 1.04);
    const conditionFactor =
      tradeCondition === "excelente" ? 1.08 : tradeCondition === "bueno" ? 1 : 0.9;
    const serviceFactor = serviceHistory ? 1.03 : 0.97;

    const estimated = Math.round(
      safeBasePrice * yearFactor * kmFactor * conditionFactor * serviceFactor,
    );

    return {
      estimated: Math.max(estimated, 1000000),
      age,
      yearFactor,
      kmFactor,
    };
  }, [serviceHistory, tradeBasePrice, tradeCondition, tradeKm, tradeYear]);

  const financingWhatsappHref = useMemo(() => {
    const msg = encodeURIComponent(
      `Hola Car Advice, quiero avanzar con financiación para ${vehicleLabel}. Cuota estimada ${formatCurrency.format(financing.installment)} a ${months} meses, anticipo ${formatCurrency.format(clamp(downPayment, 0, priceArs))}.`,
    );
    return `${WHATSAPP_DIRECT_LINK}?text=${msg}`;
  }, [downPayment, financing.installment, months, priceArs, vehicleLabel]);

  const valuationWhatsappHref = useMemo(() => {
    const msg = encodeURIComponent(
      `Hola Car Advice, quiero tasar mi auto para permuta. Año ${tradeYear}, km ${tradeKm.toLocaleString("es-AR")}, estado ${tradeCondition}. Estimación ${formatCurrency.format(valuation.estimated)}.`,
    );
    return `${WHATSAPP_DIRECT_LINK}?text=${msg}`;
  }, [tradeCondition, tradeKm, tradeYear, valuation.estimated]);

  const fieldClassName =
    "mt-1 h-11 w-full rounded-lg border border-black/15 bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";

  if (isUsd) {
    return (
      <section className="mt-6 rounded-3xl border border-black/10 bg-muted/20 p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Este vehículo está publicado en USD. Consultá financiación y cuotas en pesos por WhatsApp.
        </p>
        <Button asChild className="mt-4 h-11 rounded-xl bg-emerald-600 text-sm text-white hover:bg-emerald-500">
          <a
            href={`${WHATSAPP_DIRECT_LINK}?text=${encodeURIComponent(`Hola Car Advice, quiero consultar financiación en pesos para ${vehicleLabel}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="size-4" aria-hidden />
            Consultar por WhatsApp
          </a>
        </Button>
      </section>
    );
  }

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-2">
      <article className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6">
        <div className="flex items-center gap-2">
          <Calculator className="size-5 text-[var(--brand-orange)]" aria-hidden />
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)]">
            Simulá tu financiación
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Cálculo real de cuota con sistema francés para una decisión rápida.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-[var(--brand-black)]">
            Precio del vehículo (ARS)
            <input
              type="text"
              readOnly
              value={formatThousands(priceArs)}
              className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-muted/40 px-3 text-sm text-muted-foreground"
            />
          </label>

          <label className="text-sm font-medium text-[var(--brand-black)]">
            Anticipo (ARS)
            <input
              type="text"
              inputMode="numeric"
              value={formatThousands(downPayment)}
              onChange={(event) =>
                setDownPayment(clamp(parseThousands(event.target.value), 0, priceArs))
              }
              className={fieldClassName}
            />
          </label>

          <label className="text-sm font-medium text-[var(--brand-black)]">
            Plazo (meses)
            <input
              type="number"
              inputMode="numeric"
              min={6}
              max={84}
              step={1}
              value={months}
              onChange={(event) => setMonths(Number(event.target.value || 6))}
              className={fieldClassName}
            />
          </label>
          <label className="text-sm font-medium text-[var(--brand-black)]">
            TNA (%)
            <input
              type="number"
              inputMode="decimal"
              min={0}
              max={200}
              step={0.1}
              value={annualRate}
              onChange={(event) => setAnnualRate(Number(event.target.value || 0))}
              className={fieldClassName}
            />
          </label>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-4" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Resultado estimado</p>
          <p className="mt-1 text-2xl font-black tracking-tight text-[var(--brand-black)]">
            {formatCurrency.format(financing.installment)} / mes
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Financiado: {formatCurrency.format(financing.financed)} · Interés total:{" "}
            {formatCurrency.format(financing.interest)}
          </p>
          <p className="text-sm text-muted-foreground">
            Total a pagar: {formatCurrency.format(financing.total)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            * Simulación orientativa sujeta a aprobación crediticia y condiciones vigentes.
          </p>
        </div>

        <Button asChild className="mt-4 h-11 w-full rounded-xl bg-emerald-600 text-sm text-white hover:bg-emerald-500">
          <a href={financingWhatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden />
            Consultar por este plan
          </a>
        </Button>
      </article>

      <article className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6">
        <div className="flex items-center gap-2">
          <CarFront className="size-5 text-[var(--brand-orange)]" aria-hidden />
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)]">
            Tasá tu usado
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Estimación real por año, kilometraje y estado general.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-[var(--brand-black)]">
            Valor base de mercado (ARS)
            <input
              type="text"
              inputMode="numeric"
              value={formatThousands(tradeBasePrice)}
              onChange={(event) =>
                setTradeBasePrice(Math.max(parseThousands(event.target.value), 1000000))
              }
              className={fieldClassName}
            />
          </label>

          <label className="text-sm font-medium text-[var(--brand-black)]">
            Año
            <input
              type="number"
              inputMode="numeric"
              min={1990}
              max={CURRENT_YEAR}
              step={1}
              value={tradeYear}
              onChange={(event) => setTradeYear(Number(event.target.value || CURRENT_YEAR))}
              className={fieldClassName}
            />
          </label>
          <label className="text-sm font-medium text-[var(--brand-black)]">
            Kilómetros
            <input
              type="text"
              inputMode="numeric"
              value={formatThousands(tradeKm)}
              onChange={(event) =>
                setTradeKm(clamp(parseThousands(event.target.value), 0, 500000))
              }
              className={fieldClassName}
            />
          </label>

          <div className="space-y-1.5">
            <span className="text-sm font-medium text-[var(--brand-black)]">Estado</span>
            <Select
              value={tradeCondition}
              onValueChange={(v) =>
                setTradeCondition(v as "excelente" | "bueno" | "regular")
              }
            >
              <SelectTrigger className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-background px-3 text-sm focus-visible:ring-[var(--brand-orange)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="excelente">Excelente</SelectItem>
                <SelectItem value="bueno">Bueno</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="text-sm font-medium text-[var(--brand-black)]">Service al día</span>
            <Select
              value={serviceHistory ? "si" : "no"}
              onValueChange={(v) => setServiceHistory(v === "si")}
            >
              <SelectTrigger className="mt-1 h-11 w-full rounded-lg border border-black/15 bg-background px-3 text-sm focus-visible:ring-[var(--brand-orange)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="si">Sí</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-4" aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Valor estimado de tasación
          </p>
          <p className="mt-1 text-2xl font-black tracking-tight text-[var(--brand-black)]">
            {formatCurrency.format(valuation.estimated)}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Antigüedad: {valuation.age} años · Factor año: {valuation.yearFactor.toFixed(2)} ·
            Factor km: {valuation.kmFactor.toFixed(2)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            * Valor de referencia sujeto a inspección presencial y documentación.
          </p>
        </div>

        <Button asChild className="mt-4 h-11 w-full rounded-xl bg-emerald-600 text-sm text-white hover:bg-emerald-500">
          <a href={valuationWhatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden />
            Solicitar tasación final
          </a>
        </Button>
      </article>
    </section>
  );
}
