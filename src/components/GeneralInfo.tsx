"use client";

import { Field, ErrorMessage, useFormikContext } from "formik";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function GeneralInformation() {
  const { values, setFieldValue } = useFormikContext<any>();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const slug = values.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");

    if (!values.slug) {
      setFieldValue("slug", slug);
    }
  }, [values.name, values.slug, setFieldValue]);

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
          General Information
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
                  <label className="font-medium">Name</label>

                  <Field
                    name="name"
                    placeholder="Growth Equity Fund"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />

                  <ErrorMessage
                    name="name"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>


                <div className="space-y-2">
                  <label className="font-medium">Acronym</label>

                  <Field
                    name="acronym"
                    placeholder="GEF"
                    className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                  />
                </div>
              </div>

              {/* Slug */}
              <div className="mt-6 space-y-2">
                <label className="font-medium">Slug</label>

                <Field
                  name="slug"
                  placeholder="growth-equity-fund"
                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                />

                <ErrorMessage
                  name="slug"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>

              {/* Headline */}
              <div className="mt-6 space-y-2">
                <label className="font-medium">Headline</label>

                <Field
                  name="headline"
                  placeholder="High Conviction Growth Investing"
                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                />
              </div>

              {/* Short Description */}
              <div className="mt-6 space-y-2">
                <label className="font-medium">Short Description</label>

                <Field
                  as="textarea"
                  rows={3}
                  name="shortDescription"
                  placeholder="Brief marketing summary..."
                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                />
              </div>

              {/* Description */}
              <div className="mt-6 space-y-2">
                <label className="font-medium">Description</label>

                <Field
                  as="textarea"
                  rows={7}
                  name="description"
                  placeholder="Full description of the asset class..."
                  className="w-full rounded-lg p-3 outline outline-my-gray/20 transition-colors duration-300 focus:outline-my-deep-blue/40"
                />

                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-sm text-red-500"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}

export default GeneralInformation;