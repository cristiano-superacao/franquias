import React from "react";

type Action = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  hint?: string;
};

type QuickActionsProps = {
  title?: string;
  actions: Action[];
  query?: string;
};

const QuickActions: React.FC<QuickActionsProps> = ({ title = "Módulos do sistema", actions, query = "" }) => {
  const normalized = query.trim().toLowerCase();
  const filtered = normalized
    ? actions.filter((a) => a.label.toLowerCase().includes(normalized))
    : actions;
  return (
    <section aria-label={title} className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        <span className="text-xs text-gray-500">Acesso direto</span>
      </div>
      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">Nenhum módulo encontrado para "{query}".</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filtered.map((a, i) => (
          <a
            key={i}
            href={a.href}
            className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3 shadow-sm hover:border-brand-400 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
          >
            <span className="text-brand-600" aria-hidden="true">{a.icon}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">{a.label}</span>
              {a.hint && <span className="text-[11px] text-gray-500">{a.hint}</span>}
            </div>
          </a>
        ))}
        </div>
      )}
    </section>
  );
};

export default QuickActions;
