"use client";
import React from "react";
import DashboardLayout from "../../components/DashboardLayout";

export default function StatusPage() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [syncing, setSyncing] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/status")
      .then((r) => r.json())
      .then((j) => setData(j))
      .catch(() => setData({ ok: false }))
      .finally(() => setLoading(false));
  }, []);

  async function doSync() {
    try {
      setSyncing(true);
      const res = await fetch("/api/status?sync=1");
      const json = await res.json();
      setData(json);
    } catch {}
    finally { setSyncing(false); }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Status do Sistema</h1>
      {loading ? (
        <div className="text-gray-400">Carregando...</div>
      ) : data?.ok ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400">Postgres</div>
              <div className="text-blue-400 font-bold">Conectado</div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400">Variáveis</div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <span className={`px-2 py-1 rounded ${data.env?.databaseUrl ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>DATABASE_URL</span>
                <span className={`px-2 py-1 rounded ${data.env?.railwayDatabaseUrl ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-300'}`}>RAILWAY_DATABASE_URL</span>
                <span className="px-2 py-1 rounded bg-slate-500/20 text-slate-300">NODE_ENV: {data.env?.nodeEnv || '-'}</span>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <div className="text-gray-400">Contagens</div>
              <div className="text-white font-bold">Lojas: {data.counts?.lojas ?? 0} | Metas: {data.counts?.metas ?? 0} | Mov.: {data.counts?.movimentacoes ?? 0} | Vendas: {data.counts?.vendas ?? 0}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(['franquias','caixa','metas'] as const).map((schema) => (
              <div key={schema} className="bg-gray-900 rounded-lg p-4">
                <div className="text-gray-400 mb-2">Schema: {schema}</div>
                <ul className="text-sm text-gray-200 space-y-1 list-disc list-inside">
                  {(data.schemas?.[schema] || []).map((t: string) => (
                    <li key={t}>{t}</li>
                  ))}
                  {(!data.schemas?.[schema] || data.schemas?.[schema].length === 0) && (
                    <li className="text-gray-500">Sem tabelas</li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {data.env?.allowDbSync ? (
            <button onClick={doSync} disabled={syncing} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-60">
              {syncing ? 'Sincronizando...' : 'Sincronizar banco (migrate/db push)'}
            </button>
          ) : (
            <div className="text-sm text-gray-400">Para habilitar sincronização aqui, defina ALLOW_DB_SYNC=true nas variáveis do serviço.</div>
          )}
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
