"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = {
  admin: "Admin",
  empresas: "Empresas",
  lojas: "Lojas",
  estoque: "Estoque",
  alimentos: "Alimentos",
  limpeza: "Limpeza",
  caixa: "Caixa",
  fluxo: "Fluxo",
  dashboard: "Dashboard",
  config: "Config",
  comissoes: "Comissões",
};

function toTitle(labelKey: string) {
  return labelKey
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export default function Breadcrumbs() {
  const pathname = usePathname() || "/";
  const parts = pathname.split("/").filter(Boolean);

  const crumbs = parts.map((_, idx) => {
    const href = "/" + parts.slice(0, idx + 1).join("/");
    const labelKey = parts[idx];
    const label = LABELS[labelKey] || toTitle(labelKey);
    return { href, label };
  });

  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="text-sm">
      {/* Mobile: colapsa intermediários (Início > … > Último) */}
      <ol className="flex items-center gap-2 text-gray-400 sm:hidden">
        <li className="flex items-center">
          <Link href="/dashboard" className="hover:text-emerald-300 flex items-center gap-1">
            <span className="sr-only">Ir para</span>
            <span>Início</span>
          </Link>
        </li>
        {crumbs.length > 1 && (
          <>
            <Chevron />
            {crumbs.length > 2 && (
              <li className="text-gray-600" aria-hidden>
                …
              </li>
            )}
            {crumbs.length > 2 && <Chevron />}
            <li>
              {crumbs.length > 1 && (
                <Link href={crumbs[crumbs.length - 2].href} className="hover:text-emerald-300">
                  {crumbs[crumbs.length - 2].label}
                </Link>
              )}
            </li>
            <Chevron />
            <li>
              <span className="text-white" aria-current="page">
                {crumbs[crumbs.length - 1].label}
              </span>
            </li>
          </>
        )}
      </ol>

      {/* Desktop: mostra todos os níveis */}
      <ol className="hidden sm:flex items-center gap-2 text-gray-400">
        <li className="flex items-center">
          <Link href="/dashboard" className="hover:text-emerald-300 flex items-center gap-1">
            <span className="sr-only">Ir para</span>
            <span>Início</span>
          </Link>
        </li>
        {crumbs.map((c, i) => (
          <React.Fragment key={c.href}>
            <Chevron />
            <li className="min-w-0">
              {i < crumbs.length - 1 ? (
                <Link
                  href={c.href}
                  className="hover:text-emerald-300 block truncate max-w-[12rem]"
                  title={c.label}
                >
                  {c.label}
                </Link>
              ) : (
                <span className="text-white block truncate max-w-[12rem]" aria-current="page" title={c.label}>
                  {c.label}
                </span>
              )}
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}

function Chevron() {
  return (
    <li aria-hidden className="text-gray-700">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="opacity-80"
      >
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </li>
  );
}
