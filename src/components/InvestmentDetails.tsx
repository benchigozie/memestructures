"use client";

import { Field } from "formik";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function InvestmentDetails() {
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
          Investment Details
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
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-medium">Fund Type</label>

                  <Field
                    name="fundType"
                    placeholder="Closed End"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Risk Profile</label>

                  <Field
                    as="select"
                    name="riskProfile"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  >
                    <option value="">Select Risk</option>
                    <option value="Low">Low</option>
                    <option value="Moderate">Moderate</option>
                    <option value="High">High</option>
                    <option value="Very High">Very High</option>
                  </Field>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Allocation Source</label>

                  <Field
                    name="allocationSource"
                    placeholder="30% of Capital Call"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Investment Horizon</label>

                  <Field
                    name="investmentHorizon"
                    placeholder="5 - 7 Years"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Lockup Period</label>

                  <Field
                    name="lockupPeriod"
                    placeholder="36 Months"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Target Return</label>

                  <Field
                    name="targetReturn"
                    placeholder="18% - 25% IRR"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="font-medium">
                    Minimum Investment
                  </label>

                  <Field
                    type="number"
                    name="minimumInvestment"
                    placeholder="50000"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">
                    Maximum Investment
                  </label>

                  <Field
                    type="number"
                    name="maximumInvestment"
                    placeholder="1000000"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-medium">
                    Target Allocation (%)
                  </label>

                  <Field
                    type="number"
                    name="targetAllocationPercent"
                    placeholder="30"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}