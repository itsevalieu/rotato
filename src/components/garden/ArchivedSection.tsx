"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Archive, ChevronDown, ArchiveRestore, Trash2 } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { timeAgo } from "@/lib/utils";
import { getIcon } from "@/components/ui/IconPicker";

export default function ArchivedSection() {
  const { state, dispatch } = useGarden();
  const [open, setOpen] = useState(false);

  const archived = state.projects.filter((p) => p.archived);

  if (archived.length === 0) return null;

  return (
    <div className="rounded-2xl border border-warm-gray-light/20 bg-white/20 mt-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 p-4 cursor-pointer group"
        aria-expanded={open}
      >
        <div className="p-2 rounded-xl text-warm-gray border border-warm-gray-light/30 bg-warm-gray/5">
          <Archive size={18} />
        </div>
        <div className="flex-1 text-left">
          <h2 className="font-accent text-xl text-warm-gray">Archived</h2>
          <p className="text-xs text-warm-gray/70">Projects you set aside</p>
        </div>
        <span className="text-xs text-warm-gray bg-parchment px-2 py-0.5 rounded-full">
          {archived.length}
        </span>
        <motion.div animate={{ rotate: open ? 0 : -90 }} transition={{ duration: 0.2 }}>
          <ChevronDown
            size={18}
            className="text-warm-gray group-hover:text-soft-brown transition-colors"
          />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-2">
              {archived.map((project) => {
                const Icon = project.icon ? getIcon(project.icon) : null;
                return (
                  <motion.div
                    key={project.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    className="flex items-center gap-3 bg-white/40 rounded-xl px-3 py-2.5 group/row"
                  >
                    {Icon && (
                      <Icon
                        size={14}
                        className="shrink-0 text-warm-gray"
                        style={project.color ? { color: project.color } : undefined}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-warm-gray truncate">
                        {project.title}
                      </p>
                      <p className="text-[11px] text-warm-gray/60">
                        archived · touched {timeAgo(project.lastTouchedAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover/row:opacity-100 transition-opacity">
                      <button
                        onClick={() =>
                          dispatch({ type: "UNARCHIVE_PROJECT", id: project.id })
                        }
                        className="p-1.5 rounded-lg text-warm-gray hover:text-sage hover:bg-sage/10 transition-colors"
                        aria-label="Unarchive"
                        title="Restore to garden"
                      >
                        <ArchiveRestore size={14} />
                      </button>
                      <button
                        onClick={() =>
                          dispatch({ type: "DELETE_PROJECT", id: project.id })
                        }
                        className="p-1.5 rounded-lg text-warm-gray hover:text-terracotta hover:bg-terracotta/10 transition-colors"
                        aria-label="Delete permanently"
                        title="Delete permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
