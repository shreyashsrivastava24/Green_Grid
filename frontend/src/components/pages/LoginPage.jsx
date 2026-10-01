import React, { useState } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  SunMedium,
  Building2,
  Radio,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { api } from '../../services/api';

export const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('arjun.s@greengrid.internal');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [showForgotNotice, setShowForgotNotice] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');

    try {
      if (email === 'arjun.s@greengrid.internal' && password.includes('••')) {
        await api.auth.demoLogin(email);
      } else {
        await api.auth.login(email, password);
      }
      onLogin();
    } catch (err) {
      setLoginError(err?.message || 'Authentication failed. Please verify your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 flex relative overflow-hidden">
      {/* ─── Left: Decorative Brand Panel (hidden on mobile) ─── */}
      <div className="hidden lg:flex lg:w-[48%] relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 navbar-gradient" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-80 h-80 orb orb-green opacity-60" />
        <div className="absolute bottom-32 right-16 w-64 h-64 orb orb-teal opacity-40" />
        
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="relative z-10 max-w-md px-12 text-white">
          <Logo variant="light" size="lg" showBadge={true} />
          
          <h2 className="mt-8 text-3xl font-extrabold text-white tracking-tight leading-tight">
            Enterprise Energy Intelligence at Your Fingertips.
          </h2>
          <p className="mt-4 text-emerald-100/80 text-base leading-relaxed">
            Monitor real-time IoT telemetry, optimize peak demand, and accelerate clean energy transition across multi-campus facilities.
          </p>

          {/* Floating metric cards */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <Activity className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">1,866 kW Live Demand</div>
                <div className="text-emerald-200/60 text-xs">Across 5 enterprise campuses</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <SunMedium className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">481 kWp Solar Generation</div>
                <div className="text-emerald-200/60 text-xs">34.2% clean energy offset</div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-white/10 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-400/20 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <div className="text-white font-semibold text-sm">₹18.5L Monthly Savings</div>
                <div className="text-emerald-200/60 text-xs">Automated demand optimization</div>
              </div>
            </div>
          </div>

          {/* Compliance badges */}
          <div className="mt-8 flex items-center gap-4 text-xs text-emerald-200/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ISO 50001
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              ASHRAE 90.1
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              BACnet/IP
            </span>
          </div>
        </div>
      </div>

      {/* ─── Right: Login Form ─── */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-12 xl:px-16">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Brand (visible on mobile only) */}
          <div className="lg:hidden text-center mb-8">
            <Logo variant="dark" size="lg" showBadge={true} />
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left space-y-2">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Radio className="w-3.5 h-3.5 signal-pulse" />
              <span>Smart Energy Management System</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight pt-2">
              Sign in to Control Center
            </h1>

            <p className="text-sm text-slate-500 max-w-sm">
              Industrial IoT command center for real-time telemetry, demand optimization, and tariff intelligence.
            </p>
          </div>

          {/* Authentication Card */}
          <div
            className="mt-7 bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8"
            style={{ boxShadow: '0 4px 16px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.03)' }}
          >
            <form className="space-y-5 text-sm" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-slate-700 font-semibold mb-1.5 text-xs">
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
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-slate-700 font-semibold mb-1.5 text-xs">
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
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer text-xs">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-emerald-600 cursor-pointer rounded"
                  />
                  <span>Remember console session</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowForgotNotice(true)}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold cursor-pointer text-xs transition-colors"
                >
                  Reset token?
                </button>
              </div>

              {showForgotNotice && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs">
                  Recovery token dispatched to Chief Energy Officer directory. Proceed with demo credentials below.
                </div>
              )}

              {loginError && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                  {loginError}
                </div>
              )}

              <div className="pt-1">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer group"
                  style={{ boxShadow: '0 2px 8px rgba(5,150,105,0.25), 0 1px 3px rgba(0,0,0,0.1)' }}
                >
                  <span>Connect to Control Center</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-sm text-slate-600">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-slate-900 text-xs">Demo Credentials</span>
                <span className="text-emerald-600 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Pre-Authenticated</span>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account:</span>
                  <span className="text-slate-900 font-medium">arjun.s@greengrid.internal</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Role:</span>
                  <span className="text-emerald-600 font-semibold">Chief Energy Officer</span>
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
    </div>
  );
};
