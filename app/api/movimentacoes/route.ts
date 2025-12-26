import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const movimentacoes = await prisma.movimentacao.findMany({ include: { loja: true } });
  return NextResponse.json(movimentacoes);
}
