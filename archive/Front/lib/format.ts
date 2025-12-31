function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const normalized = value.replace(/\./g, "").replace(/,/g, ".");
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (typeof value === "object" && value) {
    const maybeToString = (value as { toString?: () => string }).toString;
    if (typeof maybeToString === "function") {
      const str = maybeToString.call(value);
      const parsed = Number(str);
      return Number.isFinite(parsed) ? parsed : null;
    }
  }
  return null;
}

const brl = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  maximumFractionDigits: 2,
});

const number2 = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 2,
});

export function formatCurrency(value: unknown, fallback = "-") {
  const n = toNumber(value);
  return n === null ? fallback : brl.format(n);
}

export function formatNumber(value: unknown, fallback = "-") {
  const n = toNumber(value);
  return n === null ? fallback : number2.format(n);
}

export function formatPercent(value: unknown, fallback = "-") {
  const n = toNumber(value);
  return n === null ? fallback : `${number2.format(n)}%`;
}

export function coerceNumber(value: unknown, fallback = 0) {
  const n = toNumber(value);
  return n === null ? fallback : n;
}
