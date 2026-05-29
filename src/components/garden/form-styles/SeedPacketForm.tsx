"use client";

import { Sprout } from "lucide-react";
import { SECTION_META, SECTION_ORDER, PALETTE_COLORS, ICON_OPTIONS } from "@/lib/constants";
import { getIcon } from "@/components/ui/IconPicker";
import type { FormStyleProps } from "./types";

const sectionLabel = "text-xs text-warm-gray uppercase tracking-[0.12em] mb-1.5 font-medium";

export default function SeedPacketForm({
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
  const headerColor = color || "#C67B5C";
  const IconComp = icon ? getIcon(icon) : null;

  return (
    <form onSubmit={onSubmit}>
      {/* Packet header band */}
      <div
        className="relative -mx-6 -mt-2 mb-5 h-20 rounded-xl overflow-hidden flex items-center justify-center"
        style={{ backgroundColor: headerColor }}
      >
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, white, white 1px, transparent 1px, transparent 8px)",
          }}
        />
        <div className="relative z-10 flex flex-col items-center gap-1">
          {IconComp ? (
            <IconComp size={32} className="text-white/90" />
          ) : (
            <Sprout size={32} className="text-white/90" />
          )}
          <span className="text-white/80 text-[9px] uppercase tracking-[0.2em] font-medium">
            {isEditing ? "edit planting" : "new planting"}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Seed name */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Seed Name"
          required
          autoFocus
          className="w-full text-center text-2xl font-accent text-soft-brown bg-transparent border-0 border-b-2 border-warm-gray-light focus:border-soft-brown pb-2 placeholder:text-warm-gray focus:outline-none transition-colors"
        />

        {/* Variety / description */}
        <div>
          <p className={sectionLabel}>Variety</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="describe this project..."
            rows={2}
            className="w-full text-sm text-soft-brown bg-parchment/40 rounded-lg px-3 py-2 border border-dashed border-warm-gray-light/60 focus:border-warm-gray-light resize-none placeholder:text-warm-gray focus:outline-none transition-colors"
          />
        </div>

        <div className="border-t border-dashed border-warm-gray-light/40 pt-3.5">
          <p className={sectionLabel}>Planting Notes</p>
          <input
            type="text"
            value={nextTinyStep}
            onChange={(e) => setNextTinyStep(e.target.value)}
            placeholder="first tiny action..."
            className="w-full text-sm text-soft-brown bg-transparent border-0 border-b border-dashed border-warm-gray-light/60 focus:border-soft-brown/60 pb-1 placeholder:text-warm-gray focus:outline-none transition-colors"
          />
        </div>

        <div className="border-t border-dashed border-warm-gray-light/40 pt-3.5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className={sectionLabel}>Tags</p>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="art, daily..."
                className="w-full text-xs text-soft-brown bg-transparent border-0 border-b border-dashed border-warm-gray-light/60 focus:border-soft-brown/60 pb-0.5 placeholder:text-warm-gray focus:outline-none transition-colors"
              />
            </div>
            <div>
              <p className={sectionLabel}>Inspired By</p>
              <input
                type="text"
                value={inspirationText}
                onChange={(e) => setInspirationText(e.target.value)}
                placeholder="a feeling, a moment..."
                className="w-full text-xs text-soft-brown bg-transparent border-0 border-b border-dashed border-warm-gray-light/60 focus:border-soft-brown/60 pb-0.5 placeholder:text-warm-gray focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Garden zone */}
        <div className="border-t border-dashed border-warm-gray-light/40 pt-3.5">
          <p className={sectionLabel}>Garden Zone</p>
          <div className="flex flex-wrap gap-1.5">
            {SECTION_ORDER.map((s) => {
              const Icon = getIcon(SECTION_META[s].icon);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSection(s)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                    section === s
                      ? "border-soft-brown bg-parchment text-soft-brown font-medium"
                      : "border-dashed border-warm-gray-light/60 text-warm-gray hover:border-warm-gray hover:text-soft-brown"
                  }`}
                >
                  {Icon && <Icon size={12} />}
                  {SECTION_META[s].label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colour & mark */}
        <div className="border-t border-dashed border-warm-gray-light/40 pt-3.5">
          <p className={sectionLabel}>Colour & Mark</p>
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setColor(undefined)}
              className={`w-6 h-6 rounded-full border-2 bg-white/60 transition-all ${
                !color ? "border-soft-brown scale-110" : "border-warm-gray-light/50"
              }`}
              title="No colour"
            />
            {PALETTE_COLORS.map((c) => (
              <button
                key={c.hex}
                type="button"
                onClick={() => setColor(c.hex)}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  color === c.hex ? "border-soft-brown scale-125" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            <span className="text-warm-gray/40 mx-0.5">·</span>
            {ICON_OPTIONS.slice(0, 8).map((name) => {
              const Icon = getIcon(name);
              if (!Icon) return null;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setIcon(icon === name ? undefined : name)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                    icon === name
                      ? "bg-parchment border-soft-brown/50 text-soft-brown"
                      : "border-warm-gray-light/40 text-warm-gray hover:text-soft-brown hover:border-warm-gray-light"
                  }`}
                  title={name}
                >
                  <Icon size={14} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-warm-gray hover:text-soft-brown transition-colors"
          >
            cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors shadow-warm-sm"
            style={{ backgroundColor: headerColor }}
          >
            {isEditing ? "Update Packet" : "Seal & Plant"}
          </button>
        </div>
      </div>
    </form>
  );
}
