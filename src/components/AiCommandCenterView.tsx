import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  MessageSquare,
  RefreshCw,
  Send,
  Plus,
  CheckCircle2,
  Bot,
  User,
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';

export const AiCommandCenterView: React.FC = () => {
  const { medicines, salesInvoices, createPurchaseOrder, suppliers, addToast } = useApp();

  const [activeModule, setActiveModule] = useState<'demand' | 'reorder' | 'expiry' | 'chat'>('demand');

  // Loading states
  const [loadingDemand, setLoadingDemand] = useState(false);
  const [loadingReorder, setLoadingReorder] = useState(false);
  const [loadingExpiry, setLoadingExpiry] = useState(false);

  // Data states
  const [demandData, setDemandData] = useState<any[]>([]);
  const [reorderData, setReorderData] = useState<any[]>([]);
  const [expiryData, setExpiryData] = useState<any[]>([]);

  // AI Chat state
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am your Pharmix AI Operating System Assistant. Ask me anything about stock optimization, expiry risk prevention, sales insights, or drafting supplier communications."
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch AI Demand Forecast
  const handleFetchDemand = async () => {
    setLoadingDemand(true);
    try {
      const res = await fetch('/api/ai/demand-prediction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines, salesInvoices })
      });
      const data = await res.json();
      if (data.predictions) {
        setDemandData(data.predictions);
        addToast({ title: 'AI Demand Forecast Complete', message: 'Generated 90-day predictive model.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      addToast({ title: 'AI Endpoint Error', message: 'Failed to run AI demand model.', type: 'error' });
    } finally {
      setLoadingDemand(false);
    }
  };

  // Fetch AI Reorder Suggestions
  const handleFetchReorder = async () => {
    setLoadingReorder(true);
    try {
      const res = await fetch('/api/ai/reorder-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines, suppliers })
      });
      const data = await res.json();
      if (data.suggestions) {
        setReorderData(data.suggestions);
        addToast({ title: 'AI Reorder Engine Complete', message: 'Identified optimal stock reorder thresholds.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      addToast({ title: 'AI Endpoint Error', message: 'Failed to run AI reorder model.', type: 'error' });
    } finally {
      setLoadingReorder(false);
    }
  };

  // Fetch AI Expiry Risk
  const handleFetchExpiry = async () => {
    setLoadingExpiry(true);
    try {
      const res = await fetch('/api/ai/expiry-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ medicines })
      });
      const data = await res.json();
      if (data.expiryAnalysis) {
        setExpiryData(data.expiryAnalysis);
        addToast({ title: 'AI Expiry Scan Complete', message: 'Calculated potential financial risk mitigations.', type: 'success' });
      }
    } catch (err) {
      console.error(err);
      addToast({ title: 'AI Endpoint Error', message: 'Failed to run AI expiry scan.', type: 'error' });
    } finally {
      setLoadingExpiry(false);
    }
  };

  // Chat Submission
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userQuery = chatInput;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userQuery }]);
    setChatInput('');
    setChatLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userQuery,
          inventoryContext: {
            medicinesCount: (medicines || []).length,
            lowStockCount: (medicines || []).filter((m) => m.totalStock <= m.minStockAlert).length,
            medicinesList: (medicines || []).map((m) => ({ name: m.name, category: m.category, stock: m.totalStock }))
          }
        })
      });
      const data = await res.json();
      if (data.reply) {
        setChatMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      }
    } catch (err) {
      console.error(err);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: 'Sorry, I encountered an error communicating with Gemini AI.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleAutogenPoFromAi = (item: any) => {
    const med = medicines.find((m) => m.name.toLowerCase().includes(item.medicineName.toLowerCase())) || medicines[0];
    const sup = suppliers[0] || { id: 'sup_1', name: 'Astra Pharma' };
    const qty = item.suggestedOrderQty || 50;
    const unitPrice = med?.costPrice || 10;

    createPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      items: [
        {
          medicineId: med.id,
          medicineName: med.name,
          quantity: qty,
          unitPrice,
          totalPrice: qty * unitPrice
        }
      ],
      totalAmount: qty * unitPrice,
      status: 'pending',
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      notes: `AI Autogenerated PO: ${item.reasoning || 'Demand spike optimization'}`,
      createdBy: 'AI Command Engine'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/30 text-white shadow-2xl space-y-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Pharmix AI Intelligence Command Hub</h1>
            <p className="text-xs text-slate-300">
              Powered by Google Gemini 2.5 AI for predictive supply chain management and automated pharmacy decisioning.
            </p>
          </div>
        </div>

        {/* Module Selector Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800 text-xs">
          {[
            { id: 'demand', label: '1. Demand Forecasting', icon: TrendingUp },
            { id: 'reorder', label: '2. Auto Reorder Engine', icon: RefreshCw },
            { id: 'expiry', label: '3. Expiry Risk Prevention', icon: Clock },
            { id: 'chat', label: '4. AI Pharmacy Copilot', icon: MessageSquare }
          ].map((mod) => {
            const Icon = mod.icon;
            const selected = activeModule === mod.id;
            return (
              <button
                key={mod.id}
                onClick={() => setActiveModule(mod.id as any)}
                className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all ${
                  selected
                    ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{mod.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Module 1: Demand Forecasting */}
      {activeModule === 'demand' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" /> AI Demand Trend Analysis
              </h2>
              <p className="text-xs text-slate-500">
                Predicts prescription demand velocity over the next 90 days using historical sales data.
              </p>
            </div>
            <button
              onClick={handleFetchDemand}
              disabled={loadingDemand}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{loadingDemand ? 'Analyzing Models...' : 'Run Demand AI Scan'}</span>
            </button>
          </div>

          {demandData.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
              <Sparkles className="w-8 h-8 text-emerald-500 mx-auto animate-bounce" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click "Run Demand AI Scan" to trigger Gemini predictive modeling on your current medicine inventory.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(demandData || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                      {item.medicineName}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        item.predictedTrend === 'High Demand Spike'
                          ? 'bg-rose-100 text-rose-800'
                          : item.predictedTrend === 'Moderate Growth'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.predictedTrend}
                    </span>
                  </div>

                  <div className="text-xs space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Stockout Risk Level:</span>
                      <strong className="text-rose-600 dark:text-rose-400">{item.stockoutRisk}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Suggested Buffer Qty:</span>
                      <strong className="text-emerald-600">{item.suggestedBufferQty} units</strong>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
                    <strong>AI Note:</strong> {item.recommendation}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Module 2: Auto Reorder Engine */}
      {activeModule === 'reorder' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-emerald-500" /> Automated Stock Reorder Engine
              </h2>
              <p className="text-xs text-slate-500">
                AI evaluates current stock versus lead times and autogenerates supplier purchase orders.
              </p>
            </div>
            <button
              onClick={handleFetchReorder}
              disabled={loadingReorder}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{loadingReorder ? 'Scanning Thresholds...' : 'Run Auto-Reorder Scan'}</span>
            </button>
          </div>

          {reorderData.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-500 mx-auto animate-spin" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Run the Auto-Reorder scan to evaluate supplier lead times and generate 1-click purchase orders.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {(reorderData || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {item.medicineName}
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {item.urgency} Urgency
                      </span>
                    </div>
                    <div className="text-slate-500">
                      Suggested Order: <strong>{item.suggestedOrderQty} units</strong> • Supplier: <strong>{item.recommendedSupplier}</strong>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 italic">"{item.reasoning}"</p>
                  </div>

                  <button
                    onClick={() => handleAutogenPoFromAi(item)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shrink-0 flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" /> Autogen PO
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Module 3: Expiry Risk Prevention */}
      {activeModule === 'expiry' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Clock className="w-5 h-5 text-rose-500" /> Expiry Loss Prevention AI
              </h2>
              <p className="text-xs text-slate-500">
                Calculates financial loss risk for near-expiry batches and suggests promotional discounts or supplier returns.
              </p>
            </div>
            <button
              onClick={handleFetchExpiry}
              disabled={loadingExpiry}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/20 flex items-center gap-2 transition-all"
            >
              <Zap className="w-4 h-4" />
              <span>{loadingExpiry ? 'Scanning Batches...' : 'Scan Expiry Risk'}</span>
            </button>
          </div>

          {expiryData.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
              <Clock className="w-8 h-8 text-rose-500 mx-auto" />
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Scan batch expiry dates to prevent financial loss through AI promotional markdown strategies.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(expiryData || []).map((item, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                        {item.medicineName}
                      </h3>
                      <div className="text-[11px] text-slate-500 font-mono">
                        Batch: {item.batchNumber} • Expiry: {item.expiryDate}
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                      Risk: ${item.estimatedLossRisk}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1">
                    <strong className="text-emerald-600 dark:text-emerald-400">AI Mitigation Action:</strong>
                    <p className="text-slate-700 dark:text-slate-300">{item.actionRecommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Module 4: Pharmacy AI Copilot Chat */}
      {activeModule === 'chat' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Bot className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pharmix AI Assistant (Gemini 2.5)
              </h2>
              <p className="text-xs text-slate-500">
                Ask questions about drug interactions, stock levels, or supplier communications.
              </p>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-80 overflow-y-auto space-y-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 text-xs">
            {(chatMessages || []).map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white'
                      : 'bg-emerald-500 text-slate-950 font-bold'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs italic">
                <Sparkles className="w-4 h-4 text-emerald-500 animate-spin" />
                Gemini is thinking...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendChatMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask Gemini AI (e.g., 'Which items need reordering today?')..."
              className="flex-1 px-4 py-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
