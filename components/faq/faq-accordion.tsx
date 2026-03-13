"use client";

import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

export function FaqAccordionItem({
  question,
  answer,
  className,
}: FaqItem & { className?: string }) {
  return (
    <details
      className={cn(
        "group rounded-lg border border-[var(--brand-gray)]/30 bg-card transition-colors [&[open]]:border-[var(--brand-orange)]/30 [&[open]]:bg-[var(--brand-orange-subtle)]/50",
        className,
      )}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 pl-4 pr-3 text-left text-sm font-medium text-[var(--brand-black)] outline-none transition-colors hover:bg-[var(--brand-orange-subtle)]/30 focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-inset [&::-webkit-details-marker]:hidden [&::marker]:hidden">
        <span className="min-w-0 flex-1">{question}</span>
        <ChevronDown
          className="size-5 shrink-0 text-[var(--brand-gray)] transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <div className="border-t border-[var(--brand-gray)]/20 px-4 pb-4 pt-3 text-sm leading-relaxed text-[var(--brand-dark)]">
        {answer}
      </div>
    </details>
  );
}

export function FaqAccordion({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {items.map((item, index) => (
        <FaqAccordionItem key={index} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
