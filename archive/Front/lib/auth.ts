// Sistema de autenticação simplificado para static export
// Usa localStorage para persistir sessão
import type { Role, User } from "./types";

const MOCK_USERS = [
  { username: "admin", password: "admin123", role: "admin" as Role },
  { username: "gerente", password: "gerente123", role: "manager" as Role },
];

import { getStore } from "./tenant";

export function login(username: string, password: string): User | null {
  // Primeiro verifica usuários dinâmicos da store
  const store = getStore();
  const found = store.usuarios.find((u) => u.username === username && u.password === password);
  if (found) {
    const session: User = { username: found.username, role: found.role, empresa_id: found.empresa_id, loja_id: found.loja_id };
    if (typeof window !== "undefined") {
      localStorage.setItem("session", JSON.stringify(session));
    }
    return session;
  }

  // Fallback para usuários mock fixos (admin/manager)
  const user = MOCK_USERS.find((u) => u.username === username && u.password === password);
  if (user) {
    const session: User = { username: user.username, role: user.role };
    if (typeof window !== "undefined") {
      localStorage.setItem("session", JSON.stringify(session));
    }
    return session;
  }
  return null;
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("session");
  }
}

export function getSession(): User | null {
  if (typeof window === "undefined") return null;
  
  const stored = localStorage.getItem("session");
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function requireAuth(): User {
  const session = getSession();
  if (!session) {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new Error("Não autenticado");
  }
  return session;
}

export function requireRole(roles: Role[]): User {
  const session = requireAuth();
  if (!roles.includes(session.role)) {
    if (typeof window !== "undefined") {
      // Redireciona para dashboard por padrão
      window.location.href = "/dashboard";
    }
    throw new Error("Acesso negado");
  }
  return session;
}

export function getLandingRoute(session: User): string {
  switch (session.role) {
    case "super_admin":
      return "/admin/empresas";
    case "company_admin":
      return "/empresa/franquias";
    case "franchise_user":
      return "/dashboard";
    case "manager":
    case "admin":
    default:
      return "/dashboard";
  }
}
