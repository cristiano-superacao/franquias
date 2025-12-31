"use client";
import React, { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { requireRole } from "../../../lib/auth";
import { listEmpresas, listLojasByEmpresa, listUsuariosByEmpresa } from "../../../lib/tenant";
import Input from "../../../components/ui/Input";
import { Table, Thead, Th, Tbody, Tr, Td } from "../../../components/ui/Table";
import DashboardLayout from "../../../components/DashboardLayout";
import Breadcrumbs from "../../../components/Breadcrumbs";
import FilterBar from "../../../components/ui/FilterBar";
import Button from "../../../components/ui/Button";
import Link from "next/link";
import { useToast } from "../../../components/Toast";

export default function AdminEmpresasPage() {
  useEffect(() => {
    requireRole(["super_admin"]);
  }, []);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<"nome" | "franquias" | "usuarios">("nome");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const pageSize = 12;
  const empresas = listEmpresas();
    const { showToast } = useToast();
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return empresas;
    return empresas.filter((e) => e.nome.toLowerCase().includes(q));
  }, [empresas, query]);

  const rows = useMemo(() => {
    const base = filtered.map((e) => ({
      empresa: e,
      franquias: listLojasByEmpresa(e.id).length,
      usuarios: listUsuariosByEmpresa(e.id).filter((u) => u.role !== "super_admin").length,
    }));
    const sorted = [...base].sort((a, b) => {
      let va: string | number;
      let vb: string | number;
      if (sortKey === "nome") {
        va = a.empresa.nome;
        vb = b.empresa.nome;
        const cmp = String(va).localeCompare(String(vb), "pt", { sensitivity: "base" });
        return sortDir === "asc" ? cmp : -cmp;
      }
      if (sortKey === "franquias") {
        va = a.franquias;
        vb = b.franquias;
      } else {
        va = a.usuarios;
        vb = b.usuarios;
      }
      const cmp = Number(va) - Number(vb);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filtered, sortKey, sortDir]);

  // Paginação
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = rows.slice(start, end);

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
      const validK = k === "nome" || k === "franquias" || k === "usuarios";
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
      showToast("Empresa criada com sucesso", "success");
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
        <main className="flex-1 p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold" style={{ color: "#CCE3DE" }}>Empresas</h1>
          <div className="flex items-center gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar empresa..."
              aria-label="Buscar empresa"
              className="w-full md:w-64"
              icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
            />
            <Link href="/admin/empresas/nova" className="inline-block">
              <Button variant="brand" aria-label="Nova Empresa">Nova Empresa</Button>
            </Link>
          </div>
        </div>
        <div className="mb-4"><Breadcrumbs /></div>

        {/* Estatísticas rápidas (tema claro) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow">
            <div className="text-gray-500 text-sm">Empresas</div>
            <div className="text-gray-900 font-bold text-xl">{filtered.length}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow">
            <div className="text-gray-500 text-sm">Total de franquias</div>
            <div className="text-info-300 font-bold text-xl">{filtered.reduce((acc, e) => acc + listLojasByEmpresa(e.id).length, 0)}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow">
            <div className="text-gray-500 text-sm">Usuários (exc. admin)</div>
            <div className="text-success-300 font-bold text-xl">{filtered.reduce((acc, e) => acc + listUsuariosByEmpresa(e.id).filter(u => u.role !== "super_admin").length, 0)}</div>
          </div>
        </div>

        <FilterBar
          sortKey={sortKey}
          sortDir={sortDir}
          onSortKeyChange={(k) => setSortKey(k as any)}
          onSortDirChange={(d) => setSortDir(d)}
          sortOptions={[
            { key: "nome", label: "Nome" },
            { key: "franquias", label: "Franquias" },
            { key: "usuarios", label: "Usuários" },
          ]}
          onClear={() => {
            setQuery("");
            setSortKey("nome");
            setSortDir("asc");
          }}
          className="mb-4"
        />

        <Table caption="Empresas cadastradas e seus indicadores" variant="light">
          <Thead>
            <Th>Empresa</Th>
            <Th>Franquias</Th>
            <Th>Usuários</Th>
          </Thead>
          <Tbody>
            {paginated.map((r) => (
              <Tr key={r.empresa.id}>
                <Td><span className="font-medium">{r.empresa.nome}</span></Td>
                <Td><span className="text-gray-700">{r.franquias}</span></Td>
                <Td><span className="text-gray-700">{r.usuarios}</span></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        {/* Paginação */}
        {rows.length > 0 && (
          <div className="flex items-center justify-between mt-4 text-sm">
            <div className="text-gray-600">Mostrando {start + 1}-{Math.min(end, rows.length)} de {rows.length}</div>
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
    </div>
  );
}
