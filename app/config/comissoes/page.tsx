
"use client";
import React from "react";
import { useFetch } from "../../../hooks/useFetch";

export default function ConfigComissoesPage() {
  const { data: faixas = [], loading, error } = useFetch<any[]>("/api/comissoes");

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h2 className="font-bold text-lg text-emerald-400 mb-4">Configurar Comissões</h2>
        <nav>
          <ul>
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg transition border-2 border-transparent hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-400 focus:border-emerald-400 focus:text-emerald-400 active:scale-95 mb-2" aria-label="Nova Faixa" tabIndex={0}>
                Nova Faixa
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Configuração de Comissões</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-900 rounded-xl shadow border border-gray-800">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-gray-400">Loja</th>
                <th className="px-4 py-2 text-left text-gray-400">Faixa</th>
                <th className="px-4 py-2 text-left text-gray-400">Volume</th>
                <th className="px-4 py-2 text-left text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-gray-400 px-4 py-2">Carregando...</td></tr>
              ) : error ? (
                <tr><td colSpan={4} className="text-red-400 px-4 py-2">Erro ao carregar faixas</td></tr>
              ) : (
                (faixas || []).map((faixa: any, idx: number) => (
                  <tr key={idx}>
                    <td className="px-4 py-2">{faixa.loja ?? faixa.nome}</td>
                    <td className="px-4 py-2">{faixa.faixa ?? faixa.porcentagem_comissao ?? "-"}%</td>
                    <td className="px-4 py-2">{faixa.volume ?? (faixa.meta_venda ? `R$ ${faixa.meta_venda.toLocaleString()}` : "-")}</td>
                    <td className="px-4 py-2">
                      <button className="text-emerald-400 hover:underline">Editar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
      {/* Bottom Bar para mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 z-30">
        <button className="flex flex-col items-center text-xs text-emerald-400 hover:text-sky-400 focus:text-sky-400 transition active:scale-95" aria-label="Nova Faixa">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>
          Nova Faixa
        </button>
      </nav>
    </div>
  );
}
