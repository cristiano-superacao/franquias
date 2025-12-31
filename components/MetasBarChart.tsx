
import React from "react";
"use client";
import dynamic from "next/dynamic";
const BarChart = dynamic(() => import("recharts").then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import("recharts").then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import("recharts").then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then(mod => mod.Tooltip), { ssr: false });

const ResponsiveContainer = dynamic(() => import("recharts").then(mod => mod.ResponsiveContainer), { ssr: false });
const Legend = dynamic(() => import("recharts").then(mod => mod.Legend), { ssr: false });

type MetasBarChartProps = {
  data: { nome: string; meta: number; realizado: number }[];
};

const MetasBarChart: React.FC<MetasBarChartProps> = React.memo(function MetasBarChart({ data }) {
  const hasData = data && data.length > 0;
  return (
    <div className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.01] hover:border-blue-500 focus-within:border-blue-500" tabIndex={0} aria-label="Gráfico de Metas por Unidade">
      <h2 className="text-lg font-bold text-white mb-4">Metas por Unidade</h2>
      {hasData ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="nome" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip wrapperClassName="!bg-gray-800 !text-white !border-none" />
            <Legend wrapperStyle={{ color: "#fff" }} />
            <Bar dataKey="meta" fill="#38bdf8" name="Meta" radius={[4, 4, 0, 0]} />
            <Bar dataKey="realizado" fill="#10b981" name="Realizado" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="text-center text-gray-400">Nenhum dado de metas disponível para o filtro atual.</div>
      )}
    </div>
  );
});

export default MetasBarChart;
