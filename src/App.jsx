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
  Calendar
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

const INCOME_PRESETS = [
  { label: 'Entry Level', value: 22500, note: 'Fresh Grad / BPO Start' },
  { label: 'Mid Professional', value: 45000, note: '3-5 Yrs Experience' },
  { label: 'Senior Specialist', value: 85000, note: '5-8 Yrs Experience' },
  { label: 'Manager / Lead', value: 140000, note: 'Department Lead' },
  { label: 'Executive / Tech', value: 250000, note: 'Senior Tech / Exec' },
];

export default function App() {
  // Theme state
  const [isDark, setIsDark] = useState(true);

  // Inputs - Accurate baseline defaults
  const [monthlyIncome, setMonthlyIncome] = useState(22500); // ₱22,500 baseline
  const [currencySymbol, setCurrencySymbol] = useState('₱');
  
  // Allocation Ratios (Standard 50 / 30 / 20)
  const [customMode, setCustomMode] = useState(false);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);
  const [investPct, setInvestPct] = useState(20);

  // Simulation inputs with accurate real-world defaults
  const [currentSavings, setCurrentSavings] = useState(20000); // Realistic starter savings
  const [annualReturnRate, setAnnualReturnRate] = useState(7.0); // Realistic 7.0% p.a. (Pag-IBIG MP2 / S&P 500 average)
  const [inflationRate, setInflationRate] = useState(3.0); // 3% average PH inflation
  const [adjustForInflation, setAdjustForInflation] = useState(true);
  const [currentAge, setCurrentAge] = useState(25);

  // UI state
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown' | 'fire'

  // Active ratios
  const activeNeedsPct = customMode ? needsPct : 50;
  const activeWantsPct = customMode ? wantsPct : 30;
  const activeInvestPct = customMode ? investPct : 20;

  // Exact Core Calculations
  const needsAmount = useMemo(() => monthlyIncome * (activeNeedsPct / 100), [monthlyIncome, activeNeedsPct]);
  const wantsAmount = useMemo(() => monthlyIncome * (activeWantsPct / 100), [monthlyIncome, activeWantsPct]);
  const investAmount = useMemo(() => monthlyIncome * (activeInvestPct / 100), [monthlyIncome, activeInvestPct]);
  
  // Core Requested Metrics:
  // 1. FIRE Target Goal: Monthly Income * 300 (Rule of 300 = 25 yrs of income / 4% SWR)
  const fireTargetGoal = useMemo(() => monthlyIncome * 300, [monthlyIncome]);

  // 2. Emergency Fund (6 Months of Needs): (Monthly Income * 0.50) * 6
  const emergencyFund = useMemo(() => (monthlyIncome * (activeNeedsPct / 100)) * 6, [monthlyIncome, activeNeedsPct]);

  // Effective real rate of return (Nominal ROI minus Inflation if toggled)
  const effectiveReturnRate = useMemo(() => {
    return adjustForInflation ? Math.max(0.5, annualReturnRate - inflationRate) : annualReturnRate;
  }, [annualReturnRate, inflationRate, adjustForInflation]);

  // Projection timeline calculation
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

  // Exact Years to reach FIRE
  const yearsToFire = useMemo(() => {
    const match = projectionData.find((d) => d.portfolio >= fireTargetGoal);
    return match ? match.year : '> 45';
  }, [projectionData, fireTargetGoal]);

  const targetAge = useMemo(() => {
    return typeof yearsToFire === 'number' ? currentAge + yearsToFire : 'N/A';
  }, [yearsToFire, currentAge]);

  const formatCurrency = (val) => `${currencySymbol}${Math.round(val).toLocaleString('en-US')}`;

  const handleCopySummary = () => {
    const text = `FIRE & Budgeting Plan (50/20/30 Rule)
----------------------------------
Monthly Net Income: ${formatCurrency(monthlyIncome)}
- 50% Needs (Living): ${formatCurrency(needsAmount)}/mo
- 30% Wants (Discretionary): ${formatCurrency(wantsAmount)}/mo
- 20% Investing (FIRE): ${formatCurrency(investAmount)}/mo
----------------------------------
🛡️ Emergency Reserve (6 Mo Needs): ${formatCurrency(emergencyFund)}
🎯 FIRE Target (Rule of 300): ${formatCurrency(fireTargetGoal)}
⏱️ Target FIRE Timeframe: ${yearsToFire} Years (Retire at Age ${targetAge} with ${effectiveReturnRate}% net ROI)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const pieData = [
    { name: 'Needs', value: needsAmount, color: '#3b82f6', pct: activeNeedsPct },
    { name: 'Wants', value: wantsAmount, color: '#f59e0b', pct: activeWantsPct },
    { name: 'Investing', value: investAmount, color: '#10b981', pct: activeInvestPct },
  ];

  return (
    <div className={`min-h-screen font-sans ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navigation Bar */}
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
            <button
              onClick={handleCopySummary}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : isDark
                  ? 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              {copied ? 'Copied to Clipboard' : 'Export Plan'}
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

          {/* Card 2: 6-Month Emergency Fund */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                6-Mo Emergency Fund
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
                Monthly Investment ({activeInvestPct}%)
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
              20% of monthly income to Pag-IBIG MP2 / Stocks
            </div>
          </div>

          {/* Card 4: FIRE Timeframe */}
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
              Target Age: {targetAge} (at {effectiveReturnRate}% net ROI)
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
                  Monthly Income
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
              <div className="relative mb-5">
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
                  placeholder="22,500"
                />
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

              {/* Presets */}
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Philippine Salary Benchmarks
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {INCOME_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      onClick={() => setMonthlyIncome(preset.value)}
                      className={`px-3 py-2 rounded-lg text-xs text-left transition-all border ${
                        monthlyIncome === preset.value
                          ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-semibold'
                          : isDark
                          ? 'bg-slate-950 hover:bg-slate-800 text-slate-400 border-slate-800'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                      }`}
                    >
                      <div className="font-bold text-slate-200">{currencySymbol}{(preset.value).toLocaleString()}</div>
                      <div className="text-[10px] text-slate-400 truncate">{preset.label}</div>
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
                  Budget Allocation Strategy
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
                  {customMode ? 'Custom Mode' : 'Standard 50/30/20'}
                </button>
              </div>

              {!customMode ? (
                <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                  <span className="font-semibold text-slate-200 block mb-0.5">50/20/30 Model Rules:</span>
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
                Realistic Growth Benchmarks
              </span>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">Current Savings / Nest Egg:</span>
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
                    <span className="text-slate-400">Expected Annual ROI:</span>
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
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>Conservative (5%)</span>
                    <span>Pag-IBIG MP2 (7%)</span>
                    <span>S&P 500 (10%)</span>
                  </div>
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
                    
                    {/* Needs Row */}
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

                    {/* Wants Row */}
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

                    {/* Investing Row */}
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
