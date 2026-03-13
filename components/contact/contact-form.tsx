"use client";

import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  FORM_PLACEHOLDER_NAME,
  FORM_PLACEHOLDER_EMAIL,
  FORM_PLACEHOLDER_PHONE,
  FORM_PLACEHOLDER_MESSAGE,
  FORM_ERROR_PRIVACIDAD,
  FORM_ERROR_SEND_GENERIC,
  FORM_SUCCESS_CONTACT_TITLE,
  FORM_SUCCESS_CONTACT_TEXT,
  FORM_PRIVACY_LINK,
} from "@/lib/form-copy";

export function ContactForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
    aceptaPrivacidad: false,
  });

  const [formStatus, setFormStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.aceptaPrivacidad) {
      setErrorMessage(FORM_ERROR_PRIVACIDAD);
      setFormStatus("error");
      return;
    }

    setFormStatus("sending");
    setErrorMessage("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "contact",
          name: formData.nombre,
          email: formData.email,
          phone: formData.telefono,
          message: formData.mensaje,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || FORM_ERROR_SEND_GENERIC);
      }

      setFormStatus("success");
      setFormData({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
        aceptaPrivacidad: false,
      });

      setTimeout(() => setFormStatus("idle"), 5000);
    } catch (err: unknown) {
      setFormStatus("error");
      setErrorMessage(err instanceof Error ? err.message : FORM_ERROR_SEND_GENERIC);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const inputClass =
    "h-11 w-full rounded-lg border border-black/15 bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]";

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-border bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 md:p-8"
    >
      <div className="space-y-4 sm:space-y-5">
        <div>
          <label
            htmlFor="contact-nombre"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Nombre completo *
          </label>
          <input
            id="contact-nombre"
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder={FORM_PLACEHOLDER_NAME}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Email *
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder={FORM_PLACEHOLDER_EMAIL}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="contact-telefono"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Teléfono *
          </label>
          <input
            id="contact-telefono"
            type="tel"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            placeholder={FORM_PLACEHOLDER_PHONE}
            className={inputClass}
          />
        </div>

        <div>
          <label
            htmlFor="contact-mensaje"
            className="mb-1.5 block text-sm font-semibold text-foreground"
          >
            Mensaje *
          </label>
          <textarea
            id="contact-mensaje"
            name="mensaje"
            value={formData.mensaje}
            onChange={handleChange}
            required
            rows={5}
            placeholder={FORM_PLACEHOLDER_MESSAGE}
            className="w-full resize-none rounded-lg border border-black/15 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
          />
        </div>

        <div>
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              name="aceptaPrivacidad"
              checked={formData.aceptaPrivacidad}
              onChange={handleChange}
              required
              className="mt-1 size-5 rounded border-border text-[var(--brand-orange)] focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
            />
            <span className="text-sm text-muted-foreground">
              Acepto las{" "}
              <a
                href={FORM_PRIVACY_LINK}
                className="font-semibold text-[var(--brand-orange)] hover:underline"
              >
                políticas de privacidad
              </a>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          disabled={formStatus === "sending"}
          className="h-12 w-full rounded-xl bg-[var(--brand-orange)] text-base font-semibold text-white hover:bg-[var(--brand-orange-light)] disabled:opacity-70"
        >
          {formStatus === "sending" ? (
            <>
              <span className="size-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Enviando...
            </>
          ) : formStatus === "success" ? (
            <>{FORM_SUCCESS_CONTACT_TITLE}</>
          ) : (
            <>
              <Send className="size-5" />
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
            {FORM_SUCCESS_CONTACT_TEXT}
          </p>
        )}
      </div>
    </form>
  );
}
