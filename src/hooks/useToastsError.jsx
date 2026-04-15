import { useEffect, useRef } from "react";
import { useToast } from "../context/ToastContext";

export function useToastError(error) {
  const { showToast } = useToast();
  const isFirstRender = useRef(true);
  const lastMessage = useRef(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return; // ❌ ignore first render completely
    }

    if (!error) return;

    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Something went wrong";

    // ❌ prevent duplicate spam
    if (lastMessage.current === msg) return;

    lastMessage.current = msg;

    showToast("error", msg);
  }, [error, showToast]);
}