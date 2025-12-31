"use client";

import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency } from "../../../lib/format";
import { getSession } from "../../../lib/auth";
import DashboardLayout from "../../../components/DashboardLayout";
import { SkeletonTable } from "../../../components/SkeletonTable";
import NFModal from "../../../components/NFModal";
import { useToast } from "../../../components/Toast";

export default function CaixaFluxoPage() {
  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) window.location.href = "/login";
  }, []);

  const { data: movimentacoes, loading, error } = useFetch<any[]>("/api/movimentacoes");
  const [showModal, setShowModal] = useState(false);
  const { showToast } = useToast();

  function handleNFSuccess() {
    showToast("Movimentação lançada com sucesso!", "success");
    setShowModal(false);
    setTimeout(() => window.location.reload(), 300);
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Fluxo de Caixa</h1>
      {loading ? (
        <SkeletonTable rows={6} cols={4} />
      ) : error ? (
        <div className="text-red-400">Erro ao carregar movimentações</div>
      ) : (movimentacoes && movimentacoes.length > 0 ? (
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
              {movimentacoes.map(mov => (
                <tr key={mov.id} className="transition hover:bg-gray-800 focus-within:bg-gray-800">
                  <td className={mov.tipo === "entrada" ? "text-blue-400 px-4 py-2" : "text-red-400 px-4 py-2"}>{mov.tipo}</td>
                  <td className="px-4 py-2">{mov.categoria}</td>
                  <td className="px-4 py-2 font-bold">{formatCurrency(mov.valor)}</td>
                  <td className="px-4 py-2">{mov.data ? new Date(mov.data).toLocaleString() : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center">
          <p className="text-gray-400">Nenhuma movimentação encontrada.</p>
        </div>
      ))}
      <button onClick={() => setShowModal(true)} className="mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition active:scale-95" aria-label="Nova Movimentação">Nova Movimentação</button>
      {showModal && <NFModal open={showModal} onClose={() => setShowModal(false)} onSuccess={handleNFSuccess} />}
    </DashboardLayout>
  );
}
