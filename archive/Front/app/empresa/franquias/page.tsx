"use client";
import React, { useEffect, useMemo, useState } from "react";
import { requireRole, getSession } from "../../../lib/auth";
import { listLojasByEmpresa, createLoja } from "../../../lib/tenant";
import { useToast } from "../../../components/Toast";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import MobileNav from "../../../components/MobileNav";
import DashboardLayout from "../../../components/DashboardLayout";
import { Table, Thead, Th, Tbody, Tr, Td } from "../../../components/ui/Table";
import Breadcrumbs from "../../../components/Breadcrumbs";

export default function EmpresaFranquiasPage() {
  useEffect(() => {
    requireRole(["company_admin"]);
  }, []);

  const { showToast } = useToast();
  const session = getSession();
  const empresaId = session?.empresa_id ?? 0;

  const [query, setQuery] = useState("");
  const lojas = listLojasByEmpresa(empresaId);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return lojas;
    return lojas.filter((l) => l.nome.toLowerCase().includes(q));
  }, [lojas, query]);

  const [nome, setNome] = useState("");

  function addLoja(e: React.FormEvent) {
    e.preventDefault();
    if (!nome) {
      showToast("Informe o nome da franquia", "error");
      return;
    }
    createLoja(empresaId, nome);
    showToast("Franquia criada", "success");
    setNome("");
  }

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <DashboardLayout>
        <main className="flex-1 p-6">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold" style={{ color: "#CCE3DE" }}>Franquias da Empresa</h1>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar franquia..."
            aria-label="Buscar franquia"
            className="w-full md:w-64"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
          />
        </div>
        <div className="mb-4"><Breadcrumbs /></div>

        <form onSubmit={addLoja} className="flex flex-col md:flex-row gap-3">
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome da franquia" aria-label="Nome da franquia" className="flex-1" />
          <Button type="submit">Adicionar</Button>
        </form>

        <Table caption="Lista de franquias da empresa" variant="light">
          <Thead>
            <Th>Franquia</Th>
            <Th>Meta Venda</Th>
            <Th>% Comissão</Th>
          </Thead>
          <Tbody>
            {filtered.map((l) => (
              <Tr key={l.id}>
                <Td><span className="font-medium">{l.nome}</span></Td>
                <Td><span className="text-gray-300">{l.meta_venda}</span></Td>
                <Td><span className="text-gray-300">{l.porcentagem_comissao}%</span></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
        </main>
      </DashboardLayout>
      <MobileNav
        items={[
          {
            label: "Adicionar",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M12 8v8M8 12h8"/></svg>),
          },
          {
            label: "Filtrar",
            icon: (<svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 5h18l-7 8v6l-4-2v-4L3 5z" stroke="currentColor" strokeWidth="2" fill="none"/></svg>),
          },
        ]}
      />
    </div>
  );
}
