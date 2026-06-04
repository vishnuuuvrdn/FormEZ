import { createContext, useState, useCallback, useEffect } from "react";
import { CheckCircle2, AlertTriangle, X, Info } from "lucide-react";

export const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};

// Internal Toast Card Component with Slide and Fade Transitions
const ToastCard = ({ toast, onRemove }) => {
  const { id, message, type, duration } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const typeConfig = {
    success: {
      bg: "bg-surface",
      border: "border-success/30",
      text: "text-success",
      icon: CheckCircle2,
      accent: "bg-success",
    },
    error: {
      bg: "bg-surface",
      border: "border-danger/30",
      text: "text-danger",
      icon: AlertTriangle,
      accent: "bg-danger",
    },
    info: {
      bg: "bg-surface",
      border: "border-accent/30",
      text: "text-accent",
      icon: Info,
      accent: "bg-accent",
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-center gap-3 p-4 rounded-xl shadow-xl border ${config.border} ${config.bg} max-w-sm w-80 animate-slide-in transition-all duration-300 relative overflow-hidden`}
    >
      {/* Decorative vertical color accent indicator */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.accent}`} />
      
      <Icon size={18} className={`${config.text} shrink-0 ml-1`} />
      <p className="text-sm font-semibold text-text-primary flex-1 pr-2 leading-relaxed">
        {message}
      </p>
      
      <button
        onClick={() => onRemove(id)}
        className="text-text-secondary hover:text-text-primary transition-colors shrink-0 p-1 hover:bg-surface-muted rounded-full"
        aria-label="Close notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

// Toast Container Mounted at the Top Level of App.jsx
export const ToastContainer = () => {
  const [context, setContext] = useState(null);

  // Directly consume inside the container since it runs inside the Provider
  return (
    <ToastContext.Consumer>
      {(value) => {
        if (!value || value.toasts.length === 0) return null;
        return (
          <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 pointer-events-auto">
            {value.toasts.map((toast) => (
              <ToastCard key={toast.id} toast={toast} onRemove={value.removeToast} />
            ))}
          </div>
        );
      }}
    </ToastContext.Consumer>
  );
};
