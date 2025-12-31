
"use client";
import React, { useEffect, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { getSession } from "../../../lib/auth";
import DashboardLayout from "../../../components/DashboardLayout";
import { SkeletonGrid } from "../../../components/Skeleton";
import { useToast } from "../../../components/Toast";

export default function EstoqueAlimentosPage() {
  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) window.location.href = "/login";
  }, []);

  const [refreshKey, setRefreshKey] = useState(0);
  const { data, loading, error } = useFetch<{ alimentos: any[] }>(`/api/estoque?r=${refreshKey}`);
  const alimentos = data?.alimentos || [];
  const { showToast } = useToast();

  const [lojaId, setLojaId] = useState<number | null>(null);
  const [nome, setNome] = useState("");
  const [quantidade, setQuantidade] = useState<number>(0);
  const [unidade, setUnidade] = useState("kg");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState<string>("");
  const [editUnidade, setEditUnidade] = useState<string>("kg");

  // Filtros e paginação
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;
  const filtered = alimentos.filter((i: any) => i.nome?.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const pageItems = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  React.useEffect(() => { setPage(1); }, [search, alimentos.length]);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("selectedLojaId") : null;
    const parsed = raw ? Number(raw) : null;
    setLojaId(Number.isFinite(parsed as number) ? (parsed as number) : null);
  }, []);

  function handleRegistrarSaida(item: any) {
    showToast(`Saída de ${item.nome} registrada!`, "success");
    // TODO: Implementar API para registrar saída de estoque
  }

  async function handleAdicionarItem(e: React.FormEvent) {
    e.preventDefault();
    if (!lojaId) {
      showToast("Selecione uma loja no menu lateral", "error");
      return;
    }
    try {
      const res = await fetch("/api/estoque", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loja_id: lojaId, nome, categoria: "alimento", quantidade, unidade }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erro ao adicionar item", "error");
        return;
      }
      setNome("");
      setQuantidade(0);
      setUnidade("kg");
      setRefreshKey((k) => k + 1);
      showToast("Item adicionado com sucesso", "success");
    } catch {
      showToast("Falha de rede ao salvar", "error");
    }
  }

  async function handleAtualizarQuantidade(itemId: number, novaQtd: number) {
    try {
      const res = await fetch("/api/estoque", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: itemId, quantidade: novaQtd }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erro ao atualizar", "error");
        return;
      }
      setRefreshKey((k) => k + 1);
      showToast("Quantidade atualizada", "success");
    } catch {
      showToast("Falha de rede", "error");
    }
  }

  async function handleExcluir(itemId: number) {
    try {
      const res = await fetch(`/api/estoque?id=${itemId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erro ao excluir", "error");
        return;
      }
      setRefreshKey((k) => k + 1);
      showToast("Item removido", "success");
    } catch {
      showToast("Falha de rede", "error");
    }
  }

  function startEdit(item: any) {
    setEditingId(item.id);
    setEditNome(item.nome);
    setEditUnidade(item.unidade);
  }

  async function saveEdit() {
    if (!editingId) return;
    try {
      const res = await fetch("/api/estoque", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, nome: editNome, unidade: editUnidade }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Erro ao salvar", "error");
        return;
      }
      setEditingId(null);
      setRefreshKey((k) => k + 1);
      showToast("Item atualizado", "success");
    } catch {
      showToast("Falha de rede", "error");
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Estoque - Alimentos</h1>

      {/* Ações e filtros */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nome"
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600"
          aria-label="Buscar item"
        />
      </div>

      {/* Formulário de criação */}
      <form onSubmit={handleAdicionarItem} className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3 bg-gray-900 border border-gray-800 rounded-xl p-4">
        <input
          type="text"
          placeholder="Nome do item"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600"
          aria-label="Nome do item"
          required
        />
        <input
          type="number"
          min={0}
          placeholder="Quantidade"
          value={quantidade}
          onChange={(e) => setQuantidade(Number(e.target.value))}
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600"
          aria-label="Quantidade"
          required
        />
        <select
          value={unidade}
          onChange={(e) => setUnidade(e.target.value)}
          className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600"
          aria-label="Unidade"
        >
          <option value="kg">kg</option>
          <option value="L">L</option>
          <option value="un">un</option>
        </select>
        <div className="md:col-span-2 flex items-center justify-end">
          <button type="submit" className="inline-flex justify-center rounded-md bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white font-semibold shadow-sm">Adicionar Item</button>
        </div>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <SkeletonGrid count={6} />
        ) : error ? (
          <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center text-red-400">Erro ao carregar estoque</div>
        ) : pageItems && pageItems.length > 0 ? (
          pageItems.map((item: any) => (
            <div key={item.id} className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.02] hover:border-blue-500 focus-within:border-blue-500" tabIndex={0} aria-label={item.nome}>
              {editingId === item.id ? (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editNome}
                      onChange={(e) => setEditNome(e.target.value)}
                      className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white flex-1"
                      aria-label="Nome do item"
                    />
                    <select
                      value={editUnidade}
                      onChange={(e) => setEditUnidade(e.target.value)}
                      className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                      aria-label="Unidade"
                    >
                      <option value="kg">kg</option>
                      <option value="L">L</option>
                      <option value="un">un</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={saveEdit} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded shadow transition active:scale-95">Salvar</button>
                    <button onClick={() => setEditingId(null)} className="bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 px-3 rounded shadow transition active:scale-95">Cancelar</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-blue-400 mb-2">{item.nome}</h2>
                  <div className="text-gray-400 mb-3">Quantidade: <span className="text-white font-bold">{item.quantidade} {item.unidade}</span></div>
                  <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  defaultValue={item.quantidade}
                  onBlur={(e) => handleAtualizarQuantidade(item.id, Number(e.target.value))}
                  className="w-28 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600"
                  aria-label="Nova quantidade"
                />
                    <button onClick={() => handleRegistrarSaida(item)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded shadow transition active:scale-95 flex items-center gap-2" aria-label="Registrar Saída">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
                  Saída
                    </button>
                    <button onClick={() => startEdit(item)} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-3 rounded shadow transition active:scale-95" aria-label="Editar">Editar</button>
                    <button onClick={() => handleExcluir(item.id)} className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-3 rounded shadow transition active:scale-95" aria-label="Excluir">
                  Excluir
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center">
            <p className="text-gray-400">Nenhum item de alimentos disponível.</p>
          </div>
        )}
      </div>

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
