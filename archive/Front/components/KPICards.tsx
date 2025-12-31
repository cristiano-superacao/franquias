import React from "react";
import DashboardStats from "./DashboardStats";

type KPICardsProps = {
  kpis: { label: string; value: string; icon?: React.ReactNode }[];
};

// Deprecated wrapper: forwards to DashboardStats to avoid duplication
const KPICards: React.FC<KPICardsProps> = React.memo(function KPICards({ kpis }) {
  const items = kpis.map((k) => {
    const l = k.label.toLowerCase();
    let type: "success" | "danger" | "warning" | "info" | "primary" | "purple" = "primary";
    let subtext = "Atualizado recentemente";
    if (l.includes("venda") || l.includes("receita")) { type = "success"; subtext = "+12% vs mês anterior"; }
    else if (l.includes("despesa") || l.includes("saída")) { type = "danger"; subtext = "-5% vs mês anterior"; }
    else if (l.includes("resultado") || l.includes("saldo")) { type = "info"; subtext = "Dentro da meta"; }
    else if (l.includes("comissão") || l.includes("previsão")) { type = "purple"; subtext = "Pagamento dia 05"; }
    return { label: k.label, value: k.value, subtext, type };
  });
  return <DashboardStats items={items} />;
});

export default KPICards;
