"use client";

import { motion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import type { TimelineEntry } from "@/lib/types";
import { SECTION_META } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

interface ProjectTimelineProps {
  timeline: TimelineEntry[];
}

export default function ProjectTimeline({ timeline }: ProjectTimelineProps) {
  if (timeline.length === 0) return null;

  return (
    <div className="space-y-2 pt-2">
      <p className="text-xs font-medium text-warm-gray flex items-center gap-1">
        <Clock size={12} />
        Journey
      </p>
      <div className="space-y-1">
        {timeline.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-1.5 text-xs text-warm-gray"
          >
            <span className="font-medium">
              {SECTION_META[entry.from].label}
            </span>
            <ArrowRight size={10} />
            <span className="font-medium">
              {SECTION_META[entry.to].label}
            </span>
            <span className="text-warm-gray-light ml-auto">
              {timeAgo(entry.movedAt)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
