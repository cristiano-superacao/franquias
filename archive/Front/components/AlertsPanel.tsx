import React from "react";

type AlertsPanelProps = {
  critical?: { title: string; description: string }[];
  nextSteps?: { title: string; description: string }[];
};

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  critical = [
    { title: "Profissional sem CRM informado", description: "1 membro(s) da equipe precisam atualizar o CRM antes de emitir contratos." },
    { title: "Sincronização atrasada", description: "Não há novas prescrições registradas há mais de 48 horas." },
  ],
  nextSteps = [
    { title: "Tudo em dia", description: "Nenhuma pendência operacional identificada nas últimas 24h." },
  ],
}) => {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6" aria-label="Painel de alertas e próximos passos">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Atenção imediata</h3>
          <span className="text-xs text-gray-500">Alertas críticos</span>
        </div>
        <ul className="space-y-2">
          {critical.map((c, i) => (
            <li key={i} className="rounded-md border border-amber-200 bg-amber-50 p-3">
              <div className="text-sm font-medium text-amber-800">{c.title}</div>
              <div className="text-xs text-amber-700">{c.description}</div>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900">Próximos passos</h3>
          <span className="text-xs text-gray-500">Controle operacional</span>
        </div>
        <ul className="space-y-2">
          {nextSteps.map((n, i) => (
            <li key={i} className="rounded-md border border-emerald-200 bg-emerald-50 p-3">
              <div className="text-sm font-medium text-emerald-800">{n.title}</div>
              <div className="text-xs text-emerald-700">{n.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AlertsPanel;
