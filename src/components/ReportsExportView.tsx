import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Printer,
  Calendar,
  TrendingUp,
  DollarSign,
  PieChart,
  CheckCircle2,
  Filter
} from 'lucide-react';

export const ReportsExportView: React.FC = () => {
  const { salesInvoices, medicines, stockMovements, addToast } = useApp();

  const [dateRange, setDateRange] = useState<'7days' | '30days' | 'all'>('30days');

  // KPI Calculations
  const totalRevenue = salesInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalInvoicesCount = salesInvoices.length;
  const avgOrderValue = totalInvoicesCount > 0 ? totalRevenue / totalInvoicesCount : 0;

  const totalCostOfGoodsSold = salesInvoices.reduce((acc, inv) => {
    return (
      acc +
      (inv.items || []).reduce((itemAcc, item) => {
        const med = medicines.find((m) => m.id === item.medicineId);
        return itemAcc + item.quantity * (med ? med.costPrice : item.unitPrice * 0.6);
      }, 0)
    );
  }, 0);

  const grossProfit = totalRevenue - totalCostOfGoodsSold;
  const grossProfitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // CSV Export Generators
  const exportSalesCsv = () => {
    const headers = ['Invoice Number', 'Date', 'Customer', 'Payment Method', 'Items Count', 'Subtotal', 'Tax', 'Discount', 'Total Amount'];
    const rows = salesInvoices.map((inv) => [
      inv.invoiceNumber,
      new Date(inv.createdAt).toLocaleString(),
      `"${inv.customerName}"`,
      inv.paymentMethod,
      (inv.items || []).length,
      inv.subtotal.toFixed(2),
      inv.taxAmount.toFixed(2),
      inv.discountAmount.toFixed(2),
      inv.totalAmount.toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pharmix_sales_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ title: 'CSV Downloaded', message: 'Sales invoices report exported successfully.', type: 'success' });
  };

  const exportInventoryCsv = () => {
    const headers = ['SKU', 'Barcode', 'Medicine Name', 'Category', 'Dosage Form', 'Unit Cost', 'Unit Sell', 'Total Stock', 'Valuation'];
    const rows = medicines.map((m) => [
      m.sku,
      m.barcode,
      `"${m.name}"`,
      m.category,
      m.dosageForm,
      m.costPrice.toFixed(2),
      m.sellingPrice.toFixed(2),
      m.totalStock,
      (m.totalStock * m.costPrice).toFixed(2)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pharmix_inventory_master_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({ title: 'CSV Downloaded', message: 'Inventory master list exported successfully.', type: 'success' });
  };

  const handlePrintPdf = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-emerald-500" />
            Financial Reports & Data Export
          </h1>
          <p className="text-xs text-slate-500">
            Generate executive compliance summaries, export CSV ledgers, and analyze profit margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportSalesCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs shadow-md"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export Sales CSV</span>
          </button>
          <button
            onClick={exportInventoryCsv}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Export Stock Master</span>
          </button>
          <button
            onClick={handlePrintPdf}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs border border-slate-200 dark:border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report PDF</span>
          </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Total Gross Sales</div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100">
            ${totalRevenue.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            Across {totalInvoicesCount} POS transactions
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Est. Gross Profit</div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            ${grossProfit.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Margin: <strong>{grossProfitMargin.toFixed(1)}%</strong>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Avg Order Value (AOV)</div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            ${avgOrderValue.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Per customer transaction
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase mb-2">Inventory Valuation</div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            ${medicines.reduce((a, m) => a + m.totalStock * m.costPrice, 0).toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-1">
            Total cost of asset holdings
          </div>
        </div>
      </div>

      {/* Printable Executive Sales Ledger Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Executive Sales Audit Ledger
            </h2>
            <p className="text-xs text-slate-500">
              Detailed list of completed sales invoices with payment breakdown
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-400 uppercase">
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3 text-center">Items</th>
                <th className="py-3 px-3 text-center">Payment</th>
                <th className="py-3 px-3 text-right">Tax</th>
                <th className="py-3 px-3 text-right">Grand Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {salesInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-3 text-slate-500">
                    {new Date(inv.createdAt).toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-slate-800 dark:text-slate-200 font-medium">
                    {inv.customerName}
                  </td>
                  <td className="py-3 px-3 text-center font-bold">
                    {(inv.items || []).length} item(s)
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800">
                      {inv.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-500">
                    ${inv.taxAmount.toFixed(2)}
                  </td>
                  <td className="py-3 px-3 text-right font-black text-emerald-600 dark:text-emerald-400">
                    ${inv.totalAmount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
