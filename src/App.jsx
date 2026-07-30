import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  ShoppingBag,
  Home,
  PiggyBank,
  Sparkles,
  HelpCircle,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sliders,
  DollarSign,
  Calendar,
  Flame,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Sun,
  Moon,
  Info,
  CheckCircle2,
  ArrowRight
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
  CartesianGrid,
  Legend
} from 'recharts';
import confetti from 'canvas-confetti';

const INCOME_PRESETS = [
  { label: 'Fresh Grad / Entry', value: 22500, tag: 'Default' },
  { label: 'Mid-Level', value: 45000, tag: 'Standard' },
  { label: 'Senior Pro', value: 85000, tag: 'Growth' },
  { label: 'Manager / Tech', value: 150000, tag: 'Accelerated' },
  { label: 'Executive', value: 250000, tag: 'High Net Worth' },
];

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Inputs
  const [monthlyIncome, setMonthlyIncome] = useState(22500);
  const [currencySymbol, setCurrencySymbol] = useState('₱');
  
  // Allocation Ratios (Default 50 / 30 / 20)
  const [customMode, setCustomMode] = useState(false);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);
  const [investPct, setInvestPct] = useState(20);

  // Simulation inputs
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [annualReturnRate, setAnnualReturnRate] = useState(8); // 8% default stock/index fund ROI
  const [currentAge, setCurrentAge] = useState(25);

  // Interactive UI states
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown' | 'fire' | 'categories'

  // Standard or custom ratios
  const activeNeedsPct = customMode ? needsPct : 50;
  const activeWantsPct = customMode ? wantsPct : 30;
  const activeInvestPct = customMode ? investPct : 20;

  // Core Calculations based on FIRE 50/20/30 Rules
  const needsAmount = useMemo(() => monthlyIncome * (activeNeedsPct / 100), [monthlyIncome, activeNeedsPct]);
  const wantsAmount = useMemo(() => monthlyIncome * (activeWantsPct / 100), [monthlyIncome, activeWantsPct]);
  const investAmount = useMemo(() => monthlyIncome * (activeInvestPct / 100), [monthlyIncome, activeInvestPct]);
  
  // Specific requested metrics
  const fireTargetGoal = useMemo(() => monthlyIncome * 300, [monthlyIncome]);
  const emergencyFund = useMemo(() => (monthlyIncome * 0.50) * 6, [monthlyIncome]); // 6 Months of 50% Needs

  // FIRE Timeline Projection Calculation
  const projectionData = useMemo(() => {
    const data = [];
    const monthlyReturnRate = annualReturnRate / 100 / 12;
    let portfolio = currentSavings;
    let year = 0;
    const maxYears = 40;

    data.push({
      year: 0,
      age: currentAge,
      portfolio: Math.round(portfolio),
      target: fireTargetGoal,
    });

    for (let m = 1; m <= maxYears * 12; m++) {
      portfolio = portfolio * (1 + monthlyReturnRate) + investAmount;
      
      if (m % 12 === 0) {
        year = m / 12;
        data.push({
          year,
          age: currentAge + year,
          portfolio: Math.round(portfolio),
          target: fireTargetGoal,
        });
      }
    }
    return data;
  }, [monthlyIncome, investAmount, currentSavings, annualReturnRate, currentAge, fireTargetGoal]);

  // Years to reach FIRE
  const yearsToFire = useMemo(() => {
    const match = projectionData.find((d) => d.portfolio >= fireTargetGoal);
    if (!match) return '> 40';
    return match.year;
  }, [projectionData, fireTargetGoal]);

  // Helper to format currency
  const formatCurrency = (val) => {
    return `${currencySymbol}${Math.round(val).toLocaleString('en-US')}`;
  };

  // Trigger celebration confetti
  const handleTriggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const text = `🔥 FIRE & Budgeting Strategy Summary
Monthly Income: ${formatCurrency(monthlyIncome)}
----------------------------------
🏠 Needs (50%): ${formatCurrency(needsAmount)}/mo
🎉 Wants (30%): ${formatCurrency(wantsAmount)}/mo
📈 Investment (20%): ${formatCurrency(investAmount)}/mo
----------------------------------
🛡️ 6-Mo Emergency Fund: ${formatCurrency(emergencyFund)}
🎯 FIRE Freedom Target (Rule of 300): ${formatCurrency(fireTargetGoal)}
⏱️ Estimated FIRE Timeframe: ${yearsToFire} years (at ${annualReturnRate}% ROI)
Generated with 50/20/30 FIRE Calculator`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Distribution chart data
  const pieData = [
    { name: 'Needs (50%)', value: needsAmount, color: '#3b82f6', description: 'Essential living expenses' },
    { name: 'Wants (30%)', value: wantsAmount, color: '#f59e0b', description: 'Discretionary & fun' },
    { name: 'Investing (20%)', value: investAmount, color: '#10b981', description: 'Wealth building & FIRE' },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-emerald-500' : 'bg-emerald-400'}`} />
        <div className={`absolute top-1/3 -right-40 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-indigo-500' : 'bg-indigo-400'}`} />
        <div className={`absolute -bottom-40 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20 ${isDark ? 'bg-amber-500' : 'bg-amber-400'}`} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-8 border-b border-slate-800/60 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-emerald-400" />
                FIRE 50/20/30 Framework
              </span>
              <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Rule of 300
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              FIRE & Budgeting Calculator
            </h1>
            <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Master your cash flow, secure your 6-month safety net, and calculate your target net worth for early retirement.
            </p>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopySummary}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-sm ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-200'
              }`}
              title="Copy financial plan summary"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 text-emerald-400" />}
              {copied ? 'Copied to Clipboard!' : 'Share Plan'}
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2.5 rounded-xl transition-all border ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
                  : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </header>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Controls & Parameters (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Monthly Income Input Card */}
            <div className={`p-6 rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light'} shadow-xl`}>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-semibold tracking-wide uppercase flex items-center gap-2 text-emerald-400">
                  <DollarSign className="w-4 h-4" />
                  Monthly Income
                </label>
                <div className="flex items-center bg-slate-900/60 rounded-lg p-1 border border-slate-800 text-xs">
                  <button
                    onClick={() => setCurrencySymbol('₱')}
                    className={`px-2 py-1 rounded font-bold transition-all ${currencySymbol === '₱' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    PHP (₱)
                  </button>
                  <button
                    onClick={() => setCurrencySymbol('$')}
                    className={`px-2 py-1 rounded font-bold transition-all ${currencySymbol === '$' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                  >
                    USD ($)
                  </button>
                </div>
              </div>

              {/* Large Input Field */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-slate-400">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(Math.max(0, parseFloat(e.target.value) || 0))}
                  className={`w-full pl-12 pr-4 py-3.5 text-2xl font-extrabold rounded-xl border transition-all outline-none ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                      : 'bg-white border-slate-300 text-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                  }`}
                  placeholder="22,500"
                />
              </div>

              {/* Income Slider */}
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-xs font-medium text-slate-400">
                  <span>{currencySymbol}10,000</span>
                  <span>{formatCurrency(monthlyIncome)}</span>
                  <span>{currencySymbol}300,000</span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="300000"
                  step="2500"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
              </div>

              {/* Preset Buttons */}
              <div>
                <span className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                  Quick Salary Tiers
                </span>
                <div className="flex flex-wrap gap-2">
                  {INCOME_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setMonthlyIncome(preset.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 border ${
                        monthlyIncome === preset.value
                          ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20'
                          : isDark
                          ? 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      <span>{preset.label}</span>
                      <span className={`text-[10px] opacity-80 ${monthlyIncome === preset.value ? 'text-slate-900' : 'text-slate-400'}`}>
                        ({currencySymbol}{(preset.value / 1000).toFixed(1)}k)
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Custom Ratio Adjuster Card */}
            <div className={`p-6 rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light'} shadow-xl`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
                    Budget Allocation Strategy
                  </h3>
                </div>
                <button
                  onClick={() => {
                    setCustomMode(!customMode);
                    if (customMode) {
                      setNeedsPct(50);
                      setWantsPct(30);
                      setInvestPct(20);
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                    customMode
                      ? 'bg-indigo-500 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {customMode ? 'Custom Active' : 'Standard 50/30/20'}
                </button>
              </div>

              {!customMode ? (
                <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-slate-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-indigo-300 font-semibold block mb-0.5">The 50/20/30 Golden Rule</strong>
                    Allocates 50% to Needs (living expenses), 30% to Wants (lifestyle), and 20% to Investing (FIRE speed multiplier).
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-2">
                  {/* Needs Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-blue-400">Needs (Living Budget):</span>
                      <span className="font-bold text-slate-200">{needsPct}% ({formatCurrency(needsAmount)})</span>
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

                  {/* Wants Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-amber-400">Wants (Discretionary):</span>
                      <span className="font-bold text-slate-200">{wantsPct}% ({formatCurrency(wantsAmount)})</span>
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

                  {/* Investment Slider */}
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-emerald-400">Investing (Wealth):</span>
                      <span className="font-bold text-slate-200">{investPct}% ({formatCurrency(investAmount)})</span>
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

                  <div className="flex justify-between items-center text-xs pt-1 text-slate-400 border-t border-slate-800">
                    <span>Total Allocation:</span>
                    <span className={`font-bold ${needsPct + wantsPct + investPct === 100 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {needsPct + wantsPct + investPct}% {needsPct + wantsPct + investPct !== 100 && '(Must sum to 100%)'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* FIRE Simulation Parameters */}
            <div className={`p-6 rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light'} shadow-xl`}>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300">
                  FIRE Growth Assumptions
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Current Savings / Portfolio:</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(currentSavings)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="10000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Assumed Annual Return Rate (ROI):</span>
                    <span className="font-semibold text-emerald-400">{annualReturnRate}% p.a.</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="14"
                    step="0.5"
                    value={annualReturnRate}
                    onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Conservative (5%)</span>
                    <span>Pag-IBIG MP2 / S&P 500 (8%)</span>
                    <span>Aggressive (12%)</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Results, Metrics & Interactive Visuals (7 cols) */}
          <div className="lg:col-span-7 space-y-6">

            {/* TOP 2 HIGHLIGHT CARDS: FIRE Target & Emergency Fund */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* FIRE Target Card */}
              <div className={`p-6 rounded-2xl relative overflow-hidden transition-all duration-300 glow-emerald ${
                isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-emerald-500/30' : 'bg-white border border-emerald-200'
              }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <Flame className="w-32 h-32 text-emerald-500" />
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Flame className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    FIRE Target Goal
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight my-2">
                  {formatCurrency(fireTargetGoal)}
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Rule of 300:</strong> Target portfolio size (Monthly Income × 300) based on 4% safe withdrawal rate.
                  </span>
                </p>
              </div>

              {/* Emergency Fund Card */}
              <div className={`p-6 rounded-2xl relative overflow-hidden transition-all duration-300 glow-blue ${
                isDark ? 'bg-gradient-to-br from-slate-900 via-slate-900/90 to-blue-950/40 border border-blue-500/30' : 'bg-white border border-blue-200'
              }`}>
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <ShieldCheck className="w-32 h-32 text-blue-500" />
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    6-Mo Emergency Fund
                  </span>
                </div>

                <div className="text-3xl sm:text-4xl font-black text-slate-100 tracking-tight my-2">
                  {formatCurrency(emergencyFund)}
                </div>

                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-2">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>
                    <strong>Essential Safety Net:</strong> Covers 6 months of living needs ({formatCurrency(needsAmount)}/mo × 6).
                  </span>
                </p>
              </div>

            </div>

            {/* Nav Tabs for Detailed Views */}
            <div className="flex border-b border-slate-800 gap-4">
              <button
                onClick={() => setActiveTab('breakdown')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-all border-b-2 ${
                  activeTab === 'breakdown'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <PieIcon className="w-4 h-4" />
                50/20/30 Breakdown
              </button>

              <button
                onClick={() => setActiveTab('fire')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-all border-b-2 ${
                  activeTab === 'fire'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <LineIcon className="w-4 h-4" />
                FIRE Freedom Timeline ({yearsToFire} yrs)
              </button>

              <button
                onClick={() => setActiveTab('categories')}
                className={`pb-3 text-sm font-semibold flex items-center gap-2 transition-all border-b-2 ${
                  activeTab === 'categories'
                    ? 'border-emerald-400 text-emerald-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Home className="w-4 h-4" />
                Category Checklist
              </button>
            </div>

            {/* TAB CONTENT 1: Interactive 50/20/30 Distribution */}
            {activeTab === 'breakdown' && (
              <div className="space-y-6">
                
                {/* Visual Distribution Bar */}
                <div className={`p-6 rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light'} shadow-xl`}>
                  <h3 className="text-sm font-semibold tracking-wide uppercase text-slate-300 mb-4 flex items-center justify-between">
                    <span>Monthly Cash Flow Breakdown</span>
                    <span className="text-xs font-normal text-slate-400">Total: {formatCurrency(monthlyIncome)}/mo</span>
                  </h3>

                  {/* Multi-segment Progress Bar */}
                  <div className="h-5 w-full bg-slate-900 rounded-full overflow-hidden flex shadow-inner border border-slate-800 mb-4">
                    <div
                      style={{ width: `${activeNeedsPct}%` }}
                      className="bg-blue-500 transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-white"
                      title={`Needs: ${formatCurrency(needsAmount)}`}
                    >
                      {activeNeedsPct >= 15 && `${activeNeedsPct}%`}
                    </div>
                    <div
                      style={{ width: `${activeWantsPct}%` }}
                      className="bg-amber-500 transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-slate-950"
                      title={`Wants: ${formatCurrency(wantsAmount)}`}
                    >
                      {activeWantsPct >= 15 && `${activeWantsPct}%`}
                    </div>
                    <div
                      style={{ width: `${activeInvestPct}%` }}
                      className="bg-emerald-500 transition-all duration-500 relative group flex items-center justify-center text-[10px] font-bold text-slate-950"
                      title={`Investing: ${formatCurrency(investAmount)}`}
                    >
                      {activeInvestPct >= 15 && `${activeInvestPct}%`}
                    </div>
                  </div>

                  {/* Distribution Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Needs Card */}
                    <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-1 text-blue-400">
                        <Home className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Needs ({activeNeedsPct}%)
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-100">
                        {formatCurrency(needsAmount)}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Rent, utilities, groceries, health, transpo.
                      </p>
                    </div>

                    {/* Wants Card */}
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-1 text-amber-400">
                        <ShoppingBag className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Wants ({activeWantsPct}%)
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-100">
                        {formatCurrency(wantsAmount)}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Dining out, travel, subscriptions, hobbies.
                      </p>
                    </div>

                    {/* Investment Card */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <div className="flex items-center gap-2 mb-1 text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">
                          Investing ({activeInvestPct}%)
                        </span>
                      </div>
                      <div className="text-xl font-bold text-slate-100">
                        {formatCurrency(investAmount)}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">
                        MP2, index funds, REITs, FIRE engine.
                      </p>
                    </div>

                  </div>
                </div>

                {/* Donut Chart Visual Breakdown */}
                <div className={`p-6 rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light'} shadow-xl flex flex-col md:flex-row items-center gap-6`}>
                  <div className="w-full md:w-1/2 h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
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
                            borderRadius: '8px',
                            color: '#fff',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-xs text-slate-400 uppercase font-semibold">Invest/Mo</span>
                      <span className="text-lg font-extrabold text-emerald-400">{formatCurrency(investAmount)}</span>
                    </div>
                  </div>

                  <div className="w-full md:w-1/2 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                      Budget Ratio Legend
                    </h4>

                    {pieData.map((item) => (
                      <div key={item.name} className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800">
                        <div
                          className="w-3 h-3 rounded-full mt-1 shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center text-xs font-semibold text-slate-200">
                            <span>{item.name}</span>
                            <span>{formatCurrency(item.value)}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB CONTENT 2: FIRE Growth Projection Chart */}
            {activeTab === 'fire' && (
              <div className={`p-6 rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light'} shadow-xl space-y-6`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Flame className="w-5 h-5 text-emerald-400" />
                      FIRE Target Projection Timeline
                    </h3>
                    <p className="text-xs text-slate-400">
                      Accumulating {formatCurrency(fireTargetGoal)} with {formatCurrency(investAmount)}/mo at {annualReturnRate}% ROI.
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    Target Reached: ~{yearsToFire} Years
                  </div>
                </div>

                {/* Area Chart for Portfolio Growth */}
                <div className="h-72 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis
                        dataKey="year"
                        stroke="#64748b"
                        fontSize={12}
                        tickFormatter={(v) => `Yr ${v}`}
                      />
                      <YAxis
                        stroke="#64748b"
                        fontSize={11}
                        tickFormatter={(v) => `${currencySymbol}${(v / 1000000).toFixed(1)}M`}
                      />
                      <RechartsTooltip
                        formatter={(val) => formatCurrency(val)}
                        labelFormatter={(yr) => `Year ${yr} (Age ${currentAge + Number(yr)})`}
                        contentStyle={{
                          backgroundColor: '#0f172a',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#fff',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="portfolio"
                        name="Net Worth Portfolio"
                        stroke="#10b981"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#portfolioGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-slate-300">
                      Want to reach financial freedom even faster?
                    </span>
                  </div>
                  <button
                    onClick={handleTriggerConfetti}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all flex items-center gap-1 text-xs"
                  >
                    Celebrate Milestone 🎉
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Practical Budget Breakdown Checklist */}
            {activeTab === 'categories' && (
              <div className={`p-6 rounded-2xl ${isDark ? 'glass-card' : 'glass-card-light'} shadow-xl space-y-6`}>
                <div>
                  <h3 className="text-base font-bold text-slate-100 mb-1">
                    50/20/30 Expense Allocation Checklist
                  </h3>
                  <p className="text-xs text-slate-400">
                    Recommended allocation of your {formatCurrency(monthlyIncome)} monthly cash flow.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Needs */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase text-blue-400 flex items-center gap-1.5">
                        <Home className="w-4 h-4" /> 50% Essential Needs ({formatCurrency(needsAmount)})
                      </span>
                      <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                        Non-Negotiable
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        Rent / Mortgage & HOA Fees
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        Groceries & Meal Essentials
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        Utilities (Electricity, Water, Internet)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        Transportation / Commute / Gas
                      </li>
                    </ul>
                  </div>

                  {/* Wants */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase text-amber-400 flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4" /> 30% Discretionary Wants ({formatCurrency(wantsAmount)})
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-semibold">
                        Lifestyle & Joy
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Dining Out & Coffee Shops
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Streaming Subscriptions & Tech
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Travel, Concerts & Weekend Outings
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        Shopping & Hobbies
                      </li>
                    </ul>
                  </div>

                  {/* Investing */}
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" /> 20% Wealth Building ({formatCurrency(investAmount)})
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                        FIRE Accelerator
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Pag-IBIG MP2 (Tax-free dividend growth)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Global Index Funds (S&P 500 / VTI)
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        High-Yield Savings / Emergency Fund
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Dividend Stocks & REITs
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-800/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            Built with ⚡ React & Tailwind CSS • 50/20/30 FIRE Framework
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 transition-colors cursor-pointer" onClick={handleCopySummary}>
              Share Strategy
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">
              Rule of 300 Certified
            </span>
          </div>
        </footer>

      </div>
    </div>
  );
}
