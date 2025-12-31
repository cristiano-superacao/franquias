"use client";
import React from "react";

export default function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only fixed top-2 left-2 z-[1000] bg-emerald-600 text-white text-sm px-3 py-2 rounded shadow-lg"
    >
      Pular para o conteúdo
    </a>
  );
}
