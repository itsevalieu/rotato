"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-md mx-auto text-center"
      >
        <h2 className="font-accent text-3xl text-soft-brown mb-4">
          Ready to tend your garden?
        </h2>
        <p className="text-warm-gray mb-8">
          Everything stays on your device. No sign-up required. Just you and
          your creative world.
        </p>

        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <Link
            href="/garden"
            className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-cream
              rounded-2xl text-lg font-medium shadow-warm hover:shadow-warm-lg
              hover:bg-terracotta-dark transition-all duration-300"
          >
            Enter Your Garden
            <ArrowRight size={20} />
          </Link>
        </motion.div>

        <p className="text-xs text-warm-gray mt-6">
          Local-first. No tracking. No accounts. Your projects, your pace.
        </p>
      </motion.div>
    </section>
  );
}
