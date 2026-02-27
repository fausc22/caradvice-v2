"use client";

/**
 * Modal de Consignación ("Consignar mi auto").
 * Mismos campos de vehículo que Tasación + tipo (virtual / en sucursal) + contacto.
 * Al enviar: construye mensaje prearmado y abre WhatsApp.
 */
import { useState, useCallback } from "react";
import { Modal } from "@/components/ui/modal";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WHATSAPP_DIRECT_LINK } from "@/lib/constants";
import { inputClass } from "@/lib/form-styles";
import { cn } from "@/lib/utils";

export type ConsignacionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const COPY = {
  title: "Consignar mi auto",
  description:
    "Obtené un mejor precio que con venta directa. Nosotros publicamos tu auto, gestionamos consultas y te liquidamos a los 15 días de concretada la venta.",
  tipoLabel: "Tipo de consignación",
  tipoVirtual: "Consignación virtual",
  tipoSucursal: "En sucursal",
  submitLabel: "Enviar por WhatsApp",
} as const;

const TIPO_VALUES = ["virtual", "sucursal"] as const;
const TIPO_LABELS: Record<(typeof TIPO_VALUES)[number], string> = {
  virtual: COPY.tipoVirtual,
  sucursal: COPY.tipoSucursal,
};

function buildConsignacionMessage(data: {
  dominio: string;
  marca: string;
  modelo: string;
  version: string;
  ano: string;
  km: string;
  tipo: string;
  nombre: string;
  telefono: string;
  email: string;
}): string {
  const tipoLabel = TIPO_LABELS[data.tipo as (typeof TIPO_VALUES)[number]] ?? data.tipo;
  const lines: string[] = [
    "Hola Car Advice, quiero consignar mi auto.",
    "",
    "Vehículo:",
    `• Dominio: ${data.dominio || "—"}`,
    `• Marca: ${data.marca || "—"}`,
    `• Modelo: ${data.modelo || "—"}`,
    `• Versión: ${data.version || "—"}`,
    `• Año: ${data.ano || "—"}`,
    `• KM: ${data.km || "—"}`,
    `Tipo: ${tipoLabel}`,
    "",
    `Mi contacto: ${data.nombre}, ${data.telefono}${data.email ? `, ${data.email}` : ""}`,
  ];
  return lines.join("\n");
}

export function ConsignacionModal({ open, onOpenChange }: ConsignacionModalProps) {
  const [dominio, setDominio] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [version, setVersion] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [tipo, setTipo] = useState<(typeof TIPO_VALUES)[number]>("virtual");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");

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
        setTelefonoError("Ingresá tu teléfono para que te contactemos.");
        return;
      }

      const message = buildConsignacionMessage({
        dominio: dominio.trim(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        version: version.trim(),
        ano: ano.trim(),
        km: km.trim(),
        tipo,
        nombre: nameTrim,
        telefono: phoneTrim,
        email: email.trim(),
      });

      const url = `${WHATSAPP_DIRECT_LINK}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank", "noopener,noreferrer");
      onOpenChange(false);
    },
    [
      dominio,
      marca,
      modelo,
      version,
      ano,
      km,
      tipo,
      nombre,
      telefono,
      email,
      onOpenChange,
    ]
  );

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={COPY.title} size="md">
      <p className="mb-4 text-sm text-muted-foreground">{COPY.description}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <FormField
            id="consignacion-dominio"
            label="Dominio"
            value={dominio}
            onChange={(e) => setDominio(e.target.value)}
            placeholder="Ej. AB 123 CD"
          />
          <FormField
            id="consignacion-marca"
            label="Marca"
            value={marca}
            onChange={(e) => setMarca(e.target.value)}
            placeholder="Ej. Volkswagen"
          />
          <FormField
            id="consignacion-modelo"
            label="Modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="Ej. Golf"
          />
          <FormField
            id="consignacion-version"
            label="Versión"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="Ej. Highline"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="consignacion-ano"
              label="Año"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              type="number"
              placeholder="Ej. 2020"
            />
            <FormField
              id="consignacion-km"
              label="KM"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="Ej. 45000"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="consignacion-tipo" className="mb-1.5 block text-sm font-semibold text-foreground">
              {COPY.tipoLabel}
            </label>
            <Select value={tipo} onValueChange={(v) => setTipo(v as (typeof TIPO_VALUES)[number])}>
              <SelectTrigger
                id="consignacion-tipo"
                className={cn(inputClass, "w-full justify-between")}
              >
                <SelectValue placeholder="Elegí una opción" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="virtual">{COPY.tipoVirtual}</SelectItem>
                <SelectItem value="sucursal">{COPY.tipoSucursal}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 border-t border-border pt-4">
          <FormField
            id="consignacion-nombre"
            label="Nombre completo"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={nombreError}
            placeholder="Tu nombre"
          />
          <FormField
            id="consignacion-telefono"
            label="Teléfono"
            required
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            error={telefonoError}
            placeholder="351 515 8848"
          />
          <FormField
            id="consignacion-email"
            label="Email (opcional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            type="submit"
            className="h-11 w-full rounded-xl bg-[var(--whatsapp-green)] text-sm font-semibold text-white hover:bg-[var(--whatsapp-green-hover)]"
          >
            <WhatsAppIcon className="size-5" aria-hidden />
            {COPY.submitLabel}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-11 w-full rounded-xl border-[var(--brand-orange)]/80 text-sm font-semibold text-[var(--brand-orange)] hover:bg-[var(--brand-orange)]/10 hover:border-[var(--brand-orange)]"
          >
            Cerrar
          </Button>
        </div>
      </form>
    </Modal>
  );
}
