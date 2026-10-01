import React, { useState, useEffect } from 'react';
import {
  INITIAL_USER,
  INITIAL_FACILITIES,
  INITIAL_ALERTS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_BILLS,
} from './data/mockData';
import { api } from './services/api';
import { Navbar } from './components/common/Navbar';
import { ToastContainer } from './components/common/Toast';
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [activePage, setActivePage] = useState('landing');
  const [selectedFacilityId, setSelectedFacilityId] = useState('all');
  const [facilities, setFacilities] = useState(INITIAL_FACILITIES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [recommendations, setRecommendations] = useState(INITIAL_RECOMMENDATIONS);
  const [bills, setBills] = useState(INITIAL_BILLS);
  const [user, setUser] = useState(INITIAL_USER);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function validateSession() {
      const token = localStorage.getItem('greengrid_access_token');
      if (!token) {
        if (isMounted) {
          setIsLoggedIn(false);
          setIsAuthReady(true);
        }
        return;
      }

      try {
        const profile = await api.auth.getProfile();
        if (!isMounted) return;
        setIsLoggedIn(Boolean(profile));
      } catch (err) {
        if (!isMounted) return;
        api.auth.logout();
        setIsLoggedIn(false);
      } finally {
        if (isMounted) setIsAuthReady(true);
      }
    }

    async function loadBackendData() {
      try {
        const [liveFacilities, liveAlerts, liveRecs, liveBills] = await Promise.all([
          api.facilities.getAll(),
          api.alerts.getAll(),
          api.recommendations.getAll(),
          api.billing.getAll(),
        ]);
        if (!isMounted) return;
        if (liveFacilities && liveFacilities.length > 0) setFacilities(liveFacilities);
        if (liveAlerts && liveAlerts.length > 0) setAlerts(liveAlerts);
        if (liveRecs && liveRecs.length > 0) setRecommendations(liveRecs);
        if (liveBills && liveBills.length > 0) setBills(liveBills);
      } catch (err) {
        console.info('Backend initial sync notice:', err);
      }
    }

    validateSession();
    loadBackendData();
    return () => {
      isMounted = false;
    };
  }, []);

  const addToast = (type, title, description) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Facility handlers
  const handleAddFacility = async (newFacility) => {
    setFacilities((prev) => [newFacility, ...prev]);
    addToast(
      'success',
      'Facility Registered',
      `${newFacility.name} has been enrolled for smart grid telemetry monitoring.`
    );
    try {
      await api.facilities.create(newFacility);
    } catch (e) {
      console.warn('Backend sync failed:', e);
    }
  };

  const handleSelectFacilityDetail = (facilityId) => {
    setSelectedFacilityId(facilityId);
    setActivePage('facility-detail');
  };

  // Alert handlers
  const handleResolveAlert = async (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Resolved' } : a))
    );
    const alert = alerts.find((a) => a.id === alertId);
    addToast(
      'success',
      'Alert Resolved',
      `Anomaly "${alert?.title || 'Alert'}" was verified and marked resolved.`
    );
    try {
      await api.alerts.updateStatus(alertId, 'Resolved');
    } catch (e) {
      console.warn('Backend alert update failed:', e);
    }
  };

  const handleAcknowledgeAlert = async (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'Acknowledged' } : a))
    );
    addToast('info', 'Alert Acknowledged', 'Facility operations team notified.');
    try {
      await api.alerts.updateStatus(alertId, 'Acknowledged');
    } catch (e) {
      console.warn('Backend alert update failed:', e);
    }
  };

  const handleTriggerTestAlert = async () => {
    try {
      const serverAlert = await api.alerts.triggerTest();
      if (serverAlert) {
        setAlerts((prev) => [serverAlert, ...prev]);
        addToast('warning', 'New Telemetry Alert', serverAlert.title);
        return;
      }
    } catch (e) {
      // fallback
    }

    const testAlert = {
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
  const handleApplyRecommendation = async (recId) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, isApplied: true } : r))
    );
    const rec = recommendations.find((r) => r.id === recId);
    addToast(
      'success',
      'Automation Rule Applied',
      `BMS setpoint updated. Estimated monthly savings: ₹${(rec?.estimatedCostSavingInr || 0).toLocaleString()}.`
    );
    try {
      await api.recommendations.toggleApplied(recId, true);
    } catch (e) {
      console.warn('Backend recommendation update failed:', e);
    }
  };

  // Bill handlers
  const handleDownloadBill = (invoiceNo) => {
    addToast(
      'success',
      'Statement Exported',
      `Electricity utility bill ${invoiceNo} generated as printable document.`
    );
  };

  const handlePayBill = (billId) => {
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'Paid' } : b))
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

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-900">
        <div className="text-sm text-slate-500">Checking authentication…</div>
      </div>
    );
  }

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
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900 flex flex-col font-sans selection:bg-emerald-700 selection:text-white greengrid-pattern">
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
          api.auth.logout();
          setIsLoggedIn(false);
          setIsAuthReady(true);
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
