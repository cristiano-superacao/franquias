import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { numero, dataEmissao, valor, categoria, lojaId } = body || {};

    if (!numero || !dataExemplo(body) || !isFiniteNumber(valor)) {
      return NextResponse.json({ ok: false, error: "Campos inválidos" }, { status: 400 });
    }

    // Persiste venda (schema caixa)
    const venda = await prisma.venda.create({
      data: {
        numero,
        dataEmissao: new Date(dataEmissao),
        valor,
        categoria,
        loja_id: Number(lojaId) || 0,
      },
    });
    return NextResponse.json({ ok: true, venda }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
}

export async function GET() {
  const vendas = await prisma.venda.findMany({ orderBy: { id: "desc" }, take: 50 });
  return NextResponse.json({ ok: true, vendas }, { status: 200 });
}

function dataExemplo(body: any) {
  const d = body?.dataEmissao;
  return typeof d === "string" && d.length >= 8;
}

function isFiniteNumber(n: any) {
  const v = Number(n);
  return Number.isFinite(v) && v >= 0;
}
