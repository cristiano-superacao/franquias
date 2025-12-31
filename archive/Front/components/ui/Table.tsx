import React, { createContext, useContext } from "react";

type Variant = "dark" | "light";
const TableVariantContext = createContext<Variant>("dark");

export function Table({ children, caption, variant = "dark" }: { children: React.ReactNode; caption?: string; variant?: Variant }) {
  const containerClasses = variant === "light"
    ? "overflow-x-auto rounded-xl border border-gray-200 bg-white"
    : "overflow-x-auto rounded-xl border border-gray-800 bg-surface-900";
  const captionClasses = variant === "light"
    ? "text-left text-gray-600 px-4 py-2"
    : "text-left text-gray-400 px-4 py-2";
  return (
    <TableVariantContext.Provider value={variant}>
      <div className={containerClasses}>
        <table className="min-w-full text-left">
          {caption ? <caption className={captionClasses}>{caption}</caption> : null}
          {children}
        </table>
      </div>
    </TableVariantContext.Provider>
  );
}

export function Thead({ children }: { children: React.ReactNode }) {
  const variant = useContext(TableVariantContext);
  const thRow = variant === "light" ? "text-gray-600" : "text-gray-400";
  return <thead><tr className={thRow}>{children}</tr></thead>;
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th scope="col" className="px-4 py-3">{children}</th>;
}

export function Tbody({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  const variant = useContext(TableVariantContext);
  const trClasses = variant === "light"
    ? "border-t border-gray-200 hover:bg-gray-50"
    : "border-t border-gray-800 hover:bg-surface-850";
  return <tr className={trClasses}>{children}</tr>;
}

export function Td({ children }: { children: React.ReactNode }) {
  const variant = useContext(TableVariantContext);
  const tdClasses = variant === "light" ? "px-4 py-3 text-gray-900" : "px-4 py-3";
  return <td className={tdClasses}>{children}</td>;
}
