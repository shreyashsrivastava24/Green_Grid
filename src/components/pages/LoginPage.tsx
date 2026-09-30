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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Console Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
            <Radio className="w-3.5 h-3.5 signal-pulse" />
            <span>Smart Energy Management System</span>
          </div>

          <div className="flex items-center justify-center gap-2.5 pt-2">
            <div className="w-9 h-9 rounded-lg bg-green-600 flex items-center justify-center text-white shadow-xs">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              GreenGrid <span className="text-green-700">EMIS</span>
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Industrial IoT command center for real-time telemetry, demand optimization, and tariff intelligence.
          </p>
        </div>

        {/* Authentication Card */}
        <div className="mt-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-sm">
          <form className="space-y-4 text-xs" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-slate-700 font-semibold mb-1">
                Operator Email / Credential
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
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-slate-700 font-semibold mb-1">
                Access Token / Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-md px-3 py-2 text-slate-900 focus:outline-hidden focus:border-green-600 focus:ring-1 focus:ring-green-600 transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-green-600 cursor-pointer rounded"
                />
                <span>Remember console session</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotNotice(true)}
                className="text-green-700 hover:text-green-800 font-semibold cursor-pointer"
              >
                Reset token?
              </button>
            </div>

            {showForgotNotice && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-xs">
                Recovery token dispatched to Chief Energy Officer directory. Proceed with demo credentials below.
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold text-xs rounded-md shadow-xs transition-colors cursor-pointer"
              >
                <span>Connect to Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-slate-900">Demo Credentials:</span>
              <span className="text-green-700 font-semibold text-[11px]">Pre-Authenticated</span>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Account:</span>
                <span className="text-slate-900 font-semibold">arjun.s@greengrid.internal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Role:</span>
                <span className="text-green-700 font-semibold">Chief Energy Officer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-400">
          GreenGrid Smart Energy OS · Version 2.4.0 · 50.02 Hz Nominal
        </div>
      </div>
    </div>
  );
};
