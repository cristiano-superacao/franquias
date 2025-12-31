
"use client";
import React, { useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { getSession } from "../../../lib/auth";
import DashboardLayout from "../../../components/DashboardLayout";
import { SkeletonTable } from "../../../components/SkeletonTable";

export default function ComissoesPage() {
  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = "/login";
    }
  }, []);
  const { data: faixas = [], loading, error } = useFetch<any[]>("/api/comissoes");

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
                    <button className="text-emerald-400 hover:underline">Editar</button>
                  </td>
                </tr>
              ))}
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
