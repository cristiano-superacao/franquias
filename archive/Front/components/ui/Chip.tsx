"use client";
import React from "react";

type ChipProps = {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger";
  className?: string;
};

export default function Chip({ children, variant = "default", className = "" }: ChipProps) {
  const base = "inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border";
  const styles = {
    default: "bg-brand-900/30 text-brand-300 border-brand-700",
    success: "bg-emerald-900/30 text-emerald-300 border-emerald-700",
    danger: "bg-red-900/40 text-red-300 border-red-700",
  } as const;
  return <span className={`${base} ${styles[variant]} ${className}`}>{children}</span>;
}
