"use client";

import React from "react";
import { useFetch } from "../../../hooks/useFetch";

export default function CaixaFluxoPage() {
  const { data: movimentacoes, loading, error } = useFetch<any[]>("/api/movimentacoes");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h2 className="font-bold text-lg text-sky-400 mb-4">Fluxo de Caixa</h2>
        <nav>
          <ul>
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg transition border-2 border-transparent hover:bg-gray-800 hover:border-sky-400 hover:text-sky-400 focus:border-sky-400 focus:text-sky-400 active:scale-95 mb-2" aria-label="Abertura/Fechamento" tabIndex={0}>
                Abertura/Fechamento
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg transition border-2 border-transparent hover:bg-gray-800 hover:border-sky-400 hover:text-sky-400 focus:border-sky-400 focus:text-sky-400 active:scale-95 mb-2" aria-label="Conciliação" tabIndex={0}>
                Conciliação
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Fluxo de Caixa</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 rounded-xl shadow border border-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-400">Tipo</th>
                <th className="px-4 py-2 text-left text-gray-400">Categoria</th>
                <th className="px-4 py-2 text-left text-gray-400">Valor</th>
                <th className="px-4 py-2 text-left text-gray-400">Data</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-gray-400 px-4 py-2">Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="text-red-400 px-4 py-2">Erro ao carregar movimentações</td></tr>
              ) : (
                (movimentacoes || []).map(mov => (
                  <tr key={mov.id} className="transition hover:bg-gray-800 focus-within:bg-gray-800">
                    <td className={mov.tipo === "entrada" ? "text-emerald-400 px-4 py-2" : "text-red-400 px-4 py-2"}>{mov.tipo}</td>
                    <td className="px-4 py-2">{mov.categoria}</td>
                    <td className="px-4 py-2 font-bold">R$ {mov.valor?.toLocaleString() ?? "-"}</td>
                    <td className="px-4 py-2">{new Date(mov.data).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <button className="mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded shadow transition active:scale-95" aria-label="Nova Movimentação">Nova Movimentação</button>
      </main>
      {/* Bottom Bar para mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 z-30">
        <button className="flex flex-col items-center text-xs text-sky-400 hover:text-emerald-400 focus:text-emerald-400 transition active:scale-95" aria-label="Abertura/Fechamento">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8"/></svg>
          Abrir/Fechar
        </button>
        <button className="flex flex-col items-center text-xs text-sky-400 hover:text-emerald-400 focus:text-emerald-400 transition active:scale-95" aria-label="Nova Movimentação">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>
          Nova Mov.
        </button>
      </nav>
    </div>
  );
}
