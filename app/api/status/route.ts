import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getEnvReport } from "../../../lib/env";
import { bootstrapDb } from "../../../lib/bootstrap";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const trySync = url.searchParams.get("sync") === "1";

    const env = getEnvReport();

    // checar conectividade
    const ping = await (prisma as any).$queryRaw`SELECT 1 as ok`;

    // garantir estruturas se permitido
    if (env.allowDbSync) {
      try { await bootstrapDb(); } catch {}
    }

    // checar tabelas por schema
    let tables: any[] = [];
    try {
      const raw = await (prisma as any).$queryRawUnsafe(
        `SELECT table_schema, table_name
         FROM information_schema.tables
         WHERE table_schema in ('franquias','caixa','metas','estoque','financeiro','public')
           AND table_type='BASE TABLE'
         ORDER BY table_schema, table_name`
      );
      tables = raw as any[];
    } catch {
      // ignore
    }

    const schemas = {
      public: tables.filter(t => t.table_schema === 'public').map(t => t.table_name),
      franquias: tables.filter(t => t.table_schema === 'franquias').map(t => t.table_name),
      caixa: tables.filter(t => t.table_schema === 'caixa').map(t => t.table_name),
      metas: tables.filter(t => t.table_schema === 'metas').map(t => t.table_name),
      estoque: tables.filter(t => t.table_schema === 'estoque').map(t => t.table_name),
      financeiro: tables.filter(t => t.table_schema === 'financeiro').map(t => t.table_name),
    };

    // contagens úteis
    let counts: any = {};
    try {
      counts.users = await (prisma as any).user.count();
      counts.lojas = await (prisma as any).loja.count();
      counts.metas = await (prisma as any).meta.count();
      counts.movimentacoes = await (prisma as any).movimentacao.count();
      counts.vendas = await (prisma as any).venda.count();
      counts.itensEstoque = await (prisma as any).itemEstoque.count();
      counts.lancamentosFinanceiros = await (prisma as any).lancamentoFinanceiro.count();
    } catch {
      // ignora se tabelas não existem ainda
    }

    // opcional: sincronizar schema (somente se habilitado por env e query)
    let sync: { ran: boolean; ok?: boolean; error?: string } = { ran: false };
    if (trySync && env.allowDbSync) {
      try {
        // Primeiro, tentamos criar com Prisma CLI; se falhar, caímos para DDL manual.
        const { execaCommand } = await import('execa');
        await execaCommand('npx prisma migrate deploy', { stdio: 'pipe' });
        await execaCommand('npx prisma db push', { stdio: 'pipe' });
        sync = { ran: true, ok: true };
      } catch (e: any) {
        try {
          await bootstrapDb();
          sync = { ran: true, ok: true };
        } catch (e2: any) {
          sync = { ran: true, ok: false, error: e2?.message || e?.message || 'sync failed' };
        }
      }
    }

    return NextResponse.json({ ok: true, ping, env, schemas, counts, sync }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "DB indisponível" }, { status: 500 });
  }
}
