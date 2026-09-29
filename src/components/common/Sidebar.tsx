import React from 'react';
import {
  LayoutDashboard,
  Building2,
  Receipt,
  SunMedium,
  AlertTriangle,
  Settings,
  LogOut,
  Zap,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Activity,
  Cpu,
  Radio,
} from 'lucide-react';
import { PageId, UserProfile } from '../../types';

interface SidebarProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  unreadAlertCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  totalKwhThisMonth: number;
  renewablePercentage: number;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  user: UserProfile;
}

interface NavItem {
  id: PageId;
  label: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  tag?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  unreadAlertCount,
  mobileOpen,
  onCloseMobile,
  totalKwhThisMonth,
  renewablePercentage,
  collapsed,
  onToggleCollapsed,
  user,
}) => {
  const navSections: NavSection[] = [
    {
      title: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', code: '01', icon: LayoutDashboard },
        { id: 'facilities', label: 'Facilities', code: '02', icon: Building2 },
        { id: 'analytics', label: 'Energy Analytics', code: '03', icon: Activity },
        { id: 'billing', label: 'Billing & Tariff', code: '04', icon: Receipt },
        { id: 'renewable', label: 'Renewable Energy', code: '05', icon: SunMedium },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          id: 'alerts',
          label: 'Alerts',
          code: '06',
          icon: AlertTriangle,
          badge: unreadAlertCount > 0 ? unreadAlertCount : undefined,
        },
        {
          id: 'recommendations',
          label: 'AI Recommendations',
          code: '07',
          icon: Cpu,
          tag: 'OPT',
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [{ id: 'settings', label: 'Settings', code: '08', icon: Settings }],
    },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-[#101512]/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Fresh Light Editorial Sidebar Chassis */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-[min(264px,88vw)] ${
          collapsed ? 'lg:w-[72px]' : 'lg:w-[264px]'
        } bg-[#f7f8f5] text-[#101512] border-r border-[#e2e4dc] flex flex-col transition-all duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div
          className={`px-5 py-5 border-b border-[#e2e4dc] flex items-center ${
            collapsed ? 'lg:justify-center' : 'justify-between'
          }`}
        >
          <div className={`flex items-center ${collapsed ? 'lg:justify-center' : 'gap-3'}`}>
            <div className="w-8 h-8 rounded-xs bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-[#059669] shrink-0">
              <Zap className="w-4 h-4 fill-[#059669]" />
            </div>
            <div className={collapsed ? 'lg:hidden' : ''}>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-bold tracking-[0.14em] text-[#101512]">GREENGRID</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] signal-pulse" />
              </div>
              <p className="text-[9px] font-mono text-[#059669] font-bold tracking-[0.2em] uppercase">
                SMART ENERGY OS
              </p>
            </div>
          </div>
          <button
            onClick={onToggleCollapsed}
            className="hidden lg:flex text-[#64748b] hover:text-[#101512] p-1 rounded hover:bg-[#eaece4] cursor-pointer"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-[#64748b] hover:text-[#101512] p-1"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.title}>
              {!collapsed && (
                <div className="px-3 pb-2 text-[9px] font-mono font-bold tracking-[0.2em] text-[#64748b] uppercase">
                  {section.title}
                </div>
              )}
              {collapsed && <div className="h-2" />}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`w-full flex items-center ${
                        collapsed ? 'lg:justify-center' : 'justify-between'
                      } px-3 py-2.5 text-xs transition-all group cursor-pointer ${
                        isActive
                          ? 'border-l-2 border-[#059669] bg-[#eaf5ee] text-[#065f46] font-bold shadow-xs'
                          : 'border-l-2 border-transparent text-[#525f56] hover:text-[#101512] hover:bg-[#eeefe9]'
                      }`}
                    >
                      <div className={`flex items-center ${collapsed ? 'lg:justify-center' : 'gap-3'}`}>
                        <span className={`text-[10px] font-mono text-[#8e9e94] ${collapsed ? 'hidden' : ''}`}>
                          {item.code}
                        </span>
                        <Icon
                          className={`w-4 h-4 transition-colors shrink-0 ${
                            isActive ? 'text-[#059669]' : 'text-[#64748b] group-hover:text-[#059669]'
                          }`}
                        />
                        <span className={collapsed ? 'lg:hidden' : 'tracking-tight font-medium'}>
                          {item.label}
                        </span>
                      </div>

                      <div className={collapsed ? 'lg:hidden' : 'flex items-center gap-1.5'}>
                        {item.badge !== undefined && (
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-xs bg-[#e11d48] text-white tabular-nums">
                            {item.badge}
                          </span>
                        )}
                        {item.tag && (
                          <span className="text-[9px] font-mono font-bold tracking-wider px-1.5 py-0.2 rounded-xs bg-[#dcfce7] text-[#15803d]">
                            {item.tag}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Operational Telemetry Widget: Green Energy Mix */}
        <div
          className={`${
            collapsed ? 'lg:hidden' : ''
          } mx-3 mb-3 p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xs space-y-2.5 font-mono`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#166534] flex items-center gap-1.5 uppercase tracking-wider font-bold">
              <Radio className="w-3 h-3 text-[#059669]" />
              Green Energy Mix
            </span>
            <span className="text-xs font-bold text-[#059669] tabular-nums">
              {renewablePercentage}%
            </span>
          </div>

          <div className="w-full bg-[#dcfce7] h-1.5 rounded-xs overflow-hidden">
            <div
              className="bg-[#059669] h-full transition-all duration-500"
              style={{ width: `${renewablePercentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#4b5563] pt-0.5">
            <span>MONTH LOAD</span>
            <span className="font-semibold text-[#101512] tabular-nums">
              {(totalKwhThisMonth / 1000).toFixed(1)} MWh
            </span>
          </div>
        </div>

        {/* User Profile Footer Console */}
        <div
          className={`p-3.5 border-t border-[#e2e4dc] bg-[#f2f3ee] flex items-center ${
            collapsed ? 'lg:justify-center' : 'justify-between'
          }`}
        >
          <div className={`flex items-center gap-2.5 min-w-0 ${collapsed ? 'lg:hidden' : ''}`}>
            <div className="w-7 h-7 rounded-xs bg-[#dcfce7] border border-[#a7f3d0] text-[#065f46] flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
              {user.name.split(' ').map((part) => part[0]).join('')}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-[#101512] truncate">{user.name}</p>
              <p className="text-[9px] font-mono text-[#059669] font-semibold tracking-wider uppercase truncate">
                CHIEF ENERGY OFFICER
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNavClick('login')}
            title="Switch Session"
            className="text-[#64748b] hover:text-[#e11d48] transition-colors p-1.5 rounded cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
