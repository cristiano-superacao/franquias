
"use client";
import React, { useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { requireRole } from "../../../lib/auth";
import Button from "../../../components/ui/Button";
import MobileNav from "../../../components/MobileNav";
import DashboardLayout from "../../../components/DashboardLayout";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Table, Thead, Th, Tbody, Tr, Td } from "../../../components/ui/Table";

export default function ComissoesPage() {
  // Verifica autenticação
  useEffect(() => {
    // Somente super_admin e company_admin podem configurar comissões
    requireRole(["super_admin", "company_admin"]);
  }, []);
  const { data: faixas = [], loading, error } = useFetch<any[]>("/api/comissoes");

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <DashboardLayout>
        <main className="flex-1 p-6">
          <div className="mx-auto w-full max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold" style={{ color: "#CCE3DE" }}>Configuração de Comissões</h1>
              <div className="flex items-center gap-3">
                <Button aria-label="Nova Faixa">Nova Faixa</Button>
              </div>
            </div>

            <div className="mb-4"><Breadcrumbs /></div>

            {loading ? (
              <div className="text-gray-400">Carregando...</div>
            ) : error ? (
              <div className="text-red-400">Erro ao carregar faixas</div>
            ) : (
              <Table caption="Faixas de comissão por loja" variant="light">
                <Thead>
                  <Th>Loja</Th>
                  <Th>Faixa</Th>
                  <Th>Volume</Th>
                  <Th>Ações</Th>
                </Thead>
                <Tbody>
                  {(faixas || []).map((faixa: any, idx: number) => (
                    <Tr key={idx}>
                      <Td><span className="text-gray-900 font-medium">{faixa.loja ?? faixa.nome}</span></Td>
                      <Td><span className="text-gray-700">{faixa.faixa ? String(faixa.faixa) : formatPercent(faixa.porcentagem_comissao)}</span></Td>
                      <Td><span className="text-gray-700">{faixa.volume ?? formatCurrency(faixa.meta_venda)}</span></Td>
                      <Td>
                        <Button variant="ghost" className="text-sm">Editar</Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </div>
        </main>
      </DashboardLayout>
      <MobileNav
        items={[
          {
            label: "Nova Faixa",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>),
          },
        ]}
      />
    </div>
  );
}
