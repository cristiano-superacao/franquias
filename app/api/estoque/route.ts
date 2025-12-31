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
