import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const lojas = await prisma.loja.findMany({ select: { id: true, nome: true, porcentagem_comissao: true, meta_venda: true } });
  return NextResponse.json(lojas);
}
