"use client";

/**
 * Legacy: hoy la VDP usa AutoDetailPlanForm. Si se reutiliza este bloque,
 * mantener la política: sin cuotas ni tasaciones publicadas como definitivas.
 */
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

function formatThousands(value: number): string {
  if (Number.isNaN(value) || value < 0) return "0";
  return Math.round(value).toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

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

  const [tradeYear, setTradeYear] = useState(CURRENT_YEAR - 5);
  const [tradeKm, setTradeKm] = useState(75000);
  const [tradeCondition, setTradeCondition] = useState<"excelente" | "bueno" | "regular">("bueno");
  const [serviceHistory, setServiceHistory] = useState(true);

  const financingWhatsappHref = useMemo(() => {
    const ant = clamp(downPayment, 0, priceArs);
    const msg = encodeURIComponent(
      `Hola Car Advice, quiero consultar financiación para ${vehicleLabel}. Anticipo aproximado ${formatCurrency.format(ant)}, plazo deseado ${months} meses.`,
    );
    return `${WHATSAPP_DIRECT_LINK}?text=${msg}`;
  }, [downPayment, months, priceArs, vehicleLabel]);

  const valuationWhatsappHref = useMemo(() => {
    const msg = encodeURIComponent(
      `Hola Car Advice, quiero consultar permuta/tasación. Vehículo de interés: ${vehicleLabel}. Mi usado: año ${tradeYear}, ${tradeKm.toLocaleString("es-AR")} km, estado ${tradeCondition}, service ${serviceHistory ? "al día" : "a regularizar"}.`,
    );
    return `${WHATSAPP_DIRECT_LINK}?text=${msg}`;
  }, [serviceHistory, tradeCondition, tradeKm, tradeYear, vehicleLabel]);

  const fieldClassName =
    "mt-1 h-11 w-full rounded-lg border border-black/15 bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";

  if (isUsd) {
    return (
      <section className="mt-6 rounded-3xl border border-black/10 bg-background p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Este vehículo está publicado en USD. Consultá financiación en pesos con un asesor por WhatsApp.
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
            Financiación
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Cargá anticipo y plazo; un asesor te confirma opciones reales por WhatsApp (sin cuota estimada en web).
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium text-[var(--brand-black)] sm:col-span-2">
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
              onChange={(event) => setMonths(clamp(Number(event.target.value) || 6, 6, 84))}
              className={fieldClassName}
            />
          </label>
        </div>

        <Button asChild className="mt-4 h-11 w-full rounded-xl bg-emerald-600 text-sm text-white hover:bg-emerald-500">
          <a href={financingWhatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden />
            Consultar financiación por WhatsApp
          </a>
        </Button>
      </article>

      <article className="rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6">
        <div className="flex items-center gap-2">
          <CarFront className="size-5 text-[var(--brand-orange)]" aria-hidden />
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)]">
            Tu usado / permuta
          </h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Enviá datos de tu unidad; la tasación la confirma un asesor en sucursal.
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
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

          <div className="space-y-1.5 sm:col-span-2">
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
          <div className="space-y-1.5 sm:col-span-2">
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

        <Button asChild className="mt-4 h-11 w-full rounded-xl bg-emerald-600 text-sm text-white hover:bg-emerald-500">
          <a href={valuationWhatsappHref} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" aria-hidden />
            Consultar permuta por WhatsApp
          </a>
        </Button>
      </article>
    </section>
  );
}
