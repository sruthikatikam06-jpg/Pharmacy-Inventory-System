import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PurchaseOrder, PurchaseOrderItem } from '../types';
import {
  Truck,
  Plus,
  Search,
  CheckCircle2,
  Package,
  Clock,
  XCircle,
  FileText,
  Building2,
  ChevronRight,
  X
} from 'lucide-react';

export const PurchaseOrdersView: React.FC = () => {
  const {
    purchaseOrders,
    suppliers,
    medicines,
    createPurchaseOrder,
    updatePurchaseOrderStatus,
    currentUser
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [poSearch, setPoSearch] = useState<string>('');

  // New PO Modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([]);
  const [poNotes, setPoNotes] = useState<string>('');

  // Item addition state inside modal
  const [addMedId, setAddMedId] = useState<string>(medicines[0]?.id || '');
  const [addQty, setAddQty] = useState<number>(100);

  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    const matchesSearch =
      po.poNumber.toLowerCase().includes(poSearch.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(poSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleAddItemToPo = () => {
    const med = medicines.find((m) => m.id === addMedId);
    if (!med || !addQty) return;

    const existingIdx = poItems.findIndex((i) => i.medicineId === med.id);
    if (existingIdx !== -1) {
      const updated = [...poItems];
      updated[existingIdx].quantity += addQty;
      updated[existingIdx].totalPrice = updated[existingIdx].quantity * updated[existingIdx].unitPrice;
      setPoItems(updated);
    } else {
      const newItem: PurchaseOrderItem = {
        medicineId: med.id,
        medicineName: med.name,
        quantity: addQty,
        unitPrice: med.costPrice,
        totalPrice: addQty * med.costPrice,
        expectedExpiry: '2028-12-31'
      };
      setPoItems([...poItems, newItem]);
    }
  };

  const handleRemovePoItem = (medicineId: string) => {
    setPoItems((prev) => prev.filter((i) => i.medicineId !== medicineId));
  };

  const handleFinalizePo = (e: React.FormEvent) => {
    e.preventDefault();
    if (poItems.length === 0) return;

    const supplier = suppliers.find((s) => s.id === selectedSupplierId) || suppliers[0];
    const totalAmount = poItems.reduce((acc, i) => acc + i.totalPrice, 0);

    createPurchaseOrder({
      supplierId: supplier.id,
      supplierName: supplier.name,
      items: poItems,
      totalAmount,
      status: 'pending',
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: poNotes,
      createdBy: currentUser?.name || 'Pharmacist'
    });

    setShowCreateModal(false);
    setPoItems([]);
    setPoNotes('');
  };

  const statusBadges = {
    draft: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
    approved: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300',
    received: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
    cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Truck className="w-6 h-6 text-emerald-500" />
            Purchase Order Management
          </h1>
          <p className="text-xs text-slate-500">
            Issue purchase orders to suppliers, manage delivery schedules, and receive stock.
          </p>
        </div>

        {currentUser?.role !== 'staff' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Purchase Order</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'pending', 'approved', 'shipped', 'received'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={poSearch}
            onChange={(e) => setPoSearch(e.target.value)}
            placeholder="Search PO # or supplier..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          />
        </div>
      </div>

      {/* PO Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPOs.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-400 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            No purchase orders matching criteria.
          </div>
        ) : (
          filteredPOs.map((po) => (
            <div
              key={po.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4 hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {po.poNumber}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      statusBadges[po.status]
                    }`}
                  >
                    {po.status}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-500" />
                    {po.supplierName}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Ordered: {new Date(po.orderDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Items preview */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 space-y-1.5 text-xs">
                  {(po.items || []).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-slate-700 dark:text-slate-300">
                      <span className="truncate max-w-[180px]">{item.medicineName}</span>
                      <span className="font-bold">{item.quantity} units</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between font-black text-slate-900 dark:text-slate-100">
                    <span>Total Cost:</span>
                    <span className="text-emerald-600 dark:text-emerald-400">${po.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Actions */}
              {currentUser?.role !== 'staff' && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                  {po.status === 'pending' && (
                    <button
                      onClick={() => updatePurchaseOrderStatus(po.id, 'approved')}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-500"
                    >
                      Approve PO
                    </button>
                  )}
                  {po.status === 'approved' && (
                    <button
                      onClick={() => updatePurchaseOrderStatus(po.id, 'shipped')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500"
                    >
                      Mark Shipped
                    </button>
                  )}
                  {po.status === 'shipped' && (
                    <button
                      onClick={() => updatePurchaseOrderStatus(po.id, 'received')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 shadow-md"
                    >
                      Receive & Update Stock
                    </button>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Create Purchase Order Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create New Purchase Order
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinalizePo} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Select Supplier *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.contactPerson})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add items section */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300">
                  Add Item to Order
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={addMedId}
                    onChange={(e) => setAddMedId(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {medicines.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} (${m.costPrice.toFixed(2)}/unit)
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    value={addQty}
                    onChange={(e) => setAddQty(Number(e.target.value))}
                    className="w-20 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />

                  <button
                    type="button"
                    onClick={handleAddItemToPo}
                    className="px-3 py-1.5 font-bold rounded-lg bg-emerald-600 text-white"
                  >
                    + Add
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {poItems.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs"
                  >
                    <div>
                      <div className="font-bold">{item.medicineName}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.quantity} x ${item.unitPrice.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-emerald-600">${item.totalPrice.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePoItem(item.medicineId)}
                        className="text-rose-500 font-bold"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes / Instructions</label>
                <input
                  type="text"
                  placeholder="e.g. Expedited cold-chain delivery required"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={poItems.length === 0}
                  className="px-5 py-2 font-bold rounded-xl bg-emerald-600 text-white shadow-md disabled:opacity-50"
                >
                  Submit PO to Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
