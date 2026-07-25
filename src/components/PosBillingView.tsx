import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Medicine, SaleItem, SaleInvoice, Customer } from '../types';
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  Printer,
  User,
  CreditCard,
  DollarSign,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  X,
  Pill,
  Barcode
} from 'lucide-react';

export const PosBillingView: React.FC = () => {
  const {
    medicines,
    customers,
    addCustomer,
    processSale,
    currentUser
  } = useApp();

  const [cartItems, setCartItems] = useState<SaleItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'upi' | 'insurance'>('card');
  const [taxRate, setTaxRate] = useState<number>(5); // 5% default tax
  const [orderDiscount, setOrderDiscount] = useState<number>(0);
  const [medicineSearch, setMedicineSearch] = useState<string>('');

  // Generated Invoice Receipt state
  const [activeInvoice, setActiveInvoice] = useState<SaleInvoice | null>(null);

  // New Customer Modal
  const [showNewCustModal, setShowNewCustModal] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');

  // Search medicines for POS
  const filteredMeds = (medicines || []).filter((m) => {
    if (!medicineSearch.trim()) return false;
    const term = medicineSearch.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(term) ||
      (m.sku || '').toLowerCase().includes(term) ||
      (m.barcode || '').includes(term)
    );
  });

  const addToCart = (med: Medicine) => {
    if (med.totalStock <= 0) return;

    const existingIndex = cartItems.findIndex((ci) => ci.medicineId === med.id);
    if (existingIndex !== -1) {
      const existing = cartItems[existingIndex];
      if (existing.quantity >= med.totalStock) return;

      const updated = [...cartItems];
      const newQty = existing.quantity + 1;
      const lineTotal = newQty * existing.unitPrice - existing.discount;
      updated[existingIndex] = { ...existing, quantity: newQty, totalPrice: lineTotal };
      setCartItems(updated);
    } else {
      const availableBatch = med.batches.find((b) => b.quantity > 0) || med.batches[0];
      const newItem: SaleItem = {
        medicineId: med.id,
        medicineName: med.name,
        batchNumber: availableBatch?.batchNumber || 'B1',
        quantity: 1,
        unitPrice: med.sellingPrice,
        discount: 0,
        taxRate: taxRate,
        totalPrice: med.sellingPrice
      };
      setCartItems([...cartItems, newItem]);
    }
    setMedicineSearch('');
  };

  const updateCartQty = (medicineId: string, delta: number) => {
    const med = medicines.find((m) => m.id === medicineId);
    if (!med) return;

    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.medicineId === medicineId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > med.totalStock) return item;

            const lineTotal = newQty * item.unitPrice - item.discount;
            return { ...item, quantity: newQty, totalPrice: lineTotal };
          }
          return item;
        })
        .filter(Boolean) as SaleItem[]
    );
  };

  const removeFromCart = (medicineId: string) => {
    setCartItems((prev) => prev.filter((item) => item.medicineId !== medicineId));
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const totalItemDiscounts = cartItems.reduce((acc, item) => acc + item.discount, 0);
  const taxAmount = ((subtotal - totalItemDiscounts - orderDiscount) * taxRate) / 100;
  const grandTotal = Math.max(0, subtotal - totalItemDiscounts - orderDiscount + taxAmount);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;

    const invoice = processSale({
      customerId: selectedCustomer?.id,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer?.phone,
      items: cartItems,
      subtotal,
      taxAmount,
      discountAmount: totalItemDiscounts + orderDiscount,
      totalAmount: grandTotal,
      paymentMethod,
      paymentStatus: 'paid',
      soldBy: currentUser?.name || 'Pharmacist Staff',
      notes: selectedCustomer?.medicalNotes ? `Patient Notes: ${selectedCustomer.medicalNotes}` : undefined
    });

    if (invoice) {
      setActiveInvoice(invoice);
      setCartItems([]);
      setSelectedCustomer(null);
      setOrderDiscount(0);
    }
  };

  const handleCreateCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustName) return;
    addCustomer({
      name: newCustName,
      phone: newCustPhone || '+1 (555) 000-0000'
    });
    setNewCustName('');
    setNewCustPhone('');
    setShowNewCustModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-emerald-500" />
            POS Sales & Billing Counter
          </h1>
          <p className="text-xs text-slate-500">
            Scan barcodes or search medicines, manage prescription billing, and print official receipts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewCustModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs transition-colors"
          >
            <User className="w-4 h-4 text-emerald-500" />
            <span>+ New Patient/Customer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Item Selection & Catalog (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Barcode Search Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Barcode className="w-4 h-4 text-emerald-500" /> Fast Item Search / Barcode Scanner
            </label>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={medicineSearch}
                onChange={(e) => setMedicineSearch(e.target.value)}
                placeholder="Scan barcode or type trade name, SKU, formula..."
                className="w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Search Dropdown / Autocomplete Results */}
            {medicineSearch.trim() && (
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 shadow-xl z-20">
                {filteredMeds.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    No medicine found matching "{medicineSearch}"
                  </div>
                ) : (
                  filteredMeds.map((med) => (
                    <div
                      key={med.id}
                      onClick={() => addToCart(med)}
                      className="p-3 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 cursor-pointer flex items-center justify-between transition-colors"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                          {med.name}
                          {med.prescriptionRequired && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold rounded bg-purple-100 text-purple-700">
                              Rx
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {med.genericName} • Stock: <strong className={med.totalStock <= med.minStockAlert ? 'text-amber-500' : 'text-emerald-500'}>{med.totalStock}</strong>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-xs text-emerald-600 dark:text-emerald-400">
                          ${med.sellingPrice.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-emerald-600 font-semibold">+ Add to Bill</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Popular / Quick-Pick Medicines Grid */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Pick Medicines
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(medicines || []).slice(0, 6).map((med) => (
                <button
                  key={med.id}
                  onClick={() => addToCart(med)}
                  disabled={med.totalStock <= 0}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 text-left transition-all group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-slate-400">{med.dosageForm}</span>
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      ${med.sellingPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600">
                    {med.name}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Stock: {med.totalStock}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Billing Counter & Cart Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xl space-y-5">
            {/* Customer Header */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {selectedCustomer ? selectedCustomer.name : 'Walk-in Customer'}
                </span>
              </div>
              <select
                value={selectedCustomer?.id || ''}
                onChange={(e) => {
                  const cust = customers.find((c) => c.id === e.target.value);
                  setSelectedCustomer(cust || null);
                }}
                className="text-xs font-semibold bg-transparent text-emerald-600 dark:text-emerald-400 focus:outline-none"
              >
                <option value="">Walk-in Customer</option>
                {(customers || []).map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>

            {/* Cart Table */}
            <div className="space-y-3 max-h-72 overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>Item</span>
                <span className="text-center">Qty</span>
                <span className="text-right">Price</span>
              </div>

              {cartItems.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                  <ShoppingCart className="w-8 h-8 text-slate-300 mx-auto" />
                  <p>POS Cart is empty. Scan barcode or add items above.</p>
                </div>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.medicineId}
                    className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate">
                        {item.medicineName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Batch: {item.batchNumber} • ${item.unitPrice.toFixed(2)}/unit
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => updateCartQty(item.medicineId, -1)}
                        className="p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold px-1 text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQty(item.medicineId, 1)}
                        className="p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right min-w-[60px]">
                      <div className="font-black text-slate-900 dark:text-slate-100">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.medicineId)}
                        className="text-[10px] text-rose-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Calculations & Discounts */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Tax Rate:</span>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(Number(e.target.value))}
                  className="px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value={0}>0% Tax</option>
                  <option value={5}>5% Standard Tax</option>
                  <option value={10}>10% Medical Duty</option>
                </select>
              </div>

              <div className="flex justify-between items-center text-slate-600 dark:text-slate-400">
                <span>Order Discount ($):</span>
                <input
                  type="number"
                  min="0"
                  value={orderDiscount}
                  onChange={(e) => setOrderDiscount(Number(e.target.value))}
                  className="w-20 px-2 py-0.5 text-xs rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-right"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
                <span className="font-extrabold text-slate-900 dark:text-slate-100 text-sm">Grand Total Due:</span>
                <span className="font-black text-xl text-emerald-600 dark:text-emerald-400">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Payment Mode Selector */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Payment Method
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'card', label: 'Card', icon: CreditCard },
                  { id: 'cash', label: 'Cash', icon: DollarSign },
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'insurance', label: 'Insurance', icon: ShieldCheck }
                ].map((pm) => {
                  const Icon = pm.icon;
                  const selected = paymentMethod === pm.id;
                  return (
                    <button
                      key={pm.id}
                      onClick={() => setPaymentMethod(pm.id as any)}
                      className={`p-2 rounded-xl border text-center transition-all ${
                        selected
                          ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-md'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <span className="text-[10px] block">{pm.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete Transaction Button */}
            <button
              onClick={handleCheckout}
              disabled={cartItems.length === 0}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Process POS Invoice (${grandTotal.toFixed(2)})</span>
            </button>
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewCustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Create Patient / Customer
              </h3>
              <button
                onClick={() => setShowNewCustModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  placeholder="e.g. Robert Jenkins"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newCustPhone}
                  onChange={(e) => setNewCustPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewCustModal(false)}
                  className="px-4 py-2 font-semibold rounded-xl border border-slate-200 dark:border-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold rounded-xl bg-emerald-600 text-white shadow-md"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Official Sale Receipt #{activeInvoice.invoiceNumber}
                </h3>
              </div>
              <button
                onClick={() => setActiveInvoice(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Preview Body */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs space-y-4 font-mono">
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300 dark:border-slate-700">
                <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100 font-sans">
                  Pharmix Healthcare Pharmacy
                </h4>
                <p className="text-[10px] text-slate-500">
                  100 BioMed Pkwy, Suite 400 • Tel: +1 (800) 555-0199
                </p>
                <p className="text-[10px] text-slate-400">
                  GST/Tax ID: TX-88992011 • Licensed Dispenser
                </p>
              </div>

              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-400">
                <div>
                  <div>Invoice #: <strong>{activeInvoice.invoiceNumber}</strong></div>
                  <div>Patient: <strong>{activeInvoice.customerName}</strong></div>
                </div>
                <div className="text-right">
                  <div>Date: {new Date(activeInvoice.createdAt).toLocaleDateString()}</div>
                  <div>Cashier: {activeInvoice.soldBy}</div>
                </div>
              </div>

              <div className="space-y-2 py-2 border-y border-dashed border-slate-300 dark:border-slate-700">
                {(activeInvoice.items || []).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-slate-800 dark:text-slate-200">
                    <div>
                      <div>{item.medicineName}</div>
                      <div className="text-[10px] text-slate-400">
                        {item.quantity} x ${item.unitPrice.toFixed(2)} (Batch: {item.batchNumber})
                      </div>
                    </div>
                    <div className="font-bold">${item.totalPrice.toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-right text-slate-600 dark:text-slate-400">
                <div>Subtotal: ${activeInvoice.subtotal.toFixed(2)}</div>
                {activeInvoice.discountAmount > 0 && (
                  <div className="text-emerald-600">Discount: -${activeInvoice.discountAmount.toFixed(2)}</div>
                )}
                <div>Tax: ${activeInvoice.taxAmount.toFixed(2)}</div>
                <div className="font-black text-sm text-slate-900 dark:text-slate-100 pt-1 font-sans">
                  Total Paid ({activeInvoice.paymentMethod.toUpperCase()}): ${activeInvoice.totalAmount.toFixed(2)}
                </div>
              </div>

              <div className="text-center text-[10px] text-slate-400 pt-3 border-t border-dashed border-slate-300 dark:border-slate-700 font-sans">
                Thank you for choosing Pharmix Rx. Wish you good health!
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Receipt</span>
              </button>
              <button
                onClick={() => setActiveInvoice(null)}
                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
