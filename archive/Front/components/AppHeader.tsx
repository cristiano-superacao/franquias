"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getSession, logout } from "../lib/auth";
import { getStore, getSelectedLojaId, setSelectedLojaId } from "../lib/tenant";

export default function AppHeader() {
  const [session, setSession] = useState<typeof getSession extends (...args: any) => infer R ? R : any>(null);
  const [selectedLoja, setSelectedLoja] = useState<number | null>(null);
  const [lojas, setLojas] = useState<{ id: number; nome: string; empresa_id: number }[]>([]);

  useEffect(() => {
    const s = getSession();
    setSession(s);
    setSelectedLoja(getSelectedLojaId());
    const store = getStore();
    let list = store.lojas;
    if (s?.role === "franchise_user" && s.loja_id) {
      list = list.filter((l) => l.id === s.loja_id);
    } else if (s?.role === "company_admin" && s.empresa_id) {
      list = list.filter((l) => l.empresa_id === s.empresa_id);
    }
    // Ordem alfabética por nome da loja
    setLojas([...list].sort((a, b) => a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" })));

    const onStorage = (e: StorageEvent) => {
      if (e.key === "selected_loja_id") {
        try {
          setSelectedLoja(e.newValue ? JSON.parse(e.newValue) : null);
        } catch {
          setSelectedLoja(null);
        }
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <header className="w-full bg-surface-900 border-b border-gray-800 sticky top-0 z-40">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="h-7 w-7 rounded-lg shrink-0" style={{ backgroundColor: "#CCE3DE" }} />
          <span className="font-semibold shrink-0" style={{ color: "#CCE3DE" }}>Franquias</span>
          {/* Botões de lojas posicionados após "Franquias" */}
          <div className="hidden sm:flex items-center gap-2 ml-2">
            {lojas.map((loja) => {
              const active = selectedLoja === loja.id;
              return (
                <button
                  key={loja.id}
                  type="button"
                  onClick={() => { setSelectedLojaId(loja.id); setSelectedLoja(loja.id); }}
                  className={`px-3 py-1 rounded-lg border text-sm transition active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${
                    active
                      ? "bg-surface-850 text-brand-300 border-brand-300"
                      : "bg-surface-900 text-gray-200 border-gray-800 hover:bg-surface-850 hover:border-brand-300 hover:text-brand-300"
                  }`}
                  aria-pressed={active}
                >
                  {loja.nome}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {session ? (
            <>
              <span className="text-xs text-gray-400 hidden sm:inline">{session.username}</span>
              <button
                onClick={() => { logout(); window.location.href = "/login"; }}
                className="text-sm px-3 py-1 rounded border border-gray-800 bg-surface-900 hover:bg-surface-850 text-white"
              >
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-gray-300 hover:text-white transition">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}
