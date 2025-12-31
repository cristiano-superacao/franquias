// Gestão de dados multi-tenant em localStorage (apenas demo)
import { empresas as seedEmpresas, lojas as seedLojas } from "./mockData";
import type { Role, User } from "./types";

export interface Usuario extends User {
  id: number;
  password: string; // demo somente
}

export interface Store {
  empresas: { id: number; nome: string }[];
  lojas: { id: number; nome: string; empresa_id: number; meta_venda: number; meta_consumo_limpeza: number; porcentagem_comissao: number }[];
  usuarios: Usuario[];
}

const LS_KEY = "multi_tenant_store";

function getInitialUsers(): Usuario[] {
  return [
    { id: 1, username: "super", password: "super123", role: "super_admin" },
    { id: 2, username: "alpha_admin", password: "alpha123", role: "company_admin", empresa_id: 1 },
    { id: 3, username: "beta_admin", password: "beta123", role: "company_admin", empresa_id: 2 },
    { id: 4, username: "centro", password: "centro123", role: "franchise_user", empresa_id: 1, loja_id: 1 },
  ];
}

export function getStore(): Store {
  if (typeof window === "undefined") {
    return { empresas: seedEmpresas, lojas: seedLojas, usuarios: getInitialUsers() };
  }
  const raw = localStorage.getItem(LS_KEY);
  if (!raw) {
    const initial: Store = { empresas: seedEmpresas, lojas: seedLojas, usuarios: getInitialUsers() };
    localStorage.setItem(LS_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    const parsed = JSON.parse(raw) as Store;
    // Garantir seeds mínimos
    if (!parsed.empresas?.length) parsed.empresas = seedEmpresas;
    if (!parsed.lojas?.length) parsed.lojas = seedLojas;
    if (!parsed.usuarios?.length) parsed.usuarios = getInitialUsers();
    return parsed;
  } catch {
    const initial: Store = { empresas: seedEmpresas, lojas: seedLojas, usuarios: getInitialUsers() };
    localStorage.setItem(LS_KEY, JSON.stringify(initial));
    return initial;
  }
}

export function saveStore(store: Store) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LS_KEY, JSON.stringify(store));
  }
}

export function listEmpresas() {
  return getStore().empresas;
}

export function listLojasByEmpresa(empresaId: number) {
  return getStore().lojas.filter((l) => l.empresa_id === empresaId);
}

export function listUsuariosByEmpresa(empresaId: number) {
  return getStore().usuarios.filter((u) => u.empresa_id === empresaId || u.role === "super_admin");
}

export function createEmpresa(nome: string) {
  const store = getStore();
  const id = Math.max(0, ...store.empresas.map((e) => e.id)) + 1;
  const empresa = { id, nome };
  store.empresas.push(empresa);
  saveStore(store);
  return empresa;
}

export function createLoja(empresaId: number, nome: string, meta_venda = 50000, meta_consumo_limpeza = 3000, porcentagem_comissao = 3) {
  const store = getStore();
  const id = Math.max(0, ...store.lojas.map((l) => l.id)) + 1;
  const loja = { id, nome, empresa_id: empresaId, meta_venda, meta_consumo_limpeza, porcentagem_comissao };
  store.lojas.push(loja);
  saveStore(store);
  return loja;
}

export function createUsuario(u: Omit<Usuario, "id">) {
  const store = getStore();
  const id = Math.max(0, ...store.usuarios.map((x) => x.id)) + 1;
  const novo = { id, ...u };
  store.usuarios.push(novo);
  saveStore(store);
  return novo;
}

// Seleção global de loja (demo via localStorage)
const SELECTED_LOJA_KEY = "selected_loja_id";

export function getSelectedLojaId(): number | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SELECTED_LOJA_KEY);
  if (!raw) return null;
  try {
    const val = JSON.parse(raw) as number | null;
    return typeof val === "number" ? val : null;
  } catch {
    return null;
  }
}

export function setSelectedLojaId(id: number | null) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SELECTED_LOJA_KEY, JSON.stringify(id));
}
