import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { porcentagem_comissao, meta_venda } = body;

    // Validação básica
    if (
      porcentagem_comissao !== undefined &&
      (typeof porcentagem_comissao !== "number" || porcentagem_comissao < 0 || porcentagem_comissao > 100)
    ) {
      return NextResponse.json(
        { error: "Porcentagem de comissão deve ser entre 0 e 100" },
        { status: 400 }
      );
    }

    if (
      meta_venda !== undefined &&
      (typeof meta_venda !== "number" || meta_venda < 0)
    ) {
      return NextResponse.json(
        { error: "Meta de venda deve ser um valor positivo" },
        { status: 400 }
      );
    }

    // Atualiza a loja
    const updateData: any = {};
    if (porcentagem_comissao !== undefined) updateData.porcentagem_comissao = porcentagem_comissao;
    if (meta_venda !== undefined) updateData.meta_venda = meta_venda;

    const lojaAtualizada = await prisma.loja.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(lojaAtualizada, { status: 200 });
  } catch (error: any) {
    console.error("Erro ao atualizar comissão:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar comissão", details: error.message },
      { status: 500 }
    );
  }
}
