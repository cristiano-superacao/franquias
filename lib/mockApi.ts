import { lojas, movimentacoes, estoque, Movimentacao } from "./mockData";
import { coerceNumber, formatCurrency, formatPercent } from "./format";

function parseUrl(url: string) {
  const u = new URL(url, "http://localhost");
  const lojaIdRaw = u.searchParams.get("lojaId");
  const lojaId = lojaIdRaw ? Number(lojaIdRaw) : null;
  return { pathname: u.pathname, lojaId: Number.isFinite(lojaId as number) ? (lojaId as number) : null };
}

function filtraPorLoja<T extends { loja_id?: number; id?: number }>(items: T[], lojaId: number | null) {
  if (!lojaId) return items;
  return items.filter((i) => i.loja_id === lojaId || i.id === lojaId);
}

function loadLocalSales(): Movimentacao[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem("sales_submissions");
    const arr = raw ? JSON.parse(raw) : [];
    const mapped: Movimentacao[] = (Array.isArray(arr) ? arr : []).map((s, idx) => ({
      id: 100000 + idx,
      loja_id: s.lojaId ?? 0,
      tipo: "entrada",
      categoria: "venda",
      valor: Number(s.valor) || 0,
      data: s.dataEmissao || new Date().toISOString(),
    }));
    return mapped;
  } catch {
    return [];
  }
}

function getMovs(lojaId: number | null) {
  const locals = loadLocalSales();
  const base = [...movimentacoes, ...locals];
  return filtraPorLoja(base, lojaId);
}

function somaVendas(lojaId: number | null) {
  return getMovs(lojaId)
    .filter((m) => m.categoria === "venda" && m.tipo === "entrada")
    .reduce((acc, m) => acc + coerceNumber(m.valor, 0), 0);
}

function somaSaidas(lojaId: number | null) {
  return getMovs(lojaId)
    .filter((m) => m.tipo === "saida")
    .reduce((acc, m) => acc + coerceNumber(m.valor, 0), 0);
}

export async function mockApiFetch(url: string): Promise<unknown | null> {
  const { pathname, lojaId } = parseUrl(url);

  if (pathname === "/api/lojas") {
    return lojas;
  }

  if (pathname === "/api/movimentacoes") {
    return getMovs(lojaId);
  }

  if (pathname === "/api/estoque") {
    return estoque;
  }

  if (pathname === "/api/comissoes") {
    // Exibe uma faixa simples por loja (demo)
    return lojas.map((l) => ({
      loja: l.nome,
      porcentagem_comissao: l.porcentagem_comissao,
      meta_venda: l.meta_venda,
    }));
  }

  if (pathname === "/api/metas") {
    const lojasFiltradas = lojaId ? lojas.filter((l) => l.id === lojaId) : lojas;
    return lojasFiltradas.map((l) => ({
      nome: l.nome,
      meta: l.meta_venda,
      realizado: somaVendas(l.id),
    }));
  }

  if (pathname === "/api/kpis") {
    const vendas = somaVendas(lojaId);
    const saidas = somaSaidas(lojaId);
    const lucro = vendas - saidas;

    const loja = lojaId ? lojas.find((l) => l.id === lojaId) : null;
    const comissaoPercent = loja ? coerceNumber(loja.porcentagem_comissao, 0) : 0;
    const comissaoValor = (vendas * comissaoPercent) / 100;

    return [
      { label: "Vendas", value: formatCurrency(vendas) },
      { label: "Despesas", value: formatCurrency(saidas) },
      { label: "Resultado", value: formatCurrency(lucro) },
      ...(loja
        ? [
            { label: "Comissão", value: `${formatPercent(comissaoPercent)} (${formatCurrency(comissaoValor)})` },
          ]
        : []),
    ];
  }

  return null;
}
