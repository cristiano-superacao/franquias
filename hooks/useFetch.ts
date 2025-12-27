"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

export function useFetch<T = any>(url: string) {
  // Removed invalid default export
  // export default useFetch; // This line has been removed
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar dados");
        return res.json();
      })
      .then((data) => setData(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return useMemo(() => ({ data, loading, error }), [data, loading, error]);
}
