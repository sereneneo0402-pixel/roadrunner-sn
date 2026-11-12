import React, { useState } from 'react';
import { CorporateExpense, UserProfile } from '../types';
import { Translations } from '../i18n/translations';
import { StorageService } from '../services/storage';
import { 
  Briefcase, 
  PlusCircle, 
  Download, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  Building2,
  DollarSign,
  AlertCircle
} from 'lucide-react';

interface CorporatePassProps {
  profile: UserProfile;
  t: Translations;
}

export const CorporatePass: React.FC<CorporatePassProps> = ({ profile, t }) => {
  const [expenses, setExpenses] = useState<CorporateExpense[]>(() => StorageService.getExpenses());
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  
  // New expense form state
  const [amount, setAmount] = useState<string>('24.50');
  const [purpose, setPurpose] = useState<CorporateExpense['purpose']>('Client Meeting');
  const [operator, setOperator] = useState<string>('TADA Sedan');
  const [pickup, setPickup] = useState<string>('One Raffles Quay');
  const [dropoff, setDropoff] = useState<string>('Changi Business Park');

  const allowance = profile.corporateAllowance || { total: 350, used: 113.70, currency: 'SGD' };
  const totalClaimed = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingAllowance = Math.max(0, allowance.total - totalClaimed);
  const usedPercentage = Math.min(100, Math.round((totalClaimed / allowance.total) * 100));

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseFloat(amount) || 15.0;
    const updated = StorageService.addExpense({
      tripDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
      operator,
      pickup,
      dropoff,
      amount: parsed,
      purpose,
      status: 'Approved',
      receiptId: `RR-CORP-${Math.floor(1000 + Math.random() * 9000)}`,
      policyCompliant: true,
    });
    setExpenses(updated);
    setIsLogModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = 'Receipt ID,Date,Operator,Pickup,Dropoff,Purpose,Amount (SGD),Status\n';
    const rows = expenses.map(e => 
      `"${e.receiptId}","${e.tripDate}","${e.operator}","${e.pickup}","${e.dropoff}","${e.purpose}",${e.amount.toFixed(2)},"${e.status}"`
    ).join('\n');
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RoadRunner-Corporate-Claims-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-7 h-7 text-indigo-600" />
            {t.corporateTitle}
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            {t.corporateSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLogModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t.logNewExpense}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>{t.exportClaim}</span>
          </button>
        </div>
      </div>

      {/* 1. Monthly Allowance Progress Tracker */}
      <section 
        aria-labelledby="allowance-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase text-indigo-600 tracking-wider">
              Corporate Travel Account
            </span>
            <h2 id="allowance-heading" className="text-xl font-bold text-slate-900 mt-0.5">
              {profile.name} (Employee Pass)
            </h2>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Policy: Capped rides after 8:00 PM or valid client meetings</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-semibold text-slate-400 block">{t.remaining}</span>
            <span className="text-3xl font-black text-slate-900 font-mono">
              SGD ${remainingAllowance.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 block">
              of SGD ${allowance.total.toFixed(2)} total budget
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200 flex">
            <div
              style={{ width: `${usedPercentage}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full transition-all duration-500"
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 font-medium">
            <span>Used: ${totalClaimed.toFixed(2)} ({usedPercentage}%)</span>
            <span>Limit: ${allowance.total.toFixed(2)} SGD</span>
          </div>
        </div>
      </section>

      {/* 2. Recent Commute Claims List */}
      <section 
        aria-labelledby="claims-heading"
        className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 id="claims-heading" className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            {t.recentClaims}
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {expenses.length} claims filed
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {expenses.map(expense => (
            <div 
              key={expense.id}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors rounded-xl px-2"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-slate-900">
                    {expense.purpose}
                  </span>
                  <span className="text-xs text-slate-400">•</span>
                  <span className="text-xs font-semibold text-slate-600">
                    {expense.operator}
                  </span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-md">
                    {expense.status}
                  </span>
                </div>

                <div className="text-xs text-slate-500">
                  {expense.pickup} ➔ {expense.dropoff}
                </div>

                <div className="text-[11px] text-slate-400 font-mono">
                  Receipt: {expense.receiptId} • Date: {expense.tripDate}
                </div>
              </div>

              <div className="sm:text-right shrink-0">
                <div className="text-lg font-black text-slate-900 font-mono">
                  SGD ${expense.amount.toFixed(2)}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 sm:justify-end">
                  <CheckCircle2 className="w-3 h-3" /> Policy Approved
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Log Work Ride Modal */}
      {isLogModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in"
          role="dialog"
        >
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-lg font-black text-slate-900 mb-1">
              {t.logNewExpense}
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Submit your ride claim for direct company reimbursement
            </p>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Claim Amount (SGD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 font-mono text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Business Purpose
                </label>
                <select
                  value={purpose}
                  onChange={e => setPurpose(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 text-sm font-semibold bg-white"
                >
                  <option value="Client Meeting">Client Meeting</option>
                  <option value="Late Night Commute">Late Night Commute (After 8 PM)</option>
                  <option value="Airport Transfer">Airport Transfer (Flight Business)</option>
                  <option value="Team Transport">Team Transport</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Operator / Ride Type
                </label>
                <input
                  type="text"
                  required
                  value={operator}
                  onChange={e => setOperator(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-indigo-600 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    From
                  </label>
                  <input
                    type="text"
                    required
                    value={pickup}
                    onChange={e => setPickup(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    To
                  </label>
                  <input
                    type="text"
                    required
                    value={dropoff}
                    onChange={e => setDropoff(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border-2 border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Complies with company travel policy. Automatic approval.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLogModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                >
                  Submit Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
