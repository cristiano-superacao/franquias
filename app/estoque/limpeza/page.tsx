
"use client";
import React, { useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { getSession } from "../../../lib/auth";
import DashboardLayout from "../../../components/DashboardLayout";
import { SkeletonGrid } from "../../../components/Skeleton";

export default function EstoqueLimpezaPage() {
  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) window.location.href = "/login";
  }, []);
  const { data, loading, error } = useFetch<{ limpeza: any[] }>("/api/estoque");
  const insumos = data?.limpeza || [];

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Estoque - Limpeza</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center text-red-400">Erro ao carregar estoque</div>
        ) : insumos && insumos.length > 0 ? (
          insumos.map((item: any) => (
            <div key={item.id} className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.03] hover:border-emerald-500 focus-within:border-emerald-500" tabIndex={0} aria-label={item.nome ?? item.categoria}>
              <h2 className="text-lg font-bold text-emerald-400 mb-2">{item.nome ?? item.categoria}</h2>
              <div className="text-gray-400 mb-2">Quantidade: <span className="text-white font-bold">{item.valor ?? item.quantidade ?? "-"} {item.unidade ?? ""}</span></div>
              <button className="mt-4 bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow transition active:scale-95" aria-label="Registrar Saída">Registrar Saída</button>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center">
            <p className="text-gray-400">Nenhum item de limpeza disponível.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
