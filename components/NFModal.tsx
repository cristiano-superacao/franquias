"use client";
import React from "react";
import { useToast } from "./Toast";
import { useFetch } from "../hooks/useFetch";

type NFModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function NFModal({ open, onClose, onSuccess }: NFModalProps) {
  const { showToast } = useToast();
  const { data: lojas } = useFetch<{ id: number; nome: string }[]>("/api/lojas");

  const [numero, setNumero] = React.useState("");
  const [dataEmissao, setDataEmissao] = React.useState("");
  const [valor, setValor] = React.useState("");
  const [categoria, setCategoria] = React.useState("Compra");
  const [lojaId, setLojaId] = React.useState<number | "">("");
  const dialogRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && open) onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  React.useEffect(() => {
    if (open) {
      setTimeout(() => {
        const el = dialogRef.current?.querySelector<HTMLInputElement>("input, select, button");
        el?.focus();
      }, 10);
    }
  }, [open]);

  function resetForm() {
    setNumero("");
    setDataEmissao("");
    setValor("");
    setCategoria("Compra");
    setLojaId("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = Number(valor);
    if (!numero || !dataEmissao || !Number.isFinite(v)) {
      showToast("Preencha número, data e valor válidos", "error");
      return;
    }

    const payload = {
      numero,
      dataEmissao,
      valor: v,
      categoria,
      lojaId: typeof lojaId === "number" ? lojaId : null,
      createdAt: new Date().toISOString(),
    };

    try {
      // Tenta enviar para API de vendas (simulada)
      try {
        await fetch("/api/vendas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch {
        // Se falhar, segue com salvamento local
      }

      const raw = localStorage.getItem("nf_submissions");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(payload);
      localStorage.setItem("nf_submissions", JSON.stringify(arr));
      // Se for venda, também registra em sales_submissions para KPIs e Metas
      if (categoria === "Venda") {
        const rawSales = localStorage.getItem("sales_submissions");
        const salesArr = rawSales ? JSON.parse(rawSales) : [];
        salesArr.push({
          lojaId: typeof lojaId === "number" ? lojaId : null,
          valor: v,
          dataEmissao,
        });
        localStorage.setItem("sales_submissions", JSON.stringify(salesArr));
      }
      showToast("NF lançada com sucesso!", "success");
      resetForm();
      if (onSuccess) onSuccess();
      onClose();
    } catch {
      showToast("Erro ao salvar NF", "error");
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden={!open}>
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="nf-modal-title"
        className="absolute left-1/2 top-10 -translate-x-1/2 w-[95%] max-w-lg rounded-xl border border-gray-800 bg-gray-900 p-6 shadow-xl"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 id="nf-modal-title" className="text-lg font-bold text-white">Lançar Nota Fiscal</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            aria-label="Fechar modal"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Número da NF</span>
            <input
              type="text"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-400 text-white"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Data de Emissão</span>
            <input
              type="date"
              value={dataEmissao}
              onChange={(e) => setDataEmissao(e.target.value)}
              className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-400 text-white"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Valor</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-400 text-white"
              required
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Categoria</span>
            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-400 text-white"
            >
              <option>Compra</option>
              <option>Venda</option>
              <option>Serviço</option>
            </select>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-gray-300">Loja (opcional)</span>
            <select
              value={lojaId === "" ? "" : String(lojaId)}
              onChange={(e) => setLojaId(e.target.value ? Number(e.target.value) : "")}
              className="px-4 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:border-blue-400 text-white"
            >
              <option value="">Consolidado</option>
              {(lojas || []).map((l) => (
                <option key={l.id} value={l.id}>{l.nome}</option>
              ))}
            </select>
          </label>
          <div className="flex justify-end gap-3 mt-2">
            <button type="button" onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded">Cancelar</button>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Lançar</button>
          </div>
        </form>
      </div>
    </div>
  );
}
