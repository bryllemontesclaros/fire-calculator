import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Home,
  Copy,
  Check,
  Sliders,
  Flame,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Sun,
  Moon,
  Info,
  Wallet,
  Calendar,
  Briefcase,
  Mail,
  Download,
  X,
  ExternalLink,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts';

const SALARY_BENCHMARKS = [
  { label: 'Junior / Entry', value: 25000, annual: 300000, desc: 'Fresh Grad / BPO Associate (₱25k/mo)' },
  { label: 'Mid-Level Pro', value: 45000, annual: 540000, desc: '3–5 Yrs Exp / Senior Specialist (₱45k/mo)' },
  { label: 'Senior Lead', value: 85000, annual: 1020000, desc: '5–8 Yrs Exp / Team Lead (₱85k/mo)' },
  { label: 'Managerial', value: 140000, annual: 1680000, desc: 'Department Manager / Specialist (₱140k/mo)' },
  { label: 'Director / Executive', value: 250000, annual: 3000000, desc: 'Director / Offshore Tech / VP (₱250k/mo)' },
];

export default function App() {
  const [isDark, setIsDark] = useState(true);

  // Core Inputs
  const [monthlyIncome, setMonthlyIncome] = useState(25000);
  const [currencySymbol, setCurrencySymbol] = useState('₱');
  
  // Custom Ratios
  const [customMode, setCustomMode] = useState(false);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);
  const [investPct, setInvestPct] = useState(20);

  // Growth Assumptions
  const [currentSavings, setCurrentSavings] = useState(25000);
  const [annualReturnRate, setAnnualReturnRate] = useState(7.0);
  const [inflationRate, setInflationRate] = useState(3.0);
  const [adjustForInflation, setAdjustForInflation] = useState(true);
  const [currentAge, setCurrentAge] = useState(25);

  // Modal & Lead Gen State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // UI state
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown');

  // Allocation Ratios
  const activeNeedsPct = customMode ? needsPct : 50;
  const activeWantsPct = customMode ? wantsPct : 30;
  const activeInvestPct = customMode ? investPct : 20;

  // Exact Calculations
  const needsAmount = useMemo(() => monthlyIncome * (activeNeedsPct / 100), [monthlyIncome, activeNeedsPct]);
  const wantsAmount = useMemo(() => monthlyIncome * (activeWantsPct / 100), [monthlyIncome, activeWantsPct]);
  const investAmount = useMemo(() => monthlyIncome * (activeInvestPct / 100), [monthlyIncome, activeInvestPct]);
  
  const fireTargetGoal = useMemo(() => monthlyIncome * 300, [monthlyIncome]);
  const annualIncome = useMemo(() => monthlyIncome * 12, [monthlyIncome]);
  const emergencyFund = useMemo(() => (monthlyIncome * (activeNeedsPct / 100)) * 6, [monthlyIncome, activeNeedsPct]);

  const effectiveReturnRate = useMemo(() => {
    return adjustForInflation ? Math.max(0.5, annualReturnRate - inflationRate) : annualReturnRate;
  }, [annualReturnRate, inflationRate, adjustForInflation]);

  const projectionData = useMemo(() => {
    const data = [];
    const monthlyReturnRate = effectiveReturnRate / 100 / 12;
    let portfolio = currentSavings;
    const maxYears = 45;

    data.push({ year: 0, age: currentAge, portfolio: Math.round(portfolio) });

    for (let m = 1; m <= maxYears * 12; m++) {
      portfolio = portfolio * (1 + monthlyReturnRate) + investAmount;
      if (m % 12 === 0) {
        data.push({
          year: m / 12,
          age: currentAge + (m / 12),
          portfolio: Math.round(portfolio),
        });
      }
    }
    return data;
  }, [investAmount, currentSavings, effectiveReturnRate, currentAge]);

  const yearsToFire = useMemo(() => {
    const match = projectionData.find((d) => d.portfolio >= fireTargetGoal);
    return match ? match.year : '> 45';
  }, [projectionData, fireTargetGoal]);

  const targetAge = useMemo(() => {
    return typeof yearsToFire === 'number' ? currentAge + yearsToFire : 'N/A';
  }, [yearsToFire, currentAge]);

  const formatCurrency = (val) => `${currencySymbol}${Math.round(val).toLocaleString('en-US')}`;

  const handleCopySummary = () => {
    const text = `FIRE & Budgeting Financial Plan
----------------------------------
Monthly Income: ${formatCurrency(monthlyIncome)} (Annual: ${formatCurrency(annualIncome)})
- 50% Needs: ${formatCurrency(needsAmount)}/mo
- 30% Wants: ${formatCurrency(wantsAmount)}/mo
- 20% Investing: ${formatCurrency(investAmount)}/mo
----------------------------------
🛡️ Emergency Reserve (6 Mo Needs): ${formatCurrency(emergencyFund)}
🎯 FIRE Target (Rule of 300): ${formatCurrency(fireTargetGoal)}
⏱️ Horizon to FIRE: ${yearsToFire} Years (Retire at Age ${targetAge} @ ${effectiveReturnRate}% net ROI)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Lead Gen Email Submission Handler
  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    setIsSubmitting(true);
    
    // Simulate API request to email marketing provider (Substack, Beehiiv, ConvertKit, or Mailchimp)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1000);
  };

  // Download Generated PDF / Text Report
  const handleDownloadReport = () => {
    const reportText = `================================================
50/20/30 FIRE FINANCIAL STRATEGY & ACTION REPORT
================================================
Prepared for: ${nameInput || 'Valued Investor'}
Generated Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

1. CASH FLOW SUMMARY
------------------------------------------------
Monthly Net Income: ${formatCurrency(monthlyIncome)}
Annual Net Take-Home: ${formatCurrency(annualIncome)}

ALLOCATION BREAKDOWN (50/20/30 RULE):
• Living Needs (${activeNeedsPct}%): ${formatCurrency(needsAmount)}/month
  (Rent, Groceries, Utilities, Health, Transportation)

• Discretionary Wants (${activeWantsPct}%): ${formatCurrency(wantsAmount)}/month
  (Dining Out, Entertainment, Subscriptions, Hobbies)

• Wealth Building / FIRE (${activeInvestPct}%): ${formatCurrency(investAmount)}/month
  (Pag-IBIG MP2, S&P 500 Index Funds, REITs, Savings)

2. CORE FINANCIAL MILESTONES
------------------------------------------------
🛡️ 6-Month Emergency Reserve: ${formatCurrency(emergencyFund)}
🎯 FIRE Freedom Target (Rule of 300): ${formatCurrency(fireTargetGoal)}

3. FIRE RETIREMENT TIMELINE
------------------------------------------------
• Current Portfolio / Savings: ${formatCurrency(currentSavings)}
• Monthly Investment Engine: ${formatCurrency(investAmount)}/month
• Net ROI (After Inflation): ${effectiveReturnRate}% p.a.
• Estimated Years to FIRE: ${yearsToFire} Years
• Projected Retirement Age: Age ${targetAge}

================================================
RECOMMENDED ACTION STEPS & RESOURCES:
• High-Yield Savings (Emergency Reserve 4%-6% p.a.): SeaBank, Maya Bank, GoTyme
• Wealth Building Engine: Pag-IBIG MP2, GoTrade (S&P 500), COL Financial
• Track Your Monthly Budget: Get the 50/20/30 Notion Budgeting Template
================================================`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `FIRE_Strategy_Report_${monthlyIncome}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const pieData = [
    { name: 'Needs', value: needsAmount, color: '#3b82f6', pct: activeNeedsPct },
    { name: 'Wants', value: wantsAmount, color: '#f59e0b', pct: activeWantsPct },
    { name: 'Investing', value: investAmount, color: '#10b981', pct: activeInvestPct },
  ];

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navigation Header */}
      <header className={`border-b sticky top-0 z-30 backdrop-blur-md ${isDark ? 'bg-slate-950/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight flex items-center gap-2">
                50/20/30 FIRE Calculator
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Rule of 300
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Primary Action Lead Magnet Button */}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              Get PDF Report
            </button>

            <button
              onClick={handleCopySummary}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? 'Copied' : 'Share'}
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-lg border transition-all ${
                isDark
                  ? 'bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle theme"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Lead Generation Banner Strip */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 border-b border-emerald-500/20 py-2.5 px-4 text-center text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-300">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Want your personalized <strong>{formatCurrency(fireTargetGoal)} FIRE Roadmap</strong> delivered to your inbox as a printable PDF report?
            </span>
          </div>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setIsModalOpen(true);
            }}
            className="text-emerald-400 font-bold hover:underline flex items-center gap-1 shrink-0"
          >
            Download Free Report <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Card 1: FIRE Target */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                FIRE Target Goal
              </span>
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                <Flame className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              {formatCurrency(fireTargetGoal)}
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              Rule of 300: Income ({formatCurrency(monthlyIncome)}) × 300
            </div>
          </div>

          {/* Card 2: 6-Month Emergency Reserve */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                6-Mo Emergency Reserve
              </span>
              <div className="p-1.5 rounded bg-blue-500/10 text-blue-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              {formatCurrency(emergencyFund)}
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              6 months of Needs ({formatCurrency(needsAmount)} × 6)
            </div>
          </div>

          {/* Card 3: Monthly Investment */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Monthly Investing ({activeInvestPct}%)
              </span>
              <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-emerald-400 tracking-tight">
              {formatCurrency(investAmount)}<span className="text-xs text-slate-400 font-normal">/mo</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              20% allocated to Pag-IBIG MP2 / Index Funds
            </div>
          </div>

          {/* Card 4: Horizon to FIRE */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Horizon to FIRE
              </span>
              <div className="p-1.5 rounded bg-indigo-500/10 text-indigo-400">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-indigo-400 tracking-tight">
              {yearsToFire} <span className="text-xs text-slate-400 font-normal">years</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              Retire at Age {targetAge} ({effectiveReturnRate}% net ROI)
            </div>
          </div>

        </div>

        {/* Form and Chart Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Income Panel */}
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-emerald-400" />
                  Monthly Net Take-Home
                </label>
                <div className="flex items-center bg-slate-950 rounded-md p-0.5 border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setCurrencySymbol('₱')}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${currencySymbol === '₱' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    ₱ PHP
                  </button>
                  <button
                    onClick={() => setCurrencySymbol('$')}
                    className={`px-2 py-0.5 rounded font-semibold transition-all ${currencySymbol === '$' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    $ USD
                  </button>
                </div>
              </div>

              {/* Income Field */}
              <div className="relative mb-4">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-slate-500">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={`w-full pl-10 pr-4 py-3 text-xl font-bold rounded-lg border transition-all outline-none ${
                    isDark
                      ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-500'
                      : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                  }`}
                  placeholder="25,000"
                />
              </div>

              <div className="flex justify-between text-xs text-slate-400 mb-5 pb-3 border-b border-slate-800">
                <span>Annual Equivalent:</span>
                <span className="font-bold text-slate-200">{formatCurrency(annualIncome)}/yr</span>
              </div>

              {/* Slider */}
              <div className="space-y-1.5 mb-6">
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>{currencySymbol}10,000</span>
                  <span className="font-semibold text-slate-300">{formatCurrency(monthlyIncome)}</span>
                  <span>{currencySymbol}300,000</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="2500"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Career Tiers */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                  Philippine Career Benchmarks
                </span>
                <div className="space-y-2">
                  {SALARY_BENCHMARKS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setMonthlyIncome(preset.value)}
                      className={`w-full px-3 py-2 rounded-lg text-xs text-left transition-all border flex items-center justify-between ${
                        monthlyIncome === preset.value
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-semibold'
                          : isDark
                          ? 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div>
                        <div className="font-bold text-slate-200">{preset.label}</div>
                        <div className="text-[11px] text-slate-400">{preset.desc}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-emerald-400">{currencySymbol}{(preset.value / 1000).toFixed(0)}k/mo</div>
                        <div className="text-[10px] text-slate-500">({currencySymbol}${(preset.annual / 1000000).toFixed(2)}M/yr)</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Ratios */}
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  Budget Allocation Ratios
                </label>
                <button
                  onClick={() => {
                    setCustomMode(!customMode);
                    if (customMode) {
                      setNeedsPct(50);
                      setWantsPct(30);
                      setInvestPct(20);
                    }
                  }}
                  className={`text-[11px] px-2 py-0.5 rounded font-semibold transition-all border ${
                    customMode
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {customMode ? 'Custom' : 'Standard 50/30/20'}
                </button>
              </div>

              {!customMode ? (
                <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-0.5">50/20/30 Budget Allocation:</span>
                  <strong>50% Needs</strong> ({formatCurrency(needsAmount)}) • <strong>30% Wants</strong> ({formatCurrency(wantsAmount)}) • <strong>20% Investing</strong> ({formatCurrency(investAmount)})
                </div>
              ) : (
                <div className="space-y-4 pt-1">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-blue-400 font-semibold">Needs ({needsPct}%):</span>
                      <span className="font-bold text-slate-200">{formatCurrency(needsAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min="30"
                      max="70"
                      value={needsPct}
                      onChange={(e) => setNeedsPct(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-blue-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-400 font-semibold">Wants ({wantsPct}%):</span>
                      <span className="font-bold text-slate-200">{formatCurrency(wantsAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="50"
                      value={wantsPct}
                      onChange={(e) => setWantsPct(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-amber-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-400 font-semibold">Investing ({investPct}%):</span>
                      <span className="font-bold text-slate-200">{formatCurrency(investAmount)}</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="60"
                      value={investPct}
                      onChange={(e) => setInvestPct(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Growth Assumptions */}
            <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                Growth Assumptions
              </span>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Current Savings / Portfolio:</span>
                    <span className="font-semibold text-slate-200">{formatCurrency(currentSavings)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="500000"
                    step="5000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Annual Return Rate (ROI):</span>
                    <span className="font-semibold text-emerald-400">{annualReturnRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="12"
                    step="0.5"
                    value={annualReturnRate}
                    onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500"
                  />
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={adjustForInflation}
                      onChange={(e) => setAdjustForInflation(e.target.checked)}
                      className="rounded accent-emerald-500"
                    />
                    Adjust for Inflation ({inflationRate}% p.a.)
                  </label>
                  <span className="text-xs font-semibold text-slate-400">
                    Net ROI: {effectiveReturnRate}%
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Breakdown & Projection (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800 gap-6">
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'breakdown'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieIcon className="w-4 h-4" />
                Monthly Breakdown
              </button>

              <button
                onClick={() => setActiveTab('fire')}
                className={`pb-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
                  activeTab === 'fire'
                    ? 'border-emerald-500 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LineIcon className="w-4 h-4" />
                FIRE Accumulation Path ({yearsToFire} yrs)
              </button>
            </div>

            {/* TAB 1: Distribution Breakdown */}
            {activeTab === 'breakdown' && (
              <div className="space-y-6">
                
                {/* Distribution Bar */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Cash Flow Allocation
                    </span>
                    <span className="text-xs font-semibold text-slate-300">
                      Monthly Total: {formatCurrency(monthlyIncome)}
                    </span>
                  </div>

                  {/* Multi-segment Progress Bar */}
                  <div className="h-4 w-full bg-slate-950 rounded-lg overflow-hidden flex border border-slate-800 mb-6">
                    <div
                      style={{ width: `${activeNeedsPct}%` }}
                      className="bg-blue-500 transition-all duration-300 relative flex items-center justify-center text-[10px] font-bold text-white"
                    >
                      {activeNeedsPct >= 15 && `50% Needs`}
                    </div>
                    <div
                      style={{ width: `${activeWantsPct}%` }}
                      className="bg-amber-500 transition-all duration-300 relative flex items-center justify-center text-[10px] font-bold text-slate-950"
                    >
                      {activeWantsPct >= 15 && `30% Wants`}
                    </div>
                    <div
                      style={{ width: `${activeInvestPct}%` }}
                      className="bg-emerald-500 transition-all duration-300 relative flex items-center justify-center text-[10px] font-bold text-slate-950"
                    >
                      {activeInvestPct >= 15 && `20% Invest`}
                    </div>
                  </div>

                  {/* Category Breakdown Table */}
                  <div className="divide-y divide-slate-800/60">
                    <div className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Living Needs ({activeNeedsPct}%)</div>
                          <div className="text-[11px] text-slate-400">Rent, groceries, utilities, health, transport</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-100">{formatCurrency(needsAmount)}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Discretionary Wants ({activeWantsPct}%)</div>
                          <div className="text-[11px] text-slate-400">Dining, entertainment, subscriptions, hobbies</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-slate-100">{formatCurrency(wantsAmount)}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                    </div>

                    <div className="py-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <div>
                          <div className="text-xs font-semibold text-slate-200">Wealth Building ({activeInvestPct}%)</div>
                          <div className="text-[11px] text-slate-400">Pag-IBIG MP2, S&P 500, REITs, emergency fund</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-emerald-400">{formatCurrency(investAmount)}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                    </div>
                  </div>
                </div>

                {/* Donut Chart & Target Breakdown */}
                <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} flex flex-col md:flex-row items-center gap-6`}>
                  <div className="w-full md:w-1/2 h-56 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={80}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{
                            backgroundColor: '#0f172a',
                            borderColor: '#334155',
                            borderRadius: '6px',
                            color: '#fff',
                            fontSize: '12px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Invest</span>
                      <span className="text-base font-bold text-emerald-400">{formatCurrency(investAmount)}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 space-y-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Target Financial Benchmarks
                    </span>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                      <div className="text-slate-400 mb-0.5">FIRE Goal (Rule of 300):</div>
                      <div className="text-base font-bold text-slate-100">{formatCurrency(fireTargetGoal)}</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs">
                      <div className="text-slate-400 mb-0.5">6-Month Emergency Reserve:</div>
                      <div className="text-base font-bold text-slate-100">{formatCurrency(emergencyFund)}</div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 2: FIRE Growth Projection Chart */}
            {activeTab === 'fire' && (
              <div className={`p-6 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'} space-y-4`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">
                      Portfolio Accumulation Curve
                    </h3>
                    <p className="text-xs text-slate-400">
                      Accumulating {formatCurrency(fireTargetGoal)} with {formatCurrency(investAmount)}/mo at {effectiveReturnRate}% net ROI.
                    </p>
                  </div>

                  <div className="px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
                    Target: ~{yearsToFire} Years
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickFormatter={(v) => `Yr ${v}`} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${currencySymbol}${(v / 1000000).toFixed(1)}M`} />
                      <RechartsTooltip
                        formatter={(val) => formatCurrency(val)}
                        labelFormatter={(yr) => `Year ${yr} (Age ${currentAge + Number(yr)})`}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '6px',
                          color: '#fff',
                          fontSize: '12px'
                        }}
                      />
                      <Area type="monotone" dataKey="portfolio" stroke="#10b981" strokeWidth={2} fill="url(#portfolioGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* LEAD GENERATION & PDF REPORT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-lg p-6 rounded-2xl border shadow-2xl transition-all ${
            isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      Get Your Customized FIRE Strategy Report
                    </h3>
                    <p className="text-xs text-slate-400">
                      Printable PDF Roadmap for {formatCurrency(monthlyIncome)} monthly cash flow
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    What’s included in your personal report:
                  </div>
                  <ul className="space-y-1.5 text-slate-400 pl-5 list-disc">
                    <li>Customized 50/20/30 Cash Flow Allocation ({formatCurrency(needsAmount)} Needs, {formatCurrency(wantsAmount)} Wants, {formatCurrency(investAmount)} Investing)</li>
                    <li>Year-by-year FIRE Net Worth accumulation curve to reach <strong>{formatCurrency(fireTargetGoal)}</strong></li>
                    <li>6-Month Emergency Reserve Target ({formatCurrency(emergencyFund)})</li>
                    <li>Pag-IBIG MP2 & Global Index Fund starter allocation checklist</li>
                  </ul>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">First Name (Optional)</label>
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      placeholder="e.g. Alex"
                      className={`w-full px-3 py-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address <span className="text-emerald-400">*</span></label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="alex@example.com"
                      className={`w-full px-3 py-2.5 text-xs rounded-lg border outline-none ${
                        isDark ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Preparing Your Report...</span>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Send Me My Customized FIRE PDF Strategy
                      </>
                    )}
                  </button>
                </form>

                <p className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
                  <Lock className="w-3 h-3 text-slate-500" />
                  We respect your privacy. Zero spam. Unsubscribe anytime.
                </p>
              </div>
            ) : (
              /* SUCCESS VIEW WITH INSTANT DOWNLOAD & MONETIZATION LINKS */
              <div className="space-y-5 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Check className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100">Your FIRE Strategy is Ready!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    We've sent a copy to <strong>{emailInput}</strong>. You can also download your report instantly below.
                  </p>
                </div>

                <button
                  onClick={handleDownloadReport}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Download className="w-4 h-4" />
                  Download FIRE Report (.TXT / Printable PDF)
                </button>

                {/* MONETIZATION & AFFILIATE RECOMMENDATION CARDS */}
                <div className="pt-4 border-t border-slate-800 text-left space-y-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    🚀 Next Steps for Your {formatCurrency(monthlyIncome)} Plan
                  </span>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    
                    {/* Affiliate Card 1: High Yield Emergency Reserve */}
                    <a
                      href="https://www.seabank.com.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                          High-Yield Emergency Reserve (4.5% p.a.)
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </div>
                        <div className="text-[11px] text-slate-400">Park your {formatCurrency(emergencyFund)} safety net in SeaBank or Maya</div>
                      </div>
                    </a>

                    {/* Affiliate Card 2: Investment Engine */}
                    <a
                      href="https://www.pagibigfund.gov.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-semibold text-slate-200 group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                          Pag-IBIG MP2 & S&P 500 Starter Guide
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </div>
                        <div className="text-[11px] text-slate-400">Automate your {formatCurrency(investAmount)}/mo wealth building</div>
                      </div>
                    </a>

                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/60 mt-16 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>50/20/30 FIRE & Budgeting Calculator</div>
          <div>Rule of 300 Financial Framework</div>
        </div>
      </footer>

    </div>
  );
}
