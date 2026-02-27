"use client";

/**
 * Bloque combinado en VDP: tasación/permuta (Parte A) + financiación (Parte B).
 * El usuario puede usar solo permuta, solo financiación o ambas. Un solo CTA "Enviar por WhatsApp".
 */
import { useMemo, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, CarFront } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { WHATSAPP_DIRECT_LINK } from "@/lib/constants";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { inputClass } from "@/lib/form-styles";
import { cn } from "@/lib/utils";

export type AutoDetailPlanFormProps = {
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Cuota con sistema francés */
function calcInstallment(principal: number, months: number, annualRatePct: number): number {
  if (principal <= 0) return 0;
  const safeMonths = clamp(months, 6, 84);
  const monthlyRate = clamp(annualRatePct, 0, 200) / 100 / 12;
  if (monthlyRate === 0) return principal / safeMonths;
  return (
    (principal * monthlyRate) /
    (1 - Math.pow(1 + monthlyRate, -safeMonths))
  );
}

function buildPlanWhatsAppMessage(params: {
  vehicleLabel: string;
  priceArs: number;
  hasUsed: boolean;
  usedData?: {
    dominio: string;
    marca: string;
    modelo: string;
    version: string;
    ano: string;
    km: string;
    valorEstimado: number;
  };
  anticipo: number;
  valorUsado: number;
  aFinanciar: number;
  months: number;
  cuota: number;
  nombre: string;
  telefono: string;
}): string {
  const {
    vehicleLabel,
    priceArs,
    hasUsed,
    usedData,
    anticipo,
    valorUsado,
    aFinanciar,
    months,
    cuota,
    nombre,
    telefono,
  } = params;

  const lines: string[] = [
    `Hola Car Advice, me interesa ${vehicleLabel}.`,
    "",
  ];

  if (hasUsed && usedData) {
    lines.push("Quiero dar mi usado como parte de pago:");
    lines.push(`• Dominio: ${usedData.dominio || "—"}`);
    lines.push(`• Marca: ${usedData.marca || "—"}`);
    lines.push(`• Modelo: ${usedData.modelo || "—"}`);
    lines.push(`• Versión: ${usedData.version || "—"}`);
    lines.push(`• Año: ${usedData.ano || "—"}`);
    lines.push(`• KM: ${usedData.km || "—"}`);
    if (usedData.valorEstimado > 0) {
      lines.push(`Valor estimado: ${formatCurrency.format(usedData.valorEstimado)}`);
    }
    lines.push("");
  }

  lines.push(`Precio del vehículo: ${formatCurrency.format(priceArs)}`);
  lines.push(`Anticipo: ${formatCurrency.format(anticipo)}`);
  if (hasUsed && valorUsado > 0) {
    lines.push(`Valor de mi usado: ${formatCurrency.format(valorUsado)}`);
  }
  lines.push(`A financiar: ${formatCurrency.format(aFinanciar)} en ${months} meses`);
  lines.push(`Cuota estimada: ${formatCurrency.format(cuota)}/mes`);
  lines.push("");
  lines.push(`Contacto: ${nombre}, ${telefono}`);

  return lines.join("\n");
}

export function AutoDetailPlanForm({
  vehicleLabel,
  priceArs,
  priceUsd = 0,
}: AutoDetailPlanFormProps) {
  const isUsd = priceUsd > 0;

  const [hasUsed, setHasUsed] = useState(false);
  const [dominio, setDominio] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [version, setVersion] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [valorUsadoInput, setValorUsadoInput] = useState("");

  const [anticipo, setAnticipo] = useState(Math.round(priceArs * 0.2));
  const [months, setMonths] = useState(48);
  const [annualRate, setAnnualRate] = useState(42);

  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");

  const valorUsado = useMemo(() => {
    if (!hasUsed) return 0;
    return Math.max(parseThousands(valorUsadoInput), 0);
  }, [hasUsed, valorUsadoInput]);

  const aFinanciar = useMemo(() => {
    const ant = clamp(anticipo, 0, priceArs);
    return Math.max(priceArs - ant - valorUsado, 0);
  }, [anticipo, priceArs, valorUsado]);

  const cuota = useMemo(
    () => calcInstallment(aFinanciar, months, annualRate),
    [aFinanciar, months, annualRate]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setNombreError("");
      setTelefonoError("");
      const nameTrim = nombre.trim();
      const phoneTrim = telefono.trim();
      if (!nameTrim) {
        setNombreError("Ingresá tu nombre.");
        return;
      }
      if (!phoneTrim) {
        setTelefonoError("Ingresá tu teléfono.");
        return;
      }

      const message = buildPlanWhatsAppMessage({
        vehicleLabel,
        priceArs,
        hasUsed,
        usedData: hasUsed
          ? {
              dominio: dominio.trim(),
              marca: marca.trim(),
              modelo: modelo.trim(),
              version: version.trim(),
              ano: ano.trim(),
              km: km.trim(),
              valorEstimado: valorUsado,
            }
          : undefined,
        anticipo: clamp(anticipo, 0, priceArs),
        valorUsado,
        aFinanciar,
        months,
        cuota,
        nombre: nameTrim,
        telefono: phoneTrim,
      });

      const url = `${WHATSAPP_DIRECT_LINK}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
    },
    [
      vehicleLabel,
      priceArs,
      hasUsed,
      dominio,
      marca,
      modelo,
      version,
      ano,
      km,
      valorUsado,
      anticipo,
      aFinanciar,
      months,
      cuota,
      nombre,
      telefono,
    ]
  );

  if (isUsd) {
    return (
      <section className="mt-6 rounded-3xl border border-black/10 bg-background p-5 sm:p-6">
        <p className="text-sm text-muted-foreground">
          Este vehículo está publicado en USD. Consultá financiación y cuotas en pesos por WhatsApp.
        </p>
        <Button asChild className="mt-4 h-11 rounded-xl bg-[var(--whatsapp-green)] text-sm text-white hover:bg-[var(--whatsapp-green-hover)]">
          <a
            href={`${WHATSAPP_DIRECT_LINK}?text=${encodeURIComponent(`Hola Car Advice, quiero consultar financiación en pesos para ${vehicleLabel}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon className="size-4" aria-hidden />
            Consultar por WhatsApp
          </a>
        </Button>
      </section>
    );
  }

  return (
    <section className="mt-6 rounded-3xl border border-[var(--brand-gray)]/40 bg-card p-5 shadow-[0_12px_36px_rgba(0,0,0,0.06)] sm:p-6">
      <div className="flex items-center gap-2">
        <Calculator className="size-5 text-[var(--brand-orange)]" aria-hidden />
        <h2 className="text-xl font-black uppercase tracking-tight text-[var(--brand-black)] sm:text-2xl">
          Armá tu plan
        </h2>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Combiná tu usado, anticipo y financiación. Enviá tu plan por WhatsApp.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 space-y-5">
        {/* Parte A: ¿Tenés un usado? */}
        <div>
          <p className={cn("mb-3 text-sm font-semibold text-foreground")}>
            ¿Tenés un usado para dar?
          </p>
          <div
            role="tablist"
            aria-label="¿Tenés un usado?"
            className="inline-flex rounded-xl border border-black/15 bg-muted/30 p-0.5"
          >
            <button
              type="button"
              role="tab"
              aria-selected={!hasUsed}
              onClick={() => setHasUsed(false)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                !hasUsed
                  ? "bg-card text-[var(--brand-black)] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              No
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={hasUsed}
              onClick={() => setHasUsed(true)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                hasUsed
                  ? "bg-card text-[var(--brand-black)] shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sí
            </button>
          </div>

          <AnimatePresence initial={false}>
            {hasUsed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-4 space-y-4 border-t border-border pt-4">
                  <FormField
                    id="plan-dominio"
                    label="Dominio"
                    value={dominio}
                    onChange={(e) => setDominio(e.target.value)}
                    placeholder="Ej. AB 123 CD"
                  />
                  <FormField
                    id="plan-marca"
                    label="Marca"
                    value={marca}
                    onChange={(e) => setMarca(e.target.value)}
                    placeholder="Ej. Volkswagen"
                  />
                  <FormField
                    id="plan-modelo"
                    label="Modelo"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                    placeholder="Ej. Golf"
                  />
                  <FormField
                    id="plan-version"
                    label="Versión"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="Ej. Highline"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      id="plan-ano"
                      label="Año"
                      value={ano}
                      onChange={(e) => setAno(e.target.value)}
                      type="number"
                      placeholder="Ej. 2020"
                    />
                    <FormField
                      id="plan-km"
                      label="KM"
                      value={km}
                      onChange={(e) => setKm(e.target.value)}
                      placeholder="Ej. 45000"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="plan-valor-usado"
                      className="mb-1.5 block text-sm font-semibold text-foreground"
                    >
                      Valor estimado de tu usado (ARS)
                    </label>
                    <input
                      id="plan-valor-usado"
                      type="text"
                      inputMode="numeric"
                      value={valorUsadoInput ? formatThousands(parseThousands(valorUsadoInput)) : ""}
                      onChange={(e) =>
                        setValorUsadoInput(e.target.value.replace(/\D/g, ""))
                      }
                      className={cn(inputClass)}
                      placeholder="Opcional, para el cálculo"
                    />
                    <p className="text-xs text-muted-foreground">
                      Si no lo sabés, dejalo en blanco. Valor sujeto a inspección en sucursal.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Parte B: Financiación */}
        <div className="border-t border-border pt-5">
          <div className="flex items-center gap-2 mb-3">
            <CarFront className="size-5 text-[var(--brand-orange)]" aria-hidden />
            <p className="text-sm font-semibold text-foreground">
              ¿Cómo lo financiás?
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                Precio del vehículo (ARS)
              </label>
              <input
                type="text"
                readOnly
                value={formatThousands(priceArs)}
                className={cn(inputClass, "bg-muted/40 text-muted-foreground")}
              />
            </div>
            <FormField
              id="plan-anticipo"
              label="Anticipo (ARS)"
              value={formatThousands(anticipo)}
              onChange={(e) =>
                setAnticipo(clamp(parseThousands(e.target.value), 0, priceArs))
              }
            />
            {hasUsed && valorUsado > 0 && (
              <div className="sm:col-span-2 space-y-1">
                <span className="text-sm font-semibold text-foreground">
                  Valor de tu usado: {formatCurrency.format(valorUsado)}
                </span>
              </div>
            )}
            <div className="sm:col-span-2 space-y-1">
              <span className="text-sm font-semibold text-foreground">
                A financiar: {formatCurrency.format(aFinanciar)}
              </span>
            </div>
            <FormField
              id="plan-plazo"
              label="Plazo (meses)"
              value={String(months)}
              onChange={(e) =>
                setMonths(clamp(Number(e.target.value) || 6, 6, 84))
              }
              type="number"
            />
            <div className="space-y-1">
              <label className="mb-1.5 block text-sm font-semibold text-foreground">
                TNA (%)
              </label>
              <input
                type="number"
                inputMode="decimal"
                min={0}
                max={200}
                step={0.1}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value) || 0)}
                className={cn(inputClass)}
              />
            </div>
          </div>

          <div
            className="mt-4 rounded-2xl border border-[var(--brand-gray)]/40 bg-[var(--brand-cream)]/20 p-4"
            aria-live="polite"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Cuota estimada
            </p>
            <p className="mt-1 text-2xl font-black tracking-tight text-[var(--brand-black)]">
              {formatCurrency.format(cuota)} / mes
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              * Simulación orientativa sujeta a aprobación crediticia y condiciones vigentes.
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Valor del usado sujeto a inspección en sucursal.
            </p>
          </div>
        </div>

        {/* Contacto */}
        <div className="border-t border-border pt-5 space-y-4">
          <FormField
            id="plan-nombre"
            label="Nombre"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={nombreError}
            placeholder="Tu nombre"
          />
          <FormField
            id="plan-telefono"
            label="Teléfono"
            required
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            error={telefonoError}
            placeholder="351 515 8848"
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[var(--whatsapp-green)] text-sm font-semibold text-white hover:bg-[var(--whatsapp-green-hover)]"
        >
          <WhatsAppIcon className="size-5" aria-hidden />
          Enviar por WhatsApp
        </Button>
      </form>
    </section>
  );
}
