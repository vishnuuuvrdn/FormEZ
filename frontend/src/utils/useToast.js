import { useContext } from "react";
import { ToastContext } from "../components/Toast";

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return {
    success: (msg, duration) => context.addToast(msg, "success", duration),
    error: (msg, duration) => context.addToast(msg, "error", duration),
    info: (msg, duration) => context.addToast(msg, "info", duration),
  };
}
