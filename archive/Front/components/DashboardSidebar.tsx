"use client";
import React, { useMemo, useState } from "react";
import Input from "./ui/Input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { visibleRoutes } from "../lib/routes";
import { logout } from "../lib/auth";
import type { Role } from "../lib/types";

export default function DashboardSidebar({ lojas, selectedLoja, onSelectLoja, allowConsolidated = true, role, showStores = false, showSearch = false }: {
  lojas: { id: number; nome: string }[];
  selectedLoja: number | null;
  onSelectLoja: (id: number | null) => void;
  allowConsolidated?: boolean;
  role?: Role | null;
  showStores?: boolean;
  showSearch?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const lojasFiltradas = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lojas;
    return lojas.filter(l => l.nome.toLowerCase().includes(q));
  }, [lojas, query]);
  const pathname = usePathname();

  // Sidebar para desktop, drawer para mobile
  return (
    <>
      {/* Botão de menu para mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-30 bg-brand-700 hover:bg-brand-800 text-white rounded-full p-2 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
      >
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>

      {/* Sidebar desktop e drawer mobile */}
      <aside
        className={`bg-surface-900 text-white flex flex-col shadow-lg z-20 transition-all duration-300
          fixed top-0 left-0 h-full w-64 md:relative md:w-64 md:h-auto md:shadow-none
          ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
        role="navigation"
        aria-label="Sidebar de lojas"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <span className="font-bold text-lg" style={{ color: "#CCE3DE" }}>Lojas</span>
        {/* Ações inferiores: Sair (visível dentro do aside em todas as telas) */}
        <div className="mt-auto px-6 py-3 border-t border-gray-800">
          <button
            className="w-full text-left px-4 py-2 rounded-lg border border-gray-800 bg-surface-900 text-gray-200 hover:bg-surface-850 hover:border-brand-300 hover:text-brand-300 transition active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-500"
            onClick={() => { logout(); if (typeof window !== "undefined") window.location.href = "/login"; }}
            aria-label="Sair"
          >
            Sair
          </button>
        </div>
          {/* Botão fechar para mobile */}
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        {showSearch && (
          <div className="px-6 py-3 border-b border-gray-800">
            <Input
              label="Pesquisar lojas"
              placeholder="Digite o nome da loja"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
        <div className="px-6 py-3 border-b border-gray-800" aria-label="Atalhos de navegação">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-400">Acesso direto</span>
          </div>
          <div className="flex flex-col gap-2">
            {visibleRoutes(role).map((item) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`w-full text-left px-4 py-2 rounded-lg border transition active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-500 ${
                      active
                        ? "bg-surface-850 text-brand-300 border-brand-300"
                        : "border-gray-800 bg-surface-900 text-gray-200 hover:bg-surface-850 hover:border-brand-300 hover:text-brand-300"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            {/* Admin quick link for super admins */}
            {role === "super_admin" && (
              <Link
                href="/admin/empresas"
                className={`w-full text-left px-4 py-2 rounded-lg border transition active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-500 ${
                  pathname.startsWith("/admin")
                    ? "bg-surface-850 text-brand-300 border-brand-300"
                    : "border-gray-800 bg-surface-900 text-gray-200 hover:bg-surface-850 hover:border-brand-300 hover:text-brand-300"
                }`}
                aria-label="Admin"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
        {showStores && (
          <nav className="flex-1 overflow-y-auto" aria-label="Lista de lojas">
            <ul>
              {allowConsolidated && (
                <li>
                  <button
                    className={`w-full text-left px-6 py-3 rounded-lg transition border-2
                      ${selectedLoja === null ? "bg-surface-850 text-brand-300 border-brand-300" : "border-transparent"}
                      hover:bg-surface-850 hover:border-brand-300 hover:text-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500 focus:border-brand-300 focus:text-brand-300 active:scale-95`}
                    onClick={() => { onSelectLoja(null); setOpen(false); }}
                    tabIndex={0}
                    aria-label="Visão Consolidada"
                    aria-current={selectedLoja === null ? "page" : undefined}
                  >
                    Visão Consolidada
                  </button>
                </li>
              )}
              {lojasFiltradas.map(loja => (
                <li key={loja.id}>
                  <button
                    className={`w-full text-left px-6 py-3 rounded-lg transition border-2
                      ${selectedLoja === loja.id ? "bg-surface-850 text-brand-300 border-brand-300" : "border-transparent"}
                      hover:bg-surface-850 hover:border-brand-300 hover:text-brand-300 focus-visible:ring-2 focus-visible:ring-brand-500 focus:border-brand-300 focus:text-brand-300 active:scale-95`}
                    onClick={() => { onSelectLoja(loja.id); setOpen(false); }}
                    tabIndex={0}
                    aria-label={"Selecionar " + loja.nome}
                    aria-current={selectedLoja === loja.id ? "page" : undefined}
                  >
                    {loja.nome}
                  </button>
                </li>
              ))}
              {lojasFiltradas.length === 0 && (
                <li>
                  <div className="px-6 py-3 text-sm text-gray-400">Nenhuma loja encontrada.</div>
                </li>
              )}
            </ul>
          </nav>
        )}
      </aside>

      {/* Ações inferiores: Sair */}
      <div className="fixed bottom-0 left-0 w-64 md:w-64 bg-surface-900 border-t border-gray-800 px-6 py-3 hidden md:block">
        <button
          className="w-full text-left px-4 py-2 rounded-lg border border-gray-800 bg-surface-900 text-gray-200 hover:bg-surface-850 hover:border-brand-300 hover:text-brand-300 transition active:scale-95 focus-visible:ring-2 focus-visible:ring-brand-500"
          onClick={() => { logout(); if (typeof window !== "undefined") window.location.href = "/login"; }}
          aria-label="Sair"
        >
          Sair
        </button>
      </div>

      {/* Overlay para mobile quando aberto */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
