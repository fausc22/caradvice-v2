"use client";

import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ContactLeadForm() {
  return (
    <form
      className="rounded-2xl border border-[var(--brand-gray)]/40 bg-card p-4 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6"
      onSubmit={(event) => event.preventDefault()}
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
            name="name"
            type="text"
            placeholder="Tu nombre"
            className="h-11 min-h-[44px] w-full rounded-lg border border-[var(--brand-gray)]/50 bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
            style={{ fontSize: "16px" }}
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
            placeholder="tu@email.com"
            className="h-11 min-h-[44px] w-full rounded-lg border border-[var(--brand-gray)]/50 bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
            style={{ fontSize: "16px" }}
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
            name="phone"
            type="tel"
            placeholder="351 515 8848"
            className="h-11 min-h-[44px] w-full rounded-lg border border-[var(--brand-gray)]/50 bg-background px-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
            style={{ fontSize: "16px" }}
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
            name="message"
            placeholder="Contanos en qué podemos ayudarte..."
            rows={5}
            className="min-h-[44px] w-full resize-none rounded-lg border border-[var(--brand-gray)]/50 bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)]"
            style={{ fontSize: "16px" }}
          />
        </div>

        <Button
          type="submit"
          className="h-11 w-full rounded-xl bg-[var(--brand-orange)] text-base font-semibold text-white hover:bg-[var(--brand-orange-light)]"
        >
          <Send className="size-4" aria-hidden />
          Enviar
        </Button>
      </div>
    </form>
  );
}
