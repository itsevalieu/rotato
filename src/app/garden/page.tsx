"use client";

import { useState } from "react";
import { Plus, Sprout } from "lucide-react";
import { motion } from "framer-motion";
import { GardenProvider, useGarden } from "@/context/GardenContext";
import Header from "@/components/layout/Header";
import AmbientBackground from "@/components/layout/AmbientBackground";
import GardenBoard from "@/components/garden/GardenBoard";
import SearchFilter from "@/components/garden/SearchFilter";
import ProjectForm from "@/components/garden/ProjectForm";
import ArchivedSection from "@/components/garden/ArchivedSection";
import FocusBanner from "@/components/garden/FocusBanner";
import ActivityHeatmap from "@/components/garden/ActivityHeatmap";
import Button from "@/components/ui/Button";
import type { SectionId } from "@/lib/types";

const WIDE_MODES = new Set(["kanban", "three-panel"]);
const FULL_MODES = new Set(["quadrant", "deck", "river", "three-panel"]);

function GardenContent() {
  const { state } = useGarden();
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [createSection, setCreateSection] = useState<SectionId>("currently-playing");

  const isWide = WIDE_MODES.has(state.viewMode);
  const isFullBleed = FULL_MODES.has(state.viewMode);
  const containerClass = isWide
    ? "max-w-7xl mx-auto px-4 py-6"
    : "max-w-4xl mx-auto px-4 py-6";

  return (
    <>
      <AmbientBackground />
      <Header />

      <main id="main-content" className={containerClass}>
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <SearchFilter
              query={searchQuery}
              onQueryChange={setSearchQuery}
              tagFilter={tagFilter}
              onTagFilterChange={setTagFilter}
            />
          </div>
          <div className="flex gap-2 shrink-0">
            <Button
              onClick={() => {
                setCreateSection("currently-playing");
                setCreateOpen(true);
              }}
              icon={<Plus size={16} />}
              size="sm"
            >
              New Project
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                setCreateSection("seeds");
                setCreateOpen(true);
              }}
              icon={<Sprout size={16} />}
              size="sm"
            >
              Plant Seed
            </Button>
          </div>
        </div>

        {!isFullBleed && <FocusBanner />}
        <GardenBoard searchQuery={searchQuery} tagFilter={tagFilter} />
        {!isFullBleed && <ArchivedSection />}
        {!isFullBleed && <ActivityHeatmap />}
      </main>

      <ProjectForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultSection={createSection}
      />
    </>
  );
}

export default function GardenPage() {
  return (
    <GardenProvider>
      <GardenContent />
    </GardenProvider>
  );
}
