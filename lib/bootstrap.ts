import { prisma } from "./db";
import bcrypt from "bcryptjs";

export async function bootstrapDb() {
  // Schemas
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS franquias`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS caixa`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS metas`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS estoque`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS financeiro`);
  await prisma.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS public`);

  // Tabela Loja
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS franquias."Loja" (
      id SERIAL PRIMARY KEY,
      nome TEXT NOT NULL,
      meta_venda NUMERIC(10,2) NOT NULL,
      meta_consumo_limpeza NUMERIC(10,2) NOT NULL,
      porcentagem_comissao NUMERIC(5,2) NOT NULL
    )
  `);

  // Tabela Movimentacao
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS caixa."Movimentacao" (
      id SERIAL PRIMARY KEY,
      loja_id INTEGER NOT NULL REFERENCES franquias."Loja"(id) ON DELETE CASCADE,
      tipo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      valor NUMERIC(10,2) NOT NULL,
      data TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Tabela Venda
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS caixa."Venda" (
      id SERIAL PRIMARY KEY,
      loja_id INTEGER NOT NULL REFERENCES franquias."Loja"(id) ON DELETE CASCADE,
      numero TEXT NOT NULL,
      dataEmissao TIMESTAMPTZ NOT NULL,
      valor NUMERIC(10,2) NOT NULL,
      categoria TEXT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Tabela Meta
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS metas."Meta" (
      id SERIAL PRIMARY KEY,
      loja_id INTEGER NOT NULL REFERENCES franquias."Loja"(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      meta NUMERIC(10,2) NOT NULL,
      realizado NUMERIC(10,2) NOT NULL DEFAULT 0,
      periodo TEXT NOT NULL,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Tabela ItemEstoque
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS estoque."ItemEstoque" (
      id SERIAL PRIMARY KEY,
      loja_id INTEGER NOT NULL REFERENCES franquias."Loja"(id) ON DELETE CASCADE,
      nome TEXT NOT NULL,
      categoria TEXT NOT NULL,
      quantidade INTEGER NOT NULL DEFAULT 0,
      unidade TEXT NOT NULL,
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Tabela LancamentoFinanceiro
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS financeiro."LancamentoFinanceiro" (
      id SERIAL PRIMARY KEY,
      loja_id INTEGER NOT NULL REFERENCES franquias."Loja"(id) ON DELETE CASCADE,
      tipo TEXT NOT NULL,
      categoria TEXT NOT NULL,
      valor NUMERIC(10,2) NOT NULL,
      data TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      descricao TEXT NULL,
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Usuários (autenticação básica)
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS public."User" (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Seed Loja padrão
  const lojasCount = await prisma.loja.count().catch(() => 0);
  if (lojasCount === 0) {
    await prisma.loja.create({
      data: {
        nome: "Loja Principal",
        meta_venda: 10000,
        meta_consumo_limpeza: 1500,
        porcentagem_comissao: 5,
      },
    }).catch(() => {});
  }

  // Seed usuário admin
  const adminEmail = "admin@vendacerta.com";
  const existsAdmin = await prisma.user.findUnique({ where: { email: adminEmail } }).catch(() => null);
  if (!existsAdmin) {
    const hash = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: adminEmail,
        password: hash,
        role: "admin",
      },
    }).catch(() => {});
  }
}
