import { NextResponse } from "next/server";

export async function GET() {
  // Exemplo de KPIs estáticos, substitua por dados reais do banco se necessário
  const kpis = [
    { label: "Faturamento Total", value: "R$ 120.000" },
    { label: "Ticket Médio Global", value: "R$ 45,00" },
    { label: "Lucro Líquido", value: "R$ 30.000" },
  ];
  return NextResponse.json(kpis);
}
