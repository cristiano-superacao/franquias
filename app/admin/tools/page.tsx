"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../../components/DashboardLayout";
import { useToast } from "../../../components/Toast";
import { getSession } from "../../../lib/auth";

export default function AdminToolsPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    const session = getSession();
    if (!session) window.location.href = "/login";
  }, []);

  async function runInit() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/init", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        showToast(json.error || "Falha ao executar init", "error");
      } else {
        showToast("Init executado com sucesso", "success");
        setResult("OK");
      }
    } catch {
      showToast("Falha de rede ao executar init", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Admin Tools</h1>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <p className="text-gray-300 mb-3">Executa o endpoint de inicialização do banco (criação de schemas/tabelas e seed). Requer variável <span className="font-semibold text-blue-400">ALLOW_DB_SYNC=true</span> no ambiente de produção.</p>
          <button
            onClick={runInit}
            disabled={loading}
            className="inline-flex justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-semibold shadow-sm disabled:opacity-60"
          >
            {loading ? "Executando..." : "Executar Init"}
          </button>
          {result && <p className="mt-3 text-green-400">Resultado: {result}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
