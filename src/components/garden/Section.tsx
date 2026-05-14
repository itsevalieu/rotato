"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Shuffle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { SectionId } from "@/lib/types";
import { SECTION_META } from "@/lib/constants";
import { type ReactNode } from "react";

interface SectionProps {
  sectionId: SectionId;
  count: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onShuffle?: () => void;
  isOver?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  droppableProps?: Record<string, unknown>;
}

type LucideIconComponent = React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;

export default function Section({
  sectionId,
  count,
  collapsed,
  onToggleCollapse,
  onShuffle,
  isOver,
  children,
  footer,
  droppableProps,
}: SectionProps) {
  const meta = SECTION_META[sectionId];
  const Icon = (LucideIcons as Record<string, unknown>)[
    meta.icon
  ] as LucideIconComponent;

  const colorMap: Record<string, string> = {
    terracotta: "text-terracotta border-terracotta/20 bg-terracotta/5",
    "dusty-blue": "text-dusty-blue border-dusty-blue/20 bg-dusty-blue/5",
    sage: "text-sage border-sage/20 bg-sage/5",
    "muted-gold": "text-muted-gold border-muted-gold/20 bg-muted-gold/5",
  };

  const glowMap: Record<string, string> = {
    terracotta: "ring-2 ring-terracotta/30 bg-terracotta/5",
    "dusty-blue": "ring-2 ring-dusty-blue/30 bg-dusty-blue/5",
    sage: "ring-2 ring-sage/30 bg-sage/5",
    "muted-gold": "ring-2 ring-muted-gold/30 bg-muted-gold/5",
  };

  return (
    <motion.section
      layout
      className={`rounded-2xl border transition-all duration-300 ${
        isOver ? glowMap[meta.color] : "border-warm-gray-light/20 bg-white/30 dark:bg-white/[0.04] dark:border-white/[0.08]"
      }`}
      role="region"
      aria-label={`${meta.label} projects`}
      {...droppableProps}
    >
      <div className="flex items-center gap-3 p-4 group">
        <button
          onClick={onToggleCollapse}
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer text-left"
          aria-expanded={!collapsed}
        >
          <div className={`p-2 rounded-xl shrink-0 ${colorMap[meta.color]}`}>
            {Icon && <Icon size={20} />}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h2 className="font-accent text-xl text-soft-brown">
              {meta.label}
            </h2>
            <p className="text-xs text-warm-gray">{meta.description}</p>
          </div>
        </button>
        <span className="text-xs text-warm-gray bg-parchment px-2 py-0.5 rounded-full shrink-0">
          {count}
        </span>
        {onShuffle && count > 1 && (
          <button
            onClick={onShuffle}
            className="p-1.5 rounded-lg text-warm-gray hover:text-soft-brown hover:bg-parchment transition-colors shrink-0"
            aria-label="Shuffle section order"
            title="Shuffle"
          >
            <Shuffle size={14} />
          </button>
        )}
        <button
          onClick={onToggleCollapse}
          className="shrink-0"
          aria-label={collapsed ? "Expand section" : "Collapse section"}
          tabIndex={-1}
        >
          <motion.div
            animate={{ rotate: collapsed ? -90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={18} className="text-warm-gray group-hover:text-soft-brown transition-colors" />
          </motion.div>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4">
              {count === 0 ? (
                <p className="text-sm text-warm-gray italic text-center py-6 font-accent text-lg">
                  {meta.emptyMessage}
                </p>
              ) : (
                <div className="space-y-3">{children}</div>
              )}
              {footer && <div className="mt-3">{footer}</div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
