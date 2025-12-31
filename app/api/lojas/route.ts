import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
  try {
    const lojas = await prisma.loja.findMany({
      orderBy: { id: "asc" },
    });
    return NextResponse.json(lojas);
  } catch (err) {
    return NextResponse.json({ error: "Falha ao listar lojas" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nome = String(body?.nome || "").trim();
    const meta_venda = Number(body?.meta_venda ?? 0);
    const meta_consumo_limpeza = Number(body?.meta_consumo_limpeza ?? 0);
    const porcentagem_comissao = Number(body?.porcentagem_comissao ?? 0);

    if (!nome) return NextResponse.json({ error: "Informe o nome da loja." }, { status: 400 });
    if (meta_venda < 0) return NextResponse.json({ error: "Meta de venda inválida." }, { status: 400 });
    if (meta_consumo_limpeza < 0) return NextResponse.json({ error: "Meta de consumo inválida." }, { status: 400 });
    if (porcentagem_comissao < 0 || porcentagem_comissao > 100)
      return NextResponse.json({ error: "Porcentagem de comissão deve estar entre 0 e 100." }, { status: 400 });

    const created = await prisma.loja.create({
      data: { nome, meta_venda, meta_consumo_limpeza, porcentagem_comissao },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao criar loja" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
  try {
    const lojas = await (prisma as any).loja.findMany({ orderBy: { nome: "asc" } });
    return NextResponse.json(lojas, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao listar lojas" }, { status: 500 });
  }
}
