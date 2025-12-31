"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export default function Input({ label, icon, className = "", ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-gray-200">
      {label}
      <div className="relative">
        {icon ? (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <input
          {...props}
          className={`${icon ? "pl-9" : "pl-3"} pr-3 py-2 rounded bg-gray-900 border border-gray-800 focus:outline-none focus:border-brand transition-all duration-300 text-white w-full ${className}`}
        />
      </div>
    </label>
  );
}
