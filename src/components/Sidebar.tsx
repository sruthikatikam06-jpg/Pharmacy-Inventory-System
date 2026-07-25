import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  Boxes,
  Truck,
  Users,
  BarChart3,
  Sparkles,
  History,
  Building2,
  AlertTriangle,
  Flame
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggleCollapse }) => {
  const { activeTab, setActiveTab, medicines } = useApp();

  const lowStockCount = medicines.filter((m) => m.totalStock <= m.minStockAlert).length;
  
  const now = new Date();
  const expiredCount = medicines.reduce((acc, m) => {
    return acc + m.batches.filter((b) => new Date(b.expiryDate) < now).length;
  }, 0);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'medicines',
      label: 'Medicine Catalog',
      icon: Pill,
      badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined,
      badgeColor: 'bg-amber-500'
    },
    { id: 'pos_billing', label: 'POS Billing & Sales', icon: ShoppingCart },
    { id: 'inventory', label: 'Stock Movements', icon: Boxes },
    { id: 'orders', label: 'Purchase Orders', icon: Truck },
    { id: 'suppliers', label: 'Suppliers', icon: Building2 },
    { id: 'customers', label: 'Customers & Patients', icon: Users },
    { id: 'reports', label: 'Reports & Export', icon: BarChart3 },
    {
      id: 'ai_insights',
      label: 'AI Command Center',
      icon: Sparkles,
      highlight: true
    },
    { id: 'activity_logs', label: 'Audit Activity Logs', icon: History }
  ];

  return (
    <aside
      className={`fixed lg:sticky top-0 left-0 z-40 h-screen bg-slate-900 text-slate-300 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <div className={`flex items-center gap-3 overflow-hidden ${collapsed ? 'justify-center w-full' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-500/20 shrink-0">
              <Pill className="w-6 h-6 animate-pulse" />
            </div>
            {!collapsed && (
              <div>
                <h1 className="font-bold text-lg text-white tracking-wide flex items-center gap-1.5">
                  Pharmix <span className="text-emerald-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/30">AI</span>
                </h1>
                <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">
                  Pharmacy Operating System
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)] scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all relative group ${
                  isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-lg shadow-emerald-600/30 font-semibold'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold'
                    : item.highlight
                    ? 'text-emerald-300 hover:bg-emerald-950/40 border border-emerald-500/20'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-emerald-400 text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

                {!collapsed && item.badge && (
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold text-white rounded-full ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status Banner */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50">
        {!collapsed ? (
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> System Status
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span>Low Stock: <strong className="text-amber-400">{lowStockCount}</strong></span>
              <span>Expired: <strong className="text-rose-400">{expiredCount}</strong></span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2 text-slate-400">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
        )}
      </div>
    </aside>
  );
};
