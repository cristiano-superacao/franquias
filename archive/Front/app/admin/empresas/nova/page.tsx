"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { requireRole } from "../../../../lib/auth";
import DashboardLayout from "../../../../components/DashboardLayout";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function NovaEmpresaPage() {
  useEffect(() => {
    requireRole(["super_admin"]);
  }, []);

  const router = useRouter();
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    setLoading(true);
    try {
      // Mock de criação; em produção, chamar API
      await new Promise((r) => setTimeout(r, 600));
      router.push("/admin/empresas?created=1");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col">
      <DashboardLayout>
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4"><Breadcrumbs /></div>
            <header className="mb-4 flex items-center justify-between">
              <h1 className="text-2xl font-bold" style={{ color: "#CCE3DE" }}>Nova Empresa</h1>
            </header>
            <section className="bg-white rounded-xl border border-gray-200 p-6 shadow">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                <Input label="Nome da Empresa" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Ex.: Acme S/A" />
                <Input label="CNPJ" value={cnpj} onChange={(e) => setCnpj(e.target.value)} placeholder="00.000.000/0000-00" />
                <Input type="email" label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="contato@empresa.com" />
                <div className="flex items-center gap-3 mt-2">
                  <Button type="button" variant="ghost" onClick={() => router.back()}>Cancelar</Button>
                  <Button type="submit" variant="brand" isLoading={loading} aria-label="Salvar Empresa">Salvar</Button>
                </div>
              </form>
            </section>
          </div>
        </main>
      </DashboardLayout>
    </div>
  );
}
