"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function Home() {
  // Redireciona via client-side para manter resposta 200 no healthcheck
  useEffect(() => {
    const t = setTimeout(() => {
      window.location.replace("/dashboard");
    }, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Sistema de Franquias</h1>
        <p className="text-gray-400 mb-4">Carregando dashboard...</p>
        <Link href="/dashboard" className="text-blue-400 hover:underline">Ir para o Dashboard</Link>
      </div>
    </main>
  );
}
