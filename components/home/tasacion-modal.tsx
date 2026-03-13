"use client";

/**
 * Modal de Tasación ("Tasá tu auto" / "Tomamos tu usado").
 * Si filtersMeta está disponible, Marca y Modelo son selects; si no, inputs de texto.
 * Al enviar: construye mensaje prearmado y abre WhatsApp.
 */
import { useState, useCallback, useMemo } from "react";
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
import { normalizeCatalogString } from "@/lib/catalog/params";
import type { CatalogFilterMetadata } from "@/lib/catalog/types";
import { inputClass } from "@/lib/form-styles";
import { cn } from "@/lib/utils";
import {
  FORM_PLACEHOLDER_NAME,
  FORM_PLACEHOLDER_EMAIL,
  FORM_PLACEHOLDER_PHONE,
  FORM_ERROR_NAME,
  FORM_ERROR_PHONE,
} from "@/lib/form-copy";

export type TasacionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Si se pasa, Marca y Modelo se muestran como selects con opciones del catálogo. */
  filtersMeta?: CatalogFilterMetadata;
};

const COPY = {
  title: "Tasá tu auto",
  description: "Completá los datos y te contactamos por WhatsApp.",
  placeholderMarca: "Elegí la marca",
  placeholderModelo: "Elegí el modelo",
  submitLabel: "Enviar por WhatsApp",
} as const;

function buildTasacionMessage(data: {
  dominio: string;
  marca: string;
  modelo: string;
  version: string;
  ano: string;
  km: string;
  nombre: string;
  telefono: string;
  email: string;
}): string {
  const lines: string[] = [
    "Hola Car Advice, quiero tasar mi auto para venta/permuta.",
    "",
    "Vehículo:",
    `• Dominio: ${data.dominio || "—"}`,
    `• Marca: ${data.marca || "—"}`,
    `• Modelo: ${data.modelo || "—"}`,
    `• Versión: ${data.version || "—"}`,
    `• Año: ${data.ano || "—"}`,
    `• KM: ${data.km || "—"}`,
    "",
    `Mi contacto: ${data.nombre}, ${data.telefono}${data.email ? `, ${data.email}` : ""}`,
  ];
  return lines.join("\n");
}

export function TasacionModal({ open, onOpenChange, filtersMeta }: TasacionModalProps) {
  const [dominio, setDominio] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [version, setVersion] = useState("");
  const [ano, setAno] = useState("");
  const [km, setKm] = useState("");
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [nombreError, setNombreError] = useState("");
  const [telefonoError, setTelefonoError] = useState("");

  const keyMarca = normalizeCatalogString(marca);
  const modelosOpciones = useMemo(() => {
    if (!filtersMeta || !marca.trim()) return [];
    return filtersMeta.modelsByBrand[keyMarca] ?? [];
  }, [filtersMeta, keyMarca, marca]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setNombreError("");
      setTelefonoError("");

      const nameTrim = nombre.trim();
      const phoneTrim = telefono.trim();
      if (!nameTrim) {
        setNombreError(FORM_ERROR_NAME);
        return;
      }
      if (!phoneTrim) {
        setTelefonoError(FORM_ERROR_PHONE);
        return;
      }

      const message = buildTasacionMessage({
        dominio: dominio.trim(),
        marca: marca.trim(),
        modelo: modelo.trim(),
        version: version.trim(),
        ano: ano.trim(),
        km: km.trim(),
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
            id="tasacion-dominio"
            label="Dominio"
            value={dominio}
            onChange={(e) => setDominio(e.target.value)}
            placeholder="Ej. AB 123 CD"
          />
          {filtersMeta ? (
            <>
              <div className="space-y-1">
                <label htmlFor="tasacion-marca" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Marca
                </label>
                <Select
                  value={marca || "__empty__"}
                  onValueChange={(v) => {
                    setMarca(v === "__empty__" ? "" : v);
                    setModelo("");
                  }}
                >
                  <SelectTrigger id="tasacion-marca" className={cn(inputClass, "w-full justify-between")}>
                    <SelectValue placeholder={COPY.placeholderMarca} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__">{COPY.placeholderMarca}</SelectItem>
                    {filtersMeta.brands.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label htmlFor="tasacion-modelo" className="mb-1.5 block text-sm font-semibold text-foreground">
                  Modelo
                </label>
                <Select
                  value={modelo || "__empty__"}
                  onValueChange={(v) => setModelo(v === "__empty__" ? "" : v)}
                  disabled={!marca.trim()}
                >
                  <SelectTrigger id="tasacion-modelo" className={cn(inputClass, "w-full justify-between")}>
                    <SelectValue placeholder={COPY.placeholderModelo} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__empty__">{COPY.placeholderModelo}</SelectItem>
                    {modelosOpciones.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          ) : (
            <>
              <FormField
                id="tasacion-marca"
                label="Marca"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                placeholder="Ej. Volkswagen"
              />
              <FormField
                id="tasacion-modelo"
                label="Modelo"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                placeholder="Ej. Golf"
              />
            </>
          )}
          <FormField
            id="tasacion-version"
            label="Versión (opcional)"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="Ej. Highline (opcional)"
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              id="tasacion-ano"
              label="Año"
              value={ano}
              onChange={(e) => setAno(e.target.value)}
              type="number"
              placeholder="Ej. 2020"
            />
            <FormField
              id="tasacion-km"
              label="KM"
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="Ej. 45000"
            />
          </div>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <FormField
            id="tasacion-nombre"
            label="Nombre completo"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            error={nombreError}
            placeholder={FORM_PLACEHOLDER_NAME}
          />
          <FormField
            id="tasacion-telefono"
            label="Teléfono"
            required
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            error={telefonoError}
            placeholder={FORM_PLACEHOLDER_PHONE}
          />
          <FormField
            id="tasacion-email"
            label="Email (opcional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={FORM_PLACEHOLDER_EMAIL}
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
