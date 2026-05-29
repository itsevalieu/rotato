"use client";

import { SECTION_META, SECTION_ORDER, PALETTE_COLORS, ICON_OPTIONS } from "@/lib/constants";
import { getIcon } from "@/components/ui/IconPicker";
import type { SectionId } from "@/lib/types";
import type { FormStyleProps } from "./types";

interface MiniCardProps {
  title: string;
  description: string;
  nextTinyStep: string;
  tags: string;
  color: string | undefined;
  icon: string | undefined;
  section: SectionId;
}

function MiniCard({ title, description, nextTinyStep, tags, color, icon, section }: MiniCardProps) {
  const IconComp = icon ? getIcon(icon) : null;
  const parsedTags = tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  return (
    <div className="relative bg-white/80 rounded-xl shadow-warm border border-warm-gray-light/30 overflow-hidden transition-all duration-300">
      {color && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
          style={{ backgroundColor: color }}
        />
      )}
      <div className={`p-3 ${color ? "pl-5" : ""}`}>
        <div className="flex items-start gap-2 mb-2">
          {IconComp && (
            <IconComp size={15} className="text-soft-brown/60 mt-0.5 shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-soft-brown text-sm leading-tight truncate">
              {title || (
                <span className="text-warm-gray italic font-normal">your project</span>
              )}
            </h3>
            {description && (
              <p className="text-xs text-warm-gray/70 leading-snug mt-0.5 line-clamp-2">
                {description}
              </p>
            )}
          </div>
        </div>
        {nextTinyStep && (
          <p className="text-xs text-sage-dark/80 bg-sage/10 rounded px-2 py-0.5 line-clamp-1 mb-2">
            → {nextTinyStep}
          </p>
        )}
        {parsedTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {parsedTags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="text-[9px] bg-parchment text-warm-gray rounded-full px-2 py-0.5"
              >
                {t}
              </span>
            ))}
          </div>
        )}
        <div className="flex items-center justify-between pt-1.5 border-t border-warm-gray-light/15">
          <span className="text-[9px] text-warm-gray">{SECTION_META[section].label}</span>
          {color && (
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
          )}
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2 rounded-xl border border-warm-gray-light/50 bg-white/60 text-sm text-soft-brown placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-terracotta-light/50 transition-colors";

export default function LivePreviewForm({
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
    <form onSubmit={onSubmit}>
      <div className="flex gap-5">
        {/* Left — live preview */}
        <div className="hidden sm:flex w-44 shrink-0 flex-col gap-2">
          <p className="text-xs text-warm-gray uppercase tracking-[0.12em] font-medium">Preview</p>
          <MiniCard
            title={title}
            description={description}
            nextTinyStep={nextTinyStep}
            tags={tags}
            color={color}
            icon={icon}
            section={section}
          />
          <p className="text-[10px] text-warm-gray text-center">updates as you type</p>
        </div>

        {/* Right — form fields */}
        <div className="flex-1 space-y-3 min-w-0">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What are you creating?"
            required
            autoFocus
            className={inputClass}
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A few words about this..."
            rows={2}
            className={`${inputClass} resize-none`}
          />
          <input
            type="text"
            value={nextTinyStep}
            onChange={(e) => setNextTinyStep(e.target.value)}
            placeholder="Next tiny step..."
            className={inputClass}
          />
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
            className={inputClass}
          />
          <input
            type="text"
            value={inspirationText}
            onChange={(e) => setInspirationText(e.target.value)}
            placeholder="Inspired by..."
            className={inputClass}
          />

          {/* Section */}
          <div className="flex flex-wrap gap-1.5">
            {SECTION_ORDER.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSection(s)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-all border ${
                  section === s
                    ? "bg-parchment border-soft-brown text-soft-brown font-medium"
                    : "border-warm-gray-light/50 text-warm-gray hover:border-warm-gray hover:text-soft-brown"
                }`}
              >
                {SECTION_META[s].label}
              </button>
            ))}
          </div>

          {/* Colour + icon */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setColor(undefined)}
              className={`w-5 h-5 rounded-full border-2 bg-white/60 transition-all ${
                !color ? "border-soft-brown scale-110" : "border-warm-gray-light/30"
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
            <span className="text-warm-gray/50 mx-0.5 text-xs">|</span>
            {ICON_OPTIONS.slice(0, 8).map((name) => {
              const Icon = getIcon(name);
              if (!Icon) return null;
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setIcon(icon === name ? undefined : name)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    icon === name
                      ? "bg-parchment border-soft-brown/50 text-soft-brown"
                      : "border-warm-gray-light/40 text-warm-gray hover:text-soft-brown hover:border-warm-gray-light"
                  }`}
                  title={name}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              className="flex-1 py-2 bg-terracotta text-cream rounded-xl text-sm font-medium hover:bg-terracotta-dark transition-colors shadow-warm-sm"
            >
              {isEditing ? "Save Changes" : "Plant It"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-warm-gray hover:text-soft-brown hover:bg-parchment rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
