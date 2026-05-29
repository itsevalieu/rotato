"use client";

import { SECTION_META, SECTION_ORDER, PALETTE_COLORS, ICON_OPTIONS } from "@/lib/constants";
import { getIcon } from "@/components/ui/IconPicker";
import type { FormStyleProps } from "./types";

const inputBase =
  "bg-transparent border-0 border-b focus:outline-none transition-colors text-soft-brown placeholder:text-warm-gray";

export default function SentenceForm({
  title, setTitle,
  description, setDescription,
  inspirationText, setInspirationText,
  tags, setTags,
  nextTinyStep, setNextTinyStep,
  color, setColor,
  icon, setIcon,
  section, setSection,
  isEditing, onSubmit, onClose,
}: FormStyleProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <p className="text-xs text-warm-gray uppercase tracking-widest mb-2.5">
          {isEditing ? "tending to" : "i'm planting"}
        </p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="what are you creating?"
          required
          autoFocus
          className={`${inputBase} w-full text-2xl font-accent border-b-2 border-warm-gray-light focus:border-terracotta pb-1.5`}
        />
      </div>

      {/* Description — italic prose */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="a few words about this project..."
        rows={2}
        className={`${inputBase} w-full text-sm italic border-b border-warm-gray-light/60 focus:border-terracotta/60 pb-1 resize-none leading-relaxed`}
      />

      {/* Section — inline chips */}
      <div>
        <p className="text-xs text-warm-gray mb-2">it lives in</p>
        <div className="flex flex-wrap gap-1.5">
          {SECTION_ORDER.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`px-3 py-1.5 rounded-xl text-xs transition-all border ${
                section === s
                  ? "bg-parchment border-soft-brown text-soft-brown font-medium"
                  : "border-warm-gray-light/60 text-warm-gray hover:border-warm-gray hover:text-soft-brown"
              }`}
            >
              {SECTION_META[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Next tiny step — inline */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm text-warm-gray shrink-0">my first tiny step:</span>
        <input
          type="text"
          value={nextTinyStep}
          onChange={(e) => setNextTinyStep(e.target.value)}
          placeholder="the smallest possible action..."
          className={`${inputBase} flex-1 text-sm border-b border-warm-gray-light/60 focus:border-terracotta/60 pb-0.5`}
        />
      </div>

      {/* Secondary fields */}
      <div className="border-t border-warm-gray-light/30 pt-4 space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="tags..."
            className={`${inputBase} text-xs border-b border-warm-gray-light/50 focus:border-terracotta/50 pb-0.5`}
          />
          <input
            type="text"
            value={inspirationText}
            onChange={(e) => setInspirationText(e.target.value)}
            placeholder="inspired by..."
            className={`${inputBase} text-xs border-b border-warm-gray-light/50 focus:border-terracotta/50 pb-0.5`}
          />
        </div>

        {/* Color + icon strip */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <button
            type="button"
            onClick={() => setColor(undefined)}
            className={`w-5 h-5 rounded-full border-2 transition-all bg-white/60 ${
              !color ? "border-soft-brown scale-110" : "border-warm-gray-light/50"
            }`}
            title="No colour"
          />
          {PALETTE_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => setColor(c.hex)}
              className={`w-5 h-5 rounded-full border-2 transition-all ${
                color === c.hex ? "border-soft-brown scale-125" : "border-transparent hover:scale-105"
              }`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          ))}
          <span className="text-warm-gray/50 mx-1 text-xs">|</span>
          {ICON_OPTIONS.slice(0, 10).map((name) => {
            const Icon = getIcon(name);
            if (!Icon) return null;
            return (
              <button
                key={name}
                type="button"
                onClick={() => setIcon(icon === name ? undefined : name)}
                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                  icon === name
                    ? "bg-parchment border border-soft-brown/40 text-soft-brown"
                    : "text-warm-gray hover:text-soft-brown hover:bg-parchment/50"
                }`}
                title={name}
              >
                <Icon size={13} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-1">
        <button
          type="button"
          onClick={onClose}
          className="text-sm text-warm-gray hover:text-soft-brown transition-colors"
        >
          cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-terracotta text-cream rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors shadow-warm-sm"
        >
          {isEditing ? "Save Changes" : "Plant It 🌱"}
        </button>
      </div>
    </form>
  );
}
