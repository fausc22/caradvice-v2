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
  "h-10 w-full rounded-xl border border-border bg-white px-3 text-sm font-medium text-[var(--brand-black)] shadow-xs transition-colors hover:border-[var(--brand-orange)]/40 focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] focus-visible:ring-offset-0 data-[placeholder]:text-muted-foreground";

type FilterSelectProps = {
  value: string;
  onValueChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  name?: string;
  id?: string;
  disabled?: boolean;
};

export function FilterSelect({
  value,
  onValueChange,
  options,
  placeholder,
  name,
  id,
  disabled,
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
        <SelectTrigger id={id} className={cn(TRIGGER_STYLE, "w-full")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className="rounded-xl border-border"
          position="popper"
          sideOffset={4}
        >
          <SelectItem
            value="__empty__"
            className="cursor-pointer rounded-lg focus:bg-[var(--brand-orange)]/10 focus:text-[var(--brand-orange)]"
          >
            {placeholder}
          </SelectItem>
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              className="cursor-pointer rounded-lg focus:bg-[var(--brand-orange)]/10 focus:text-[var(--brand-orange)] data-[state=checked]:bg-[var(--brand-orange)]/10 data-[state=checked]:text-[var(--brand-orange)]"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
