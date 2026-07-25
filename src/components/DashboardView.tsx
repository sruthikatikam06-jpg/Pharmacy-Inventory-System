import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Pill,
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  Sparkles,
  ArrowUpRight,
  PackageCheck,
  ShieldAlert,
  ChevronRight,
  Plus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

export const DashboardView: React.FC = () => {
  const {
    medicines,
    salesInvoices,
    purchaseOrders,
    setActiveTab,
    createPurchaseOrder,
    suppliers
  } = useApp();

  // Metrics calculation
  const totalMedicines = medicines.length;

  const lowStockMedicines = medicines.filter((m) => m.totalStock <= m.minStockAlert);
  
  const now = new Date();
  const expiredBatches = medicines.flatMap((m) =>
    (m.batches || [])
      .filter((b) => new Date(b.expiryDate) < now)
      .map((b) => ({ medicine: m, batch: b }))
  );

  const totalStockValuation = medicines.reduce((acc, m) => {
    return acc + m.totalStock * m.costPrice;
  }, 0);

  const todaySalesValuation = salesInvoices
    .filter((inv) => new Date(inv.createdAt).toDateString() === now.toDateString())
    .reduce((acc, inv) => acc + inv.totalAmount, 0);

  const monthlySalesValuation = salesInvoices.reduce(
    (acc, inv) => acc + inv.totalAmount,
    0
  );

  const pendingPOs = purchaseOrders.filter((p) => p.status === 'pending' || p.status === 'approved').length;

  // Recharts Chart Data
  const monthlyData = [
    { month: 'Feb', sales: 4200, revenue: 8400, orders: 120 },
    { month: 'Mar', sales: 5100, revenue: 10200, orders: 145 },
    { month: 'Apr', sales: 4800, revenue: 9600, orders: 130 },
    { month: 'May', sales: 6200, revenue: 12400, orders: 180 },
    { month: 'Jun', sales: 7400, revenue: 14800, orders: 210 },
    { month: 'Jul', sales: 8900, revenue: 17800, orders: 245 }
  ];

  const categoryStockData = [
    { name: 'Antibiotics', count: medicines.filter((m) => m.category === 'Antibiotics').reduce((a, m) => a + m.totalStock, 0) },
    { name: 'Pain Relievers', count: medicines.filter((m) => m.category === 'Pain Relievers').reduce((a, m) => a + m.totalStock, 0) },
    { name: 'Cardiovascular', count: medicines.filter((m) => m.category === 'Cardiovascular').reduce((a, m) => a + m.totalStock, 0) },
    { name: 'Diabetes', count: medicines.filter((m) => m.category === 'Diabetes').reduce((a, m) => a + m.totalStock, 0) },
    { name: 'Respiratory', count: medicines.filter((m) => m.category === 'Respiratory').reduce((a, m) => a + m.totalStock, 0) },
    { name: 'Gastro', count: medicines.filter((m) => m.category === 'Gastrointestinal').reduce((a, m) => a + m.totalStock, 0) }
  ];

  const categoryColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4'];

  const handleQuickReorder = (medicine: typeof medicines[0]) => {
    const defaultSupplier = suppliers[0] || { id: 'sup_1', name: 'Astra Pharma Global' };
    createPurchaseOrder({
      supplierId: defaultSupplier.id,
      supplierName: defaultSupplier.name,
      items: [
        {
          medicineId: medicine.id,
          medicineName: medicine.name,
          quantity: medicine.reorderPoint * 2,
          unitPrice: medicine.costPrice,
          totalPrice: medicine.reorderPoint * 2 * medicine.costPrice
        }
      ],
      totalAmount: medicine.reorderPoint * 2 * medicine.costPrice,
      status: 'pending',
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `Quick automated reorder for low stock ${medicine.name}`,
      createdBy: 'Dashboard Quick Action'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-6 lg:p-8 text-white shadow-2xl border border-emerald-500/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
              <span>AI Inventory Intelligence Engine Active</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">
              Pharmacy Operations Overview
            </h1>
            <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
              Real-time monitoring of medicine stock levels, sales turnover, expiry tracking, and AI-assisted demand forecasting.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('pos_billing')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Open POS Terminal</span>
            </button>
            <button
              onClick={() => setActiveTab('ai_insights')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-semibold backdrop-blur-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Run AI Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Medicines */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Medicines
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Pill className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              {totalMedicines}
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
              <TrendingUp className="w-3.5 h-3.5" /> Valuation: ${totalStockValuation.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div
          onClick={() => setActiveTab('medicines')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {lowStockMedicines.length}
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Requires Reorder
            </span>
          </div>
        </div>

        {/* Expired Batches */}
        <div
          onClick={() => setActiveTab('medicines')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-200/80 dark:border-rose-900/40 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Expired Batches
            </span>
            <div className="p-2.5 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {expiredBatches.length}
            </div>
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400">
              Quarantine Required
            </span>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Today's Sales
            </span>
            <div className="p-2.5 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
              ${todaySalesValuation.toFixed(2)}
            </div>
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400">
              Total Sales: ${monthlySalesValuation.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales & Revenue Trend Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Sales & Revenue Analytics
              </h2>
              <p className="text-xs text-slate-500">
                6-month historical turnover & POS invoice growth
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              +24% Growth
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Distribution by Category */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Stock by Category
            </h2>
            <p className="text-xs text-slate-500">
              Total units available per therapeutic category
            </p>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#1e293b',
                    borderRadius: '12px',
                    color: '#f8fafc',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {categoryStockData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Action Items Table & AI Insight Snippet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Low Stock Items Action Table */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Low Stock Action Queue ({lowStockMedicines.length})
              </h2>
            </div>
            <button
              onClick={() => setActiveTab('medicines')}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              Manage Catalog <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {lowStockMedicines.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700">
              <PackageCheck className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                All medicines are well stocked above min safety thresholds!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                    <th className="py-2.5 px-3">Medicine</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3 text-center">Stock / Min</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {lowStockMedicines.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{med.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{med.sku}</div>
                      </td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                        {med.category}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-rose-600 dark:text-rose-400">{med.totalStock}</span>
                        <span className="text-slate-400"> / {med.minStockAlert}</span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleQuickReorder(med)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" /> Reorder PO
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Insight Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                AI Smart Recommendation
              </span>
              <span className="text-[10px] text-slate-400">Updated Real-time</span>
            </div>

            <h3 className="text-base font-bold text-emerald-100">
              Antibiotics & Diabetes Demand Surge
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed">
              AI predictive models project a <strong>22% increase in Amoxicillin demand</strong> and <strong>Metformin reorder requirement</strong> due to seasonal prescription trends.
            </p>

            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span>Confidence Score:</span>
                <span className="font-bold text-emerald-400">95%</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Suggested Action:</span>
                <span className="font-medium text-amber-300">Autogen Purchase Orders</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('ai_insights')}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Open AI Command Hub</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
