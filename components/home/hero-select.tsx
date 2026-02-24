"use client";

/**
 * Select custom para el hero (estilos propios, no nativo). Reutilizable con cualquier lista de options.
 */
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type HeroSelectProps = {
  id: string;
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export function HeroSelect({ id, label, options, value, onChange, placeholder }: HeroSelectProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = value || placeholder || options[0];
  const isPlaceholder = !value || value === options[0];

  return (
    <div ref={containerRef} className="relative w-full">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <motion.button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1 }}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-[var(--brand-orange)]/40",
          "border-[var(--brand-cream)]/30 bg-[var(--brand-dark)]/40",
          open && "border-[var(--brand-cream)]/50 ring-1 ring-[var(--brand-orange)]/30",
          !isPlaceholder && [
            "border-[var(--brand-orange)]/50 bg-[var(--brand-orange)]/5",
            open && "border-[var(--brand-orange)]/60"
          ]
        )}
      >
        <span
          className={cn(
            isPlaceholder ? "text-[var(--brand-cream)]/80" : "text-[var(--brand-orange)]"
          )}
        >
          {displayValue}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="inline-flex"
        >
          <ChevronDown
            className={cn(
              "size-4 shrink-0",
              isPlaceholder ? "text-[var(--brand-cream)]/70" : "text-[var(--brand-orange)]/80"
            )}
            aria-hidden
          />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label={label}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute top-full left-0 right-0 z-50 mt-1.5 max-h-56 overflow-auto rounded-xl border border-[var(--brand-cream)]/20 bg-[var(--brand-black)]/95 py-1 shadow-xl backdrop-blur-sm"
          >
            {options.map((option) => {
              const isSelected = option === value;
              return (
                <li
                  key={option}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onChange(option);
                      setOpen(false);
                    }
                  }}
                  className={cn(
                    "relative cursor-pointer px-3 py-2 text-sm text-white transition-colors first:rounded-t-lg last:rounded-b-lg",
                    "hover:bg-[var(--brand-dark)]/50",
                    isSelected && "bg-[var(--brand-orange)]/10 text-[var(--brand-orange)]"
                  )}
                >
                  {isSelected && (
                    <span
                      className="absolute left-2 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-[var(--brand-orange)]"
                      aria-hidden
                    />
                  )}
                  {option}
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
