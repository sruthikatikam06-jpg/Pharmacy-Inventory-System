import React from 'react';
import { Medicine, MedicineBatch } from '../types';
import { X, Printer, QrCode, Barcode } from 'lucide-react';

interface BarcodeModalProps {
  medicine: Medicine;
  batch?: MedicineBatch;
  onClose: () => void;
}

export const BarcodeModal: React.FC<BarcodeModalProps> = ({ medicine, batch, onClose }) => {
  const barcodeValue = batch ? batch.barcode : medicine.barcode || '000000000000';
  const batchNo = batch ? batch.batchNumber : (medicine.batches || [])[0]?.batchNumber || 'N/A';
  const expiry = batch ? batch.expiryDate : (medicine.batches || [])[0]?.expiryDate || 'N/A';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Barcode className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Barcode & Batch Label Generator
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Label Preview */}
        <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-center space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Pharmix Rx Healthcare
            </p>
            <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {medicine.name}
            </h4>
            <p className="text-xs text-slate-500">
              {medicine.dosageForm} • {medicine.manufacturer}
            </p>
          </div>

          {/* Simulated Code-128 Barcode Graphic */}
          <div className="py-4 px-2 bg-white rounded-xl border border-slate-200 shadow-inner space-y-2">
            <div className="flex justify-center items-center gap-1 h-16 px-4">
              {/* Simulated barcode vertical bars */}
              {barcodeValue.split('').map((char, idx) => {
                const code = char.charCodeAt(0);
                const widthClass = code % 2 === 0 ? 'w-1.5' : 'w-0.5';
                const heightClass = idx % 3 === 0 ? 'h-full' : 'h-14';
                return (
                  <div
                    key={idx}
                    className={`${widthClass} ${heightClass} bg-slate-900 rounded-xs`}
                  />
                );
              })}
            </div>
            <p className="font-mono text-xs font-extrabold text-slate-800 tracking-widest">
              *{barcodeValue}*
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Batch No:</span>
              <strong className="text-slate-800 dark:text-slate-200 font-mono">{batchNo}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Expiry Date:</span>
              <strong className="text-rose-600 dark:text-rose-400 font-mono">{expiry}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">MRP / Selling:</span>
              <strong className="text-emerald-600 dark:text-emerald-400">${medicine.sellingPrice.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Rack Location:</span>
              <strong className="text-slate-800 dark:text-slate-200">{batch?.rackLocation || 'Aisle 1'}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Batch Label</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
