import { useState, useEffect, useCallback } from "react";

export function useAsync(
  asyncFunction,
  deps = [],
  { immediate = true, enabled = true } = {}
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      if (!enabled) return;

      setLoading(true);
      setError(null);

      try {
        const res = await asyncFunction(...args);
        const result = res?.data ?? res;
        setData(result);
        return result;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong";

        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction, enabled]
  );

  useEffect(() => {
    if (immediate && enabled) {
      execute();
    }
  }, [execute, immediate, enabled, ...deps]);

  return { data, loading, error, execute };
}