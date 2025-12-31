"use client";
import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useToast } from "../../components/Toast";
import { getSession } from "../../lib/auth";
import { SkeletonGrid } from "../../components/Skeleton";

export default function FinanceiroPage() {
  useEffect(() => {
    const session = getSession();
    if (!session) window.location.href = "/login";
  }, []);

  const { showToast } = useToast();
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lancamentos, setLancamentos] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTipo, setEditTipo] = useState<string>("entrada");
  const [editCategoria, setEditCategoria] = useState<string>("venda");
  const [editValor, setEditValor] = useState<number>(0);
  const [editData, setEditData] = useState<string>("");
  const [editDescricao, setEditDescricao] = useState<string>("");

  const [lojaId, setLojaId] = useState<number | null>(null);
  const [tipo, setTipo] = useState("entrada");
  const [categoria, setCategoria] = useState("venda");
  const [valor, setValor] = useState<number>(0);
  const [data, setData] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("selectedLojaId") : null;
    const parsed = raw ? Number(raw) : null;
    setLojaId(Number.isFinite(parsed as number) ? (parsed as number) : null);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/financeiro?r=${refreshKey}${lojaId ? `&lojaId=${lojaId}` : ""}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then((json) => setLancamentos(json.lancamentos || []))
      .catch(() => setError("Erro ao carregar financeiro"))
      .finally(() => setLoading(false));
  }, [refreshKey, lojaId]);

  // Filtros/paginação client-side
  const [filterTipo, setFilterTipo] = useState<string>("all");
  const [filterCategoria, setFilterCategoria] = useState<string>("all");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const filtered = lancamentos.filter((l) => {
    if (filterTipo !== "all" && l.tipo !== filterTipo) return false;
    if (filterCategoria !== "all" && l.categoria !== filterCategoria) return false;
    const d = new Date(l.data);
    if (fromDate && d < new Date(fromDate)) return false;
    if (toDate && d > new Date(toDate)) return false;
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pageItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  useEffect(() => { setPage(1); }, [filterTipo, filterCategoria, fromDate, toDate, lancamentos.length]);

  async function handleAdicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!lojaId) {
      showToast("Selecione uma loja no menu lateral", "error");
      return;
    }
    try {
      const res = await fetch("/api/financeiro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loja_id: lojaId, tipo, categoria, valor, data: data || undefined, descricao: descricao || undefined }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erro ao adicionar", "error");
        return;
      }
      setValor(0);
      setData("");
      setDescricao("");
      setRefreshKey((k) => k + 1);
      showToast("Lançamento criado", "success");
    } catch {
      showToast("Falha de rede", "error");
    }
  }

  async function handleExcluir(id: number) {
    try {
      const res = await fetch(`/api/financeiro?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erro ao excluir", "error");
        return;
      }
      setRefreshKey((k) => k + 1);
      showToast("Lançamento removido", "success");
    } catch {
      showToast("Falha de rede", "error");
    }
  }

  function startEdit(l: any) {
    setEditingId(l.id);
    setEditTipo(l.tipo);
    setEditCategoria(l.categoria);
    setEditValor(Number(l.valor));
    setEditData(new Date(l.data).toISOString().slice(0, 10));
    setEditDescricao(l.descricao ?? "");
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const res = await fetch("/api/financeiro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, tipo: editTipo, categoria: editCategoria, valor: editValor, data: editData, descricao: editDescricao }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erro ao salvar edição", "error");
        return;
      }
      setEditingId(null);
      setRefreshKey((k) => k + 1);
      showToast("Lançamento atualizado", "success");
    } catch {
      showToast("Falha de rede", "error");
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Financeiro</h1>

      {/* Formulário */}
      <form onSubmit={handleAdicionar} className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600">
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600">
          <option value="venda">Venda</option>
          <option value="fixo">Fixo</option>
          <option value="impostos">Impostos</option>
          <option value="outros">Outros</option>
        </select>
        <input type="number" min={0} step={0.01} placeholder="Valor" value={valor} onChange={(e) => setValor(Number(e.target.value))} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600" required />
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600" />
        <input type="text" placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600" />
        <div className="flex items-center justify-end">
          <button type="submit" className="inline-flex justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-semibold shadow-sm">Adicionar</button>
        </div>
      </form>

      {/* Filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <select value={filterTipo} onChange={(e) => setFilterTipo(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600">
          <option value="all">Tipo: todos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
        </select>
        <select value={filterCategoria} onChange={(e) => setFilterCategoria(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600">
          <option value="all">Categoria: todas</option>
          <option value="venda">Venda</option>
          <option value="fixo">Fixo</option>
          <option value="impostos">Impostos</option>
          <option value="outros">Outros</option>
        </select>
        <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600" aria-label="De" />
        <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600" aria-label="Até" />
      </div>

      {/* Lista */}
      {loading ? (
        <SkeletonGrid count={4} />
      ) : error ? (
        <div className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center text-red-400">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="min-w-full divide-y divide-gray-800">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Data</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Tipo</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Categoria</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-300">Descrição</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-300">Valor</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-300">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-gray-950 divide-y divide-gray-800">
              {pageItems.map((l) => (
                <tr key={l.id} className="hover:bg-gray-900">
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {editingId === l.id ? (
                      <input type="date" value={editData} onChange={(e) => setEditData(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white w-36" />
                    ) : (
                      new Date(l.data).toLocaleDateString()
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {editingId === l.id ? (
                      <select value={editTipo} onChange={(e) => setEditTipo(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white">
                        <option value="entrada">Entrada</option>
                        <option value="saida">Saída</option>
                      </select>
                    ) : (
                      l.tipo
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {editingId === l.id ? (
                      <select value={editCategoria} onChange={(e) => setEditCategoria(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white">
                        <option value="venda">Venda</option>
                        <option value="fixo">Fixo</option>
                        <option value="impostos">Impostos</option>
                        <option value="outros">Outros</option>
                      </select>
                    ) : (
                      l.categoria
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-300">
                    {editingId === l.id ? (
                      <input type="text" value={editDescricao} onChange={(e) => setEditDescricao(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white w-48" />
                    ) : (
                      l.descricao ?? ""
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-semibold text-white">
                    {editingId === l.id ? (
                      <input type="number" step={0.01} value={editValor} onChange={(e) => setEditValor(Number(e.target.value))} className="rounded-md border border-gray-700 bg-gray-800 px-2 py-1 text-white w-28 text-right" />
                    ) : (
                      Number(l.valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-center space-x-2">
                    {editingId === l.id ? (
                      <>
                        <button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded shadow-sm">Salvar</button>
                        <button onClick={() => setEditingId(null)} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-1.5 px-3 rounded shadow-sm">Cancelar</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(l)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-1.5 px-3 rounded shadow-sm">Editar</button>
                        <button onClick={() => handleExcluir(l.id)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded shadow-sm">Excluir</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginação */}
      {!loading && !error && filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm text-gray-400">Página {page} de {totalPages}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-1"
              aria-label="Página anterior"
            >Anterior</button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-md bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-1"
              aria-label="Próxima página"
            >Próxima</button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
