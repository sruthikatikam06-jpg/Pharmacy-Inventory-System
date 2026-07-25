import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { ShieldCheck, User, Lock, Mail, Key, Sparkles, X } from 'lucide-react';

export const AuthModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { login, register, demoUsers, addToast } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('pharmacist');

  const handleQuickDemoLogin = (demoUser: typeof demoUsers[0]) => {
    login(demoUser.email, demoUser.role);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      login(email || 'admin@pharmix.com', role);
      onClose();
    } else if (mode === 'register') {
      if (!name || !email) return;
      register(name, email, role);
      onClose();
    } else {
      addToast({ title: 'Password Reset Sent', message: `Reset instructions emailed to ${email}`, type: 'success' });
      setMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {mode === 'login' ? 'Pharmacy User Login' : mode === 'register' ? 'Register Staff Account' : 'Reset Password'}
          </h2>
          <p className="text-xs text-slate-500">
            {mode === 'login'
              ? 'Select a role or sign in with registered credentials.'
              : mode === 'register'
              ? 'Add new authorized staff to the pharmacy system.'
              : 'Enter registered email to receive security reset code.'}
          </p>
        </div>

        {/* Quick Demo Selector */}
        {mode === 'login' && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 space-y-2">
            <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> 1-Click Role Switcher (Demo Mode)
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(demoUsers || []).map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleQuickDemoLogin(u)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-left hover:border-emerald-500 transition-all group"
                >
                  <div className="font-extrabold text-[11px] text-slate-900 dark:text-slate-100 truncate group-hover:text-emerald-600">
                    {u.name}
                  </div>
                  <div className="text-[9px] font-bold text-emerald-600 capitalize">
                    {u.role}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {mode === 'register' && (
            <div>
              <label className="block font-semibold mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dr. Alexander Wright"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1">Work Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="pharmacist@pharmix.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          {mode !== 'forgot' && (
            <div>
              <label className="block font-semibold mb-1">Password *</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          )}

          <div>
            <label className="block font-semibold mb-1">System Role Access</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="admin">Administrator (Full Control)</option>
              <option value="pharmacist">Pharmacist (Prescriptions & Dispensing)</option>
              <option value="staff">Pharmacy Technician (Billing & Inventory)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-lg shadow-emerald-600/30 transition-all mt-2"
          >
            {mode === 'login' ? 'Sign In to Pharmacy OS' : mode === 'register' ? 'Register Staff Account' : 'Send Reset Link'}
          </button>
        </form>

        <div className="flex justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
          {mode === 'login' ? (
            <>
              <button onClick={() => setMode('forgot')} className="hover:underline">
                Forgot password?
              </button>
              <button onClick={() => setMode('register')} className="text-emerald-600 font-bold hover:underline">
                Register New Staff
              </button>
            </>
          ) : (
            <button onClick={() => setMode('login')} className="text-emerald-600 font-bold hover:underline mx-auto">
              Return to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
