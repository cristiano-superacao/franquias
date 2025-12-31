
"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useFetch } from "../../../hooks/useFetch";
import { requireRole } from "../../../lib/auth";
import Input from "../../../components/ui/Input";
import Chip from "../../../components/ui/Chip";
import MobileNav from "../../../components/MobileNav";
import DashboardLayout from "../../../components/DashboardLayout";
import Breadcrumbs from "../../../components/Breadcrumbs";
import FilterBar from "../../../components/ui/FilterBar";
import { Table, Thead, Th, Tbody, Tr, Td } from "../../../components/ui/Table";

export default function EstoqueAlimentosPage() {
  // Verifica autenticação
  useEffect(() => {
    requireRole(["super_admin", "company_admin", "franchise_user"]);
  }, []);

  const { data, loading, error } = useFetch<{ alimentos: any[] }>("/api/estoque");
  const alimentos = data?.alimentos || [];

  // Filtro e busca
  const [query, setQuery] = useState("");
  const baseFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return alimentos;
    return alimentos.filter((i: any) => String(i.nome).toLowerCase().includes(q));
  }, [alimentos, query]);

  // Filtro por status (Baixo/OK)
  type StatusFilter = "all" | "low" | "ok";
  const [status, setStatus] = useState<StatusFilter>("all");
  const threshold = 50;
  const filtered = useMemo(() => {
    if (status === "all") return baseFiltered;
    const isLow = (q: number) => q < threshold;
    return baseFiltered.filter((i: any) => (status === "low" ? isLow(Number(i.quantidade)) : !isLow(Number(i.quantidade))));
  }, [baseFiltered, status]);

  // Ordenação
  type SortKey = "nome" | "quantidade";
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a: any, b: any) => {
      const mult = sortDir === "asc" ? 1 : -1;
      if (sortKey === "nome") {
        return mult * String(a.nome).localeCompare(String(b.nome));
      }
      return mult * (Number(a.quantidade) - Number(b.quantidade));
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  // Paginação simples
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = sorted.slice(start, end);

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  // Resetar página ao mudar filtros/ordenação/busca
  useEffect(() => {
    setPage(1);
  }, [query, status, sortKey, sortDir]);

  // Ler status da URL (?status=low|ok|all)
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    const s = searchParams.get("status");
    if (s === "low" || s === "ok" || s === "all") setStatus(s as StatusFilter);
    const q = searchParams.get("q") || "";
    if (q !== query) setQuery(q);
    const sort = searchParams.get("sort");
    if (sort) {
      const [k, d] = sort.split(":");
      if ((k === "nome" || k === "quantidade") && (d === "asc" || d === "desc")) {
        if (k !== sortKey) setSortKey(k as SortKey);
        if (d !== sortDir) setSortDir(d);
      }
    }
  }, [searchParams]);

  // Sincronizar estado com URL (shallow)
  useEffect(() => {
    const params = new URLSearchParams();
    if (status !== "all") params.set("status", status);
    if (query.trim()) params.set("q", query.trim());
    if (!(sortKey === "nome" && sortDir === "asc")) params.set("sort", `${sortKey}:${sortDir}`);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [status, query, sortKey, sortDir, pathname, router]);

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <DashboardLayout>
        <main className="flex-1 p-0 md:p-6 md:pb-6 overflow-hidden">
          <div className="h-full w-full bg-gray-50 text-gray-900 md:rounded-3xl p-8 overflow-y-auto shadow-2xl shadow-black/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Estoque - Alimentos</h1>
                <p className="text-gray-500 mt-1">Controle seus itens de alimentos por unidade e quantidade.</p>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar item..."
                  aria-label="Buscar item"
                  className="w-full md:w-64"
                  icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
                />
              </div>
            </div>

            {/* Breadcrumbs */}
            <div className="mb-4">
              <Breadcrumbs />
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-gray-500 text-sm">Itens listados</div>
                <div className="text-gray-900 font-bold text-2xl">{filtered.length}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-gray-500 text-sm">Baixo estoque (&lt; 50)</div>
                <div className="text-amber-500 font-bold text-2xl">{filtered.filter((i:any) => Number(i.quantidade) < 50).length}</div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-gray-500 text-sm">Unidades diferentes</div>
                <div className="text-sky-500 font-bold text-2xl">{Array.from(new Set(filtered.map((i:any)=> i.unidade))).length}</div>
              </div>
            </div>

            {/* Alerts & Quick Access */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-amber-500">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12" y2="17"/></svg>
                  </span>
                  <h3 className="text-sm font-semibold text-gray-900">Produtos em Alerta</h3>
                </div>
                <div className="text-sm text-gray-600">Nenhum produto em alerta</div>
              </section>

              <section className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <div className="text-sm font-semibold text-gray-900 mb-3">Acesso Rápido</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Listar Produtos", href: "/estoque/alimentos" },
                    { label: "Baixo estoque", href: "/estoque/alimentos?status=low" },
                    { label: "Movimentações", href: "/caixa/fluxo" },
                  ].map((item, idx) => (
                    <Link key={idx} href={item.href} className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all">
                      <div className="h-9 w-9 rounded-lg bg-brand/5 text-brand flex items-center justify-center">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>
                      </div>
                      <div className="font-medium text-gray-800">{item.label}</div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Filtros e Ordenação */}
            <FilterBar
              className="mb-3"
              status={status}
              onStatusChange={(v) => setStatus(v as any)}
              statusOptions={[
                { id: "all", label: "Todos" },
                { id: "low", label: "Baixo" },
                { id: "ok", label: "OK" },
              ]}
              sortKey={sortKey}
              sortDir={sortDir}
              onSortKeyChange={(k) => setSortKey(k as any)}
              onSortDirChange={(d) => setSortDir(d)}
              sortOptions={[
                { key: "nome", label: "Nome" },
                { key: "quantidade", label: "Quantidade" },
              ]}
              onClear={() => { setQuery(""); setStatus("all"); setSortKey("nome"); setSortDir("asc"); setPage(1); }}
            />

            {/* Table */}
            {loading ? (
              <div className="text-gray-500">Carregando...</div>
            ) : error ? (
              <div className="text-red-500">Erro ao carregar estoque</div>
            ) : sorted.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600">Nenhum item encontrado.</div>
            ) : (
              <Table caption="Estoque de alimentos" variant="light">
                <Thead>
                  <Th>
                    <button
                      className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900"
                      onClick={() => {
                        if (sortKey === "nome") setSortDir(sortDir === "asc" ? "desc" : "asc");
                        setSortKey("nome");
                      }}
                    >
                      Item {sortKey === "nome" && (sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </Th>
                  <Th>Unidade</Th>
                  <Th>
                    <button
                      className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900"
                      onClick={() => {
                        if (sortKey === "quantidade") setSortDir(sortDir === "asc" ? "desc" : "asc");
                        setSortKey("quantidade");
                      }}
                    >
                      Quantidade {sortKey === "quantidade" && (sortDir === "asc" ? "↑" : "↓")}
                    </button>
                  </Th>
                  <Th>Status</Th>
                </Thead>
                <Tbody>
                  {paginated.map((item: any) => {
                    const low = Number(item.quantidade) < 50;
                    return (
                      <Tr key={item.id}>
                        <Td><span className="font-medium text-gray-900">{item.nome}</span></Td>
                        <Td>
                          <Chip className="bg-surface-850 text-gray-200 border-gray-700">
                            {item.unidade}
                          </Chip>
                        </Td>
                        <Td><span className="text-gray-700">{item.quantidade}</span></Td>
                        <Td>
                          <button onClick={() => setStatus(low ? "low" : "ok")} className="focus:outline-none" aria-label="Filtrar por status">
                            <Chip variant={low ? "danger" : "default"}>{low ? "Baixo" : "OK"}</Chip>
                          </button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            )}

            {/* Pagination */}
            {sorted.length > 0 && (
              <div className="flex items-center justify-between mt-4 text-sm">
                <div className="text-gray-600">Mostrando {start + 1}-{Math.min(end, sorted.length)} de {sorted.length}</div>
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
            label: "Entrada",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12h8"/></svg>),
          },
          {
            label: "Saída",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>),
          },
        ]}
      />
    </div>
  );
}
