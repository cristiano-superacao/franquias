"use client";
import Link from "next/link";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useState } from "react";
import { useToast } from "../../components/Toast";

export default function CriarContaPage() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    empresa: "",
    telefone: ""
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    showToast("Solicitação enviada! Entraremos em contato.", "success");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 relative overflow-hidden font-sans">
      <div className="w-full max-w-[480px] p-6 relative z-10">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-brand flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-surface-950">
                <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Criar Conta da Franquia</h1>
            <p className="text-gray-400 text-sm">
              Preencha os dados para solicitar o credenciamento da sua unidade.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-surface-900/60 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-2xl">
            <Input
              label="Nome do Responsável"
              value={formData.nome}
              onChange={(e) => setFormData({...formData, nome: e.target.value})}
              required
              className="bg-surface-950/50 border-white/10 focus:border-brand/50"
            />
            <Input
              label="Email Corporativo"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              className="bg-surface-950/50 border-white/10 focus:border-brand/50"
            />
            <Input
              label="Nome da Franquia/Empresa"
              value={formData.empresa}
              onChange={(e) => setFormData({...formData, empresa: e.target.value})}
              required
              className="bg-surface-950/50 border-white/10 focus:border-brand/50"
            />
            <Input
              label="Telefone / WhatsApp"
              value={formData.telefone}
              onChange={(e) => setFormData({...formData, telefone: e.target.value})}
              required
              className="bg-surface-950/50 border-white/10 focus:border-brand/50"
            />

            <Button type="submit" isLoading={loading} className="w-full h-12 mt-2">
              Solicitar Acesso
            </Button>

            <Link href="/login" className="text-center text-sm text-gray-400 hover:text-white transition-colors">
              Já tem uma conta? Fazer Login
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
