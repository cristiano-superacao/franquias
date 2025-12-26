
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

type MetasBarChartProps = {
  data: { nome: string; meta: number; realizado: number }[];
};

const MetasBarChart: React.FC<MetasBarChartProps> = React.memo(function MetasBarChart({ data }) {
  return (
    <div className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.01] hover:border-sky-500 focus-within:border-sky-500" tabIndex={0} aria-label="Gráfico de Metas por Unidade">
      <h2 className="text-lg font-bold text-white mb-4">Metas por Unidade</h2>
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
    </div>
  );
});

export default MetasBarChart;
