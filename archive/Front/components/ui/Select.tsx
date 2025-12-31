"use client";
import React from "react";

type Option = { value: string | number; label: string; disabled?: boolean };

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: Option[];
  className?: string;
};

export default function Select({ label, options = [], className = "", ...props }: SelectProps) {
  return (
    <label className="flex flex-col gap-2 text-gray-200">
      {label}
      <select
        {...props}
        className={
          `px-3 py-2 rounded bg-gray-900 border border-gray-800 text-white ` +
          `focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus:border-brand-500 ` +
          `${className}`
        }
      >
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value} disabled={opt.disabled}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
