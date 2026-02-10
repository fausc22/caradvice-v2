"use client";

/**
 * Select custom para el hero (estilos propios, no nativo). Reutilizable con cualquier lista de options.
 */
import { useEffect, useRef, useState } from "react";
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
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-white/30 bg-white/15 px-3 py-2.5 text-left text-sm transition-colors",
          "focus:border-[var(--brand-orange)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-orange)]/50",
          open && "border-white/50 ring-2 ring-[var(--brand-orange)]/30"
        )}
      >
        <span className={cn(isPlaceholder && "text-white/70")}>{displayValue}</span>
        <ChevronDown
          className={cn("size-4 shrink-0 text-white/70 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-auto rounded-lg border border-white/20 bg-[var(--brand-black)] py-1 shadow-xl"
        >
          {options.map((option) => {
            const isSelected = option === value;
            const itemClass = isSelected
              ? "bg-white/15 text-[var(--brand-orange)]"
              : "hover:bg-white/10 hover:text-white";
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
                  "cursor-pointer px-3 py-2 text-sm text-white transition-colors first:rounded-t-md last:rounded-b-md",
                  itemClass
                )}
              >
                {option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
