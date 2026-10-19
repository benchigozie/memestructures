"use client";

import React, { useRef } from "react";
import { useField } from "formik";

interface OtpInputProps {
  name: string;
  length?: number;
}

const OtpInput: React.FC<OtpInputProps> = ({ name, length = 6 }) => {
  const [field, meta, helpers] = useField(name);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const value = field.value || "";
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;

    // Take the last entered character if multiple typed
    const char = val.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    
    const combined = newDigits.join("").slice(0, length);
    helpers.setValue(combined);

    // Auto-focus next input field
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newDigits = [...digits];

      if (newDigits[index]) {
        // Clear current digit
        newDigits[index] = "";
        helpers.setValue(newDigits.join(""));
      } else if (index > 0) {
        // Move to previous box and clear it
        newDigits[index - 1] = "";
        helpers.setValue(newDigits.join(""));
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, length);

    if (pastedData) {
      helpers.setValue(pastedData);
      const nextFocusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[nextFocusIndex]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex justify-between gap-2 md:gap-3 w-full max-w-sm mx-auto">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digits[index] || ""}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`w-11 h-14 md:w-12 md:h-16 text-center text-2xl font-bold rounded-xl border-2 transition-all outline-none ${
              digits[index]
                ? "border-my-blue bg-my-blue/5 text-my-deep-blue"
                : "border-my-blue/20 bg-white text-my-deep-blue"
            } focus:border-my-blue focus:ring-4 focus:ring-my-blue/10`}
          />
        ))}
      </div>
      {meta.touched && meta.error && (
        <p className="text-sm text-red-400 mt-1 text-center">{meta.error}</p>
      )}
    </div>
  );
};

export default OtpInput;