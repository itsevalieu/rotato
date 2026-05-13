"use client";

import { motion } from "framer-motion";
import { Sparkles, CloudMoon, Sprout, Trophy } from "lucide-react";

const principles = [
  {
    icon: Sparkles,
    title: "Currently Playing",
    description:
      "Projects you're excited about right now. Keep it small — just 1 to 5 things that light you up.",
    color: "text-terracotta",
  },
  {
    icon: CloudMoon,
    title: "Resting",
    description:
      "Dormant projects aren't failures. They're sleeping, and they'll be here whenever you're ready.",
    color: "text-dusty-blue",
  },
  {
    icon: Sprout,
    title: "Seeds",
    description:
      "Tiny ideas that might grow into something. Capture them quickly, no pressure to develop.",
    color: "text-sage",
  },
  {
    icon: Trophy,
    title: "Finished Worlds",
    description:
      "Completed or retired projects. Celebrate what you've made, no matter how small.",
    color: "text-muted-gold",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function PhilosophySection() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="font-accent text-3xl text-soft-brown mb-3">
          Creativity should feel like play
        </h2>
        <p className="text-warm-gray max-w-lg mx-auto">
          No task explosions. No streaks. No guilt. Just a gentle space
          where your projects can drift in and out naturally.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid sm:grid-cols-2 gap-6"
      >
        {principles.map((p) => (
          <motion.div
            key={p.title}
            variants={item}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-warm-gray-light/20 shadow-warm-sm"
          >
            <p.icon size={24} className={`${p.color} mb-3`} />
            <h3 className="font-accent text-xl text-soft-brown mb-2">
              {p.title}
            </h3>
            <p className="text-sm text-warm-gray leading-relaxed">
              {p.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12 text-center"
      >
        <blockquote className="font-accent text-2xl text-warm-gray italic">
          &ldquo;It&apos;s okay to put things down for months. They&apos;ll
          still be here.&rdquo;
        </blockquote>
      </motion.div>
    </section>
  );
}
