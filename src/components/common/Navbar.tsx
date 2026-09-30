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
import { Facility, UserProfile, PageId } from '../../types';
import { Logo } from './Logo';

interface NavbarProps {
  user: UserProfile;
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (facilityId: string) => void;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  unreadAlertCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

interface NavLinkItem {
  id: PageId;
  label: string;
  badge?: number;
  icon: React.ComponentType<{ className?: string }>;
}

export const Navbar: React.FC<NavbarProps> = ({
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

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const facilityRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
      if (facilityRef.current && !facilityRef.current.contains(e.target as Node)) {
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

  const navItems: NavLinkItem[] = [
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
    <header className="sticky top-0 z-50 bg-[#15803d] border-b border-[#14532d]/40 shadow-xs select-none w-full">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] sm:h-[76px] gap-2 sm:gap-4">
          
          {/* ========================================================
              LEFT: BRAND LOGO
              ======================================================== */}
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

          {/* ========================================================
              CENTER: NAVIGATION LINKS (Strict whitespace-nowrap)
              ======================================================== */}
          {isLanding ? (
            /* Landing Page Navigation Links (Visible >= 1024px lg) */
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              <a
                href="#about"
                className="px-3 py-2 text-sm font-semibold text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg whitespace-nowrap transition-colors"
              >
                About
              </a>
              <a
                href="#features"
                className="px-3 py-2 text-sm font-semibold text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg whitespace-nowrap transition-colors"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="px-3 py-2 text-sm font-semibold text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg whitespace-nowrap transition-colors"
              >
                How It Works
              </a>
              <a
                href="#impact"
                className="px-3 py-2 text-sm font-semibold text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg whitespace-nowrap transition-colors"
              >
                Impact
              </a>
              <a
                href="#stats"
                className="px-3 py-2 text-sm font-semibold text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg whitespace-nowrap transition-colors"
              >
                Metrics
              </a>
              <button
                onClick={() => onNavigate('facilities')}
                className="px-3 py-2 text-sm font-semibold text-emerald-100 hover:text-white hover:bg-white/10 rounded-lg whitespace-nowrap transition-colors cursor-pointer"
              >
                Campuses
              </button>
            </nav>
          ) : (
            /* Platform Console Navigation Links (Visible >= 1280px xl) */
            <nav className="hidden xl:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive =
                  activePage === item.id ||
                  (item.id === 'facilities' && activePage === 'facility-detail');
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`relative flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 text-xs xl:text-sm font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#14532d] text-white font-bold shadow-xs ring-1 ring-emerald-400/40'
                        : 'text-emerald-100 hover:text-white hover:bg-green-800/60'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white leading-tight">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* ========================================================
              RIGHT: CONTROLS & HAMBURGER (Never overflows)
              ======================================================== */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {isLanding ? (
              /* Landing Mode CTA Controls */
              <div className="flex items-center gap-2.5">
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-[#14532d]/80 border border-green-600/40 rounded-lg text-xs font-semibold text-emerald-200 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 signal-pulse" />
                  <span className="font-semibold text-white">5 Campuses Live</span>
                </div>

                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white hover:bg-emerald-50 text-[#15803d] font-bold text-sm shadow-xs hover:shadow whitespace-nowrap transition-all cursor-pointer group"
                >
                  <span>Launch Live Platform</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>

                {/* Hamburger menu button for Landing mode on < lg */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 text-white hover:bg-[#166534] rounded-lg transition-colors cursor-pointer"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            ) : (
              /* Platform Console Controls */
              <>
                {/* Live telemetry pill: Visible on 2xl+ */}
                <div className="hidden 2xl:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#14532d] border border-green-600/40 rounded-lg text-xs text-emerald-200 whitespace-nowrap">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 signal-pulse" />
                  <span className="font-bold text-white">LIVE</span>
                  <span className="text-emerald-400/60">·</span>
                  <span className="font-mono text-xs">50.02 Hz</span>
                </div>

                {/* Facility Scope Selector */}
                <div className="relative shrink-0" ref={facilityRef}>
                  <button
                    onClick={() => setShowFacilityMenu(!showFacilityMenu)}
                    className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-[#166534] hover:bg-[#14532d] border border-green-600/50 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer whitespace-nowrap"
                    title="Select facility monitoring scope"
                  >
                    <Building2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                    <span className="truncate max-w-[90px] sm:max-w-[130px] text-left">
                      {selectedFacility ? selectedFacility.name : 'All Facilities'}
                    </span>
                    <ChevronDown className="w-3 h-3 text-emerald-300 shrink-0" />
                  </button>

                  {showFacilityMenu && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3.5 py-1 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                        Facility Telemetry Scope
                      </div>
                      <button
                        onClick={() => {
                          onSelectFacility('all');
                          setShowFacilityMenu(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-xs text-left cursor-pointer transition-colors ${
                          selectedFacilityId === 'all'
                            ? 'bg-green-50 text-green-800 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">All Monitored Facilities</div>
                          <div className="text-xs text-slate-500">Consolidated portfolio telemetry</div>
                        </div>
                        {selectedFacilityId === 'all' && (
                          <Check className="w-4 h-4 text-green-600 shrink-0" />
                        )}
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      {facilities.map((fac) => (
                        <button
                          key={fac.id}
                          onClick={() => {
                            onSelectFacility(fac.id);
                            setShowFacilityMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left cursor-pointer transition-colors ${
                            selectedFacilityId === fac.id
                              ? 'bg-green-50 text-green-800 font-bold'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-medium text-slate-900">{fac.name}</div>
                            <div className="text-xs text-slate-500">
                              {fac.location} · {fac.currentConsumptionKw} kW
                            </div>
                          </div>
                          {selectedFacilityId === fac.id && (
                            <Check className="w-4 h-4 text-green-600 shrink-0" />
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
                    className="p-2 text-emerald-100 hover:text-white hover:bg-[#166534] rounded-lg transition-colors cursor-pointer relative"
                    aria-label="View notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadAlertCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#15803d]" />
                    )}
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                        <span className="text-xs font-bold text-slate-900">Active Telemetry Alerts</span>
                        <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          {unreadAlertCount} Pending
                        </span>
                      </div>
                      <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
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
                          <p className="text-xs text-slate-500">Inrush draw at 482.0 kW exceeded sanctioned 460 kW cap.</p>
                        </div>
                        <div
                          onClick={() => {
                            setShowNotifications(false);
                            onNavigate('recommendations');
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-green-700">ENERGY SAVINGS RULE</span>
                            <span className="text-slate-400">13:30</span>
                          </div>
                          <p className="text-xs font-medium text-slate-800 mt-1">Thermal Pre-cooling Trigger</p>
                          <p className="text-xs text-slate-500">Save ₹33,600 prior to 14:00 TOD peak window.</p>
                        </div>
                      </div>
                      <div className="p-2 border-t border-slate-100 text-center">
                        <button
                          onClick={() => {
                            setShowNotifications(false);
                            onNavigate('alerts');
                          }}
                          className="text-xs font-semibold text-green-700 hover:text-green-800 cursor-pointer"
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
                    className="flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 bg-[#166534] hover:bg-[#14532d] border border-green-600/50 rounded-lg transition-colors cursor-pointer whitespace-nowrap"
                    aria-label="User Account"
                  >
                    <div className="w-6 h-6 rounded-md bg-emerald-400 text-green-950 flex items-center justify-center text-xs font-bold shrink-0">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <span className="hidden sm:inline font-semibold text-white text-xs">
                      {user.name.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-emerald-300 hidden sm:block" />
                  </button>

                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 text-slate-700">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-xs bg-green-50 text-green-700 border border-green-200 font-semibold px-2 py-0.5 rounded-full">
                          Enterprise Facility Lead
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onNavigate('settings');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
                      >
                        <User className="w-3.5 h-3.5 text-slate-500" />
                        <span>Account Profile</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onNavigate('settings');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left cursor-pointer"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                        <span>Threshold Policies</span>
                      </button>
                      <div className="my-1 border-t border-slate-100" />
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          onLogout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left cursor-pointer font-semibold"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile / Tablet Hamburger Menu Button on Platform mode (< xl) */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-2 text-white hover:bg-[#166534] rounded-lg transition-colors cursor-pointer shrink-0"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </>
            )}
          </div>
        </div>

        {/* ========================================================
            MOBILE / TABLET DROPDOWN DRAWER
            ======================================================== */}
        {mobileMenuOpen && (
          <div className="border-t border-green-800 py-3 pb-5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
            {isLanding ? (
              <div className="space-y-1">
                <a
                  href="#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-[#166534] rounded-lg"
                >
                  About GreenGrid
                </a>
                <a
                  href="#features"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-[#166534] rounded-lg"
                >
                  Key Features
                </a>
                <a
                  href="#how-it-works"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-[#166534] rounded-lg"
                >
                  How It Works
                </a>
                <a
                  href="#impact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-[#166534] rounded-lg"
                >
                  Environmental Impact
                </a>
                <a
                  href="#stats"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-[#166534] rounded-lg"
                >
                  Operational Metrics
                </a>
                <button
                  onClick={() => {
                    onNavigate('facilities');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2.5 text-sm font-semibold text-emerald-100 hover:bg-[#166534] rounded-lg cursor-pointer"
                >
                  Monitored Campuses
                </button>
                <div className="pt-2 px-2">
                  <button
                    onClick={() => {
                      onNavigate('dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-green-800 bg-white hover:bg-emerald-50 rounded-lg shadow-sm cursor-pointer"
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
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-emerald-200 hover:bg-[#166534] rounded-lg text-left"
                >
                  <Logo variant="light" size="sm" showBadge={false} />
                  <span>Return to Product Overview</span>
                </button>

                <div className="pt-1 border-t border-green-800/80 my-1.5" />

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
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-[#14532d] text-white font-bold ring-1 ring-emerald-400/40'
                          : 'text-emerald-100 hover:bg-[#166534]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-200'}`} />
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

                <div className="pt-3 mt-2 border-t border-green-800 px-3">
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
    </header>
  );
};
