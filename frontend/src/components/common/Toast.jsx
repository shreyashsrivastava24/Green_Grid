import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
          style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.1), 0 2px 6px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.03)' }}
        >
          {toast.type === 'success' && (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <AlertCircle className="w-4 h-4 text-amber-600" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200/60 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
              <Info className="w-4 h-4 text-sky-600" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-slate-900">{toast.title}</h4>
            {toast.description && (
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-300 hover:text-slate-600 transition-colors p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
