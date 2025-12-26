import { NextResponse } from "next/server";

export async function GET() {
  // Exemplo de metas estáticas, substitua por dados reais do banco se necessário
  const metas = [
    { nome: "Loja 1", meta: 20000, realizado: 18000 },
    { nome: "Loja 2", meta: 22000, realizado: 21000 },
    { nome: "Loja 3", meta: 18000, realizado: 17000 },
    { nome: "Loja 4", meta: 25000, realizado: 24000 },
    { nome: "Loja 5", meta: 15000, realizado: 16000 },
    { nome: "Loja 6", meta: 20000, realizado: 19500 },
  ];
  return NextResponse.json(metas);
}
