"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FORM_PLACEHOLDER_NAME,
  FORM_PLACEHOLDER_EMAIL,
  FORM_PLACEHOLDER_PHONE,
  FORM_PLACEHOLDER_MESSAGE,
  FORM_ERROR_NAME,
  FORM_ERROR_EMAIL,
  FORM_ERROR_PHONE,
  FORM_ERROR_MESSAGE,
  FORM_ERROR_SEND_GENERIC,
  FORM_SUCCESS_LEAD_TITLE,
  FORM_SUCCESS_LEAD_TEXT,
} from "@/lib/form-copy";

export type ContactLeadFormProps = {
  /** Etiqueta del vehículo para el lead (ej. "Volkswagen Golf Highline (2020)") */
  vehicleLabel?: string;
  /** Slug del vehículo para el lead */
  vehicleSlug?: string;
};

export function ContactLeadForm({ vehicleLabel, vehicleSlug }: ContactLeadFormProps) {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  });
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    const nameTrim = formData.nombre.trim();
    const emailTrim = formData.email.trim();
    const phoneTrim = formData.telefono.trim();
    const messageTrim = formData.mensaje.trim();

    if (!nameTrim) {
      setErrorMessage(FORM_ERROR_NAME);
      setFormStatus("error");
      return;
    }
    if (!emailTrim) {
      setErrorMessage(FORM_ERROR_EMAIL);
      setFormStatus("error");
      return;
    }
    if (!phoneTrim) {
      setErrorMessage(FORM_ERROR_PHONE);
      setFormStatus("error");
      return;
    }
    if (!messageTrim) {
      setErrorMessage(FORM_ERROR_MESSAGE);
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "vdp",
          name: nameTrim,
          email: emailTrim,
          phone: phoneTrim,
          message: messageTrim,
          vehicleLabel: vehicleLabel ?? undefined,
          vehicleSlug: vehicleSlug ?? undefined,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Error al enviar el mensaje.");
      }

      setFormStatus("success");
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (err: unknown) {
      setFormStatus("error");
      setErrorMessage(err instanceof Error ? err.message : FORM_ERROR_SEND_GENERIC);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass =
    "h-11 min-h-[44px] w-full rounded-lg border border-[var(--brand-gray)]/50 bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";
  const textareaClass =
    "min-h-[44px] w-full resize-none rounded-lg border border-[var(--brand-gray)]/50 bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";

  return (
    <form
      className="rounded-2xl border border-[var(--brand-gray)]/40 bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="space-y-4">
        <div>
          <label
            htmlFor="lead-name"
            className="mb-1.5 block text-sm font-semibold text-[var(--brand-black)]"
          >
            Nombre completo *
          </label>
          <input
            id="lead-name"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder={FORM_PLACEHOLDER_NAME}
            className={inputClass}
            style={{ fontSize: "16px" }}
            disabled={formStatus === "sending"}
          />
        </div>

        <div>
          <label
            htmlFor="lead-email"
            className="mb-1.5 block text-sm font-semibold text-[var(--brand-black)]"
          >
            Email *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder={FORM_PLACEHOLDER_EMAIL}
            className={inputClass}
            style={{ fontSize: "16px" }}
            disabled={formStatus === "sending"}
          />
        </div>

        <div>
          <label
            htmlFor="lead-phone"
            className="mb-1.5 block text-sm font-semibold text-[var(--brand-black)]"
          >
            Teléfono *
          </label>
          <input
            id="lead-phone"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            placeholder={FORM_PLACEHOLDER_PHONE}
            className={inputClass}
            style={{ fontSize: "16px" }}
            disabled={formStatus === "sending"}
          />
        </div>

        <div>
          <label
            htmlFor="lead-message"
            className="mb-1.5 block text-sm font-semibold text-[var(--brand-black)]"
          >
            Mensaje *
          </label>
          <textarea
            id="lead-message"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            placeholder={FORM_PLACEHOLDER_MESSAGE}
            rows={5}
            className={textareaClass}
            style={{ fontSize: "16px" }}
            disabled={formStatus === "sending"}
          />
        </div>

        <Button
          type="submit"
          disabled={formStatus === "sending"}
          className="h-11 w-full rounded-xl bg-[var(--brand-orange)] text-base font-semibold text-white hover:bg-[var(--brand-orange-light)] disabled:opacity-70"
        >
          {formStatus === "sending" ? (
            <>
              <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enviando...
            </>
          ) : formStatus === "success" ? (
            <>{FORM_SUCCESS_LEAD_TITLE}</>
          ) : (
            <>
              <Send className="size-4" aria-hidden />
              Enviar
            </>
          )}
        </Button>

        {formStatus === "error" && errorMessage && (
          <p className="text-center text-sm font-semibold text-destructive">
            {errorMessage}
          </p>
        )}

        {formStatus === "success" && (
          <p className="text-center text-sm font-semibold text-green-600">
            {FORM_SUCCESS_LEAD_TEXT}
          </p>
        )}
      </div>
    </form>
  );
}
