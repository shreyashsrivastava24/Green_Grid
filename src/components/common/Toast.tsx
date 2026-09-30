import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white border border-slate-200 rounded-lg p-3.5 shadow-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' && (
            <div className="w-6 h-6 rounded-md bg-green-50 border border-green-200 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-green-700" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-6 h-6 rounded-md bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-amber-700" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-6 h-6 rounded-md bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-4 h-4 text-sky-700" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
