"use client";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useState } from "react";
import { useToast } from "../../components/Toast";

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    showToast("Se o e-mail existir, você receberá as instruções.", "success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 relative overflow-hidden font-sans">
      <div className="w-full max-w-[420px] p-6 relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-surface-950">
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Recuperar Senha</h1>
            <p className="text-gray-400 text-sm">
              Digite seu e-mail para receber as instruções de redefinição.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-surface-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
            <Input
              label="Email Profissional"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              autoFocus
              className="bg-surface-950/50 border-white/10 focus:border-brand/50"
            />

            <Button type="submit" isLoading={loading} className="w-full h-12">
              Enviar Instruções
            </Button>

            <Link href="/login" className="text-center text-sm text-gray-400 hover:text-white transition-colors">
              Voltar para o Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
