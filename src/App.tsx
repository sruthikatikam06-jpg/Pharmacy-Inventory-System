import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { AuthModal } from './components/AuthModal';

import { DashboardView } from './components/DashboardView';
import { MedicineManagementView } from './components/MedicineManagementView';
import { PosBillingView } from './components/PosBillingView';
import { InventoryStockView } from './components/InventoryStockView';
import { PurchaseOrdersView } from './components/PurchaseOrdersView';
import { SuppliersCustomersView } from './components/SuppliersCustomersView';
import { ReportsExportView } from './components/ReportsExportView';
import { AiCommandCenterView } from './components/AiCommandCenterView';
import { ActivityLogsView } from './components/ActivityLogsView';

const MainContent: React.FC = () => {
  const { activeTab, toasts, removeToast } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex font-sans selection:bg-emerald-500 selection:text-white">
      {/* Navigation Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Header */}
        <Header onOpenAuth={() => setShowAuthModal(true)} />

        {/* Dynamic View Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {activeTab === 'dashboard' && <DashboardView />}
          {activeTab === 'medicines' && <MedicineManagementView />}
          {activeTab === 'pos_billing' && <PosBillingView />}
          {activeTab === 'inventory' && <InventoryStockView />}
          {activeTab === 'orders' && <PurchaseOrdersView />}
          {activeTab === 'suppliers' && <SuppliersCustomersView initialTab="suppliers" />}
          {activeTab === 'customers' && <SuppliersCustomersView initialTab="customers" />}
          {activeTab === 'reports' && <ReportsExportView />}
          {activeTab === 'ai_insights' && <AiCommandCenterView />}
          {activeTab === 'activity_logs' && <ActivityLogsView />}
        </main>
      </div>

      {/* Toast System Notifications */}
      <div className="fixed bottom-5 right-5 z-50 space-y-2 max-w-sm pointer-events-none">
        {(toasts || []).map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={removeToast} />
          </div>
        ))}
      </div>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
