"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { GardenProvider, useGarden } from "@/context/GardenContext";
import { ToastProvider } from "@/context/ToastContext";
import Header from "@/components/layout/Header";
import AmbientBackground from "@/components/layout/AmbientBackground";
import GardenBoard from "@/components/garden/GardenBoard";
import SearchFilter from "@/components/garden/SearchFilter";
import ProjectForm from "@/components/garden/ProjectForm";
import ArchivedSection from "@/components/garden/ArchivedSection";
import FocusBanner from "@/components/garden/FocusBanner";
import ActivityHeatmap from "@/components/garden/ActivityHeatmap";
import Button from "@/components/ui/Button";
import OnboardingModal from "@/components/garden/OnboardingModal";
import DemoBanner from "@/components/garden/DemoBanner";
import WeeklyReflection from "@/components/garden/WeeklyReflection";
import MoodCheck from "@/components/garden/MoodCheck";
import ProjectBirthday from "@/components/garden/ProjectBirthday";

const WIDE_MODES = new Set(["kanban", "three-panel"]);
const FULL_MODES = new Set(["quadrant", "deck", "river", "three-panel"]);

function GardenContent() {
  const { state } = useGarden();
  const [searchQuery, setSearchQuery] = useState("");
  const [tagFilter, setTagFilter] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);

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
              onClick={() => setCreateOpen(true)}
              icon={<Plus size={16} />}
              size="sm"
            >
              New Project
            </Button>
          </div>
        </div>

        <DemoBanner />
        {!isFullBleed && <FocusBanner />}
        <GardenBoard searchQuery={searchQuery} tagFilter={tagFilter} />
        {!isFullBleed && <ArchivedSection />}
        {!isFullBleed && <ActivityHeatmap />}
      </main>

      <ProjectForm
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        defaultSection="currently-playing"
      />
      <OnboardingModal />
      <WeeklyReflection />
      <MoodCheck />
      <ProjectBirthday />
    </>
  );
}

export default function GardenPage() {
  return (
    <GardenProvider>
      <ToastProvider>
        <GardenContent />
      </ToastProvider>
    </GardenProvider>
  );
}
