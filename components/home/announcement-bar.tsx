"use client";

import { WHATSAPP_PHONE_FORMATTED } from "@/lib/constants";

const ANNOUNCEMENT_MESSAGES = [
  "0KM FINANCIADOS CON BANCOR",
  "TOMAMOS TU USADO EN PARTE DE PAGO",
  "PERMUTAS Y FINANCIACION A MEDIDA",
  "CASA CENTRAL: OCTAVIO PINTO 3024, CORDOBA",
  "SUCURSAL GRANADEROS: BV. LOS GRANADEROS 3110, CORDOBA",
  "SUCURSAL CARAFFA: AV. EMILIO CARAFFA 2883, CORDOBA",
  "POSTVENTA Y ALISTAJE: OCTAVIO PINTO 3169, CORDOBA",
  `CONTACTANOS AL ${WHATSAPP_PHONE_FORMATTED}`,
];

const ANNOUNCEMENT_TEXT = ANNOUNCEMENT_MESSAGES.join("   •   ");

export function AnnouncementBar() {
  return (
    <section
      aria-label="Novedades y ofertas"
      className="border-y border-[var(--brand-orange)]/25 bg-[var(--brand-black)] text-[var(--brand-offwhite)]"
    >
      <div className="announcement-track-wrap">
        <p className="sr-only">{ANNOUNCEMENT_TEXT}</p>
        <div className="announcement-track" aria-hidden>
          <span className="announcement-item">{ANNOUNCEMENT_TEXT}</span>
          <span className="announcement-item">{ANNOUNCEMENT_TEXT}</span>
          <span className="announcement-item">{ANNOUNCEMENT_TEXT}</span>
        </div>
      </div>
    </section>
  );
}
