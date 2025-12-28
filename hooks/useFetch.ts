"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { mockApiFetch } from "../lib/mockApi";

export function useFetch<T = any>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
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

        setError("Erro ao buscar dados");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  useEffect(() => {
    const cleanup = fetchData();
    return cleanup;
  }, [fetchData]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
