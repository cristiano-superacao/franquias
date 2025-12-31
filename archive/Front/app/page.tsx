"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, getLandingRoute } from "../lib/auth";

export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    const target = session ? getLandingRoute(session) : "/login";
    // Usa router para transição suave; fallback para location
    try {
      router.replace(target);
    } catch {
      if (typeof window !== "undefined") {
        window.location.href = target;
      }
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-xl mb-4" style={{ backgroundColor: "#CCE3DE" }} />
        <p className="text-gray-300">Redirecionando…</p>
        <a href="/login" className="mt-4 inline-block px-4 py-2 rounded bg-brand text-black">Ir para login</a>
      </div>
    </div>
  );
}
