import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Medicine, MedicineCategory, StorageCondition, MedicineBatch } from '../types';
import { BarcodeModal } from './BarcodeModal';
import {
  Pill,
  Search,
  Plus,
  Filter,
  AlertTriangle,
  Clock,
  Barcode,
  Edit,
  Trash2,
  X,
  Boxes,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react';

export const MedicineManagementView: React.FC = () => {
  const {
    medicines,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    addBatchToMedicine,
    removeExpiredBatch,
    suppliers,
    searchTerm,
    setSearchTerm,
    currentUser
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockStatusFilter, setStockStatusFilter] = useState<'all' | 'low' | 'expired' | 'rx'>('all');

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [batchModalMed, setBatchModalMed] = useState<Medicine | null>(null);
  const [barcodeModalState, setBarcodeModalState] = useState<{ medicine: Medicine; batch?: MedicineBatch } | null>(null);

  // New Medicine Form State
  const [formData, setFormData] = useState({
    name: '',
    genericName: '',
    brandName: '',
    category: 'Antibiotics' as MedicineCategory,
    sku: '',
    barcode: '',
    description: '',
    manufacturer: '',
    dosageForm: 'Tablet' as Medicine['dosageForm'],
    unit: 'Box' as Medicine['unit'],
    minStockAlert: 20,
    maxStockCapacity: 200,
    reorderPoint: 30,
    costPrice: 5.00,
    sellingPrice: 10.00,
    prescriptionRequired: false,
    storageCondition: 'Room Temperature' as StorageCondition,
    initialBatchNumber: `BT-${new Date().getFullYear()}-01`,
    initialBatchQty: 50,
    initialBatchExpiry: '2027-12-31'
  });

  // New Batch Form State
  const [newBatchData, setNewBatchData] = useState({
    batchNumber: '',
    barcode: '',
    expiryDate: '2028-06-30',
    manufacturingDate: new Date().toISOString().split('T')[0],
    quantity: 50,
    purchasePrice: 5.00,
    sellingPrice: 10.00,
    rackLocation: 'Aisle 1 - Shelf A',
    supplierId: suppliers[0]?.id || 'sup_1'
  });

  const categories: string[] = [
    'All',
    'Antibiotics',
    'Pain Relievers',
    'Cardiovascular',
    'Diabetes',
    'Respiratory',
    'Vitamins & Supplements',
    'Gastrointestinal',
    'Dermatology',
    'First Aid',
    'Pediatric'
  ];

  const now = new Date();

  // Filter logic
  const filteredMedicines = medicines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.barcode.includes(searchTerm);

    const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;

    let matchesStatus = true;
    if (stockStatusFilter === 'low') {
      matchesStatus = m.totalStock <= m.minStockAlert;
    } else if (stockStatusFilter === 'expired') {
      matchesStatus = (m.batches || []).some((b) => new Date(b.expiryDate) < now);
    } else if (stockStatusFilter === 'rx') {
      matchesStatus = m.prescriptionRequired;
    }

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.genericName) return;

    const skuGen = formData.sku || `MED-${formData.name.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const barcodeGen = formData.barcode || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`;

    const initialBatch: MedicineBatch = {
      batchNumber: formData.initialBatchNumber || `BT-${Date.now()}`,
      barcode: `${barcodeGen}-B1`,
      expiryDate: formData.initialBatchExpiry,
      manufacturingDate: new Date().toISOString().split('T')[0],
      quantity: Number(formData.initialBatchQty),
      initialQuantity: Number(formData.initialBatchQty),
      purchasePrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      rackLocation: 'Main Shelf A',
      supplierId: suppliers[0]?.id || 'sup_1'
    };

    addMedicine({
      name: formData.name,
      genericName: formData.genericName,
      brandName: formData.brandName || formData.name,
      category: formData.category,
      sku: skuGen,
      barcode: barcodeGen,
      description: formData.description || 'Pharmaceutical preparation',
      manufacturer: formData.manufacturer || 'Standard Global Pharma',
      dosageForm: formData.dosageForm,
      unit: formData.unit,
      totalStock: Number(formData.initialBatchQty),
      minStockAlert: Number(formData.minStockAlert),
      maxStockCapacity: Number(formData.maxStockCapacity),
      reorderPoint: Number(formData.reorderPoint),
      costPrice: Number(formData.costPrice),
      sellingPrice: Number(formData.sellingPrice),
      prescriptionRequired: formData.prescriptionRequired,
      storageCondition: formData.storageCondition,
      batches: [initialBatch]
    });

    setShowAddModal(false);
  };

  const handleUpdateMedicineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedicine) return;

    updateMedicine(editingMedicine.id, {
      name: editingMedicine.name,
      genericName: editingMedicine.genericName,
      category: editingMedicine.category,
      dosageForm: editingMedicine.dosageForm,
      unit: editingMedicine.unit,
      costPrice: Number(editingMedicine.costPrice),
      sellingPrice: Number(editingMedicine.sellingPrice),
      minStockAlert: Number(editingMedicine.minStockAlert),
      prescriptionRequired: editingMedicine.prescriptionRequired,
      storageCondition: editingMedicine.storageCondition
    });

    setEditingMedicine(null);
  };

  const handleAddBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchModalMed || !newBatchData.batchNumber) return;

    addBatchToMedicine(batchModalMed.id, {
      batchNumber: newBatchData.batchNumber,
      barcode: `${batchModalMed.barcode}-${newBatchData.batchNumber}`,
      expiryDate: newBatchData.expiryDate,
      manufacturingDate: newBatchData.manufacturingDate,
      quantity: Number(newBatchData.quantity),
      initialQuantity: Number(newBatchData.quantity),
      purchasePrice: Number(newBatchData.purchasePrice),
      sellingPrice: Number(newBatchData.sellingPrice),
      rackLocation: newBatchData.rackLocation,
      supplierId: newBatchData.supplierId
    });

    setBatchModalMed(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Pill className="w-6 h-6 text-emerald-500" />
            Medicine Inventory Catalog
          </h1>
          <p className="text-xs text-slate-500">
            Manage pharmaceutical master records, batch tracking, barcodes, and stock levels.
          </p>
        </div>

        {currentUser?.role !== 'staff' && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Medicine</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setStockStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                stockStatusFilter === 'all'
                  ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              All Items ({medicines.length})
            </button>
            <button
              onClick={() => setStockStatusFilter('low')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                stockStatusFilter === 'low'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/50'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" /> Low Stock Queue
            </button>
            <button
              onClick={() => setStockStatusFilter('expired')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                stockStatusFilter === 'expired'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Expired Batches
            </button>
            <button
              onClick={() => setStockStatusFilter('rx')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                stockStatusFilter === 'rx'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Rx Required
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search SKU or name..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 dark:border-slate-800 pt-3 text-xs scrollbar-none">
          <span className="text-slate-400 font-medium flex items-center gap-1 pr-2 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg shrink-0 transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Medicine Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Form / Storage</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-right">Cost / Sell Price</th>
                <th className="py-3 px-4 text-center">Batches</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredMedicines.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No medicines found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredMedicines.map((med) => {
                  const isLow = med.totalStock <= med.minStockAlert;
                  const hasExpired = (med.batches || []).some((b) => new Date(b.expiryDate) < now);

                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-start gap-2.5">
                          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-emerald-500 shrink-0 mt-0.5">
                            <Pill className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {med.name}
                              {med.prescriptionRequired && (
                                <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                  Rx
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500">{med.genericName}</div>
                            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                              SKU: {med.sku} | Barcode: {med.barcode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {med.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="font-medium text-slate-800 dark:text-slate-200">{med.dosageForm} ({med.unit})</div>
                        <div className="text-[10px] text-slate-400">{med.storageCondition}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span
                            className={`font-black text-sm ${
                              isLow ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {med.totalStock} <span className="text-[10px] font-normal text-slate-400">units</span>
                          </span>
                          <div className="w-20 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isLow ? 'bg-rose-500' : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${Math.min(100, (med.totalStock / med.maxStockCapacity) * 100)}%`
                              }}
                            />
                          </div>
                          {isLow && (
                            <span className="text-[9px] font-bold text-amber-500 mt-0.5 flex items-center gap-0.5">
                              <AlertTriangle className="w-2.5 h-2.5" /> Low Stock
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="font-bold text-emerald-600 dark:text-emerald-400">
                          ${med.sellingPrice.toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Cost: ${med.costPrice.toFixed(2)}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setBatchModalMed(med)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] flex items-center gap-1 mx-auto transition-colors"
                        >
                          <Boxes className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{(med.batches || []).length} Batch(es)</span>
                          {hasExpired && (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                          )}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setBarcodeModalState({ medicine: med })}
                            title="Generate Barcode Label"
                            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          >
                            <Barcode className="w-4 h-4" />
                          </button>
                          {currentUser?.role !== 'staff' && (
                            <>
                              <button
                                onClick={() => setEditingMedicine(med)}
                                title="Edit Medicine"
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteMedicine(med.id)}
                                title="Delete Medicine"
                                className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-500" /> Add New Medicine Record
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMedicine} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Medicine Trade Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Generic Formula *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.genericName}
                    onChange={(e) => setFormData({ ...formData, genericName: e.target.value })}
                    placeholder="e.g. Amoxicillin Trihydrate"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as MedicineCategory })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500"
                  >
                    {categories.filter((c) => c !== 'All').map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Dosage Form & Unit
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={formData.dosageForm}
                      onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment', 'Inhaler', 'Drops', 'Powder'].map((df) => (
                        <option key={df} value={df}>
                          {df}
                        </option>
                      ))}
                    </select>

                    <select
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    >
                      {['Box', 'Strip', 'Bottle', 'Vial', 'Tube'].map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Purchase Cost ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Selling Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.sellingPrice}
                    onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Min Safety Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.minStockAlert}
                    onChange={(e) => setFormData({ ...formData, minStockAlert: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Storage Condition
                  </label>
                  <select
                    value={formData.storageCondition}
                    onChange={(e) => setFormData({ ...formData, storageCondition: e.target.value as StorageCondition })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                  >
                    <option value="Room Temperature">Room Temperature</option>
                    <option value="Refrigerated (2-8°C)">Refrigerated (2-8°C)</option>
                    <option value="Cool & Dry">Cool & Dry</option>
                    <option value="Controlled Substance Safe">Controlled Substance Safe</option>
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
                <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" /> Initial Stock Batch Details
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Batch Number
                    </label>
                    <input
                      type="text"
                      value={formData.initialBatchNumber}
                      onChange={(e) => setFormData({ ...formData, initialBatchNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.initialBatchQty}
                      onChange={(e) => setFormData({ ...formData, initialBatchQty: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-400">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={formData.initialBatchExpiry}
                      onChange={(e) => setFormData({ ...formData, initialBatchExpiry: e.target.value })}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rx_check"
                  checked={formData.prescriptionRequired}
                  onChange={(e) => setFormData({ ...formData, prescriptionRequired: e.target.checked })}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="rx_check" className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Prescription required for dispensing (Rx item)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                >
                  Save Medicine Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Medicine Modal */}
      {editingMedicine && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Edit Medicine: {editingMedicine.name}
              </h3>
              <button
                onClick={() => setEditingMedicine(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateMedicineSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Trade Name</label>
                <input
                  type="text"
                  value={editingMedicine.name}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Cost Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingMedicine.costPrice}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, costPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Selling Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingMedicine.sellingPrice}
                    onChange={(e) => setEditingMedicine({ ...editingMedicine, sellingPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Min Safety Alert Threshold</label>
                <input
                  type="number"
                  value={editingMedicine.minStockAlert}
                  onChange={(e) => setEditingMedicine({ ...editingMedicine, minStockAlert: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingMedicine(null)}
                  className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold rounded-xl bg-emerald-600 text-white shadow-md"
                >
                  Update Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Management Modal */}
      {batchModalMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Boxes className="w-5 h-5 text-emerald-500" />
                  Batches for: {batchModalMed.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Total Stock: <strong>{batchModalMed.totalStock}</strong> units across {(batchModalMed.batches || []).length} batch(es)
                </p>
              </div>
              <button
                onClick={() => setBatchModalMed(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Existing Batches List */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Current Inventory Batches
              </h4>
              {(batchModalMed.batches || []).map((batch) => {
                const isExpired = new Date(batch.expiryDate) < now;
                return (
                  <div
                    key={batch.batchNumber}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs ${
                      isExpired
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/50'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        {batch.batchNumber}
                        {isExpired && (
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-500 text-white">
                            EXPIRED
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>Expiry: <strong className={isExpired ? 'text-rose-600' : 'text-slate-800 dark:text-slate-200'}>{batch.expiryDate}</strong></span>
                        <span>• Location: {batch.rackLocation}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-black text-sm text-slate-900 dark:text-slate-100">
                          {batch.quantity} <span className="text-[10px] text-slate-400 font-normal">units</span>
                        </div>
                      </div>

                      {isExpired && currentUser?.role !== 'staff' && (
                        <button
                          onClick={() => {
                            removeExpiredBatch(batchModalMed.id, batch.batchNumber);
                            setBatchModalMed(null);
                          }}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-rose-600 hover:bg-rose-500 text-white"
                        >
                          Quarantine & Remove
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add New Batch Form */}
            {currentUser?.role !== 'staff' && (
              <form onSubmit={handleAddBatchSubmit} className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
                <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Add New Stock Batch
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Batch No *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. BT-2026-X1"
                      value={newBatchData.batchNumber}
                      onChange={(e) => setNewBatchData({ ...newBatchData, batchNumber: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      required
                      value={newBatchData.quantity}
                      onChange={(e) => setNewBatchData({ ...newBatchData, quantity: Number(e.target.value) })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newBatchData.expiryDate}
                      onChange={(e) => setNewBatchData({ ...newBatchData, expiryDate: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Rack / Location
                    </label>
                    <input
                      type="text"
                      value={newBatchData.rackLocation}
                      onChange={(e) => setNewBatchData({ ...newBatchData, rackLocation: e.target.value })}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                  >
                    Save Batch Stock
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Barcode Label Modal */}
      {barcodeModalState && (
        <BarcodeModal
          medicine={barcodeModalState.medicine}
          batch={barcodeModalState.batch}
          onClose={() => setBarcodeModalState(null)}
        />
      )}
    </div>
  );
};
