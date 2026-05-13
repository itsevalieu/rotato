"use client";

import { PALETTE_COLORS } from "@/lib/constants";
import { Check } from "lucide-react";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string | undefined) => void;
  label?: string;
}

export default function ColorPicker({
  value,
  onChange,
  label = "Color",
}: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      <span className="block text-sm font-medium text-soft-brown">{label}</span>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange(undefined)}
          className={`w-8 h-8 rounded-full border-2 transition-all duration-200
            flex items-center justify-center
            ${!value ? "border-soft-brown scale-110" : "border-warm-gray-light/50 hover:border-warm-gray"}
            bg-white/60`}
          aria-label="No color"
        >
          {!value && <Check size={14} className="text-soft-brown" />}
        </button>
        {PALETTE_COLORS.map((c) => (
          <button
            key={c.hex}
            type="button"
            onClick={() => onChange(c.hex)}
            className={`w-8 h-8 rounded-full border-2 transition-all duration-200
              flex items-center justify-center
              ${value === c.hex ? "border-soft-brown scale-110" : "border-transparent hover:scale-105"}`}
            style={{ backgroundColor: c.hex }}
            aria-label={c.name}
          >
            {value === c.hex && <Check size={14} className="text-white" />}
          </button>
        ))}
      </div>
    </div>
  );
}
