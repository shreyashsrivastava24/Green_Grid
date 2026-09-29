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
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#0d141d]/95 backdrop-blur-md border border-white/15 rounded-lg p-3.5 shadow-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'success' && (
            <div className="w-6 h-6 rounded bg-emerald-950/70 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
          )}
          {toast.type === 'warning' && (
            <div className="w-6 h-6 rounded bg-amber-950/70 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="w-6 h-6 rounded bg-cyan-950/70 border border-cyan-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-100 tracking-tight">{toast.title}</h4>
            {toast.description && (
              <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-sans">{toast.description}</p>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-white/5 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
