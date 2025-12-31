"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { requireRole } from "../../../lib/auth";
import MobileNav from "../../../components/MobileNav";
import DashboardLayout from "../../../components/DashboardLayout";
import Input from "../../../components/ui/Input";
import Breadcrumbs from "../../../components/Breadcrumbs";
import FilterBar from "../../../components/ui/FilterBar";
import Button from "../../../components/ui/Button";
import Skeleton from "../../../components/ui/Skeleton";
import Link from "next/link";
import { useToast } from "../../../components/Toast";

export default function AdminLojasPage() {
  // Verifica autenticação
  useEffect(() => {
    requireRole(["super_admin"]);
  }, []);

  const { data: lojasRaw, loading, error } = useFetch<any[]>("/api/lojas");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"nome" | "meta_venda" | "porcentagem_comissao">("nome");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const lojas = useMemo(() => {
    const base = lojasRaw || [];
    const filtered = base.filter((l) => l.nome.toLowerCase().includes(query.trim().toLowerCase()));
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "nome") {
        const cmp = a.nome.localeCompare(b.nome, "pt", { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      }
      if (sortKey === "meta_venda") {
        const cmp = Number(a.meta_venda) - Number(b.meta_venda);
        return sortDir === "asc" ? cmp : -cmp;
      }
      const cmp = Number(a.porcentagem_comissao) - Number(b.porcentagem_comissao);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [lojasRaw, query, sortKey, sortDir]);

  const { showToast } = useToast();

  // Paginação
  const totalPages = Math.max(1, Math.ceil((lojas || []).length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = (lojas || []).slice(start, end);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  useEffect(() => {
    setPage(1);
  }, [query, sortKey, sortDir]);

  // URL sync (q, sort)
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const q = searchParams.get("q") || "";
    if (q !== query) setQuery(q);
    const sort = searchParams.get("sort");
    if (sort) {
      const [k, d] = sort.split(":");
      const validK = k === "nome" || k === "meta_venda" || k === "porcentagem_comissao";
      const validD = d === "asc" || d === "desc";
      if (validK && validD) {
        if (k !== sortKey) setSortKey(k as any);
        if (d !== sortDir) setSortDir(d as any);
      }
    }
    const pStr = searchParams.get("page");
    const p = pStr ? parseInt(pStr, 10) : 1;
    if (!Number.isNaN(p) && p >= 1 && p <= totalPages && p !== page) setPage(p);

    const created = searchParams.get("created");
    if (created === "1") {
      showToast("Loja criada com sucesso", "success");
      const params = new URLSearchParams(searchParams.toString());
      params.delete("created");
      router.replace(params.toString() ? `${pathname}?${params.toString()}` : pathname);
    }
  }, [searchParams, totalPages]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (!(sortKey === "nome" && sortDir === "asc")) params.set("sort", `${sortKey}:${sortDir}`);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [query, sortKey, sortDir, page, pathname, router]);

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <DashboardLayout>
        <main className="flex-1 p-6 pb-20 md:pb-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="text-2xl font-bold" style={{ color: "#CCE3DE" }}>Gestão de Lojas</h1>
            <div className="flex items-center gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar loja..."
                aria-label="Buscar loja"
                className="w-full md:w-64"
                icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
              />
              <FilterBar
                sortKey={sortKey}
                sortDir={sortDir}
                onSortKeyChange={(k) => setSortKey(k as any)}
                onSortDirChange={(d) => setSortDir(d)}
                sortOptions={[
                  { key: "nome", label: "Nome" },
                  { key: "meta_venda", label: "Meta" },
                  { key: "porcentagem_comissao", label: "Comissão" },
                ]}
                onClear={() => {
                  setQuery("");
                  setSortKey("nome");
                  setSortDir("asc");
                }}
              />
              <Link href="/admin/lojas/nova" className="inline-block">
                <Button variant="brand" aria-label="Nova Loja">Nova Loja</Button>
              </Link>
            </div>
          </div>
          <div className="mb-4"><Breadcrumbs /></div>

          {/* Estatísticas rápidas (tema claro) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow">
              <div className="text-gray-500 text-sm">Total de lojas</div>
              <div className="text-gray-900 font-bold text-xl">{(lojas || []).length}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow">
              <div className="text-gray-500 text-sm">Maior meta</div>
              <div className="text-success-300 font-bold text-xl">{(lojas || []).reduce((max, l) => Math.max(max, Number(l.meta_venda || 0)), 0).toLocaleString("pt-BR")}</div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4 shadow">
              <div className="text-gray-500 text-sm">Maior comissão</div>
              <div className="text-info-300 font-bold text-xl">{(lojas || []).reduce((max, l) => Math.max(max, Number(l.porcentagem_comissao || 0)), 0)}%</div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-6 border border-gray-200">
                  <Skeleton className="h-6 w-40 mb-4" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-28 mb-4" />
                  <Skeleton className="h-9 w-32" />
                </div>
              ))
            ) : (
              paginated.map(loja => (
                <div key={loja.id} className="bg-white rounded-xl shadow p-6 border border-gray-200 transition hover:shadow-md focus-within:border-brand-500" tabIndex={0} aria-label={loja.nome}>
                  <h2 className="text-lg font-bold text-brand-400 mb-2">{loja.nome}</h2>
                  <div className="text-gray-600 mb-2">Meta de Venda: <span className="text-gray-900 font-bold">{formatCurrency(loja.meta_venda)}</span></div>
                  <div className="text-gray-600 mb-2">Comissão: <span className="text-gray-900 font-bold">{formatPercent(loja.porcentagem_comissao)}</span></div>
                  <button className="mt-4 bg-brand hover:brightness-95 text-black font-bold py-2 px-4 rounded shadow transition active:scale-95" aria-label="Editar Loja">Editar</button>
                </div>
              ))
            )}
          </div>

          {/* Paginação */}
          {(lojas || []).length > 0 && (
            <div className="flex items-center justify-between mt-4 text-sm">
              <div className="text-gray-600">Mostrando {start + 1}-{Math.min(end, (lojas || []).length)} de {(lojas || []).length}</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border border-gray-200 text-gray-700 bg-white disabled:opacity-50"
                  aria-label="Página anterior"
                >
                  Anterior
                </button>
                <span className="text-gray-700">Página {page} de {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border border-gray-200 text-gray-700 bg-white disabled:opacity-50"
                  aria-label="Próxima página"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>
        </main>
      </DashboardLayout>
      <MobileNav
        items={[
          {
            label: "Menu",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/></svg>),
          },
          {
            label: "Nova Loja",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>),
          },
        ]}
      />
    </div>
  );
}
