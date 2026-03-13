"use client";

import { WHATSAPP_PHONE_FORMATTED } from "@/lib/constants";

const ANNOUNCEMENT_MESSAGES = [
  "SOLO POR ESTA SEMANA TRANSFERENCIA BONIFICADA",
  `CONTACTANOS AL ${WHATSAPP_PHONE_FORMATTED}`,
];

const ANNOUNCEMENT_TEXT = ANNOUNCEMENT_MESSAGES.join("   •   ");

export function AnnouncementBar() {
  return (
    <section
      aria-label="Novedades y ofertas"
      className="border-b border-[var(--brand-gray)]/40 bg-neutral-200 text-black"
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
