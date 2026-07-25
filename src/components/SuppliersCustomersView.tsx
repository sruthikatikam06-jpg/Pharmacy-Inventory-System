import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Supplier, Customer } from '../types';
import {
  Building2,
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldAlert,
  Edit,
  Trash2,
  X
} from 'lucide-react';

export const SuppliersCustomersView: React.FC<{ initialTab?: 'suppliers' | 'customers' }> = ({
  initialTab = 'suppliers'
}) => {
  const {
    suppliers,
    customers,
    addSupplier,
    addCustomer,
    currentUser
  } = useApp();

  const [activeTab, setActiveTab] = useState<'suppliers' | 'customers'>(initialTab);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);

  // Form States
  const [supData, setSupData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    taxId: 'GST-9922001',
    leadTimeDays: 5
  });

  const [custData, setCustData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    medicalNotes: 'No known drug allergies'
  });

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supData.name) return;
    addSupplier({
      name: supData.name,
      contactPerson: supData.contactPerson || 'Account Manager',
      email: supData.email || 'sales@pharma.com',
      phone: supData.phone || '+1 (800) 555-0199',
      address: supData.address || 'Medical District Ave',
      taxId: supData.taxId,
      leadTimeDays: Number(supData.leadTimeDays)
    });
    setShowAddSupplierModal(false);
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custData.name) return;
    addCustomer({
      name: custData.name,
      email: custData.email || 'patient@email.com',
      phone: custData.phone || '+1 (555) 000-0000',
      address: custData.address || 'Main St',
      medicalNotes: custData.medicalNotes
    });
    setShowAddCustomerModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Tab Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 w-fit">
          <button
            onClick={() => setActiveTab('suppliers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'suppliers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Suppliers ({suppliers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'customers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Customers & Patients ({customers.length})</span>
          </button>
        </div>

        {currentUser?.role !== 'staff' && (
          <button
            onClick={() => (activeTab === 'suppliers' ? setShowAddSupplierModal(true) : setShowAddCustomerModal(true))}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New {activeTab === 'suppliers' ? 'Supplier' : 'Patient/Customer'}</span>
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Suppliers Grid */}
      {activeTab === 'suppliers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {s.name}
                  </h3>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Attn: {s.contactPerson}
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-600">
                  {s.taxId}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{s.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{s.address}</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  <span>Delivery Lead Time: {s.leadTimeDays} Days</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Customers Grid */}
      {activeTab === 'customers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                    {c.name}
                  </h3>
                  <div className="text-xs text-slate-500">{c.phone}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase">Total Purchases</span>
                  <strong className="text-xs text-emerald-600 dark:text-emerald-400 font-mono">
                    ${(c.totalSpent || 0).toFixed(2)}
                  </strong>
                </div>
              </div>

              {c.medicalNotes && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 text-xs space-y-1">
                  <div className="font-bold text-purple-800 dark:text-purple-300 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" /> Medical Profile / Allergies:
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{c.medicalNotes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add Supplier Modal */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add New Pharmaceutical Supplier
              </h3>
              <button
                onClick={() => setShowAddSupplierModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  value={supData.name}
                  onChange={(e) => setSupData({ ...supData, name: e.target.value })}
                  placeholder="e.g. Novartis Global Supply"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Contact Person</label>
                <input
                  type="text"
                  value={supData.contactPerson}
                  onChange={(e) => setSupData({ ...supData, contactPerson: e.target.value })}
                  placeholder="e.g. Sarah Connor"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={supData.phone}
                    onChange={(e) => setSupData({ ...supData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Lead Time (Days)</label>
                  <input
                    type="number"
                    value={supData.leadTimeDays}
                    onChange={(e) => setSupData({ ...supData, leadTimeDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold rounded-xl bg-emerald-600 text-white shadow-md"
                >
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Add Patient / Customer Record
              </h3>
              <button
                onClick={() => setShowAddCustomerModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Patient Name *</label>
                <input
                  type="text"
                  required
                  value={custData.name}
                  onChange={(e) => setCustData({ ...custData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={custData.phone}
                  onChange={(e) => setCustData({ ...custData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Medical Notes / Allergies</label>
                <textarea
                  value={custData.medicalNotes}
                  onChange={(e) => setCustData({ ...custData, medicalNotes: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddCustomerModal(false)}
                  className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold rounded-xl bg-emerald-600 text-white shadow-md"
                >
                  Save Patient Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
