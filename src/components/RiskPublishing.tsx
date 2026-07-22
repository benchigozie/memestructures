"use client";

import { Field } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function RiskPublishing() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.section
      layout
      className="rounded-xl bg-white p-4 outline outline-my-gray/10"
      transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full cursor-pointer items-center justify-between rounded-xl p-3 transition-colors duration-300 hover:bg-my-blue/10"
      >
        <h2 className="text-xl font-semibold text-my-deep-blue">
          Risk & Publishing
        </h2>

        <motion.div
          animate={{ rotate: isOpen ? -90 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <ChevronRight size={20} className="text-my-deep-blue" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            layout
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: {
                duration: 0.35,
                ease: [0.25, 0.1, 0.25, 1],
              },
              opacity: {
                duration: 0.2,
              },
            }}
            className="overflow-hidden p-3"
          >
            <motion.div
              layout
              className="pt-6"
              transition={{
                layout: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
              }}
            >
              <div className="space-y-2">
                <label className="font-medium">
                  Risk Disclosure
                </label>

                <Field
                  as="textarea"
                  rows={8}
                  name="riskDisclosure"
                  placeholder="Describe the risks associated with this asset class..."
                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                />
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="font-medium">
                    Display Order
                  </label>

                  <Field
                    type="number"
                    name="displayOrder"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>

                <div className="flex items-center gap-3 md:mt-8">
                  <Field
                    type="checkbox"
                    name="isPublished"
                    className="h-5 w-5 accent-my-blue"
                  />

                  <label className="font-medium">
                    Published
                  </label>
                </div>

                <div className="flex items-center gap-3 md:mt-8">
                  <Field
                    type="checkbox"
                    name="isActive"
                    className="h-5 w-5 accent-my-blue"
                  />

                  <label className="font-medium">
                    Active
                  </label>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}