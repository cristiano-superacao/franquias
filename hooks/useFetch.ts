"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { mockApiFetch } from "../lib/mockApi";

export function useFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  const fetchData = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    const timeout = setTimeout(() => controller.abort(), 8000);
    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return (await res.json()) as T;
      })
      .then((json) => setData(json))
      .catch(async (err) => {
        if (err?.name === "AbortError") return;

        const fallback = await mockApiFetch(url);
        if (fallback !== null) {
          setData(fallback as T);
          setError(null);
          return;
        }
        // Requisições resilientes: uma nova tentativa rápida
        if (retry < 1) {
          setRetry((r) => r + 1);
          setTimeout(fetchData, 400);
          return;
        }
        setError("Erro ao buscar dados");
      })
      .finally(() => { clearTimeout(timeout); setLoading(false); });

    return () => controller.abort();
  }, [url, retry]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
