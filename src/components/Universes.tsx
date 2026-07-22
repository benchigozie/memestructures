"use client";

import { Field, FieldArray } from "formik";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export default function Universes() {
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
          Investment Universes
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
              <FieldArray name="universes">
                {({ push, remove, form }) => (
                  <motion.div layout className="space-y-6">
                    <AnimatePresence>
                      {form.values.universes.map(
                        (_: any, index: number) => (
                          <motion.div
                            key={index}
                            layout
                            initial={{ opacity: 0, y: -15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.25 }}
                            className="relative"
                          >
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              disabled={
                                form.values.universes.length === 1
                              }
                              className="absolute right-4 top-0 text-red-500 transition hover:text-red-700 disabled:opacity-30"
                            >
                              <Trash2 size={18} />
                            </button>

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <label className="font-medium">
                                  Universe Name
                                </label>

                                <Field
                                  name={`universes.${index}.name`}
                                  placeholder="Growth Equities"
                                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="font-medium">
                                  Target Allocation (%)
                                </label>

                                <Field
                                  type="number"
                                  name={`universes.${index}.targetAllocation`}
                                  placeholder="30"
                                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                                />
                              </div>

                              <div className="space-y-2">
                                <label className="font-medium">
                                  Description
                                </label>

                                <Field
                                  as="textarea"
                                  rows={4}
                                  name={`universes.${index}.description`}
                                  placeholder="Describe this investment universe..."
                                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                                />
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>

                    <motion.button
                      layout
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        push({
                          name: "",
                          description: "",
                          targetAllocation: "",
                        })
                      }
                      className="flex items-center gap-2 rounded-lg outline-my-deep-blue outline cursor-pointer px-4 py-3 text-my-deep-blue hover:text-my-white duration-300 transition-colors hover:bg-my-deep-blue"
                    >
                      <Plus size={18} />
                      Add Universe
                    </motion.button>
                  </motion.div>
                )}
              </FieldArray>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}