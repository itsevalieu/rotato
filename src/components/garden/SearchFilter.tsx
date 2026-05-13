"use client";

import { Search, X } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { getAllTags } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface SearchFilterProps {
  query: string;
  onQueryChange: (query: string) => void;
  tagFilter?: string;
  onTagFilterChange: (tag?: string) => void;
}

export default function SearchFilter({
  query,
  onQueryChange,
  tagFilter,
  onTagFilterChange,
}: SearchFilterProps) {
  const { state } = useGarden();
  const allTags = getAllTags(state.projects);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-gray"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search projects..."
          className="w-full pl-9 pr-9 py-2 rounded-xl border border-warm-gray-light/50
            bg-white/60 text-soft-brown placeholder:text-warm-gray text-sm
            focus:outline-none focus:ring-2 focus:ring-terracotta-light/50
            focus:border-terracotta-light transition-colors duration-200"
          aria-label="Search projects"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-gray hover:text-soft-brown"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tagFilter && (
            <Badge
              onClick={() => onTagFilterChange(undefined)}
              color="#C67B5C"
              className="cursor-pointer"
            >
              {tagFilter} ×
            </Badge>
          )}
          {allTags
            .filter((t) => t !== tagFilter)
            .slice(0, 12)
            .map((tag) => (
              <Badge
                key={tag}
                onClick={() => onTagFilterChange(tag)}
                className="cursor-pointer hover:bg-warm-gray-light/20"
              >
                {tag}
              </Badge>
            ))}
        </div>
      )}
    </div>
  );
}
