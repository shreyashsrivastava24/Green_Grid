import React, { useState } from 'react';
import { PageId, Facility, Alert, Recommendation, Bill, UserProfile } from './types';
import {
  INITIAL_USER,
  INITIAL_FACILITIES,
  INITIAL_ALERTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_BILLS,
} from './data/mockData';
import { Navbar } from './components/common/Navbar';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { LoginPage } from './components/pages/LoginPage';
import { LandingPage } from './components/pages/LandingPage';
import { DashboardPage } from './components/pages/DashboardPage';
import { FacilitiesPage } from './components/pages/FacilitiesPage';
import { FacilityDetailPage } from './components/pages/FacilityDetailPage';
import { EnergyAnalyticsPage } from './components/pages/EnergyAnalyticsPage';
import { BillingPage } from './components/pages/BillingPage';
import { RenewableEnergyPage } from './components/pages/RenewableEnergyPage';
import { AlertsPage } from './components/pages/AlertsPage';
import { RecommendationsPage } from './components/pages/RecommendationsPage';
import { SettingsPage } from './components/pages/SettingsPage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('all');
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [bills, setBills] = useState<Bill[]>(INITIAL_BILLS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'warning' | 'info', title: string, description?: string) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Facility handlers
  const handleAddFacility = (newFacility: Facility) => {
    setFacilities((prev) => [newFacility, ...prev]);
    addToast(
      'success',
      'Facility Registered',
      `${newFacility.name} has been enrolled for smart grid telemetry monitoring.`
    );
  };

  const handleSelectFacilityDetail = (facilityId: string) => {
    setSelectedFacilityId(facilityId);
    setActivePage('facility-detail');
  };

  // Alert handlers
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' as const } : a))
    );
    const alert = alerts.find((a) => a.id === alertId);
    addToast(
      'success',
      'Alert Resolved',
      `Anomaly "${alert?.title || 'Alert'}" was verified and marked resolved.`
    );
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' as const } : a))
    );
    addToast('info', 'Alert Acknowledged', 'Facility operations team notified.');
  };

  const handleTriggerTestAlert = () => {
    const testAlert: Alert = {
      id: `alt-${Date.now().toString().slice(-4)}`,
      title: 'Sudden Inrush Current Spike',
      facilityId: 'fac-blr-01',
      facilityName: 'Bangalore Tech Park Campus',
      severity: 'Warning',
      status: 'Active',
      timestamp: 'Just now',
      currentValue: '482.0 kW',
      thresholdValue: '460.0 kW cap',
      description: 'Chiller compressor motor #2 started with excessive phase angle current draw.',
      metric: 'Transient Inrush Draw',
    };
    setAlerts((prev) => [testAlert, ...prev]);
    addToast('warning', 'New Telemetry Alert', 'Sudden Inrush Current Spike at Bangalore Tech Park.');
  };

  // Recommendation handlers
  const handleApplyRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, isApplied: true } : r))
    );
    const rec = recommendations.find((r) => r.id === recId);
    addToast(
      'success',
      'Automation Rule Applied',
      `BMS setpoint updated. Estimated monthly savings: ₹${(rec?.estimatedCostSavingInr || 0).toLocaleString()}.`
    );
  };

  // Bill handlers
  const handleDownloadBill = (invoiceNo: string) => {
    addToast(
      'success',
      'Statement Exported',
      `Electricity utility bill ${invoiceNo} generated as printable document.`
    );
  };

  const handlePayBill = (billId: string) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'Paid' as const } : b))
    );
    addToast(
      'success',
      'Payment Recorded',
      'DISCOM utility invoice settled via Automated Clearing House (ACH).'
    );
  };

  // Active facility for detail view
  const currentDetailFacility =
    facilities.find((f) => f.id === selectedFacilityId) || facilities[0];

  const unreadAlertCount = alerts.filter((a) => a.status === 'Active').length;

  // If user is not logged in, or explicitly on 'login' page
  if (!isLoggedIn || activePage === 'login') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <LoginPage
          onLogin={() => {
            setIsLoggedIn(true);
            setActivePage('dashboard');
            addToast('success', 'Welcome Back', `Logged in as ${user.name}`);
          }}
        />
        <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfbfa] text-slate-900 flex flex-col font-sans selection:bg-green-700 selection:text-white greengrid-pattern">
      {/* Top Navbar */}
      <Navbar
        user={user}
        facilities={facilities}
        selectedFacilityId={selectedFacilityId}
        onSelectFacility={(id) => {
          setSelectedFacilityId(id);
          if (id !== 'all') {
            setActivePage('facility-detail');
          } else if (activePage === 'facility-detail') {
            setActivePage('facilities');
          }
        }}
        activePage={activePage}
        onNavigate={setActivePage}
        onLogout={() => {
          setIsLoggedIn(false);
          setActivePage('login');
        }}
        unreadAlertCount={unreadAlertCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Content Viewport: Full-width for Landing, Centered container for Platform tools */}
      {activePage === 'landing' ? (
        <main className="flex-1 w-full">
          <LandingPage
            onNavigate={setActivePage}
            onSelectFacilityDetail={handleSelectFacilityDetail}
            facilities={facilities}
          />
        </main>
      ) : (
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activePage === 'dashboard' && (
            <DashboardPage
              facilities={facilities}
              alerts={alerts}
              recommendations={recommendations}
              onNavigate={setActivePage}
              onSelectFacilityDetail={handleSelectFacilityDetail}
              onResolveAlert={handleResolveAlert}
              onApplyRecommendation={handleApplyRecommendation}
            />
          )}

          {activePage === 'facilities' && (
            <FacilitiesPage
              facilities={facilities}
              onSelectFacilityDetail={handleSelectFacilityDetail}
              onAddFacility={handleAddFacility}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'facility-detail' && (
            <FacilityDetailPage
              facility={currentDetailFacility}
              facilities={facilities}
              alerts={alerts}
              recommendations={recommendations}
              onBack={() => setActivePage('facilities')}
              onSelectFacility={handleSelectFacilityDetail}
              onNavigate={setActivePage}
              onResolveAlert={handleResolveAlert}
              onApplyRecommendation={handleApplyRecommendation}
            />
          )}

          {activePage === 'analytics' && (
            <EnergyAnalyticsPage
              onExport={(format) =>
                addToast('success', 'Report Exported', `${format} successfully prepared and downloaded.`)
              }
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'billing' && (
            <BillingPage
              bills={bills}
              onDownloadBill={handleDownloadBill}
              onPayBill={handlePayBill}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'renewable' && <RenewableEnergyPage onNavigate={setActivePage} />}

          {activePage === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onTriggerTestAlert={handleTriggerTestAlert}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'recommendations' && (
            <RecommendationsPage
              recommendations={recommendations}
              onApplyRecommendation={handleApplyRecommendation}
              onNavigate={setActivePage}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              user={user}
              onUpdateUser={(updated) => {
                setUser(updated);
                addToast('success', 'Profile Updated', 'User profile changes saved successfully.');
              }}
              onSaveNotification={() =>
                addToast(
                  'success',
                  'Settings Saved',
                  'Energy thresholds and alert notification policies updated.'
                )
              }
              onNavigate={setActivePage}
            />
          )}
        </main>
      )}

      {/* Global Interactive Notification Toasts */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
