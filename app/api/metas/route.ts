import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lojaId = url.searchParams.get("lojaId");
    const where = lojaId ? { loja_id: Number(lojaId) } : {};
    const metas = await (prisma as any).meta.findMany({ where, orderBy: { id: "desc" }, take: 100 });
    return NextResponse.json(metas, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao listar metas" }, { status: 500 });
  }
}
