
"use client";
import React, { useState, useEffect } from "react";

export default function EstoqueAlimentosPage() {
  const [alimentos, setAlimentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/estoque")
      .then(res => res.json())
      .then(data => {
        setAlimentos(data.alimentos || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h2 className="font-bold text-lg text-emerald-400 mb-4">Estoque Alimentos</h2>
        <nav>
          <ul>
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg transition border-2 border-transparent hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-400 focus:border-emerald-400 focus:text-emerald-400 active:scale-95 mb-2" aria-label="Entrada" tabIndex={0}>
                Entrada
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 rounded-lg transition border-2 border-transparent hover:bg-gray-800 hover:border-emerald-400 hover:text-emerald-400 focus:border-emerald-400 focus:text-emerald-400 active:scale-95 mb-2" aria-label="Saída" tabIndex={0}>
                Saída
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-6">Estoque - Alimentos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="text-gray-400">Carregando...</div>
          ) : (
            alimentos.map((item: any) => (
              <div key={item.id} className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.03] hover:border-emerald-500 focus-within:border-emerald-500" tabIndex={0} aria-label={item.nome}>
                <h2 className="text-lg font-bold text-emerald-400 mb-2">{item.nome}</h2>
                <div className="text-gray-400 mb-2">Quantidade: <span className="text-white font-bold">{item.quantidade} {item.unidade}</span></div>
                <button className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow transition active:scale-95" aria-label="Registrar Saída">Registrar Saída</button>
              </div>
            ))
          )}
        </div>
      </main>
      {/* Bottom Bar para mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 z-30">
        <button className="flex flex-col items-center text-xs text-emerald-400 hover:text-sky-400 focus:text-sky-400 transition active:scale-95" aria-label="Entrada">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8"/></svg>
          Entrada
        </button>
        <button className="flex flex-col items-center text-xs text-emerald-400 hover:text-sky-400 focus:text-sky-400 transition active:scale-95" aria-label="Saída">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>
          Saída
        </button>
      </nav>
    </div>
  );
}
