import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Building2,
  Activity,
  Receipt,
  SunMedium,
  AlertTriangle,
  Lightbulb,
  Settings,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Menu,
  X,
  Check,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Logo } from './Logo';

export const Navbar = ({
  user,
  facilities,
  selectedFacilityId,
  onSelectFacility,
  activePage,
  onNavigate,
  onLogout,
  unreadAlertCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFacilityMenu, setShowFacilityMenu] = useState(false);

  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const facilityRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (facilityRef.current && !facilityRef.current.contains(e.target)) {
        setShowFacilityMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on page navigation or window resize
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activePage]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'facilities', label: 'Facilities', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'billing', label: 'Billing', icon: Receipt },
    { id: 'renewable', label: 'Renewables', icon: SunMedium },
    { id: 'alerts', label: 'Alerts', badge: unreadAlertCount, icon: AlertTriangle },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);
  const isLanding = activePage === 'landing';

  return (
    <header className="sticky top-0 z-50 w-full select-none">
      {/* Frosted glass navbar with gradient */}
      <div
        className="navbar-gradient border-b border-emerald-800/30 shadow-lg backdrop-blur-sm"
        style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.15), 0 0 40px rgba(16,185,129,0.08)' }}
      >
        <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[68px] sm:h-[72px] gap-2 sm:gap-4">
            
            {/* ─── LEFT: BRAND LOGO ─── */}
            <div className="flex items-center shrink-0">
              <button
                onClick={() => onNavigate('landing')}
                className="flex items-center gap-2 cursor-pointer focus:outline-hidden group"
                aria-label="GreenGrid Home - Click to return to overview"
                title="GreenGrid Energy Intelligence - Return to Overview"
              >
                <Logo variant="light" size="md" showBadge={true} />
              </button>
            </div>

            {/* ─── CENTER: NAVIGATION LINKS ─── */}
            {isLanding ? (
              <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
                {['About', 'Features', 'How It Works', 'Impact', 'Metrics', 'Campuses'].map((item) => {
                  const href = item === 'Campuses' ? undefined : `#${item.toLowerCase().replace(/\s+/g, '-')}`;
                  const isButton = item === 'Campuses';
                  const commonClasses = "px-3.5 py-2 text-sm font-medium text-emerald-100/90 hover:text-white hover:bg-white/10 rounded-lg whitespace-nowrap transition-all duration-200";
                  
                  return isButton ? (
                    <button
                      key={item}
                      onClick={() => onNavigate('facilities')}
                      className={`${commonClasses} cursor-pointer`}
                    >
                      {item}
                    </button>
                  ) : (
                    <a key={item} href={href} className={commonClasses}>{item}</a>
                  );
                })}
              </nav>
            ) : (
              <nav className="hidden xl:flex items-center gap-0.5">
                {navItems.map((item) => {
                  const isActive =
                    activePage === item.id ||
                    (item.id === 'facilities' && activePage === 'facility-detail');
                  return (
                    <button
                      key={item.id}
                      onClick={() => onNavigate(item.id)}
                      className={`relative flex items-center gap-1.5 px-3 xl:px-3.5 py-2 text-[13px] font-medium rounded-lg whitespace-nowrap transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-white/15 text-white font-semibold shadow-sm backdrop-blur-xs ring-1 ring-white/20'
                          : 'text-emerald-100/80 hover:text-white hover:bg-white/8'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white leading-tight shadow-sm">
                          {item.badge}
                        </span>
                      )}
                      {/* Active indicator dot */}
                      {isActive && (
                        <span className="absolute -bottom-[1px] left-1/2 -translate-x-1/2 w-5 h-[2px] bg-emerald-300 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* ─── RIGHT: CONTROLS ─── */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {isLanding ? (
                <div className="flex items-center gap-2.5">
                  <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-white/8 border border-white/10 rounded-lg text-xs font-medium text-emerald-200 whitespace-nowrap backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 signal-pulse" />
                    <span className="font-semibold text-white">5 Campuses Live</span>
                  </div>

                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-sm shadow-md hover:shadow-lg whitespace-nowrap transition-all cursor-pointer group"
                    style={{ boxShadow: '0 2px 12px rgba(255,255,255,0.2), 0 0 20px rgba(52,211,153,0.1)' }}
                  >
                    <span>Launch Platform</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                    aria-label="Toggle navigation menu"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              ) : (
                <>
                  {/* Live telemetry pill */}
                  <div className="hidden 2xl:flex items-center gap-2 px-3 py-1.5 bg-white/8 border border-white/10 rounded-lg text-xs text-emerald-200 whitespace-nowrap backdrop-blur-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 signal-pulse" />
                    <span className="font-bold text-white">LIVE</span>
                    <span className="text-emerald-400/40">·</span>
                    <span className="font-mono text-xs text-emerald-300/80">50.02 Hz</span>
                  </div>

                  {/* Facility Scope Selector */}
                  <div className="relative shrink-0" ref={facilityRef}>
                    <button
                      onClick={() => setShowFacilityMenu(!showFacilityMenu)}
                      className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg text-xs font-medium text-white transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs"
                      title="Select facility monitoring scope"
                    >
                      <Building2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                      <span className="truncate max-w-[90px] sm:max-w-[130px] text-left">
                        {selectedFacility ? selectedFacility.name : 'All Facilities'}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-emerald-300 shrink-0 transition-transform duration-200 ${showFacilityMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showFacilityMenu && (
                      <div
                        className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)' }}
                      >
                        <div className="px-4 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                          Facility Telemetry Scope
                        </div>
                        <button
                          onClick={() => {
                            onSelectFacility('all');
                            setShowFacilityMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left cursor-pointer transition-all ${
                            selectedFacilityId === 'all'
                              ? 'bg-emerald-50 text-emerald-800 font-semibold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-slate-900">All Monitored Facilities</div>
                            <div className="text-[11px] text-slate-400 mt-0.5">Consolidated portfolio telemetry</div>
                          </div>
                          {selectedFacilityId === 'all' && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                        <div className="my-0.5 border-t border-slate-100" />
                        {facilities.map((fac) => (
                          <button
                            key={fac.id}
                            onClick={() => {
                              onSelectFacility(fac.id);
                              setShowFacilityMenu(false);
                            }}
                            className={`w-full flex items-center justify-between px-4 py-2 text-xs text-left cursor-pointer transition-all ${
                              selectedFacilityId === fac.id
                                ? 'bg-emerald-50 text-emerald-800 font-semibold'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div>
                              <div className="font-medium text-slate-900">{fac.name}</div>
                              <div className="text-[11px] text-slate-400">
                                {fac.location} · {fac.currentConsumptionKw} kW
                              </div>
                            </div>
                            {selectedFacilityId === fac.id && (
                              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Notification Bell */}
                  <div className="relative shrink-0" ref={notifRef}>
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="p-2 text-emerald-100/80 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer relative"
                      aria-label="View notifications"
                    >
                      <Bell className="w-[18px] h-[18px]" />
                      {unreadAlertCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-emerald-800 shadow-sm" />
                      )}
                    </button>

                    {showNotifications && (
                      <div
                        className="absolute right-0 mt-2 w-80 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)' }}
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-900">Active Telemetry Alerts</span>
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            {unreadAlertCount} Pending
                          </span>
                        </div>
                        <div className="divide-y divide-slate-50 max-h-72 overflow-y-auto">
                          <div
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigate('alerts');
                            }}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-rose-600">CRITICAL PEAK SPIKE</span>
                              <span className="text-slate-400">14:15</span>
                            </div>
                            <p className="text-xs font-medium text-slate-800 mt-1">Bangalore Tech Park Campus</p>
                            <p className="text-[11px] text-slate-500">Inrush draw at 482.0 kW exceeded sanctioned 460 kW cap.</p>
                          </div>
                          <div
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigate('recommendations');
                            }}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-emerald-700">ENERGY SAVINGS RULE</span>
                              <span className="text-slate-400">13:30</span>
                            </div>
                            <p className="text-xs font-medium text-slate-800 mt-1">Thermal Pre-cooling Trigger</p>
                            <p className="text-[11px] text-slate-500">Save ₹33,600 prior to 14:00 TOD peak window.</p>
                          </div>
                        </div>
                        <div className="p-2 border-t border-slate-100 text-center">
                          <button
                            onClick={() => {
                              setShowNotifications(false);
                              onNavigate('alerts');
                            }}
                            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer"
                          >
                            View All Incidents in Alerts Console →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Profile Avatar / Menu */}
                  <div className="relative shrink-0" ref={profileRef}>
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition-all cursor-pointer whitespace-nowrap backdrop-blur-xs"
                      aria-label="User Account"
                    >
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-300 to-emerald-400 text-emerald-950 flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                        {user.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <span className="hidden sm:inline font-medium text-white text-xs">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown className={`w-3 h-3 text-emerald-300 hidden sm:block transition-transform duration-200 ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showProfileMenu && (
                      <div
                        className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-200/80 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-700"
                        style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05)' }}
                      >
                        <div className="px-4 py-3 border-b border-slate-100">
                          <p className="text-sm font-bold text-slate-900">{user.name}</p>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                          <span className="inline-block mt-2 text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded-full">
                            Enterprise Facility Lead
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onNavigate('settings');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 text-left cursor-pointer transition-colors"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Account Profile</span>
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onNavigate('settings');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 text-left cursor-pointer transition-colors"
                        >
                          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                          <span>Threshold Policies</span>
                        </button>
                        <div className="my-1 border-t border-slate-100" />
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs text-rose-600 hover:bg-rose-50 text-left cursor-pointer font-semibold transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Mobile / Tablet Hamburger */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer shrink-0"
                    aria-label="Toggle navigation menu"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* ─── MOBILE DROPDOWN DRAWER ─── */}
          {mobileMenuOpen && (
            <div className="border-t border-white/10 py-3 pb-5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
              {isLanding ? (
                <div className="space-y-1">
                  {['About GreenGrid', 'Key Features', 'How It Works', 'Environmental Impact', 'Operational Metrics'].map((label) => {
                    const href = `#${label.split(' ').slice(-2).join('-').toLowerCase()}`;
                    return (
                      <a
                        key={label}
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-2.5 text-sm font-medium text-emerald-100/80 hover:bg-white/8 rounded-lg transition-colors"
                      >
                        {label}
                      </a>
                    );
                  })}
                  <button
                    onClick={() => {
                      onNavigate('facilities');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-emerald-100/80 hover:bg-white/8 rounded-lg cursor-pointer transition-colors"
                  >
                    Monitored Campuses
                  </button>
                  <div className="pt-2 px-2">
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-emerald-700 bg-white hover:bg-emerald-50 rounded-lg shadow-md cursor-pointer transition-all"
                    >
                      <span>Launch Live Platform</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      onNavigate('landing');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-emerald-200/80 hover:bg-white/8 rounded-lg text-left transition-colors"
                  >
                    <Logo variant="light" size="sm" showBadge={false} />
                    <span>Return to Product Overview</span>
                  </button>

                  <div className="pt-1 border-t border-white/10 my-1.5" />

                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      activePage === item.id ||
                      (item.id === 'facilities' && activePage === 'facility-detail');
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white/15 text-white font-semibold ring-1 ring-white/20'
                            : 'text-emerald-100/80 hover:bg-white/8'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-200/60'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-500 text-white">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}

                  <div className="pt-3 mt-2 border-t border-white/10 px-3">
                    <button
                      onClick={() => {
                        onLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold text-rose-200 bg-rose-950/60 hover:bg-rose-950 border border-rose-800/60 rounded-lg transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
