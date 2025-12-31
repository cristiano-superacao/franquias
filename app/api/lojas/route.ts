import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET() {
  try {
    const lojas = await prisma.loja.findMany({ orderBy: { nome: "asc" } });
    return NextResponse.json(lojas, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: "Falha ao listar lojas" }, { status: 500 });
  }
}
