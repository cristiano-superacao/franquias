import type { Role } from "./types";

export type AppRoute = {
  href: string;
  label: string;
  roles?: Role[]; // if omitted, visible to all
};

export const appRoutes: AppRoute[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin/empresas", label: "Empresas", roles: ["super_admin"] },
  { href: "/admin/lojas", label: "Lojas", roles: ["super_admin"] },
  { href: "/estoque/alimentos", label: "Estoque" },
  { href: "/caixa/fluxo", label: "Caixa" },
  { href: "/config/comissoes", label: "Comissões", roles: ["super_admin", "company_admin"] },
  { href: "/empresa/franquias", label: "Franquias", roles: ["super_admin", "company_admin"] },
  { href: "/empresa/onboarding", label: "Onboarding", roles: ["super_admin", "company_admin"] },
  { href: "/empresa/usuarios", label: "Usuários", roles: ["super_admin", "company_admin"] },
];

export function visibleRoutes(role?: Role | null): AppRoute[] {
  return appRoutes
    .filter((r) => !r.roles || (role ? r.roles.includes(role) : false))
    .sort((a, b) => a.label.localeCompare(b.label, "pt", { sensitivity: "base" }));
}
