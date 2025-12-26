import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Exemplo: buscar insumos de limpeza e alimentos
  const limpeza = await prisma.movimentacao.findMany({ where: { categoria: 'limpeza' } });
  const alimentos = await prisma.movimentacao.findMany({ where: { categoria: 'alimento' } });
  return NextResponse.json({ limpeza, alimentos });
}
