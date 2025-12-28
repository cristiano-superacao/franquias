"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import DashboardSidebar from "../../components/DashboardSidebar";
import { useFetch } from "../../hooks/useFetch";

const KPICards = dynamic(() => import("../../components/KPICards"), { ssr: false });
const MetasBarChart = dynamic(() => import("../../components/MetasBarChart"), { ssr: false });

export default function DashboardPage() {
  const [selectedLoja, setSelectedLoja] = useState<number | null>(null);
  const { data: lojas, loading: loadingLojas } = useFetch<{ id: number; nome: string }[]>("/api/lojas");

  const lojaParam = selectedLoja ? `?lojaId=${selectedLoja}` : "";
  const { data: kpis, loading: loadingKpis } = useFetch<{ label: string; value: string }[]>(`/api/kpis${lojaParam}`);
  const { data: metasData, loading: loadingMetas } = useFetch<{ nome: string; meta: number; realizado: number }[]>(`/api/metas${lojaParam}`);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <DashboardSidebar
        lojas={lojas || []}
        selectedLoja={selectedLoja}
        onSelectLoja={setSelectedLoja}
      />
      <main className="flex-1 p-6 pb-20 md:pb-6">
        <div className="mx-auto w-full max-w-6xl">
          <h1 className="text-2xl font-bold mb-6">Dashboard Super Admin</h1>
          {loadingKpis ? (
            <div className="text-gray-400">Carregando KPIs...</div>
          ) : (
            <KPICards kpis={kpis || []} />
          )}
          {loadingMetas ? (
            <div className="text-gray-400">Carregando Metas...</div>
          ) : (
            <MetasBarChart data={metasData || []} />
          )}
          <div className="mt-8 flex justify-end">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded shadow transition">Backup Banco</button>
          </div>
        </div>
      </main>
      {/* Bottom Bar para mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 z-30">
        <button className="flex flex-col items-center text-xs text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition active:scale-95" aria-label="Menu">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/></svg>
          Menu
        </button>
        <button className="flex flex-col items-center text-xs text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition active:scale-95" aria-label="Lançar Nota Fiscal">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8"/></svg>
          Lançar NF
        </button>
        <button className="flex flex-col items-center text-xs text-gray-400 hover:text-emerald-400 focus:text-emerald-400 transition active:scale-95" aria-label="Backup Banco">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/></svg>
          Backup
        </button>
      </nav>
    </div>
  );
}
