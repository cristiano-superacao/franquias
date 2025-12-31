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
      {/* Overlay para mobile quando sidebar está aberto */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-10 md:hidden transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Botão de menu para mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-transform active:scale-95"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={open}
      >
        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Sidebar desktop e drawer mobile */}
      <aside
        className={`bg-gray-900 text-white flex flex-col shadow-xl z-20 transition-transform duration-300 ease-out
          fixed top-0 left-0 h-full w-72 md:relative md:w-64 md:h-auto md:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        role="navigation"
        aria-label="Sidebar de lojas"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span className="font-bold text-lg text-blue-400">Lojas</span>
          </div>
          {/* Botão fechar para mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto" aria-label="Lista de lojas">
          <ul>
            <li>
              <button
                className={`w-full text-left px-6 py-3 rounded-lg transition border-2
                  ${selectedLoja === null ? "bg-gray-800 text-blue-400 border-blue-400" : "border-transparent"}
                  hover:bg-gray-800 hover:border-blue-400 hover:text-blue-400 focus:border-blue-400 focus:text-blue-400 active:scale-95`}
                onClick={() => { onSelectLoja(null); setOpen(false); }}
                tabIndex={0}
                aria-label="Visão Consolidada"
              >
                Visão Consolidada
              </button>
            </li>
            {/* Ações rápidas abaixo do Consolidado */}
            <li className="mt-2">
              <div className="px-6 space-y-2">
                <a href="/admin/lojas" className="block w-full text-left px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-blue-300">Criar Loja</a>
                <a href="/estoque/alimentos" className="block w-full text-left px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-blue-300">Estoque</a>
                <a href="/financeiro" className="block w-full text-left px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-blue-300">Financeiro</a>
                <a href="/caixa/fluxo" className="block w-full text-left px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-blue-300">Caixa</a>
                <a href="/config/comissoes" className="block w-full text-left px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-blue-300">Comissões</a>
                <a href="/admin/tools" className="block w-full text-left px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 text-blue-300">Admin Tools</a>
              </div>
            </li>
            {lojas.map(loja => (
              <li key={loja.id}>
                <button
                  className={`w-full text-left px-6 py-3 rounded-lg transition border-2
                    ${selectedLoja === loja.id ? "bg-gray-800 text-blue-400 border-blue-400" : "border-transparent"}
                    hover:bg-gray-800 hover:border-blue-400 hover:text-blue-400 focus:border-blue-400 focus:text-blue-400 active:scale-95`}
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
