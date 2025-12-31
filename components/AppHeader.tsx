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
    <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-6 pb-4 border-b border-gray-800">
      <div className="flex items-start gap-4">
        <div className="flex items-center gap-2">
          <svg className="h-6 w-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
          <span className="text-white font-bold text-lg">Franquias</span>
        </div>
        <div className="mt-1 hidden sm:block">
          <Breadcrumbs />
        </div>
      </div>
      
      {/* Breadcrumb mobile (abaixo do logo) */}
      <div className="sm:hidden">
        <Breadcrumbs />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-lg transition-smooth active:scale-95 flex items-center gap-2"
          aria-label="Lançar Nota Fiscal"
          onClick={() => setOpenNF(true)}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <span className="hidden sm:inline">Lançar NF</span>
          <span className="sm:hidden">NF</span>
        </button>
        <button
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm py-2 px-4 rounded-lg transition-smooth active:scale-95 flex items-center gap-2"
          aria-label="Backup Banco"
          onClick={() => showToast("Backup iniciado (demo)", "success")}
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
          </svg>
          <span className="hidden lg:inline">Backup</span>
        </button>
        {session && (
          <div className="flex items-center gap-2 pl-2 border-l border-gray-700">
            <span className="text-sm text-gray-400 hidden md:inline">Olá, {session.username}</span>
            <button
              onClick={() => { logout(); window.location.href = "/login"; }}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm py-2 px-4 rounded-lg transition-smooth active:scale-95 flex items-center gap-2"
              aria-label="Sair"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m7 14l5-5-5-5m5 5H9"/>
              </svg>
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        )}
        <NFModal open={openNF} onClose={() => setOpenNF(false)} />
      </div>
    </header>
  );
}
