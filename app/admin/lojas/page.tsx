"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { formatCurrency, formatPercent } from "../../../lib/format";
import { getSession } from "../../../lib/auth";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { SkeletonGrid } from "../../../components/Skeleton";
import { useToast } from "../../../components/Toast";

export default function AdminLojasPage() {
  // Verifica autenticação
  useEffect(() => {
    const session = getSession();
    if (!session) window.location.href = "/login";
  }, []);

  const { data: lojas, loading, error } = useFetch<any[]>("/api/lojas");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState("");
  const [metaVenda, setMetaVenda] = useState("");
  const [metaLimpeza, setMetaLimpeza] = useState("");
  const [comissao, setComissao] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNome, setEditNome] = useState("");
  const [editMetaVenda, setEditMetaVenda] = useState("");
  const [editMetaLimpeza, setEditMetaLimpeza] = useState("");
  const [editComissao, setEditComissao] = useState("");

  const canSubmit = useMemo(() => {
    return nome.trim().length > 0 && Number(metaVenda) >= 0 && Number(metaLimpeza) >= 0 && Number(comissao) >= 0;
  }, [nome, metaVenda, metaLimpeza, comissao]);

  async function handleCreateLoja(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) {
      showToast("Preencha os dados corretamente.", "error");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/lojas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          meta_venda: Number(metaVenda),
          meta_consumo_limpeza: Number(metaLimpeza),
          porcentagem_comissao: Number(comissao),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erro" }));
        showToast(data.error || "Falha ao criar loja.", "error");
        return;
      }
      showToast("Loja criada com sucesso!", "success");
      setShowForm(false);
      setNome(""); setMetaVenda(""); setMetaLimpeza(""); setComissao("");
      // Recarrega a página para atualizar a lista
      setTimeout(() => { window.location.reload(); }, 300);
    } catch {
      showToast("Falha de rede ao criar loja.", "error");
    } finally {
      setSubmitting(false);
    }
  }

  function startEdit(loja: any) {
    setEditingId(loja.id);
    setEditNome(loja.nome ?? "");
    setEditMetaVenda(String(loja.meta_venda ?? ""));
    setEditMetaLimpeza(String(loja.meta_consumo_limpeza ?? ""));
    setEditComissao(String(loja.porcentagem_comissao ?? ""));
  }

  async function handleUpdateLoja(e: React.FormEvent) {
    e.preventDefault();
    if (!editingId) return;
    try {
      const res = await fetch(`/api/lojas/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: editNome,
          meta_venda: Number(editMetaVenda),
          meta_consumo_limpeza: Number(editMetaLimpeza),
          porcentagem_comissao: Number(editComissao),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erro" }));
        showToast(data.error || "Falha ao atualizar loja.", "error");
        return;
      }
      showToast("Loja atualizada!", "success");
      setEditingId(null);
      setTimeout(() => { window.location.reload(); }, 300);
    } catch {
      showToast("Falha de rede ao atualizar.", "error");
    }
  }

  async function handleDeleteLoja(id: number) {
    if (!confirm("Deseja excluir esta loja?")) return;
    try {
      const res = await fetch(`/api/lojas/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erro" }));
        showToast(data.error || "Falha ao excluir loja.", "error");
        return;
      }
      showToast("Loja excluída!", "success");
      setTimeout(() => { window.location.reload(); }, 300);
    } catch {
      showToast("Falha de rede ao excluir.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 p-6">
        <h2 className="font-bold text-lg text-blue-400 mb-4">Gestão de Lojas</h2>
        <nav>
          <ul>
            {loading ? (
              <li className="text-gray-400">Carregando...</li>
            ) : error ? (
              <li className="text-red-400">Erro ao carregar lojas</li>
            ) : (
              (lojas || []).map(loja => (
                <li key={loja.id}>
                  <button className="w-full text-left px-4 py-2 rounded-lg transition border-2 border-transparent hover:bg-gray-800 hover:border-blue-400 hover:text-blue-400 focus:border-blue-400 focus:text-blue-400 active:scale-95 mb-2" aria-label={"Selecionar " + loja.nome} tabIndex={0}>
                    {loja.nome}
                  </button>
                </li>
              ))
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-6 pb-20 md:pb-6">
        <div className="mx-auto w-full max-w-6xl">
          <div className="mb-3"><Breadcrumbs /></div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Gestão de Lojas</h1>
            <button onClick={() => setShowForm(s=>!s)} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="8"/><path d="M12 9v6M9 12h6"/></svg>
              Nova Loja
            </button>
          </div>

          {/* Filtro/Busca por loja */}
          <div className="mb-6">
            <label className="text-sm text-gray-300" htmlFor="buscaLoja">Buscar loja</label>
            <input
              id="buscaLoja"
              value={query}
              onChange={(e)=>setQuery(e.target.value)}
              placeholder="Digite parte do nome..."
              className="mt-2 w-full max-w-md rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600"
            />
          </div>

          {showForm && (
            <form onSubmit={handleCreateLoja} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-900 rounded-xl border border-gray-800 p-4">
              <div>
                <label className="text-sm text-gray-300" htmlFor="nome">Nome</label>
                <input id="nome" value={nome} onChange={e=>setNome(e.target.value)} className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600" placeholder="Ex.: Loja Centro" />
              </div>
              <div>
                <label className="text-sm text-gray-300" htmlFor="metaVenda">Meta de Venda</label>
                <input id="metaVenda" value={metaVenda} onChange={e=>setMetaVenda(e.target.value)} className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600" placeholder="Ex.: 50000" />
              </div>
              <div>
                <label className="text-sm text-gray-300" htmlFor="metaLimpeza">Meta Limpeza</label>
                <input id="metaLimpeza" value={metaLimpeza} onChange={e=>setMetaLimpeza(e.target.value)} className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600" placeholder="Ex.: 3000" />
              </div>
              <div>
                <label className="text-sm text-gray-300" htmlFor="comissao">% Comissão</label>
                <input id="comissao" value={comissao} onChange={e=>setComissao(e.target.value)} className="mt-2 w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder:text-gray-400 focus:border-blue-600 focus:ring-blue-600" placeholder="Ex.: 5" />
              </div>
              <div className="md:col-span-4 flex justify-end gap-3">
                <button type="button" onClick={()=>setShowForm(false)} className="rounded-md border border-gray-700 px-4 py-2 text-gray-200 hover:bg-gray-800">Cancelar</button>
                <button type="submit" disabled={!canSubmit || submitting} className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">{submitting?"Salvando...":"Salvar"}</button>
              </div>
            </form>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <SkeletonGrid count={6} />
            ) : (
              (lojas && (lojas.length > 0)) ? (
              (lojas.filter(l => l.nome?.toLowerCase().includes(query.toLowerCase()))).map(loja => (
                <div key={loja.id} className="bg-gray-900 rounded-xl shadow p-6 border border-gray-800 transition hover:scale-[1.03] hover:border-blue-500 focus-within:border-blue-500" tabIndex={0} aria-label={loja.nome}>
                  <h2 className="text-lg font-bold text-blue-400 mb-2">{loja.nome}</h2>
                  <div className="text-gray-400 mb-2">Meta de Venda: <span className="text-white font-bold">{formatCurrency(loja.meta_venda)}</span></div>
                  <div className="text-gray-400 mb-2">Comissão: <span className="text-white font-bold">{formatPercent(loja.porcentagem_comissao)}</span></div>
                  <div className="mt-4 flex gap-3">
                    <button onClick={()=>startEdit(loja)} className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-4 rounded shadow transition active:scale-95" aria-label="Editar Loja">Editar</button>
                    <button onClick={()=>handleDeleteLoja(loja.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow transition active:scale-95" aria-label="Excluir Loja">Excluir</button>
                  </div>
                  {editingId === loja.id && (
                    <form onSubmit={handleUpdateLoja} className="mt-4 grid grid-cols-1 gap-3">
                      <input value={editNome} onChange={e=>setEditNome(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600" />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input value={editMetaVenda} onChange={e=>setEditMetaVenda(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600" />
                        <input value={editMetaLimpeza} onChange={e=>setEditMetaLimpeza(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600" />
                        <input value={editComissao} onChange={e=>setEditComissao(e.target.value)} className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white focus:border-blue-600 focus:ring-blue-600" />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button type="button" onClick={()=>setEditingId(null)} className="rounded-md border border-gray-700 px-3 py-2 text-gray-200 hover:bg-gray-800">Cancelar</button>
                        <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700">Salvar</button>
                      </div>
                    </form>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full bg-gray-900 rounded-xl shadow p-6 border border-gray-800 text-center">
                <p className="text-gray-400">Nenhuma loja cadastrada ou disponível para o filtro atual.</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      {/* Bottom Bar para mobile */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-gray-900 border-t border-gray-800 flex justify-around items-center h-16 z-30">
        <button className="flex flex-col items-center text-xs text-gray-400 hover:text-blue-400 focus:text-blue-400 transition active:scale-95" aria-label="Menu">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18"/></svg>
          Menu
        </button>
        <button onClick={()=>setShowForm(true)} className="flex flex-col items-center text-xs text-gray-400 hover:text-blue-400 focus:text-blue-400 transition active:scale-95" aria-label="Nova Loja">
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>
          Nova Loja
        </button>
      </nav>
    </div>
  );
}
