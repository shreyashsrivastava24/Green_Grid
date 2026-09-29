import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  User,
  LogOut,
  SlidersHorizontal,
  Check,
  Zap,
  Menu,
} from 'lucide-react';
import { Facility, UserProfile, PageId } from '../../types';

interface NavbarProps {
  user: UserProfile;
  facilities: Facility[];
  selectedFacilityId: string;
  onSelectFacility: (facilityId: string) => void;
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  onLogout: () => void;
  unreadAlertCount: number;
  onToggleMobileSidebar: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
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
  onToggleMobileSidebar,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFacilityMenu, setShowFacilityMenu] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const facilityRef = useRef<HTMLDivElement>(null);

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

  const selectedFacility = facilities.find((f) => f.id === selectedFacilityId);

  const sectionCodes: Record<PageId, { index: string; title: string }> = {
    login: { index: '00', title: 'AUTHENTICATION' },
    dashboard: { index: '01', title: 'CONTROL CENTER' },
    facilities: { index: '02', title: 'FACILITY BOARD' },
    'facility-detail': {
      index: '02.1',
      title: selectedFacility ? selectedFacility.name.toUpperCase() : 'FACILITY CONTROL',
    },
    analytics: { index: '03', title: 'LOAD ANALYTICS' },
    billing: { index: '04', title: 'ENERGY FINANCE' },
    renewable: { index: '05', title: 'SOLAR DISPATCH' },
    alerts: { index: '06', title: 'INCIDENT LOG' },
    recommendations: { index: '07', title: 'AI OPTIMIZATION' },
    settings: { index: '08', title: 'CONFIGURATION' },
  };

  const current = sectionCodes[activePage] || { index: '00', title: 'SYSTEM' };

  return (
    <header className="sticky top-0 z-30 bg-[#fbfbfa]/95 backdrop-blur-md border-b border-[#e6e6de] px-4 lg:px-8 py-3 flex items-center justify-between gap-4 font-mono">
      {/* Left zone: Mobile toggle & Section identifier */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-1.5 -ml-1 text-[#101512] hover:bg-[#f0f0ea] rounded transition-colors cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[11px] font-bold text-[#065f46] bg-[#ecfdf5] border border-[#a7f3d0] px-2 py-0.5 rounded-xs">
            {current.index}
          </span>
          <span className="text-xs font-bold text-[#101512] tracking-wider truncate">
            {current.title}
          </span>
          <span className="text-[#a0aaa3] text-xs hidden sm:inline">|</span>
          <span className="text-[11px] text-[#55635a] hidden sm:inline">
            50.02 Hz · NOMINAL
          </span>
        </div>
      </div>

      {/* Center Zone: Clean Search Console */}
      <div className="flex-1 max-w-sm hidden md:block">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#7e8881] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search submeters, feeders, campuses [⌘K]..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#f4f4ee] border border-[#e2e2d8] rounded-xs pl-8 pr-8 py-1.5 text-xs text-[#101512] placeholder-[#8e9892] focus:outline-hidden focus:border-[#059669] focus:bg-white transition-all"
          />
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#7e8881] bg-[#e8e8e0] px-1 py-0.2 rounded-xs">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right Zone: LIVE Indicator + Facility Scope + Alerts + Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-xs">
        {/* Live Status */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f4ee] border border-[#e2e2d8] rounded-xs text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] signal-pulse" />
          <span className="font-bold text-[#059669]">LIVE</span>
          <span className="text-[#8e9892]">·</span>
          <span className="text-[#55635a]">14:42 IST</span>
        </div>

        {/* Facility Selector */}
        <div className="relative" ref={facilityRef}>
          <button
            onClick={() => setShowFacilityMenu(!showFacilityMenu)}
            className="flex items-center gap-2 px-2.5 py-1.5 bg-[#f4f4ee] hover:bg-[#eaeae2] border border-[#e2e2d8] rounded-xs text-xs text-[#101512] transition-colors cursor-pointer"
          >
            <Building2 className="w-3.5 h-3.5 text-[#059669] shrink-0" />
            <span className="truncate max-w-[110px] sm:max-w-[150px] font-semibold text-left">
              {selectedFacility ? selectedFacility.name : 'All Monitored Sites'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#7e8881] shrink-0" />
          </button>

          {showFacilityMenu && (
            <div className="absolute right-0 mt-1.5 w-72 bg-white rounded-xs shadow-xl border border-[#d8d8ce] py-1.5 z-40">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[#7e8881] uppercase tracking-wider border-b border-[#f0f0ea]">
                FACILITY MONITORING SCOPE
              </div>
              <button
                onClick={() => {
                  onSelectFacility('all');
                  setShowFacilityMenu(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left cursor-pointer transition-colors ${
                  selectedFacilityId === 'all'
                    ? 'bg-[#eef7f2] text-[#0c3822] font-bold border-l-2 border-[#059669]'
                    : 'text-[#101512] hover:bg-[#f6f6f2]'
                }`}
              >
                <div>
                  <div className="font-bold">All Facilities (Consolidated)</div>
                  <div className="text-[10px] text-[#7e8881]">186.0 MWh Monitored</div>
                </div>
                {selectedFacilityId === 'all' && <Check className="w-3.5 h-3.5 text-[#059669]" />}
              </button>
              <div className="my-1 border-t border-[#f0f0ea]" />
              {facilities.map((fac) => (
                <button
                  key={fac.id}
                  onClick={() => {
                    onSelectFacility(fac.id);
                    setShowFacilityMenu(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left cursor-pointer transition-colors ${
                    selectedFacilityId === fac.id
                      ? 'bg-[#eef7f2] text-[#0c3822] font-bold border-l-2 border-[#059669]'
                      : 'text-[#101512] hover:bg-[#f6f6f2]'
                  }`}
                >
                  <div className="truncate pr-2">
                    <div className="font-semibold truncate">{fac.name}</div>
                    <div className="text-[10px] text-[#7e8881] truncate">
                      {fac.currentConsumptionKw.toFixed(1)} kW · {fac.location}
                    </div>
                  </div>
                  {selectedFacilityId === fac.id && (
                    <Check className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operational Alerts Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 text-[#101512] hover:bg-[#f4f4ee] border border-[#e2e2d8] rounded-xs transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#e11d48] rounded-full signal-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-1.5 w-80 bg-white rounded-xs shadow-2xl border border-[#d8d8ce] py-2 z-40">
              <div className="px-4 py-2 border-b border-[#f0f0ea] flex items-center justify-between">
                <span className="text-xs font-bold text-[#101512]">
                  INCIDENT LOG ({unreadAlertCount})
                </span>
                <span
                  className="text-[10px] text-[#059669] hover:underline cursor-pointer font-bold"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('alerts');
                  }}
                >
                  FULL TIMELINE →
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-[#f0f0ea]">
                <div
                  className="px-4 py-3 hover:bg-[#f9f9f6] cursor-pointer"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('alerts');
                  }}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#e11d48]">CRITICAL OVERRUN</span>
                    <span className="text-[#8e9892]">14:42</span>
                  </div>
                  <p className="text-xs font-bold text-[#101512] mt-1">Gurugram Tower Breached Cap</p>
                  <p className="text-[11px] text-[#55635a]">310.8 kW draw / 290 kW sanctioned (+7.2%)</p>
                </div>
                <div
                  className="px-4 py-3 hover:bg-[#f9f9f6] cursor-pointer"
                  onClick={() => {
                    setShowNotifications(false);
                    onNavigate('recommendations');
                  }}
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-[#059669]">AI OPPORTUNITY</span>
                    <span className="text-[#8e9892]">13:30</span>
                  </div>
                  <p className="text-xs font-bold text-[#101512] mt-1">Pre-cool Thermal Loop: Bangalore</p>
                  <p className="text-[11px] text-[#55635a]">Save ₹33,600 prior to 14:00 TOD peak window</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar / Credentials */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 pl-2 pr-1.5 py-1 bg-[#f4f4ee] hover:bg-[#eaeae2] border border-[#e2e2d8] rounded-xs transition-colors cursor-pointer"
          >
            <div className="w-5 h-5 rounded-xs bg-[#059669] text-white flex items-center justify-center text-[10px] font-bold">
              {user.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </div>
            <span className="hidden lg:inline font-bold text-[#101512] text-xs">
              {user.name.split(' ')[0]}
            </span>
            <ChevronDown className="w-3 h-3 text-[#7e8881] hidden lg:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-1.5 w-56 bg-white rounded-xs shadow-2xl border border-[#d8d8ce] py-1.5 z-40">
              <div className="px-4 py-2 border-b border-[#f0f0ea]">
                <p className="text-xs font-bold text-[#101512]">{user.name}</p>
                <p className="text-[10px] text-[#7e8881] truncate">{user.email}</p>
                <span className="inline-block mt-1 text-[9px] bg-[#ecfdf5] text-[#065f46] font-bold px-1.5 py-0.5 rounded-xs">
                  ROOT OPERATOR
                </span>
              </div>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigate('settings');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#101512] hover:bg-[#f6f6f2] text-left cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-[#7e8881]" />
                <span>Account Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onNavigate('settings');
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#101512] hover:bg-[#f6f6f2] text-left cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#7e8881]" />
                <span>Threshold Policies</span>
              </button>
              <div className="my-1 border-t border-[#f0f0ea]" />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#e11d48] hover:bg-[#fff1f2] text-left cursor-pointer font-bold"
              >
                <LogOut className="w-3.5 h-3.5 text-[#e11d48]" />
                <span>Sign Out / Lock</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
