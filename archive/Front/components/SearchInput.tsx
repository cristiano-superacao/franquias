"use client";
import React from "react";

type Props = {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
};

export default function SearchInput({ placeholder = "Pesquisar módulos, páginas ou dados", value, onChange }: Props) {
  return (
    <div className="w-full max-w-xl">
      <label className="sr-only" htmlFor="global-search">Pesquisar</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </span>
        <input
          id="global-search"
          type="search"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
        />
      </div>
    </div>
  );
}
