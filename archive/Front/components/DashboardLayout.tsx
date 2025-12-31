"use client";
import React, { ReactNode } from "react";
import DashboardSidebar from "./DashboardSidebar";
import { useFetch } from "../hooks/useFetch";
import { getSession } from "../lib/auth";
import { getSelectedLojaId, setSelectedLojaId } from "../lib/tenant";
import type { User } from "../lib/types";

type DashboardLayoutProps = {
  children: ReactNode;
  showSidebar?: boolean;
  selectedLoja?: number | null;
  onSelectLoja?: (id: number | null) => void;
};

export default function DashboardLayout({ children, showSidebar = true, selectedLoja = null, onSelectLoja }: DashboardLayoutProps) {
  const session = typeof window !== "undefined" ? getSession() : null;
  const { data: lojasRaw } = useFetch<any[]>("/api/lojas");

  const [internalSelected, setInternalSelected] = React.useState<number | null>(null);
  React.useEffect(() => {
    const initial = getSelectedLojaId();
    setInternalSelected(typeof initial === "number" ? initial : null);
  }, []);

  const lojas = React.useMemo(() => {
    const list: any[] = lojasRaw || [];
    if (!session) return list;
    if (session.role === "franchise_user" && session.loja_id) {
      return list.filter((l) => l.id === session.loja_id);
    }
    if (session.role === "company_admin" && session.empresa_id) {
      return list.filter((l) => l.empresa_id === session.empresa_id);
    }
    return list;
  }, [lojasRaw, session]);

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      {showSidebar && (
        <DashboardSidebar
          lojas={lojas}
          selectedLoja={selectedLoja ?? internalSelected}
          onSelectLoja={(id) => {
            setInternalSelected(id);
            setSelectedLojaId(id);
            onSelectLoja && onSelectLoja(id);
          }}
          allowConsolidated={session?.role !== "franchise_user"}
          role={session?.role || null}
          showStores={true}
        />
      )}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
