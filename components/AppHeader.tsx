"use client";
import React from "react";
import Breadcrumbs from "./Breadcrumbs";
import { getSession, logout } from "../lib/auth";
import { useToast } from "./Toast";
import NFModal from "./NFModal";

export default function AppHeader() {
  const session = typeof window !== "undefined" ? getSession() : null;
  const { showToast } = useToast();
  const [openNF, setOpenNF] = React.useState(false);

  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded bg-emerald-600" aria-hidden="true" />
          <span className="text-white font-bold">Franquias</span>
        </div>
        <div className="mt-1">
          <Breadcrumbs />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition"
          aria-label="Lançar Nota Fiscal"
          onClick={() => setOpenNF(true)}
        >
          Lançar NF
        </button>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition"
          aria-label="Backup Banco"
          onClick={() => showToast("Backup iniciado (demo)", "success")}
        >
          Backup
        </button>
        {session && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Olá, {session.username}</span>
            <button
              onClick={() => { logout(); window.location.href = "/login"; }}
              className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-3 rounded transition"
              aria-label="Sair"
            >
              Sair
            </button>
          </div>
        )}
        <NFModal open={openNF} onClose={() => setOpenNF(false)} />
      </div>
    </header>
  );
}
