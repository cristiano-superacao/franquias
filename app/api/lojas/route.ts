import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const lojas = await prisma.loja.findMany();
  return NextResponse.json(lojas);
}
