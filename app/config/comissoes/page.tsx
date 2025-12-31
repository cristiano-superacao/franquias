
"use client";
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { getSession } from "../../../lib/auth";
import DashboardLayout from "../../../components/DashboardLayout";
import { SkeletonTable } from "../../../components/SkeletonTable";
import EditComissaoModal from "../../../components/EditComissaoModal";
import { useToast } from "../../../components/Toast";

export default function ComissoesPage() {
  const [editingLoja, setEditingLoja] = useState<any | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { showToast } = useToast();

  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = "/login";
    }
  }, []);

  const { data: faixas = [], loading, error } = useFetch<any[]>(`/api/comissoes?_refresh=${refreshKey}`);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Configuração de Comissões</h1>
      {loading ? (
        <SkeletonTable rows={6} cols={4} />
      ) : error ? (
        <div className="text-red-400">Erro ao carregar faixas</div>
      ) : (faixas && faixas.length > 0 ? (
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
              {faixas.map((faixa: any, idx: number) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{faixa.loja ?? faixa.nome}</td>
                  <td className="px-4 py-2">{faixa.faixa ? String(faixa.faixa) : formatPercent(faixa.porcentagem_comissao)}</td>
                  <td className="px-4 py-2">{faixa.volume ?? formatCurrency(faixa.meta_venda)}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => setEditingLoja(faixa)}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}

      {editingLoja && (
        <EditComissaoModal
          loja={editingLoja}
          onClose={() => setEditingLoja(null)}
          onSuccess={() => {
            showToast("Comissão atualizada com sucesso!", "success");
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center">
          <p className="text-gray-400">Nenhuma faixa de comissão configurada.</p>
        </div>
      ))}
    </DashboardLayout>
  );
}
