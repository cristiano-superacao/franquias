import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const lojaIdParam = url.searchParams.get("lojaId");
    const lojaId = lojaIdParam ? Number(lojaIdParam) : null;

    // Mock de dados de estoque (alimentos e limpeza)
    const alimentos = [
      { id: 1, nome: "Arroz", quantidade: 120, unidade: "kg" },
      { id: 2, nome: "Feijão", quantidade: 85, unidade: "kg" },
      { id: 3, nome: "Óleo", quantidade: 40, unidade: "L" },
    ];

    const limpeza = [
      { id: 4, nome: "Detergente", quantidade: 50, unidade: "unidades" },
      { id: 5, nome: "Desinfetante", quantidade: 30, unidade: "L" },
      { id: 6, nome: "Álcool Gel", quantidade: 25, unidade: "L" },
    ];

    return NextResponse.json({ alimentos, limpeza });
  } catch (err) {
    return NextResponse.json({ error: "Falha ao listar estoque" }, { status: 500 });
  }
}
