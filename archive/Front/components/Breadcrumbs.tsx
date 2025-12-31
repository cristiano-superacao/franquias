"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  admin: "Admin",
  empresas: "Empresas",
  lojas: "Lojas",
  empresa: "Empresa",
  franquias: "Franquias",
  onboarding: "Onboarding",
  usuarios: "Usuários",
  estoque: "Estoque",
  alimentos: "Alimentos",
  limpeza: "Limpeza",
  caixa: "Caixa",
  fluxo: "Fluxo",
  dashboard: "Dashboard",
};

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = parts.map((_, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const labelKey = parts[idx];
    const label = LABELS[labelKey] || labelKey;
    return { href, label };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      <ol className="flex items-center gap-2 text-gray-400">
        <li>
          <Link href="/dashboard" className="hover:text-brand-300">Inicio</Link>
        </li>
        {crumbs.map((c, i) => (
          <React.Fragment key={c.href}>
            <li aria-hidden className="text-gray-700">/</li>
            <li>
              {i < crumbs.length - 1 ? (
                <Link href={c.href} className="hover:text-brand-300">{c.label}</Link>
              ) : (
                <span className="text-white">{c.label}</span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
