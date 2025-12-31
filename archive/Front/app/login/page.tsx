"use client";
import { useState } from "react";
import Link from "next/link";
import { useToast } from "../../components/Toast";
import { login, getLandingRoute } from "../../lib/auth";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simula delay de rede
    await new Promise((resolve) => setTimeout(resolve, 800));

    const user = login(username, password);
    setLoading(false);

    if (!user) {
      showToast("Credenciais inválidas. Verifique seu usuário e senha.", "error");
    } else {
      showToast(`Bem-vindo, ${user.username}!`, "success");
      if (rememberMe) {
        localStorage.setItem("remember_user", username);
      }
      setTimeout(() => {
        const route = getLandingRoute(user);
        window.location.href = route;
      }, 500);
    }
  }

  const handleForgotPassword = () => {
    // Navegação real implementada
    window.location.href = "/recuperar-senha";
  };

  const handleCreateAccount = () => {
    // Navegação real implementada
    window.location.href = "/criar-conta";
  };

  return (
    <div className="min-h-screen w-full flex bg-surface-950 font-sans overflow-hidden">
      
      {/* Left Side - Brand & Info (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-surface-900 relative flex-col justify-between p-16 overflow-hidden border-r border-white/5">
        {/* Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-[0.02]" />
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-brand/5 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[70%] h-[70%] rounded-full bg-brand/5 blur-[120px]" />
        </div>

        {/* Top: Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-surface-950">
              <path d="M3 21h18M5 21V7l8-4 8 4v14M10 9a3 3 0 100-6 3 3 0 000 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Franquias</span>
        </div>

        {/* Middle: Hero Content */}
        <div className="relative z-10 space-y-8 max-w-lg">
          <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
            Simplifique a gestão de <span className="text-brand">franquias</span> da sua rede.
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Segurança, agilidade e conformidade em um único lugar. Desenvolvido especialmente para redes de franquias e lojas.
          </p>
        </div>

        {/* Bottom: Copyright */}
        <div className="relative z-10 text-sm text-gray-600">
          © 2025 Sistema Franquias. Todos os direitos reservados.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-surface-950">
        <div className="w-full max-w-[420px] space-y-8">
          
          {/* Mobile Logo (Visible only on mobile) */}
          <div className="lg:hidden flex justify-center mb-8">
             <div className="h-12 w-12 rounded-xl bg-brand flex items-center justify-center shadow-lg shadow-brand/20">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-surface-950">
                  <path d="M3 21h18M5 21V7l8-4 8 4v14M10 9a3 3 0 100-6 3 3 0 000 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
          </div>

          <div className="space-y-2 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">Bem-vindo de volta</h2>
            <p className="text-gray-400 text-sm">
              Acesse sua conta para gerenciar suas franquias.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <Input
                label="Email Profissional"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="nome@empresa.com"
                required
                autoFocus
                className="bg-surface-900/50 border-white/10 focus:border-brand/50 focus:ring-brand/20 h-12"
                icon={
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                }
              />

              <div className="space-y-2">
                <Input
                  label="Senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-surface-900/50 border-white/10 focus:border-brand/50 focus:ring-brand/20 h-12"
                  icon={
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  }
                />
                <div className="flex items-center justify-end pt-1">
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-brand hover:text-brand-400 transition-colors hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              isLoading={loading} 
              className="w-full h-12 text-base font-bold tracking-wide shadow-lg shadow-brand/10 hover:shadow-brand/20 transition-all duration-300"
            >
              Entrar no Sistema
            </Button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-xs text-gray-500">Não tem uma conta?</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            type="button"
            onClick={handleCreateAccount}
            className="w-full h-12 rounded-xl border border-white/10 bg-transparent text-white font-medium hover:bg-white/5 hover:border-white/20 transition-all flex items-center justify-center gap-2 group"
          >
            Criar conta da Franquia
          </button>

          <div className="lg:hidden text-center pt-8">
             <p className="text-[10px] text-gray-600 leading-normal">
              Protegido por reCAPTCHA e sujeito à <a href="#" className="hover:text-gray-500 underline">Política de Privacidade</a> e <a href="#" className="hover:text-gray-500 underline">Termos de Serviço</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

