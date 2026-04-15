import { useState, useEffect, useCallback } from "react";
export function useAsync(asyncFunction, deps = [], immediate = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const res = await asyncFunction(...args);

      setData(res?.data ?? res);
      return res;
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
  }, [asyncFunction]);

  useEffect(() => {
    if (immediate) execute();
  }, [execute]);

  return { data, loading, error, execute };
}