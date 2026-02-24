"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const TRIGGER_STYLE =
  "h-10 min-h-[44px] w-full rounded-xl border border-border bg-card px-3 text-sm font-medium text-[var(--brand-black)] shadow-xs transition-all duration-300 ease-out hover:border-[var(--brand-orange)]/50 focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-0 data-[placeholder]:text-muted-foreground";

type FilterSelectProps = {
  value: string;
  onValueChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  name?: string;
  id?: string;
  disabled?: boolean;
  /** Cuando true, el dropdown se muestra por encima de modales (z-index alto). */
  inModal?: boolean;
};

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  name,
  id,
  disabled,
  inModal = false,
}: FilterSelectProps) {
  return (
    <div className="relative">
      {name && (
        <input type="hidden" name={name} value={value} />
      )}
      <Select
        value={value || "__empty__"}
        onValueChange={(v) => onValueChange(v === "__empty__" ? "" : v)}
        disabled={disabled}
      >
        <SelectTrigger
          type="button"
          id={id}
          className={cn(
            TRIGGER_STYLE,
            "w-full",
            value && "border-[var(--brand-orange)]/40 text-[var(--brand-orange)]",
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "rounded-xl border border-[var(--brand-orange)]/20 shadow-lg transition-[transform,opacity] duration-300 ease-out",
            inModal && "z-[100]",
          )}
          position="popper"
          sideOffset={4}
        >
          <SelectItem
            value="__empty__"
            className="cursor-pointer rounded-lg transition-colors duration-200 focus:bg-[var(--brand-orange)]/10 focus:text-[var(--brand-orange)]"
          >
            {placeholder}
          </SelectItem>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer rounded-lg transition-colors duration-200 focus:bg-[var(--brand-orange)]/10 focus:text-[var(--brand-orange)] data-[state=checked]:bg-[var(--brand-orange)]/10 data-[state=checked]:font-medium data-[state=checked]:text-[var(--brand-orange)]"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
