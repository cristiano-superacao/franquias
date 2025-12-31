import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function PUT(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    const body = await req.json();
    const data: any = {};
    if (typeof body?.nome === "string") data.nome = body.nome.trim();
    if (body?.meta_venda !== undefined) data.meta_venda = Number(body.meta_venda);
    if (body?.meta_consumo_limpeza !== undefined) data.meta_consumo_limpeza = Number(body.meta_consumo_limpeza);
    if (body?.porcentagem_comissao !== undefined) data.porcentagem_comissao = Number(body.porcentagem_comissao);

    const updated = await prisma.loja.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ error: "Falha ao atualizar loja" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await ctx.params;
    const id = Number(idStr);
    if (!Number.isFinite(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    await prisma.loja.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao excluir loja" }, { status: 500 });
  }
}
