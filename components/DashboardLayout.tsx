"use client";
import React, { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { useFetch } from "../hooks/useFetch";
import { getSession } from "../lib/auth";
import AppHeader from "./AppHeader";
import SkipLink from "./SkipLink";

type DashboardLayoutProps = {
  children: ReactNode;
  showSidebar?: boolean;
  selectedLoja?: number | null;
  onSelectLoja?: (id: number | null) => void;
};

export default function DashboardLayout({ children, showSidebar = true, selectedLoja = null, onSelectLoja }: DashboardLayoutProps) {
  const session = typeof window !== "undefined" ? getSession() : null;
  const { data: lojasRaw } = useFetch<{ id: number; nome: string }[]>("/api/lojas");
  const lojas = lojasRaw || [];

  const [internalSelected, setInternalSelected] = React.useState<number | null>(null);
  React.useEffect(() => {
    const raw = typeof window !== "undefined" ? window.localStorage.getItem("selectedLojaId") : null;
    const parsed = raw ? Number(raw) : null;
    setInternalSelected(Number.isFinite(parsed as number) ? (parsed as number) : null);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col md:flex-row">
      {showSidebar && (
        <DashboardSidebar
          lojas={lojas}
          selectedLoja={selectedLoja ?? internalSelected}
          onSelectLoja={(id) => {
            setInternalSelected(id);
            if (typeof window !== "undefined") {
              if (id === null) window.localStorage.removeItem("selectedLojaId");
              else window.localStorage.setItem("selectedLojaId", String(id));
            }
            onSelectLoja && onSelectLoja(id);
          }}
        />
      )}
      {/* Skip to content for keyboard navigation */}
      <SkipLink />
      <main id="main-content" className="flex-1 p-6 pb-20 md:pb-6" role="main">
        <div className="mx-auto w-full max-w-6xl">
          <AppHeader />
          {children}
        </div>
      </main>
    </div>
  );
}
