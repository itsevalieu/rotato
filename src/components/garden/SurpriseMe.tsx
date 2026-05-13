"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Sparkles, ArrowRight } from "lucide-react";
import { useGarden } from "@/context/GardenContext";
import { randomPick, getProjectsBySection, timeAgo } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { Project } from "@/lib/types";

export default function SurpriseMe() {
  const { state, dispatch } = useGarden();
  const [surprise, setSurprise] = useState<Project | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSurprise = () => {
    const restingProjects = getProjectsBySection(state.projects, "resting");
    const allDormant = [
      ...restingProjects,
      ...getProjectsBySection(state.projects, "seeds"),
    ];
    const picked = randomPick(allDormant);
    if (picked) {
      setSurprise(picked);
      setShowModal(true);
    }
  };

  const handleMoveToPlaying = () => {
    if (surprise) {
      dispatch({
        type: "MOVE_PROJECT",
        id: surprise.id,
        to: "currently-playing",
      });
      setShowModal(false);
      setSurprise(null);
    }
  };

  const restingCount =
    getProjectsBySection(state.projects, "resting").length +
    getProjectsBySection(state.projects, "seeds").length;

  return (
    <>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="accent"
          size="sm"
          icon={<Shuffle size={16} />}
          onClick={handleSurprise}
          disabled={restingCount === 0}
        >
          Surprise Me
        </Button>
      </motion.div>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="✨ Welcome Back"
      >
        <AnimatePresence>
          {surprise && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <p className="text-warm-gray text-sm">
                Remember this one? It&apos;s been waiting for you.
              </p>

              <div className="bg-white/60 rounded-xl p-4 border border-muted-gold/20">
                <h3 className="font-accent text-xl text-soft-brown mb-1">
                  {surprise.title}
                </h3>
                {surprise.description && (
                  <p className="text-sm text-warm-gray mb-2">
                    {surprise.description}
                  </p>
                )}
                {surprise.nextTinyStep && (
                  <p className="text-sm font-accent text-terracotta italic">
                    Next tiny step: {surprise.nextTinyStep}
                  </p>
                )}
                <p className="text-xs text-warm-gray mt-2">
                  Last touched {timeAgo(surprise.lastTouchedAt)}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleMoveToPlaying}
                  icon={<Sparkles size={16} />}
                  className="flex-1"
                >
                  Start Playing
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowModal(false);
                    handleSurprise();
                  }}
                  icon={<Shuffle size={16} />}
                >
                  Another
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowModal(false)}
                >
                  Not Now
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
}
