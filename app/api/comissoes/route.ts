import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    // Retorna as configurações de comissão das lojas
    const lojas = await prisma.loja.findMany({
      select: {
        id: true,
        nome: true,
        porcentagem_comissao: true,
        meta_venda: true,
      },
      orderBy: { nome: "asc" },
    });

    const comissoes = lojas.map(l => ({
      loja: l.nome,
      faixa: `${Number(l.porcentagem_comissao).toFixed(1)}%`,
      volume: `R$ ${Number(l.meta_venda).toFixed(2)}`,
      porcentagem_comissao: Number(l.porcentagem_comissao),
      meta_venda: Number(l.meta_venda),
    }));

    return NextResponse.json(comissoes);
  } catch (err) {
    return NextResponse.json({ error: "Falha ao listar comissões" }, { status: 500 });
  }
}
