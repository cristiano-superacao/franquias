import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

function currency(n: number) {
  return `R$ ${n.toFixed(2)}`;
}

function isSameMonth(d: Date, ref: Date) {
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lojaIdParam = url.searchParams.get("lojaId");
    const lojaId = lojaIdParam ? Number(lojaIdParam) : null;
    const now = new Date();

    // Vendas mês
    const vendas = await prisma.venda.findMany({
      where: lojaId ? { loja_id: lojaId } : {},
      orderBy: { id: "desc" },
      take: 500,
    });
    const vendasMes = (vendas || [])
      .filter((v: any) => isSameMonth(new Date(v.dataEmissao), now))
      .reduce((sum: number, v: any) => sum + Number(v.valor || 0), 0);

    // Despesas (saídas) mês
    const movs = await prisma.movimentacao.findMany({
      where: lojaId ? { loja_id: lojaId } : {},
      orderBy: { data: "desc" },
      take: 500,
    });
    const despesasMes = (movs || [])
      .filter((m: any) => m.tipo === "saida" && isSameMonth(new Date(m.data), now))
      .reduce((sum: number, m: any) => sum + Number(m.valor || 0), 0);

    // Comissão (percentual da loja)
    let comPerc = 0;
    if (lojaId) {
      const loja = await prisma.loja.findUnique({ where: { id: lojaId } });
      comPerc = loja ? Number(loja.porcentagem_comissao || 0) : 0;
    }
    const comissaoMes = vendasMes * (comPerc / 100);

    const saldoMes = vendasMes - despesasMes - comissaoMes;

    const result = [
      { label: "Vendas (mês)", value: currency(vendasMes) },
      { label: "Despesas (mês)", value: currency(despesasMes) },
      { label: "Comissão (mês)", value: currency(comissaoMes) },
      { label: "Saldo (mês)", value: currency(saldoMes) },
    ];

    return NextResponse.json(result, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao calcular KPIs" }, { status: 500 });
  }
}
