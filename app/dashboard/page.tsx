"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import DashboardLayout from "../../components/DashboardLayout";
import { useFetch } from "../../hooks/useFetch";
import { getSession, logout } from "../../lib/auth";
import { SkeletonGrid, SkeletonChart } from "../../components/Skeleton";
import { useToast } from "../../components/Toast";

const KPICards = dynamic(() => import("../../components/KPICards"), { ssr: false });
const MetasBarChart = dynamic(() => import("../../components/MetasBarChart"), { ssr: false });

export default function DashboardPage() {
  const [selectedLoja, setSelectedLoja] = useState<number | null>(null);
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const { showToast } = useToast();

  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) {
      window.location.href = "/login";
      return;
    }
    setUser(session);
  }, []);
  const { data: lojas, loading: loadingLojas } = useFetch<{ id: number; nome: string }[]>("/api/lojas");

  const lojaParam = selectedLoja ? `?lojaId=${selectedLoja}` : "";
  const { data: kpis, loading: loadingKpis } = useFetch<{ label: string; value: string }[]>(`/api/kpis${lojaParam}`);
  const { data: metasData, loading: loadingMetas } = useFetch<{ nome: string; meta: number; realizado: number }[]>(`/api/metas${lojaParam}`);

  async function handleBackup() {
    showToast("Gerando backup do banco de dados...", "success");
    // TODO: Implementar API de backup real
    // Por enquanto, mostra toast simulando sucesso
    setTimeout(() => {
      showToast("Backup gerado com sucesso! (simulado)", "success");
    }, 1500);
  }

  return (
    <DashboardLayout selectedLoja={selectedLoja} onSelectLoja={setSelectedLoja}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard Super Admin</h1>
      </div>
      {loadingKpis ? (
        <SkeletonGrid />
      ) : (
        <KPICards kpis={kpis || []} />
      )}
      <div className="mt-6">
        {loadingMetas ? (
          <SkeletonChart />
        ) : (
          <MetasBarChart data={metasData || []} />
        )}
      </div>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleBackup}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition active:scale-95 flex items-center gap-2"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
          </svg>
          Backup Banco
        </button>
      </div>
    </DashboardLayout>
  );
}
