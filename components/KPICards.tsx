
import React from "react";

type KPICardsProps = {
  kpis: { label: string; value: string; icon?: React.ReactNode }[];
};

const KPICards: React.FC<KPICardsProps> = React.memo(function KPICards({ kpis }) {
  const hasData = kpis && kpis.length > 0;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {hasData ? (
        kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-gray-900 rounded-xl shadow p-6 flex items-center gap-4 border border-gray-800 transition hover:scale-[1.03] hover:border-emerald-500 focus-within:border-emerald-500"
            tabIndex={0}
            aria-label={kpi.label + ': ' + kpi.value}
          >
            <div className="text-3xl text-emerald-400" aria-hidden="true">{kpi.icon}</div>
            <div>
              <div className="text-sm text-gray-400 font-medium">{kpi.label}</div>
              <div className="text-2xl font-bold text-white">{kpi.value}</div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center">
          <p className="text-gray-400">Nenhum KPI disponível para o filtro atual.</p>
        </div>
      )}
    </div>
  );
});

export default KPICards;
