import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { lojas as mockLojas } from "../../../lib/mockData";

function toNumber(val: any): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  if (typeof val === "string") return Number(val);
  // Prisma.Decimal
  if (typeof val === "object" && typeof (val as any).toNumber === "function") {
    try { return (val as any).toNumber(); } catch { return Number(String(val)); }
  }
  return Number(val);
}

export async function GET() {
  // Fallback para mock quando variável pública estiver ativa (preview) ou quando não houver DATABASE_URL
  const useMock = !!process.env.NEXT_PUBLIC_USE_MOCK || !process.env.DATABASE_URL;
  if (useMock) {
    return NextResponse.json(mockLojas, { status: 200 });
  }

  try {
    const rows = await prisma.loja.findMany({
      select: {
        id: true,
        nome: true,
        empresa_id: true,
        meta_venda: true,
        meta_consumo_limpeza: true,
        porcentagem_comissao: true,
      },
    });

    const data = rows.map((l) => ({
      id: l.id,
      nome: l.nome,
      empresa_id: l.empresa_id,
      meta_venda: toNumber(l.meta_venda),
      meta_consumo_limpeza: toNumber(l.meta_consumo_limpeza),
      porcentagem_comissao: toNumber(l.porcentagem_comissao),
    }));

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error("/api/lojas error:", err);
    // Em caso de erro, tenta retornar mock para não quebrar UI
    return NextResponse.json(mockLojas, { status: 200 });
  }
}
