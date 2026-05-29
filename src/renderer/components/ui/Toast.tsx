import { useToast } from '../../context/ToastContext';

export function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <button
          key={toast.id}
          onClick={() => removeToast(toast.id)}
          className="flex items-center gap-3 bg-[#222228] border border-white/[0.08] rounded-lg px-4 py-3 shadow-2xl pointer-events-auto text-left"
        >
          {toast.icon && (
            <img
              src={toast.icon}
              alt=""
              className="w-6 h-6 rounded flex-shrink-0 object-cover"
              onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
            />
          )}
          <span className="text-sm text-white/80">{toast.message}</span>
        </button>
      ))}
    </div>
  );
}
