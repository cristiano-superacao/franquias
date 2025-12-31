"use client";
import { useState } from "react";
import { useToast } from "../../components/Toast";
import { validateCredentials } from "../../lib/auth";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    // Simula delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const valid = validateCredentials(username, password);
    if (!valid.ok) {
      setLoading(false);
      showToast(valid.message || "Dados inválidos", "error");
      return;
    }

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      setLoading(false);
      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Erro" }));
        showToast(data.error || "Usuário ou senha inválidos", "error");
        return;
      }
      const data = await res.json();
      if (typeof window !== "undefined") {
        localStorage.setItem("session", JSON.stringify(data.user));
      }
      showToast("Login realizado com sucesso!", "success");
      setTimeout(() => { window.location.href = "/dashboard"; }, 300);
    } catch {
      setLoading(false);
      showToast("Falha de rede ao autenticar", "error");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 md:bg-white">
      <div className="grid md:grid-cols-2 min-h-screen">
        {/* Lateral com herói/branding */}
        <aside className="hidden md:flex items-center justify-center p-10 bg-gradient-to-br from-blue-800 via-indigo-700 to-blue-500">
          <div className="max-w-md text-white">
            <div className="mb-8 flex items-center justify-center">
              <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                {/* Ícone simples */}
                <svg aria-hidden="true" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-center">
              Transforme Metas em
              <br /> Conquistas Reais.
            </h1>
            <p className="mt-6 text-center text-white/90">
              Gestão completa de vendas, comissões, clientes, estoque e
              ordens de serviço. Inteligência integrada para seu time alcançar
              resultados extraordinários.
            </p>
          </div>
        </aside>

        {/* Conteúdo: formulário de login */}
        <main className="flex items-center justify-center p-6 md:p-10 bg-white">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm"
          >
            <div className="mb-4" role="status" aria-live="polite">
              {/* Mensagem informativa opcional */}
              <div className="rounded-md border border-cyan-200 bg-cyan-50 text-cyan-900 px-4 py-3 text-sm">
                Você saiu da sua conta.
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">Bem-vindo de volta</h2>
            <p className="mt-1 text-sm text-gray-600">Acesse sua conta para continuar</p>

            {/* Usuário / Email */}
            <label className="mt-6 block text-sm font-medium text-gray-900" htmlFor="username">
              Email ou Usuário
            </label>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
                {/* envelope */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4 6h16v12H4z" />
                  <path d="M4 7l8 5 8-5" />
                </svg>
              </span>
              <input
                id="username"
                type="text"
                className="w-full rounded-md border border-gray-300 bg-white px-10 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoFocus
                aria-label="Usuário"
                placeholder="admin@vendacerta.com"
              />
            </div>

            {/* Senha */}
            <label className="mt-5 block text-sm font-medium text-gray-900" htmlFor="password">
              Senha
            </label>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" aria-hidden="true">
                {/* cadeado */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 1 1 8 0v3" />
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full rounded-md border border-gray-300 bg-white px-10 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:border-blue-600 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Senha"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {/* Olho */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </button>
            </div>

            <button
              type="submit"
              className="mt-6 inline-flex w-full justify-center rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-white font-semibold shadow-sm hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-60"
              disabled={loading}
              aria-label="Entrar no Sistema"
            >
              {loading ? "Entrando..." : "Entrar no Sistema"}
            </button>

            <div className="mt-4 flex items-center justify-between text-sm">
              <a href="#" className="text-blue-700 hover:text-blue-800">Esqueceu a senha?</a>
              <a href="/criar-conta" className="text-blue-700 hover:text-blue-800">Criar conta</a>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

