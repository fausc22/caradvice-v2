"use client";

import { useState, useCallback, useId, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

const FIELD_STYLE =
  "h-10 min-h-[44px] w-full rounded-xl border border-border bg-card px-3 text-sm outline-none transition-all duration-300 ease-out placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-[var(--brand-orange)] touch-manipulation";

type DualRangeFilterProps = {
  label: string;
  min: number;
  max: number;
  valueMin?: number;
  valueMax?: number;
  step?: number;
  formatDisplay: (n: number) => string;
  onValueChange?: (min?: number, max?: number) => void;
  /** When true, onValueChange is called on slider/input change. When false, values stay local for form submit. */
  applyOnChange?: boolean;
  nameMin: string;
  nameMax: string;
  idPrefix?: string;
};

export function DualRangeFilter({
  label,
  min,
  max,
  valueMin,
  valueMax,
  step = 1,
  formatDisplay,
  onValueChange,
  applyOnChange = false,
  nameMin,
  nameMax,
  idPrefix = "",
}: DualRangeFilterProps) {
  const baseId = useId().replace(/:/g, "");
  const id = (s: string) => (idPrefix ? `${idPrefix}-${s}` : `${baseId}-${s}`);

  const [localMin, setLocalMin] = useState<string>(
    valueMin !== undefined ? String(valueMin) : "",
  );
  const [localMax, setLocalMax] = useState<string>(
    valueMax !== undefined ? String(valueMax) : "",
  );
  const commitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalMin(valueMin !== undefined ? String(valueMin) : "");
    setLocalMax(valueMax !== undefined ? String(valueMax) : "");
  }, [valueMin, valueMax]);

  useEffect(() => {
    return () => {
      if (commitTimeoutRef.current) {
        clearTimeout(commitTimeoutRef.current);
      }
    };
  }, []);

  const scheduleApply = useCallback(
    (nextMin?: number, nextMax?: number) => {
      if (!applyOnChange || !onValueChange) return;
      if (commitTimeoutRef.current) {
        clearTimeout(commitTimeoutRef.current);
      }
      commitTimeoutRef.current = setTimeout(() => {
        onValueChange(nextMin, nextMax);
      }, 450);
    },
    [applyOnChange, onValueChange],
  );

  const handleSliderChange = useCallback(
    (values: number[]) => {
      const [a, b] = values;
      const newMin = a === min ? undefined : a;
      const newMax = b === max ? undefined : b;
      setLocalMin(newMin !== undefined ? String(newMin) : "");
      setLocalMax(newMax !== undefined ? String(newMax) : "");
    },
    [min, max],
  );

  const handleSliderCommit = useCallback(
    (values: number[]) => {
      const [a, b] = values;
      const newMin = a === min ? undefined : a;
      const newMax = b === max ? undefined : b;
      scheduleApply(newMin, newMax);
    },
    [min, max, scheduleApply],
  );

  const handleInputBlurMin = useCallback(() => {
    const raw = localMin.trim();
    const num = raw ? Number(raw) : undefined;
    const valid =
      num === undefined || (!Number.isNaN(num) && num >= min && num <= max);
    if (applyOnChange && valid) {
      scheduleApply(num, valueMax);
    }
  }, [localMin, applyOnChange, scheduleApply, valueMax, min, max]);

  const handleInputBlurMax = useCallback(() => {
    const raw = localMax.trim();
    const num = raw ? Number(raw) : undefined;
    const valid =
      num === undefined || (!Number.isNaN(num) && num >= min && num <= max);
    if (applyOnChange && valid) {
      scheduleApply(valueMin, num);
    }
  }, [localMax, applyOnChange, scheduleApply, valueMin, min, max]);

  const low = localMin
    ? Math.min(Math.max(Number(localMin), min), max)
    : min;
  const high = localMax
    ? Math.min(Math.max(Number(localMax), min), max)
    : max;
  const sliderValue: [number, number] = [Math.min(low, high), Math.max(low, high)];

  const inputMinVal =
    localMin === "" ? "" : formatDisplay(Number(localMin));
  const inputMaxVal =
    localMax === "" ? "" : formatDisplay(Number(localMax));

  const placeholderMin = formatDisplay(min);
  const placeholderMax = formatDisplay(max);

  return (
    <div className="space-y-2">
      {label ? (
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </label>
      ) : null}
      <Slider
        value={sliderValue}
        onValueChange={handleSliderChange}
        onValueCommit={handleSliderCommit}
        min={min}
        max={max}
        step={step}
        className="w-full px-0"
      />
      <div className="grid grid-cols-2 gap-2">
        <input type="hidden" name={nameMin} value={localMin} />
        <Input
          id={id("min")}
          type="text"
          inputMode="numeric"
          value={inputMinVal}
          onChange={(e) => setLocalMin(e.target.value.replace(/\D/g, ""))}
          onBlur={handleInputBlurMin}
          placeholder={placeholderMin}
          className={FIELD_STYLE}
        />
        <input type="hidden" name={nameMax} value={localMax} />
        <Input
          id={id("max")}
          type="text"
          inputMode="numeric"
          value={inputMaxVal}
          onChange={(e) => setLocalMax(e.target.value.replace(/\D/g, ""))}
          onBlur={handleInputBlurMax}
          placeholder={placeholderMax}
          className={FIELD_STYLE}
        />
      </div>
    </div>
  );
}
