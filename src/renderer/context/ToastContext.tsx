import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface ToastMessage {
  id: number;
  message: string;
  icon?: string;
}

interface ToastContextValue {
  showToast: (message: string, icon?: string) => void;
  toasts: ToastMessage[];
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const idRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, icon?: string) => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, message, icon }]);
      setTimeout(() => removeToast(id), 3000);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast, toasts, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
