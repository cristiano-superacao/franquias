"use client";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

export default function StatusPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((j) => setData(j))
      .catch(() => setData({ ok: false }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Status do Sistema</h1>
      {loading ? (
        <div className="text-gray-400">Carregando...</div>
      ) : data?.ok ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400">Postgres</div>
            <div className="text-emerald-400 font-bold">Conectado</div>
          </div>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-gray-400">Lojas (count)</div>
            <div className="text-white font-bold">{data.lojasCount ?? 0}</div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-900 rounded-lg p-4">
          <div className="text-red-400 font-bold">Falha ao conectar ao banco</div>
          <div className="text-gray-400">Verifique a variável DATABASE_URL no Railway.</div>
        </div>
      )}
    </DashboardLayout>
  );
}
