"use client";
import React from "react";

type NavItem = {
  label: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
};

type MobileNavProps = {
  items: NavItem[];
  className?: string;
};

export default function MobileNav({ items, className = "" }: MobileNavProps) {
  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 w-full bg-surface-900 border-t border-gray-800 flex justify-around items-center h-16 z-30 ${className}`}
      role="navigation"
      aria-label="Navegação móvel"
    >
      {items.map((item, idx) => (
        <button
          key={idx}
          className={`flex flex-col items-center text-xs transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${item.active ? "text-white" : "text-brand-300 hover:text-white focus:text-white"}`}
          aria-label={item.ariaLabel || item.label}
          aria-pressed={item.active ? true : undefined}
          type="button"
          onClick={item.onClick}
        >
          <span aria-hidden="true">{item.icon}</span>
          {item.label}
        </button>
      ))}
    </nav>
  );
}
