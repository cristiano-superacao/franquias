import React, { useState } from "react";

export default function DashboardSidebar({ lojas, selectedLoja, onSelectLoja }: {
  lojas: { id: number; nome: string }[];
  selectedLoja: number | null;
  onSelectLoja: (id: number | null) => void;
}) {
  const [open, setOpen] = useState(false);

  // Sidebar para desktop, drawer para mobile
  return (
    <>
      {/* Botão de menu para mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full p-2 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Sidebar desktop e drawer mobile */}
      <aside
        className={`bg-gray-900 text-white flex flex-col shadow-lg z-20 transition-all duration-300
          fixed top-0 left-0 h-full w-64 md:relative md:w-64 md:h-auto md:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        style={{ boxShadow: open ? "0 0 0 9999px rgba(0,0,0,0.5)" : undefined }}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <span className="font-bold text-lg text-emerald-400">Lojas</span>
          {/* Botão fechar para mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul>
            <li>
              <button
                className={`w-full text-left px-6 py-3 rounded-lg transition border-2
                  ${selectedLoja === null ? "bg-gray-800 text-emerald-400 border-emerald-400" : "border-transparent"}
                  hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-400 focus:border-emerald-400 focus:text-emerald-400 active:scale-95`}
                onClick={() => { onSelectLoja(null); setOpen(false); }}
                tabIndex={0}
                aria-label="Visão Consolidada"
              >
                Visão Consolidada
              </button>
            </li>
            {lojas.map(loja => (
              <li key={loja.id}>
                <button
                  className={`w-full text-left px-6 py-3 rounded-lg transition border-2
                    ${selectedLoja === loja.id ? "bg-gray-800 text-emerald-400 border-emerald-400" : "border-transparent"}
                    hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-400 focus:border-emerald-400 focus:text-emerald-400 active:scale-95`}
                  onClick={() => { onSelectLoja(loja.id); setOpen(false); }}
                  tabIndex={0}
                  aria-label={"Selecionar " + loja.nome}
                >
                  {loja.nome}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Overlay para mobile quando aberto */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
