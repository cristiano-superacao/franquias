import React from "react";

interface StatCardProps {
  label: string;
  value: string;
  subtext?: string;
  type: "success" | "danger" | "warning" | "info" | "primary" | "purple";
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, subtext, type, icon }) => {
  const styles = {
    success: "border-emerald-500 text-emerald-600 bg-emerald-50",
    danger: "border-red-500 text-red-600 bg-red-50",
    warning: "border-amber-500 text-amber-600 bg-amber-50",
    info: "border-blue-500 text-blue-600 bg-blue-50",
    primary: "border-brand text-brand bg-brand/10",
    purple: "border-purple-500 text-purple-600 bg-purple-50",
  };

  // Map type to style, default to primary if not found
  const activeStyle = styles[type as keyof typeof styles] || styles.primary;
  const borderColor = activeStyle.split(" ")[0];
  const iconColor = activeStyle.split(" ")[1];
  const iconBg = activeStyle.split(" ")[2];

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border-l-4 ${borderColor} hover:shadow-md transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{value}</h3>
          {subtext && (
            <p className={`text-xs font-medium mt-2 ${iconColor} flex items-center gap-1`}>
              {subtext}
            </p>
          )}
        </div>
        <div className={`h-12 w-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} group-hover:scale-110 transition-transform duration-300`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

interface DashboardStatsProps {
  items: {
    label: string;
    value: string;
    subtext?: string;
    type: "success" | "danger" | "warning" | "info" | "primary" | "purple";
  }[];
}

export default function DashboardStats({ items }: DashboardStatsProps) {
  const getIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes("venda") || l.includes("receita")) return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
      </svg>
    );
    if (l.includes("despesa") || l.includes("saída")) return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
        <polyline points="17 18 23 18 23 12"></polyline>
      </svg>
    );
    if (l.includes("resultado") || l.includes("saldo")) return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"></line>
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    );
    if (l.includes("comissão") || l.includes("previsão")) return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    );
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {items.map((item, idx) => (
        <StatCard
          key={idx}
          label={item.label}
          value={item.value}
          subtext={item.subtext}
          type={item.type as any}
          icon={getIcon(item.label)}
        />
      ))}
    </div>
  );
}
