import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StockMovement } from '../types';
import {
  Boxes,
  ArrowDownRight,
  ArrowUpRight,
  RefreshCw,
  Plus,
  Search,
  Filter,
  Trash2,
  FileText,
  UserCheck
} from 'lucide-react';

export const InventoryStockView: React.FC = () => {
  const {
    stockMovements,
    medicines,
    addStockMovement,
    updateMedicine,
    currentUser
  } = useApp();

  const [filterType, setFilterType] = useState<string>('all');
  const [movementSearch, setMovementSearch] = useState<string>('');

  // Quick Stock Adjustment Form state
  const [showAdjModal, setShowAdjModal] = useState(false);
  const [selectedMedId, setSelectedMedId] = useState<string>(medicines[0]?.id || '');
  const [adjType, setAdjType] = useState<'stock_in' | 'stock_out' | 'adjustment'>('adjustment');
  const [adjQty, setAdjQty] = useState<number>(10);
  const [adjReason, setAdjReason] = useState<string>('');

  const filteredMovements = (stockMovements || []).filter((m) => {
    const matchesType = filterType === 'all' || m.type === filterType;
    const matchesSearch =
      m.medicineName.toLowerCase().includes(movementSearch.toLowerCase()) ||
      m.batchNumber.toLowerCase().includes(movementSearch.toLowerCase()) ||
      m.reason.toLowerCase().includes(movementSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handlePerformAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    const med = medicines.find((m) => m.id === selectedMedId);
    if (!med || !adjQty) return;

    const qtyChange = adjType === 'stock_out' ? -Math.abs(adjQty) : Math.abs(adjQty);
    const newStock = Math.max(0, med.totalStock + qtyChange);

    // Update medicine stock
    updateMedicine(med.id, {
      totalStock: newStock
    });

    // Record Stock Movement
    addStockMovement({
      medicineId: med.id,
      medicineName: med.name,
      batchNumber: med.batches[0]?.batchNumber || 'B1',
      type: adjType,
      quantity: qtyChange,
      previousStock: med.totalStock,
      newStock,
      reason: adjReason || 'Manual Inventory Audit Adjustment',
      performedBy: currentUser?.name || 'Staff'
    });

    setShowAdjModal(false);
    setAdjReason('');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-emerald-500" />
            Stock In / Stock Out Audit Trail
          </h1>
          <p className="text-xs text-slate-500">
            Track real-time inventory velocity, manual stock adjustments, and supplier receipts.
          </p>
        </div>

        {currentUser?.role !== 'staff' && (
          <button
            onClick={() => setShowAdjModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Stock Adjustment</span>
          </button>
        )}
      </div>

      {/* Movement Type KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Stock In Total</span>
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-600">
            +{(stockMovements || []).filter((m) => m.type === 'stock_in').reduce((a, m) => a + m.quantity, 0)} units
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Stock Out (POS Sales)</span>
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-blue-600">
            {(stockMovements || []).filter((m) => m.type === 'stock_out').reduce((a, m) => a + Math.abs(m.quantity), 0)} units
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Audit Adjustments</span>
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-purple-600">
            {(stockMovements || []).filter((m) => m.type === 'adjustment').length} Records
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Expired Removals</span>
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600">
              <Trash2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-rose-600">
            {(stockMovements || []).filter((m) => m.type === 'expired_removal').reduce((a, m) => a + Math.abs(m.quantity), 0)} units
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {['all', 'stock_in', 'stock_out', 'adjustment', 'expired_removal'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  filterType === type
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={movementSearch}
              onChange={(e) => setMovementSearch(e.target.value)}
              placeholder="Search history..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Medicine</th>
                <th className="py-2.5 px-3 text-center">Movement Type</th>
                <th className="py-2.5 px-3 text-center">Qty Delta</th>
                <th className="py-2.5 px-3 text-center">New Stock</th>
                <th className="py-2.5 px-3">Reason / Reference</th>
                <th className="py-2.5 px-3 text-right">Performed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredMovements.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No movement records found.
                  </td>
                </tr>
              ) : (
                (filteredMovements || []).map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">
                      {new Date(m.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{m.medicineName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Batch: {m.batchNumber}</div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          m.type === 'stock_in'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : m.type === 'stock_out'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : m.type === 'expired_removal'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300'
                        }`}
                      >
                        {m.type.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-black">
                      <span className={m.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {m.quantity > 0 ? `+${m.quantity}` : m.quantity}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {m.newStock} units
                    </td>

                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 max-w-xs truncate">
                      {m.reason}
                    </td>

                    <td className="py-3 px-3 text-right text-slate-500 font-medium">
                      {m.performedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Stock Adjustment Modal */}
      {showAdjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Manual Inventory Adjustment
            </h3>

            <form onSubmit={handlePerformAdjustment} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Medicine *</label>
                <select
                  value={selectedMedId}
                  onChange={(e) => setSelectedMedId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {(medicines || []).map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (Current Stock: {m.totalStock})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Adjustment Action *</label>
                <select
                  value={adjType}
                  onChange={(e) => setAdjType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="stock_in">Stock In (Increase Inventory)</option>
                  <option value="stock_out">Stock Out (Decrease Inventory)</option>
                  <option value="adjustment">Manual Physical Audit Correction</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Quantity Units *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjQty}
                  onChange={(e) => setAdjQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Reason / Note *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Broken packaging / physical count discrepancy"
                  value={adjReason}
                  onChange={(e) => setAdjReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAdjModal(false)}
                  className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold rounded-xl bg-emerald-600 text-white shadow-md"
                >
                  Confirm Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
