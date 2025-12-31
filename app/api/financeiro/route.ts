import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lojaIdParam = url.searchParams.get("lojaId");
    const lojaId = lojaIdParam ? Number(lojaIdParam) : null;

    const whereBase = lojaId ? { loja_id: lojaId } : {};
    const lancamentos = await prisma.lancamentoFinanceiro.findMany({
      where: whereBase,
      orderBy: { data: "desc" },
      take: 200,
    }).catch(() => []);

    return NextResponse.json({ lancamentos });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao listar financeiro" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const loja_id = Number(body?.loja_id);
    const tipo = String(body?.tipo || "").trim();
    const categoria = String(body?.categoria || "").trim();
    const valor = Number(body?.valor || 0);
    const data = body?.data ? new Date(body.data) : new Date();
    const descricao = body?.descricao ? String(body.descricao) : null;

    if (!loja_id || !tipo || !categoria || !valor)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const created = await prisma.lancamentoFinanceiro.create({
      data: { loja_id, tipo: tipo as any, categoria: categoria as any, valor, data, descricao },
    });
    return NextResponse.json({ ok: true, lancamento: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao criar lançamento" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? Number(idParam) : null;
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.lancamentoFinanceiro.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao remover lançamento" }, { status: 500 });
  }
}
