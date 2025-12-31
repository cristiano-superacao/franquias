"use client";

import React, { useEffect } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency } from "../../../lib/format";
import { requireRole } from "../../../lib/auth";
import Button from "../../../components/ui/Button";
import MobileNav from "../../../components/MobileNav";
import DashboardLayout from "../../../components/DashboardLayout";
import { Table, Thead, Th, Tbody, Tr, Td } from "../../../components/ui/Table";
import Breadcrumbs from "../../../components/Breadcrumbs";

export default function CaixaFluxoPage() {
  // Verifica autenticação
  useEffect(() => {
    requireRole(["super_admin", "company_admin", "franchise_user"]);
  }, []);

  const { data: movimentacoes, loading, error } = useFetch<any[]>("/api/movimentacoes");

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <DashboardLayout>
        <main className="flex-1 p-0 md:p-6 md:pb-6 overflow-hidden">
          <div className="h-full w-full bg-gray-50 text-gray-900 md:rounded-3xl p-8 overflow-y-auto shadow-2xl shadow-black/50">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Fluxo de Caixa</h1>
                <p className="text-gray-500 mt-1">Acompanhe entradas, saídas e saldo consolidado.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button aria-label="Abertura/Fechamento">Abertura/Fechamento</Button>
                <Button aria-label="Conciliação" variant="ghost">Conciliação</Button>
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="mb-4"><Breadcrumbs /></div>

            {/* Quick stats */}
            {(() => {
              const items = (movimentacoes || []) as any[];
              const entradas = items.filter((m) => m.tipo === "entrada");
              const saidas = items.filter((m) => m.tipo === "saida");
              const totalEntradas = entradas.reduce((acc, m) => acc + Number(m.valor || 0), 0);
              const totalSaidas = saidas.reduce((acc, m) => acc + Number(m.valor || 0), 0);
              const saldo = totalEntradas - totalSaidas;
              return (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="text-gray-500 text-sm">Entradas</div>
                    <div className="text-gray-900 font-bold text-2xl">{formatCurrency(totalEntradas)}</div>
                    <div className="text-gray-500 text-xs mt-1">{entradas.length} registros</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="text-gray-500 text-sm">Saídas</div>
                    <div className="text-gray-900 font-bold text-2xl">{formatCurrency(totalSaidas)}</div>
                    <div className="text-gray-500 text-xs mt-1">{saidas.length} registros</div>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                    <div className="text-gray-500 text-sm">Saldo</div>
                    <div className={"font-bold text-2xl " + (saldo >= 0 ? "text-emerald-600" : "text-red-600")}>{formatCurrency(saldo)}</div>
                    <div className="text-gray-500 text-xs mt-1">Consolidado</div>
                  </div>
                </div>
              );
            })()}

            {/* Alerts and Latest */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">Pendências do Caixa</h3>
                </div>
                <div className="text-sm text-gray-600">Nenhuma pendência no momento.</div>
              </section>

              <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">Últimas Movimentações</h3>
                  <span className="text-xs text-gray-500">mais recentes</span>
                </div>
                <ul className="divide-y divide-gray-200">
                  {((movimentacoes || []) as any[]).slice(0, 3).map((m) => (
                    <li key={m.id} className="py-2 flex items-center justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <span className={"h-2.5 w-2.5 rounded-full " + (m.tipo === "entrada" ? "bg-emerald-500" : "bg-red-500")}></span>
                        <span className="text-gray-700">{m.categoria}</span>
                      </div>
                      <div className="font-medium">{formatCurrency(m.valor)}</div>
                    </li>
                  ))}
                  {((movimentacoes || []) as any[]).length === 0 && (
                    <li className="py-2 text-sm text-gray-500">Sem registros.</li>
                  )}
                </ul>
              </section>
            </div>

            {/* Quick Access */}
            <section className="mb-8">
              <div className="text-sm font-semibold text-gray-900 mb-3">Acesso Rápido</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Listar Movimentações", icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>
                  )},
                  { label: "Movimentações", icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 7l-7 7-4-4-6 6"/><path d="M3 7h18"/></svg>
                  )},
                  { label: "Nova Movimentação", icon: (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                  )},
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                    <div className="h-10 w-10 rounded-lg bg-brand/5 text-brand flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div className="font-medium text-gray-800">{item.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Table section */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">Movimentações de Caixa</h3>
                <Button aria-label="Nova Movimentação">Nova Movimentação</Button>
              </div>

              {loading ? (
                <div className="text-gray-500">Carregando...</div>
              ) : error ? (
                <div className="text-red-500">Erro ao carregar movimentações</div>
              ) : (
                <Table caption="Movimentações" variant="light">
                  <Thead>
                    <Th>Tipo</Th>
                    <Th>Categoria</Th>
                    <Th>Valor</Th>
                    <Th>Data</Th>
                  </Thead>
                  <Tbody>
                    {(movimentacoes || []).map((mov: any) => (
                      <Tr key={mov.id}>
                        <Td>
                          <span className={mov.tipo === "entrada" ? "text-emerald-600" : "text-red-600"}>{mov.tipo}</span>
                        </Td>
                        <Td><span className="text-gray-700">{mov.categoria}</span></Td>
                        <Td><span className="font-semibold">{formatCurrency(mov.valor)}</span></Td>
                        <Td><span className="text-gray-700">{mov.data ? new Date(mov.data).toLocaleString() : "-"}</span></Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </section>

          </div>
        </main>
      </DashboardLayout>
      <MobileNav
        items={[
          {
            label: "Abrir/Fechar",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8"/></svg>),
          },
          {
            label: "Nova Mov.",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>),
          },
        ]}
      />
    </div>
  );
}
