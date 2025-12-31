import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lojaIdParam = url.searchParams.get("lojaId");
    const lojaId = lojaIdParam ? Number(lojaIdParam) : null;
    // Busca no banco por categorias
    const whereBase = lojaId ? { loja_id: lojaId } : {};
    const alimentos = await prisma.itemEstoque.findMany({
      where: { ...whereBase, categoria: "alimento" as any },
      orderBy: { nome: "asc" },
    }).catch(() => []);
    const limpeza = await prisma.itemEstoque.findMany({
      where: { ...whereBase, categoria: "limpeza" as any },
      orderBy: { nome: "asc" },
    }).catch(() => []);

    return NextResponse.json({ alimentos, limpeza });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao listar estoque" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const loja_id = Number(body?.loja_id);
    const nome = String(body?.nome || "").trim();
    const categoria = String(body?.categoria || "").trim();
    const quantidade = Number(body?.quantidade || 0);
    const unidade = String(body?.unidade || "").trim();

    if (!loja_id || !nome || !categoria || !unidade)
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });

    const created = await prisma.itemEstoque.create({
      data: { loja_id, nome, categoria: categoria as any, quantidade, unidade },
    });
    return NextResponse.json({ ok: true, item: created }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao criar item" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const id = Number(body?.id);
    const nome = body?.nome !== undefined ? String(body.nome).trim() : undefined;
    const quantidade = body?.quantidade !== undefined ? Number(body.quantidade) : undefined;
    const unidade = body?.unidade !== undefined ? String(body.unidade).trim() : undefined;

    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const data: any = {};
    if (nome !== undefined) data.nome = nome;
    if (quantidade !== undefined) data.quantidade = quantidade;
    if (unidade !== undefined) data.unidade = unidade;

    const updated = await prisma.itemEstoque.update({ where: { id }, data });
    return NextResponse.json({ ok: true, item: updated });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao atualizar item" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const idParam = url.searchParams.get("id");
    const id = idParam ? Number(idParam) : null;
    if (!id) return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    await prisma.itemEstoque.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao remover item" }, { status: 500 });
  }
}
