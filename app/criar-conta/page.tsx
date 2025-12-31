"use client";
import { useState } from "react";
import { useToast } from "../../components/Toast";
import { validateRegistration } from "../../lib/auth";

export default function CreateAccountPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));

    const valid = validateRegistration({ name, email, password });
    if (!valid.ok) {
      setLoading(false);
      showToast(valid.message || "Dados inválidos", "error");
      return;
    }

    try {
      const res = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      setLoading(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erro" }));
        showToast(data.error || "Não foi possível criar sua conta.", "error");
        return;
      }
      showToast("Conta criada com sucesso!", "success");
      setTimeout(() => (window.location.href = "/login"), 500);
    } catch {
      setLoading(false);
      showToast("Falha de rede ao criar conta.", "error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 md:bg-white">
      <div className="grid md:grid-cols-2 min-h-screen">
        <aside className="hidden md:flex items-center justify-center p-10 bg-gradient-to-br from-blue-800 via-indigo-700 to-blue-500">
          <div className="max-w-md text-white">
            <div className="mb-8 flex items-center justify-center">
              <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg aria-hidden="true" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-center">Crie sua conta</h1>
            <p className="mt-6 text-center text-white/90">Acelere sua gestão de franquias com um começo rápido.</p>
          </div>
        </aside>

        <main className="flex items-center justify-center p-6 md:p-10 bg-white">
          <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-900">Criar conta</h2>
            <p className="mt-1 text-sm text-gray-600">Leva menos de um minuto.</p>

            <label className="mt-6 block text-sm font-medium text-gray-900" htmlFor="name">Nome completo</label>
            <input id="name" className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:ring-blue-600" value={name} onChange={(e)=>setName(e.target.value)} placeholder="Ex.: João Silva" required />

            <label className="mt-4 block text-sm font-medium text-gray-900" htmlFor="email">Email</label>
            <input id="email" type="email" className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:ring-blue-600" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="voce@empresa.com" required />

            <label className="mt-4 block text-sm font-medium text-gray-900" htmlFor="password">Senha</label>
            <div className="mt-2 relative">
              <input id="password" type={showPassword?"text":"password"} className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 pr-10 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:ring-blue-600" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required />
              <button type="button" onClick={()=>setShowPassword(s=>!s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700" aria-label={showPassword?"Ocultar senha":"Mostrar senha"}>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
              </button>
            </div>

            <button type="submit" disabled={loading} className="mt-6 inline-flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-60">
              {loading?"Criando...":"Criar conta"}
            </button>

            <div className="mt-4 text-sm text-gray-600">Já tem conta? <a className="text-blue-700 hover:text-blue-800" href="/login">Entrar</a></div>
          </form>
        </main>
      </div>
    </div>
  );
}
