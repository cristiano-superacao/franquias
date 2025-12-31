"use client";
import React, { useEffect, useMemo, useState } from "react";
import { requireRole, getSession } from "../../../lib/auth";
import { listUsuariosByEmpresa, listLojasByEmpresa, createUsuario } from "../../../lib/tenant";
import { useToast } from "../../../components/Toast";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import MobileNav from "../../../components/MobileNav";
import DashboardLayout from "../../../components/DashboardLayout";
import { Table, Thead, Th, Tbody, Tr, Td } from "../../../components/ui/Table";
import Breadcrumbs from "../../../components/Breadcrumbs";

export default function EmpresaUsuariosPage() {
  useEffect(() => {
    requireRole(["company_admin"]);
  }, []);

  const { showToast } = useToast();
  const session = getSession();
  const empresaId = session?.empresa_id ?? 0;

  const usuarios = listUsuariosByEmpresa(empresaId).filter(u => u.role !== "super_admin");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter((u) => u.username.toLowerCase().includes(q));
  }, [usuarios, query]);

  const lojas = listLojasByEmpresa(empresaId);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [lojaId, setLojaId] = useState<number | undefined>(undefined);

  function addUsuario(e: React.FormEvent) {
    e.preventDefault();
    if (!username || !password || !lojaId) {
      showToast("Informe usuário, senha e franquia", "error");
      return;
    }
    createUsuario({ username, password, role: "franchise_user", empresa_id: empresaId, loja_id: lojaId });
    showToast("Usuário criado", "success");
    setUsername("");
    setPassword("");
    setLojaId(undefined);
  }

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <DashboardLayout>
        <main className="flex-1 p-6">
      <div className="mx-auto max-w-6xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <h1 className="text-2xl font-bold" style={{ color: "#CCE3DE" }}>Usuários da Empresa</h1>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar usuário..."
            aria-label="Buscar usuário"
            className="w-full md:w-64"
            icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>}
          />
        </div>
        <div className="mb-4"><Breadcrumbs /></div>

        <form onSubmit={addUsuario} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-1">
            <Input label="Usuário" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div className="md:col-span-1">
            <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="md:col-span-1">
            <Select
              label="Franquia"
              value={lojaId ?? ""}
              onChange={(e) => setLojaId(Number(e.target.value))}
              options={[{ value: "", label: "Selecione", disabled: true }, ...lojas.map(l => ({ value: l.id, label: l.nome }))]}
            />
          </div>
          <div className="md:col-span-1">
            <Button type="submit" className="w-full">Adicionar</Button>
          </div>
        </form>

        <Table caption="Usuários vinculados à empresa" variant="light">
          <Thead>
            <Th>Usuário</Th>
            <Th>Papel</Th>
            <Th>Franquia</Th>
          </Thead>
          <Tbody>
            {filtered.map((u) => {
              const loja = lojas.find((l) => l.id === u.loja_id);
              return (
                <Tr key={u.id}>
                  <Td><span className="font-medium">{u.username}</span></Td>
                  <Td><span className="text-gray-300">{u.role}</span></Td>
                  <Td><span className="text-gray-300">{loja?.nome ?? "-"}</span></Td>
                </Tr>
              );
            })}
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
        ]}
      />
    </div>
  );
}
