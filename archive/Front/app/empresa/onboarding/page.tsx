"use client";
import React, { useState } from "react";
import { createEmpresa, createUsuario } from "../../../lib/tenant";
import { useToast } from "../../../components/Toast";

export default function OnboardingEmpresaPage() {
  const [empresa, setEmpresa] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { showToast } = useToast();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!empresa || !username || !password) {
      showToast("Preencha todos os campos", "error");
      return;
    }
    const emp = createEmpresa(empresa);
    createUsuario({ username, password, role: "company_admin", empresa_id: emp.id });
    showToast("Empresa criada! Você já pode acessar com seu usuário.", "success");
    setTimeout(() => {
      window.location.href = "/login";
    }, 300);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-surface-900/80 backdrop-blur-md p-8 rounded-xl w-full max-w-md border border-gray-800 shadow-soft flex flex-col gap-4">
        <h1 className="text-xl font-bold" style={{ color: "#CCE3DE" }}>Criar Empresa</h1>
        <label className="flex flex-col gap-2 text-gray-200">
          Nome da empresa
          <input className="px-3 py-2 rounded bg-gray-900 border border-gray-800 focus:outline-none focus:border-brand text-white" value={empresa} onChange={(e) => setEmpresa(e.target.value)} />
        </label>
        <label className="flex flex-col gap-2 text-gray-200">
          Usuário (admin da empresa)
          <input className="px-3 py-2 rounded bg-gray-900 border border-gray-800 focus:outline-none focus:border-brand text-white" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="flex flex-col gap-2 text-gray-200">
          Senha
          <input type="password" className="px-3 py-2 rounded bg-gray-900 border border-gray-800 focus:outline-none focus:border-brand text-white" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button type="submit" className="font-semibold py-2 px-6 rounded text-black hover:brightness-95" style={{ backgroundColor: "#CCE3DE" }}>Criar</button>
      </form>
    </div>
  );
}
