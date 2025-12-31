"use client";
import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import DashboardSidebar from "../../components/DashboardSidebar";
import MobileNav from "../../components/MobileNav";
import { useFetch } from "../../hooks/useFetch";
import { getSession, logout } from "../../lib/auth";
import { getSelectedLojaId, setSelectedLojaId } from "../../lib/tenant";
import Button from "../../components/ui/Button";
import AlertsPanel from "../../components/AlertsPanel";
import DashboardStats from "../../components/DashboardStats";
import SearchInput from "../../components/SearchInput";
import Skeleton from "../../components/ui/Skeleton";
import { visibleRoutes } from "../../lib/routes";
import type { User, Role } from "../../lib/types";

const MetasBarChart = dynamic(() => import("../../components/MetasBarChart"), { ssr: false });

export default function DashboardPage() {
  const [selectedLoja, setSelectedLoja] = useState<number | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }
    setUser(session);
    setSelectedLoja(getSelectedLojaId());
    const onStorage = (e: StorageEvent) => {
      if (e.key === "selected_loja_id") {
        try {
          setSelectedLoja(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setSelectedLoja(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const { data: lojasRaw, loading: loadingLojas } = useFetch<any[]>("/api/lojas");

  // Filtra lojas conforme papel
  const lojas = useMemo(() => {
    const list: any[] = lojasRaw || [];
    if (!user) return list;
    if (user.role === "franchise_user" && user.loja_id) {
      return list.filter((l) => l.id === user.loja_id);
    }
    if (user.role === "company_admin" && user.empresa_id) {
      return list.filter((l) => l.empresa_id === user.empresa_id);
    }
    return list;
  }, [lojasRaw, user]);

  const lojaParam = selectedLoja ? `?lojaId=${selectedLoja}` : "";
  const { data: kpis, loading: loadingKpis } = useFetch<{ label: string; value: string }[]>(`/api/kpis${lojaParam}`);
  const { data: metasData, loading: loadingMetas } = useFetch<{ nome: string; meta: number; realizado: number }[]>(`/api/metas${lojaParam}`);

  const [query, setQuery] = useState("");

  // Transform KPIs for new component
  const statsItems = useMemo(() => {
    if (!kpis) return [];
    return kpis.map((k) => {
      let type = "primary";
      let subtext = "+0% este mês"; // Mock subtext
      if (k.label.toLowerCase().includes("venda")) { type = "success"; subtext = "+12% vs mês anterior"; }
      else if (k.label.toLowerCase().includes("despesa")) { type = "danger"; subtext = "-5% vs mês anterior"; }
      else if (k.label.toLowerCase().includes("resultado")) { type = "info"; subtext = "Dentro da meta"; }
      else if (k.label.toLowerCase().includes("comissão")) { type = "purple"; subtext = "Pagamento dia 05"; }
      
      return {
        label: k.label,
        value: k.value,
        subtext,
        type: type as any
      };
    });
  }, [kpis]);

  // Filter actions
  const filteredActions = useMemo(() => {
    const actions = visibleRoutes((user?.role as Role) ?? null);
    if (!query) return actions;
    return actions.filter(a => a.label.toLowerCase().includes(query.toLowerCase()));
  }, [user, query]);

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col md:flex-row">
      <DashboardSidebar
        lojas={lojas || []}
        selectedLoja={selectedLoja}
        onSelectLoja={(id) => {
          if (user?.role === "franchise_user" && id === null) return;
          setSelectedLojaId(id);
          setSelectedLoja(id);
        }}
        allowConsolidated={user?.role !== "franchise_user"}
        role={user?.role || null}
        showStores={false}
      />
      <main className="flex-1 p-0 md:p-6 md:pb-6 overflow-hidden">
        <div className="h-full w-full bg-gray-50 text-gray-900 md:rounded-3xl p-8 overflow-y-auto shadow-2xl shadow-black/50">
          
          {/* Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-gray-500 mt-1">Gestão completa de receitas, despesas e fluxo de caixa.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm">
                <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Bem-vindo,</span>
                  <span className="text-sm font-bold text-gray-900 leading-none">{user?.username}</span>
                </div>
              </div>
              <Button 
                className="h-12 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                onClick={() => {}}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Nova Transação
              </Button>
            </div>
          </header>

          {/* Stats Cards */}
          {loadingKpis ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 rounded-2xl" />
              ))}
            </div>
          ) : (
            <DashboardStats items={statsItems} />
          )}

          {/* Filters & Actions Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1">
              <SearchInput value={query} onChange={setQuery} placeholder="Buscar transações, lojas ou categorias..." />
            </div>
            <div className="flex gap-3">
              <select className="h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>Todos os tipos</option>
                <option>Receitas</option>
                <option>Despesas</option>
              </select>
              <select className="h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand/20">
                <option>Todos os status</option>
                <option>Confirmado</option>
                <option>Pendente</option>
              </select>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Alerts & Chart */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Alerts Section */}
              <AlertsPanel />

              {/* Chart Section */}
              <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Metas por Unidade</h3>
                  <select className="text-sm border-none bg-gray-50 rounded-lg px-3 py-1 text-gray-600 font-medium focus:ring-0">
                    <option>Este mês</option>
                    <option>Últimos 3 meses</option>
                  </select>
                </div>
                <div className="h-[300px] w-full">
                  {loadingMetas ? (
                    <Skeleton className="h-full w-full rounded-xl" />
                  ) : (
                    <MetasBarChart data={metasData || []} />
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Quick Actions / Empty State */}
            <div className="space-y-8">
              <section>
                 <h3 className="text-lg font-bold text-gray-900 mb-4">Acesso Rápido</h3>
                 <div className="flex flex-col gap-3">
                    {filteredActions.map((action, idx) => (
                      <Link 
                        key={idx} 
                        href={action.href}
                        className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-brand-300 transition-all group"
                      >
                        <div className="h-10 w-10 rounded-lg bg-brand/5 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors" aria-hidden="true">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7"/>
                            <rect x="14" y="3" width="7" height="7"/>
                            <rect x="3" y="14" width="7" height="7"/>
                            <rect x="14" y="14" width="7" height="7"/>
                          </svg>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900">{action.label}</span>
                          <span className="text-xs text-gray-500">Acessar módulo</span>
                        </div>
                        <div className="ml-auto text-gray-300 group-hover:text-brand transition-colors">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                          </svg>
                        </div>
                      </Link>
                    ))}
                 </div>
              </section>

              <section className="bg-brand/5 rounded-2xl p-6 border border-brand/10 flex flex-col items-center text-center justify-center h-[200px]">
                 <div className="h-12 w-12 rounded-full bg-brand/10 flex items-center justify-center text-brand mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2v20M2 12h20"/>
                    </svg>
                 </div>
                 <h4 className="font-bold text-gray-900">Nova Campanha</h4>
                 <p className="text-xs text-gray-500 mt-1 max-w-[200px]">Crie campanhas de vendas para suas franquias.</p>
              </section>
            </div>

          </div>

        </div>
      </main>
      <MobileNav
        items={[
          {
            label: "Menu",
            ariaLabel: "Menu",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/></svg>),
          },
          {
            label: "Lançar NF",
            ariaLabel: "Lançar Nota Fiscal",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8"/></svg>),
          },
          {
            label: "Backup",
            ariaLabel: "Backup Banco",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>),
          },
        ]}
      />
    </div>
  );
}
