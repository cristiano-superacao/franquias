"use client";

import React from "react";
import { useFetch } from "../../../hooks/useFetch";

export default function AdminLojasPage() {
  const { data: lojas, loading, error } = useFetch<any[]>("/api/lojas");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h2 className="font-bold text-lg text-emerald-400 mb-4">Gestão de Lojas</h2>
        <nav>
          <ul>
            {loading ? (
              <li className="text-gray-400">Carregando...</li>
            ) : error ? (
              <li className="text-red-400">Erro ao carregar lojas</li>
            ) : (
              (lojas || []).map(loja => (
                <li key={loja.id}>
                  <button className="w-full text-left px-4 py-2 rounded-lg transition border-2 border-transparent hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-400 focus:border-emerald-400 focus:text-emerald-400 active:scale-95 mb-2" aria-label={"Selecionar " + loja.nome} tabIndex={0}>
                    {loja.nome}
                  </button>
                </li>
              ))
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 pb-20 md:pb-6">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Gestão de Lojas</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-gray-400">Carregando...</div>
            ) : (
              (lojas || []).map(loja => (
                <div key={loja.id} className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.03] hover:border-emerald-500 focus-within:border-emerald-500" tabIndex={0} aria-label={loja.nome}>
                  <h2 className="text-lg font-bold text-emerald-400 mb-2">{loja.nome}</h2>
                  <div className="text-gray-400 mb-2">Meta de Venda: <span className="text-white font-bold">R$ {loja.meta_venda?.toLocaleString() ?? "-"}</span></div>
                  <div className="text-gray-400 mb-2">Comissão: <span className="text-white font-bold">{loja.porcentagem_comissao ?? "-"}%</span></div>
                  <button className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow transition active:scale-95" aria-label="Editar Loja">Editar</button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      {/* Bottom Bar para mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 z-30">
        <button className="flex flex-col items-center text-xs text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition active:scale-95" aria-label="Menu">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/></svg>
          Menu
        </button>
        <button className="flex flex-col items-center text-xs text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition active:scale-95" aria-label="Nova Loja">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>
          Nova Loja
        </button>
      </nav>
    </div>
  );
}
