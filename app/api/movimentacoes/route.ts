import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lojaId = url.searchParams.get("lojaId");
    const where = lojaId ? { loja_id: Number(lojaId) } : {};
    const movs = await (prisma as any).movimentacao.findMany({ where, orderBy: { data: "desc" }, take: 200 });
    return NextResponse.json(movs, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao listar movimentações" }, { status: 500 });
  }
}
