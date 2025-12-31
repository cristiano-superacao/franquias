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
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <span className="text-white">Usuários: <strong>{data.counts?.users ?? 0}</strong></span>
                <span className="text-white">Lojas: <strong>{data.counts?.lojas ?? 0}</strong></span>
                <span className="text-white">Vendas: <strong>{data.counts?.vendas ?? 0}</strong></span>
                <span className="text-white">Mov.: <strong>{data.counts?.movimentacoes ?? 0}</strong></span>
                <span className="text-white">Metas: <strong>{data.counts?.metas ?? 0}</strong></span>
                <span className="text-white">Estoque: <strong>{data.counts?.itensEstoque ?? 0}</strong></span>
                <span className="text-white col-span-2">Financeiro: <strong>{data.counts?.lancamentosFinanceiros ?? 0}</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(['public', 'franquias','caixa','metas','estoque','financeiro'] as const).map((schema) => {
              const tables = data.schemas?.[schema] || [];
              const hasData = tables.length > 0;
              return (
                <div key={schema} className={`rounded-lg p-4 border-2 ${hasData ? 'bg-green-900/20 border-green-700' : 'bg-gray-900 border-gray-700'}`}>
                  <div className="text-gray-400 mb-2 flex items-center gap-2">
                    {hasData ? (
                      <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                      </svg>
                    )}
                    Schema: <strong className={hasData ? 'text-green-400' : 'text-gray-500'}>{schema}</strong>
                  </div>
                  <ul className="text-sm text-gray-200 space-y-1">
                    {tables.map((t: string) => (
                      <li key={t} className="flex items-center gap-2">
                        <svg className="h-3 w-3 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                        </svg>
                        {t}
                      </li>
                    ))}
                    {tables.length === 0 && (
                      <li className="text-gray-500">Sem tabelas</li>
                    )}
                  </ul>
                </div>
              );
            })}
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
