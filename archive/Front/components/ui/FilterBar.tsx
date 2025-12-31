"use client";
import React from "react";

type StatusOption = { id: string; label: string };
type SortOption = { key: string; label: string };

type Props = {
  status?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: StatusOption[];

  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSortKeyChange?: (key: string) => void;
  onSortDirChange?: (dir: "asc" | "desc") => void;
  sortOptions?: SortOption[];

  onClear?: () => void;
  className?: string;
};

export default function FilterBar({
  status,
  onStatusChange,
  statusOptions = [],
  sortKey,
  sortDir = "asc",
  onSortKeyChange,
  onSortDirChange,
  sortOptions = [],
  onClear,
  className = "",
}: Props) {
  const toggleSort = (key: string) => {
    if (!onSortKeyChange || !onSortDirChange) return;
    if (sortKey === key) {
      onSortDirChange(sortDir === "asc" ? "desc" : "asc");
    }
    onSortKeyChange(key);
  };

  return (
    <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}>
      {statusOptions.length > 0 && onStatusChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Status:</span>
          {statusOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => onStatusChange(opt.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                status === opt.id
                  ? opt.id === "low"
                    ? "bg-red-100 text-red-700 border-red-300"
                    : opt.id === "ok"
                    ? "bg-emerald-100 text-emerald-700 border-emerald-300"
                    : "bg-brand-900/30 text-brand-700 border-brand-300"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {sortOptions.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          Ordenar:
          {sortOptions.map((opt) => (
            <button
              key={opt.key}
              className={`px-2 py-1 rounded border ${
                sortKey === opt.key
                  ? "bg-gray-100 border-gray-300 text-gray-900"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => toggleSort(opt.key)}
            >
              {opt.label} {sortKey === opt.key ? (sortDir === "asc" ? "↑" : "↓") : ""}
            </button>
          ))}
        </div>
      )}

      {onClear && (
        <div>
          <button
            onClick={onClear}
            className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm"
          >
            Limpar filtros
          </button>
        </div>
      )}
    </div>
  );
}
