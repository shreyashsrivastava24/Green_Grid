import React, { useState } from 'react';
import {
  Zap,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('arjun.s@greengrid.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotNotice, setShowForgotNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-[#101512] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-mono relative overflow-hidden">
      {/* Background Architectural Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8e8df_1px,transparent_1px),linear-gradient(to_bottom,#e8e8df_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* Brand Console Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[#059669]">
            <Radio className="w-3.5 h-3.5 signal-pulse" />
            <span>OPERATOR ACCESS // TELEMETRY TERMINAL</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#101512] tracking-tight leading-tight font-editorial">
            GREENGRID<br />
            <span className="text-[#059669]">ENERGY OS</span>
          </h1>

          <p className="text-xs text-[#525f56] font-sans">
            Enterprise terminal authentication for real-time submeter telemetry and demand dispatch.
          </p>
        </div>

        {/* Authentication Card / Box */}
        <div className="mt-8 border border-[#e2e2d8] bg-[#fbfbfa] p-7 shadow-sm">
          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-[#6f7e75] mb-1 font-bold text-[10px] uppercase">
                OPERATOR CREDENTIAL / EMAIL
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@greengrid.internal"
                className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-[#6f7e75] mb-1 font-bold text-[10px] uppercase">
                ACCESS TOKEN / SECURITY KEY
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#fbfbfa] border border-[#dcdcd2] px-3 py-2 text-[#101512] focus:border-[#059669] focus:outline-hidden transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-[#6f7e75] cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 accent-[#059669] cursor-pointer"
                />
                <span>Persist console session</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotNotice(true)}
                className="text-[#059669] hover:text-[#047857] font-bold cursor-pointer"
              >
                Reset token?
              </button>
            </div>

            {showForgotNotice && (
              <div className="p-3 bg-[#fef7ee] border border-amber-600 text-[#9a3412] text-[11px]">
                Recovery token dispatched to Chief Energy Officer directory. Proceed with demo credentials.
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#059669] hover:bg-[#047857] text-white font-bold text-xs transition-all cursor-pointer shadow-sm"
              >
                <span>CONNECT TO CONTROL CENTER</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-6 pt-4 border-t border-[#e2e2d8] text-[11px] text-[#6f7e75]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold text-[#101512]">DEMO CREDENTIALS:</span>
              <span className="text-[#059669] font-semibold">PRE-AUTHENTICATED</span>
            </div>
            <div className="p-2.5 bg-[#f5f5ee] border border-[#dcdcd2] space-y-1">
              <div className="flex justify-between">
                <span>Account:</span>
                <span className="text-[#101512] font-bold">arjun.s@greengrid.internal</span>
              </div>
              <div className="flex justify-between">
                <span>Role:</span>
                <span className="text-[#059669] font-bold">Chief Energy Officer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer System Status */}
        <div className="mt-6 text-center text-[10px] text-[#8e9e94]">
          GREENGRID SMART ENERGY OS // VERSION 2.4.0 · 50.02 Hz STABLE
        </div>
      </div>
    </div>
  );
};
