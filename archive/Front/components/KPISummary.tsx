import React from "react";
import DashboardStats from "./DashboardStats";

type Item = { label: string; value: string };
type KPISummaryProps = { items: Item[] };

// Deprecated wrapper: reuse DashboardStats to standardize KPI visuals
const KPISummary: React.FC<KPISummaryProps> = ({ items }) => {
  const adapted = items.map((it) => ({
    label: it.label,
    value: it.value,
    subtext: "",
    type: "primary" as const,
  }));
  return <DashboardStats items={adapted} />;
};

export default KPISummary;
