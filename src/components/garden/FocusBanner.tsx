"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, X } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { getIcon } from "@/components/ui/IconPicker";
import { SECTION_COLORS } from "@/lib/constants";

export default function FocusBanner() {
  const { state, dispatch } = useGarden();
  const project = state.projects.find((p) => p.id === state.focusProjectId);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className="mb-5 rounded-2xl border-2 p-4 flex items-center gap-3"
          style={{
            borderColor: project.color ?? SECTION_COLORS[project.section],
            backgroundColor: `${project.color ?? SECTION_COLORS[project.section]}12`,
          }}
        >
          <Target
            size={18}
            style={{ color: project.color ?? SECTION_COLORS[project.section] }}
            className="shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-warm-gray mb-0.5">
              Today&apos;s Focus
            </p>
            <div className="flex items-center gap-2">
              {project.icon && (() => {
                const Icon = getIcon(project.icon!);
                return (
                  <Icon
                    size={14}
                    style={{ color: project.color ?? SECTION_COLORS[project.section] }}
                    className="shrink-0"
                  />
                );
              })()}
              <p className="font-accent text-xl text-soft-brown truncate">
                {project.title}
              </p>
            </div>
            {project.nextTinyStep && (
              <p className="text-xs text-warm-gray mt-0.5 truncate italic">
                Next: {project.nextTinyStep}
              </p>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: "CLEAR_FOCUS" })}
            className="p-1.5 rounded-lg text-warm-gray hover:text-soft-brown hover:bg-white/40 transition-colors shrink-0"
            aria-label="Clear focus"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
