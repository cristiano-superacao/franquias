export type TipoMovimentacao = "entrada" | "saida";
export type CategoriaMovimentacao = "alimento" | "limpeza" | "venda" | "fixo";

export type Empresa = {
  id: number;
  nome: string;
};

export type Loja = {
  id: number;
  nome: string;
  empresa_id: number;
  meta_venda: number;
  meta_consumo_limpeza: number;
  porcentagem_comissao: number;
};

export type Movimentacao = {
  id: number;
  loja_id: number;
  tipo: TipoMovimentacao;
  categoria: CategoriaMovimentacao;
  valor: number;
  data: string; // ISO
};

export type EstoqueItem = {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
};

export const empresas: Empresa[] = [
  { id: 1, nome: "Grupo Alpha" },
  { id: 2, nome: "Coop Beta" },
];

export const lojas: Loja[] = [
  { id: 1, nome: "Loja Centro", empresa_id: 1, meta_venda: 85000, meta_consumo_limpeza: 5000, porcentagem_comissao: 3.5 },
  { id: 2, nome: "Loja Shopping", empresa_id: 1, meta_venda: 120000, meta_consumo_limpeza: 6500, porcentagem_comissao: 4.0 },
  { id: 3, nome: "Loja Bairro", empresa_id: 2, meta_venda: 60000, meta_consumo_limpeza: 4200, porcentagem_comissao: 3.0 },
];

export const movimentacoes: Movimentacao[] = [
  { id: 1, loja_id: 1, tipo: "entrada", categoria: "venda", valor: 74250.35, data: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 2, loja_id: 1, tipo: "saida", categoria: "fixo", valor: 18500, data: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 3, loja_id: 1, tipo: "saida", categoria: "alimento", valor: 12990.8, data: new Date(Date.now() - 86400000 * 1).toISOString() },

  { id: 4, loja_id: 2, tipo: "entrada", categoria: "venda", valor: 110430.12, data: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 5, loja_id: 2, tipo: "saida", categoria: "fixo", valor: 26000, data: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 6, loja_id: 2, tipo: "saida", categoria: "limpeza", valor: 4200.55, data: new Date(Date.now() - 86400000 * 1).toISOString() },

  { id: 7, loja_id: 3, tipo: "entrada", categoria: "venda", valor: 53540.0, data: new Date(Date.now() - 86400000 * 5).toISOString() },
  { id: 8, loja_id: 3, tipo: "saida", categoria: "fixo", valor: 15000, data: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 9, loja_id: 3, tipo: "saida", categoria: "alimento", valor: 9800.25, data: new Date(Date.now() - 86400000 * 1).toISOString() },
];

export const estoque = {
  alimentos: [
    { id: 1, nome: "Arroz", quantidade: 120, unidade: "kg" },
    { id: 2, nome: "Feijão", quantidade: 85, unidade: "kg" },
    { id: 3, nome: "Óleo", quantidade: 40, unidade: "L" },
  ] satisfies EstoqueItem[],
  limpeza: [
    { id: 11, nome: "Detergente", quantidade: 60, unidade: "un" },
    { id: 12, nome: "Desinfetante", quantidade: 35, unidade: "L" },
    { id: 13, nome: "Papel toalha", quantidade: 28, unidade: "pct" },
  ] satisfies EstoqueItem[],
};
