
"use client";
import React, { useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { getSession } from "../../../lib/auth";
import DashboardLayout from "../../../components/DashboardLayout";
import { SkeletonGrid } from "../../../components/Skeleton";
import { useToast } from "../../../components/Toast";

export default function EstoqueAlimentosPage() {
  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) window.location.href = "/login";
  }, []);

  const { data, loading, error } = useFetch<{ alimentos: any[] }>("/api/estoque");
  const alimentos = data?.alimentos || [];
  const { showToast } = useToast();

  function handleRegistrarSaida(item: any) {
    showToast(`Saída de ${item.nome} registrada!`, "success");
    // TODO: Implementar API para registrar saída de estoque
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Estoque - Alimentos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center text-red-400">Erro ao carregar estoque</div>
        ) : alimentos && alimentos.length > 0 ? (
          alimentos.map((item: any) => (
            <div key={item.id} className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.03] hover:border-blue-500 focus-within:border-blue-500" tabIndex={0} aria-label={item.nome}>
              <h2 className="text-lg font-bold text-blue-400 mb-2">{item.nome}</h2>
              <div className="text-gray-400 mb-2">Quantidade: <span className="text-white font-bold">{item.quantidade} {item.unidade}</span></div>
              <button onClick={() => handleRegistrarSaida(item)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow transition active:scale-95 flex items-center gap-2" aria-label="Registrar Saída">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                Registrar Saída
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center">
            <p className="text-gray-400">Nenhum item de alimentos disponível.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
