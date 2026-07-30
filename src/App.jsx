import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ShieldCheck,
  Flame,
  PieChart as PieIcon,
  LineChart as LineIcon,
  Sun,
  Moon,
  Info,
  Wallet,
  Calendar,
  Briefcase,
  Copy,
  Check,
  Sliders,
  Printer,
  Scale,
  HelpCircle,
  ChevronDown,
  User,
  RotateCcw,
  Zap,
  Rocket,
  ArrowRight,
  CheckCircle2,
  Lock,
  ExternalLink,
  Sparkles,
  Share2,
  PartyPopper,
  X,
  Star,
  ArrowLeft,
  BookOpen
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
  { label: 'Junior / Entry', value: 25000, annual: 300000, desc: 'Fresh Grad / BPO Associate (₱25,000/mo)' },
  { label: 'Mid-Level Pro', value: 45000, annual: 540000, desc: '3–5 Yrs Exp / Senior Specialist (₱45,000/mo)' },
  { label: 'Senior Lead', value: 85000, annual: 1020000, desc: '5–8 Yrs Exp / Team Lead (₱85,000/mo)' },
  { label: 'Managerial', value: 140000, annual: 1680000, desc: 'Department Manager / Specialist (₱140,000/mo)' },
  { label: 'Director / Executive', value: 250000, annual: 3000000, desc: 'Director / Offshore Tech / VP (₱250,000/mo)' },
];

const FAQS = [
  {
    q: 'What is the 50/20/30 Budgeting Rule?',
    a: 'The 50/20/30 framework divides your net monthly take-home salary into 3 distinct categories: 50% for essential Living Needs (housing, groceries, utilities, transportation), 30% for discretionary Wants (dining out, entertainment, hobbies), and 20% for Wealth Building & FIRE Investments.'
  },
  {
    q: 'What is the Rule of 300 in FIRE financial planning?',
    a: 'The Rule of 300 estimates your target portfolio size needed for financial independence by multiplying your monthly living expenses by 300 (equivalent to 25 years of expenses). This stems from the 4% Safe Withdrawal Rate (SWR) Trinity Study principle.'
  },
  {
    q: 'How is the 6-Month Emergency Reserve calculated?',
    a: 'Your emergency reserve covers 6 months of essential living expenses (Needs). For example, if your monthly Needs allocation is ₱12,500 (50% of ₱25,000 income), your recommended 6-month safety reserve is exactly ₱75,000 parked in a liquid high-yield savings account.'
  },
  {
    q: 'What are realistic long-term annual returns in the Philippines?',
    a: 'Tax-free government savings like Pag-IBIG MP2 have historically yielded 6.5% to 7.5% annually. Broad-market global index funds (such as the S&P 500) have historically returned ~7% to 10% annually before inflation.'
  }
];

export default function App() {
  const [isDark, setIsDark] = useState(true);

  // Multi-page Navigation State: 'landing' (Home / Hero Page) vs 'calculator' (Interactive Calculator Dashboard)
  const [currentPage, setCurrentPage] = useState('landing');

  // Caltiger-style Onboarding Wizard Modal State
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(1);

  // User Profile Inputs
  const [userName, setUserName] = useState('');
  const [currentAge, setCurrentAge] = useState(25);

  // Financial Inputs
  const [monthlyIncome, setMonthlyIncome] = useState(45000);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [currencySymbol, setCurrencySymbol] = useState('₱');

  // Custom Allocation Ratios
  const [customMode, setCustomMode] = useState(false);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);
  const [investPct, setInvestPct] = useState(20);

  // Growth Assumptions
  const [annualReturnRate, setAnnualReturnRate] = useState(7.0);
  const [inflationRate, setInflationRate] = useState(3.0);
  const [adjustForInflation, setAdjustForInflation] = useState(true);

  // Lead & PDF Modal State
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Legal Modal State
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState('disclaimer');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // UI State
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('breakdown');

  // Safe Numerical Fallbacks (Strict, zero-BS validation)
  const safeIncome = Math.max(1000, Number(monthlyIncome) || 25000);
  const safeSavings = Math.max(0, Number(currentSavings) || 0);
  const safeAge = Math.max(18, Number(currentAge) || 25);

  // Allocation Percentages
  const activeNeedsPct = customMode ? needsPct : 50;
  const activeWantsPct = customMode ? wantsPct : 30;
  const activeInvestPct = customMode ? investPct : 20;

  // Exact Mathematical Calculations
  const needsAmount = useMemo(() => safeIncome * (activeNeedsPct / 100), [safeIncome, activeNeedsPct]);
  const wantsAmount = useMemo(() => safeIncome * (activeWantsPct / 100), [safeIncome, activeWantsPct]);
  const investAmount = useMemo(() => safeIncome * (activeInvestPct / 100), [safeIncome, activeInvestPct]);
  
  const fireTargetGoal = useMemo(() => safeIncome * 300, [safeIncome]);
  const annualIncome = useMemo(() => safeIncome * 12, [safeIncome]);
  const emergencyFund = useMemo(() => (safeIncome * (activeNeedsPct / 100)) * 6, [safeIncome, activeNeedsPct]);

  const effectiveReturnRate = useMemo(() => {
    return adjustForInflation ? Math.max(0.5, annualReturnRate - inflationRate) : annualReturnRate;
  }, [annualReturnRate, inflationRate, adjustForInflation]);

  const projectionData = useMemo(() => {
    const data = [];
    const monthlyReturnRate = effectiveReturnRate / 100 / 12;
    let portfolio = safeSavings;
    const maxYears = 45;

    data.push({ year: 0, age: safeAge, portfolio: Math.round(portfolio) });

    for (let m = 1; m <= maxYears * 12; m++) {
      portfolio = portfolio * (1 + monthlyReturnRate) + investAmount;
      if (m % 12 === 0) {
        data.push({
          year: m / 12,
          age: safeAge + (m / 12),
          portfolio: Math.round(portfolio),
        });
      }
    }
    return data;
  }, [investAmount, safeSavings, effectiveReturnRate, safeAge]);

  const yearsToFire = useMemo(() => {
    const match = projectionData.find((d) => d.portfolio >= fireTargetGoal);
    return match ? match.year : '> 45';
  }, [projectionData, fireTargetGoal]);

  const targetAge = useMemo(() => {
    return typeof yearsToFire === 'number' ? safeAge + yearsToFire : 'N/A';
  }, [yearsToFire, safeAge]);

  const formatCurrency = (val) => `${currencySymbol}${Math.round(val || 0).toLocaleString('en-US')}`;

  const handleCopySummary = () => {
    const text = `HowToRetire.info - FIRE Plan Summary
----------------------------------
Monthly Take-Home: ${formatCurrency(safeIncome)} (Annual: ${formatCurrency(annualIncome)})
- Needs (50%): ${formatCurrency(needsAmount)}/mo
- Wants (30%): ${formatCurrency(wantsAmount)}/mo
- Investing (20%): ${formatCurrency(investAmount)}/mo
----------------------------------
🛡️ Emergency Reserve (6 Mo Needs): ${formatCurrency(emergencyFund)}
🎯 FIRE Target Goal (Rule of 300): ${formatCurrency(fireTargetGoal)}
⏱️ FIRE Horizon: Retiring at Age ${targetAge} (${yearsToFire} years @ ${effectiveReturnRate}% net ROI)`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 800);
  };

  const handlePrintPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>HowToRetire.info - FIRE Strategy Plan - ${userName || 'Investor'}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; color: #0f172a; padding: 40px; max-width: 800px; margin: 0 auto; line-height: 1.5; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #10b981; padding-bottom: 16px; margin-bottom: 24px; }
    .title { font-size: 24px; font-weight: 800; color: #0f172a; }
    .subtitle { font-size: 12px; color: #059669; font-weight: 700; }
    .kpi-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-bottom: 24px; }
    .kpi-card { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; }
    .kpi-label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #047857; }
    .kpi-value { font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 4px; }
    .kpi-value-green { color: #059669; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table th, .table td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; font-size: 12px; }
    .table th { background: #f1f5f9; font-weight: 700; }
    .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">HowToRetire.info</div>
      <div class="subtitle">50/20/30 Financial Independence Roadmap</div>
    </div>
    <div style="text-align: right;">
      <div style="font-size: 13px; font-weight: 800;">${userName || 'Valued Client'} (Age ${safeAge})</div>
      <div style="font-size: 11px; color: #64748b;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
    </div>
  </div>

  <div class="kpi-grid">
    <div class="kpi-card">
      <div class="kpi-label">FIRE Target Goal (Rule of 300)</div>
      <div class="kpi-value kpi-value-green">${formatCurrency(fireTargetGoal)}</div>
      <div style="font-size: 11px; color: #047857; margin-top: 4px;">Net worth required for early retirement</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">6-Month Emergency Reserve</div>
      <div class="kpi-value">${formatCurrency(emergencyFund)}</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">6 months of living needs</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Monthly Investment Engine (20%)</div>
      <div class="kpi-value kpi-value-green">${formatCurrency(investAmount)}/mo</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Automated wealth allocation</div>
    </div>
    <div class="kpi-card">
      <div class="kpi-label">Estimated FIRE Horizon</div>
      <div class="kpi-value">${yearsToFire} Years</div>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Retire at Age ${targetAge} (${effectiveReturnRate}% net ROI)</div>
    </div>
  </div>

  <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 12px;">Monthly Cash Flow Allocation</h3>
  <table class="table">
    <thead>
      <tr>
        <th>Category</th>
        <th>Percentage</th>
        <th>Monthly Amount</th>
        <th>Annual Equivalent</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Living Needs</strong> (Rent, Groceries, Utilities)</td>
        <td>${activeNeedsPct}%</td>
        <td>${formatCurrency(needsAmount)}</td>
        <td>${formatCurrency(needsAmount * 12)}</td>
      </tr>
      <tr>
        <td><strong>Discretionary Wants</strong> (Dining, Lifestyle)</td>
        <td>${activeWantsPct}%</td>
        <td>${formatCurrency(wantsAmount)}</td>
        <td>${formatCurrency(wantsAmount * 12)}</td>
      </tr>
      <tr>
        <td><strong>Wealth Building</strong> (Pag-IBIG MP2, Index Funds)</td>
        <td>${activeInvestPct}%</td>
        <td>${formatCurrency(investAmount)}</td>
        <td>${formatCurrency(investAmount * 12)}</td>
      </tr>
      <tr style="font-weight: 700; background: #f8fafc;">
        <td>Total Net Income</td>
        <td>100%</td>
        <td>${formatCurrency(safeIncome)}</td>
        <td>${formatCurrency(annualIncome)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div>Generated by HowToRetire.info for educational personal financial planning purposes. Does not constitute certified financial advice.</div>
  </div>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const pieData = [
    { name: 'Needs', value: needsAmount, color: '#3b82f6', pct: activeNeedsPct },
    { name: 'Wants', value: wantsAmount, color: '#f59e0b', pct: activeWantsPct },
    { name: 'Investing', value: investAmount, color: '#10b981', pct: activeInvestPct },
  ];

  return (
    <div className={`min-h-screen font-sans selection:bg-emerald-500 selection:text-slate-950 ${
      isDark ? 'bg-[#090d16] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* GLOBAL TOP NAVBAR */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-xl ${
        isDark ? 'bg-[#090d16]/85 border-slate-800/80' : 'bg-white/85 border-slate-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Navigation Tabs */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentPage('landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <span className="font-black text-lg tracking-tight flex items-center gap-1">
                  HowToRetire<span className="text-emerald-400">.info</span>
                </span>
              </div>
            </button>

            {/* View Switcher Buttons */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
              <button
                onClick={() => setCurrentPage('landing')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  currentPage === 'landing' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Home Overview
              </button>
              <button
                onClick={() => setCurrentPage('calculator')}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  currentPage === 'calculator' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FIRE Calculator Dashboard
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {currentPage === 'calculator' && (
              <button
                onClick={() => {
                  setOnboardingStep(1);
                  setShowWizardModal(true);
                }}
                className="px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 flex items-center gap-1.5 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-emerald-400" />
                Quick Setup
              </button>
            )}

            <button
              onClick={() => {
                if (currentPage === 'landing') {
                  setCurrentPage('calculator');
                } else {
                  setIsSubmitted(false);
                  setIsPdfModalOpen(true);
                }
              }}
              className="px-4 py-2 rounded-2xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              {currentPage === 'landing' ? (
                <>Open Calculator →</>
              ) : (
                <><Printer className="w-3.5 h-3.5" /> Download PDF</>
              )}
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className={`p-2 rounded-2xl border transition-all ${
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

      {/* ========================================================================= */}
      {/* PAGE 1: HERO & PRODUCT OVERVIEW LANDING PAGE                             */}
      {/* ========================================================================= */}
      {currentPage === 'landing' && (
        <div className="space-y-16 animate-fade-in pb-16">
          
          {/* HERO SECTION */}
          <section className="relative pt-16 pb-12 px-4 overflow-hidden border-b border-slate-800/80">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-3.5 h-3.5 fill-emerald-400" />
                Financial Independence, Retire Early Framework
              </div>

              <h1 className="text-3xl sm:text-6xl font-black tracking-tight text-slate-100 max-w-4xl mx-auto leading-tight">
                Plan Your Early Retirement With The <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400">50/20/30 FIRE Calculator</span>
              </h1>

              <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                An accurate, mathematical planning tool to structure your monthly cash flow, build a 6-month safety net, and calculate your exact retirement net worth target.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => setCurrentPage('calculator')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95"
                >
                  <Flame className="w-4 h-4 fill-slate-950" />
                  Launch Interactive Calculator →
                </button>

                <button
                  onClick={() => {
                    setOnboardingStep(1);
                    setShowWizardModal(true);
                  }}
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-extrabold text-xs transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  Take 30-Second Quick Setup
                </button>
              </div>

              {/* Verified Features Strip */}
              <div className="pt-6 flex items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-200">Rule of 300 Mathematics</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>6-Month Safety Net Reserve</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Philippine Career Salary Tiers</span>
                </div>
              </div>

            </div>
          </section>

          {/* 3-STEP EXPLANATION SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                How The 50/20/30 FIRE Model Works
              </h2>
              <p className="text-2xl font-black text-slate-100">
                A 3-Part Formula for Financial Independence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="p-6 rounded-3xl border border-slate-800/80 bg-[#0f172a]/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black text-sm">
                  50%
                </div>
                <h3 className="text-lg font-bold text-slate-100">Essential Living Needs</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Allocates 50% of your take-home pay to non-negotiable living costs (rent/mortgage, groceries, utilities, transportation, and health).
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800/80 bg-[#0f172a]/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-black text-sm">
                  30%
                </div>
                <h3 className="text-lg font-bold text-slate-100">Discretionary Wants</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Allocates 30% for enjoying life today (dining out, lifestyle, subscriptions, hobbies, travel). Sustainable budgeting requires flexibility.
                </p>
              </div>

              <div className="p-6 rounded-3xl border border-slate-800/80 bg-[#0f172a]/80 space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-sm">
                  20%
                </div>
                <h3 className="text-lg font-bold text-slate-100">FIRE Wealth Engine</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Directs 20% to building your 6-month safety net & investing in long-term compound growth assets (Pag-IBIG MP2, S&P 500 index funds).
                </p>
              </div>

            </div>

            <div className="text-center pt-4">
              <button
                onClick={() => setCurrentPage('calculator')}
                className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 inline-flex items-center gap-2"
              >
                Go To Calculator Dashboard →
              </button>
            </div>
          </section>

          {/* RECOMMENDED NEXT STEPS SECTION */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`p-8 rounded-3xl border ${
              isDark ? 'bg-gradient-to-br from-[#0f172a] to-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            } space-y-6`}>
              
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-black text-slate-100 uppercase tracking-wider">
                  🚀 Recommended Next Steps
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <a
                  href="https://maribank.ph/c/earnfreemoney?referralCode=BM284604"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 transition-all group flex flex-col justify-between space-y-3 shadow-lg shadow-emerald-500/5"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                        🏦 Digital Banking Safety Net
                      </span>
                      <ExternalLink className="w-4 h-4 text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                      MariBank High-Yield Savings (4.5% p.a.)
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Park your 6-month emergency reserve & earn daily interest credited directly to your account.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Referral Code: <strong className="text-emerald-400 font-black">BM284604</strong></span>
                    <span className="text-emerald-400 font-bold underline">Open Account →</span>
                  </div>
                </a>

                <a
                  href="https://www.pagibigfund.gov.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all group flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        📈 Wealth Building Engine
                      </span>
                      <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      Pag-IBIG MP2 & S&P 500 Guide
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Automate your monthly wealth building into tax-free government MP2 savings & broad-market index funds.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">Historical ROI: <strong className="text-indigo-400 font-bold">7.0% - 10.0% p.a.</strong></span>
                    <span className="text-indigo-400 font-bold underline">Read Guide →</span>
                  </div>
                </a>

              </div>

            </div>
          </section>

          {/* FAQ SECTION ON LANDING PAGE */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`p-6 sm:p-8 rounded-3xl border ${
              isDark ? 'bg-[#0f172a]/40 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="mb-6 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-slate-100">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, index) => (
                  <div key={index} className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-950/60">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                      className="w-full p-4 text-left font-bold text-xs text-slate-200 flex justify-between items-center gap-4 hover:bg-slate-900/60 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === index ? 'rotate-180 text-emerald-400' : ''}`} />
                    </button>
                    {openFaqIndex === index && (
                      <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PAGE 2: INTERACTIVE FIRE CALCULATOR DASHBOARD                             */}
      {/* ========================================================================= */}
      {currentPage === 'calculator' && (
        <div className="animate-fade-in pb-16">
          
          {/* Sub-header Navigation Bar */}
          <div className="bg-slate-950/60 border-b border-slate-800/80 py-3 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
              <button
                onClick={() => setCurrentPage('landing')}
                className="text-slate-400 hover:text-emerald-400 font-bold flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Home Overview
              </button>
              <div className="text-slate-400 font-semibold flex items-center gap-2">
                <span>Personalized Roadmap for <strong>{userName || 'Investor'}</strong> (Age {safeAge})</span>
              </div>
            </div>
          </div>

          {/* MAIN BENTO GRID CALCULATOR */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            
            {/* BENTO KPI SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              
              <div className={`p-6 rounded-3xl border transition-all duration-300 hover:border-emerald-500/40 ${
                isDark ? 'bg-[#0f172a]/90 border-slate-800/80 shadow-2xl shadow-emerald-500/5' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    🎯 FIRE Target Goal
                  </span>
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Flame className="w-4 h-4 fill-emerald-400" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-100 tracking-tight">
                  {formatCurrency(fireTargetGoal)}
                </div>
                <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Rule of 300: Income ({formatCurrency(safeIncome)}) × 300
                </div>
              </div>

              <div className={`p-6 rounded-3xl border transition-all duration-300 hover:border-blue-500/40 ${
                isDark ? 'bg-[#0f172a]/90 border-slate-800/80 shadow-2xl shadow-blue-500/5' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    🛡️ Safety Reserve
                  </span>
                  <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-100 tracking-tight">
                  {formatCurrency(emergencyFund)}
                </div>
                <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  6 months of Needs ({formatCurrency(needsAmount)} × 6)
                </div>
              </div>

              <div className={`p-6 rounded-3xl border transition-all duration-300 hover:border-emerald-500/40 ${
                isDark ? 'bg-[#0f172a]/90 border-slate-800/80 shadow-2xl shadow-emerald-500/5' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    💸 Monthly Investing
                  </span>
                  <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-emerald-400 tracking-tight">
                  {formatCurrency(investAmount)}<span className="text-xs text-slate-400 font-bold">/mo</span>
                </div>
                <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  20% allocated to Pag-IBIG MP2 & S&P 500
                </div>
              </div>

              <div className={`p-6 rounded-3xl border transition-all duration-300 hover:border-indigo-500/40 ${
                isDark ? 'bg-[#0f172a]/90 border-slate-800/80 shadow-2xl shadow-indigo-500/5' : 'bg-white border-slate-200 shadow-sm'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    ⏱️ Horizon to FIRE
                  </span>
                  <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-indigo-400 tracking-tight">
                  {yearsToFire} <span className="text-xs text-slate-400 font-bold">years</span>
                </div>
                <div className="mt-2.5 text-[11px] text-slate-400 flex items-center gap-1">
                  <PartyPopper className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  Retire at Age {targetAge} ({effectiveReturnRate}% net ROI)
                </div>
              </div>

            </div>

            {/* MAIN CALCULATOR CONTROLS & GRAPH */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT COLUMN: INPUT CONTROLS */}
              <div className="lg:col-span-5 space-y-6">
                
                <div className={`p-6 sm:p-7 rounded-3xl border ${
                  isDark ? 'bg-[#0f172a]/90 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-emerald-400" />
                      Monthly Net Take-Home
                    </label>
                    <div className="flex items-center bg-slate-950 rounded-2xl p-1 border border-slate-800 text-xs">
                      <button
                        onClick={() => setCurrencySymbol('₱')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all ${currencySymbol === '₱' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                      >
                        ₱ PHP
                      </button>
                      <button
                        onClick={() => setCurrencySymbol('$')}
                        className={`px-3 py-1 rounded-xl font-bold transition-all ${currencySymbol === '$' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'}`}
                      >
                        $ USD
                      </button>
                    </div>
                  </div>

                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-500">
                      {currencySymbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={monthlyIncome || ''}
                      onChange={(e) => setMonthlyIncome(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full pl-12 pr-4 py-4 text-2xl font-black rounded-2xl border transition-all outline-none ${
                        isDark
                          ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                      placeholder="25,000"
                    />
                  </div>

                  <div className="flex justify-between text-xs text-slate-400 mb-5 pb-3 border-b border-slate-800/80">
                    <span>Annual Net Income:</span>
                    <span className="font-extrabold text-slate-200">{formatCurrency(annualIncome)}/yr</span>
                  </div>

                  <div className="space-y-1.5 mb-6">
                    <div className="flex justify-between text-[11px] text-slate-500 font-semibold">
                      <span>{currencySymbol}10,000</span>
                      <span className="font-extrabold text-emerald-400">{formatCurrency(safeIncome)}</span>
                      <span>{currencySymbol}300,000</span>
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="300000"
                      step="2500"
                      value={safeIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                      Philippine Career Benchmarks
                    </span>
                    <div className="space-y-2">
                      {SALARY_BENCHMARKS.map((preset) => (
                        <button
                          key={preset.value}
                          onClick={() => setMonthlyIncome(preset.value)}
                          className={`w-full px-4 py-3 rounded-2xl text-xs text-left transition-all border flex items-center justify-between ${
                            safeIncome === preset.value
                              ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-extrabold shadow-lg shadow-emerald-500/5'
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
                            <div className="font-black text-emerald-400">{currencySymbol}{(preset.value / 1000).toFixed(0)}k/mo</div>
                            <div className="text-[10px] text-slate-500">({currencySymbol}${(preset.annual / 1000000).toFixed(2)}M/yr)</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`p-6 sm:p-7 rounded-3xl border ${
                  isDark ? 'bg-[#0f172a]/90 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
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
                      className={`text-[11px] px-3 py-1 rounded-xl font-bold transition-all border ${
                        customMode
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      {customMode ? 'Custom' : 'Standard 50/30/20'}
                    </button>
                  </div>

                  {!customMode ? (
                    <div className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                      <span className="font-bold text-slate-200 block mb-1">50/20/30 Budget Allocation:</span>
                      <span className="text-blue-400 font-bold">50% Needs</span> ({formatCurrency(needsAmount)}) • <span className="text-amber-400 font-bold">30% Wants</span> ({formatCurrency(wantsAmount)}) • <span className="text-emerald-400 font-bold">20% Investing</span> ({formatCurrency(investAmount)})
                    </div>
                  ) : (
                    <div className="space-y-4 pt-1">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-blue-400 font-bold">Needs ({needsPct}%):</span>
                          <span className="font-black text-slate-200">{formatCurrency(needsAmount)}</span>
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
                          <span className="text-amber-400 font-bold">Wants ({wantsPct}%):</span>
                          <span className="font-black text-slate-200">{formatCurrency(wantsAmount)}</span>
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
                          <span className="text-emerald-400 font-bold">Investing ({investPct}%):</span>
                          <span className="font-black text-slate-200">{formatCurrency(investAmount)}</span>
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

                <div className={`p-6 sm:p-7 rounded-3xl border ${
                  isDark ? 'bg-[#0f172a]/90 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <span className="block text-xs font-black uppercase tracking-wider text-slate-300 mb-4">
                    Growth & ROI Assumptions
                  </span>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Current Savings / Portfolio:</span>
                        <span className="font-bold text-slate-200">{formatCurrency(safeSavings)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="5000"
                        value={safeSavings}
                        onChange={(e) => setCurrentSavings(Number(e.target.value))}
                        className="w-full h-1.5 bg-slate-800 rounded appearance-none accent-emerald-500"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">Annual Return Rate (ROI):</span>
                        <span className="font-black text-emerald-400">{annualReturnRate}% p.a.</span>
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

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <label className="text-xs text-slate-300 flex items-center gap-2 cursor-pointer font-medium">
                        <input
                          type="checkbox"
                          checked={adjustForInflation}
                          onChange={(e) => setAdjustForInflation(e.target.checked)}
                          className="rounded accent-emerald-500"
                        />
                        Adjust for Inflation ({inflationRate}% p.a.)
                      </label>
                      <span className="text-xs font-bold text-slate-400">
                        Net ROI: {effectiveReturnRate}%
                      </span>
                    </div>
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: CHARTS & BREAKDOWN */}
              <div className="lg:col-span-7 space-y-6">

                <div className="flex border-b border-slate-800/80 gap-6">
                  <button
                    onClick={() => setActiveTab('breakdown')}
                    className={`pb-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'breakdown'
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <PieIcon className="w-4 h-4" />
                    Monthly Cash Flow
                  </button>

                  <button
                    onClick={() => setActiveTab('fire')}
                    className={`pb-3 text-xs font-black flex items-center gap-2 border-b-2 transition-all ${
                      activeTab === 'fire'
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <LineIcon className="w-4 h-4" />
                    FIRE Accumulation Curve ({yearsToFire} yrs)
                  </button>
                </div>

                {activeTab === 'breakdown' && (
                  <div className="space-y-6">
                    
                    <div className={`p-6 sm:p-7 rounded-3xl border ${
                      isDark ? 'bg-[#0f172a]/90 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                          Cash Flow Distribution
                        </span>
                        <span className="text-xs font-extrabold text-slate-200">
                          Total Take-Home: {formatCurrency(safeIncome)}
                        </span>
                      </div>

                      <div className="h-5 w-full bg-slate-950 rounded-2xl overflow-hidden flex border border-slate-800/80 mb-6">
                        <div
                          style={{ width: `${activeNeedsPct}%` }}
                          className="bg-blue-500 transition-all duration-300 relative flex items-center justify-center text-[11px] font-black text-white"
                        >
                          {activeNeedsPct >= 15 && `50% Needs`}
                        </div>
                        <div
                          style={{ width: `${activeWantsPct}%` }}
                          className="bg-amber-500 transition-all duration-300 relative flex items-center justify-center text-[11px] font-black text-slate-950"
                        >
                          {activeWantsPct >= 15 && `30% Wants`}
                        </div>
                        <div
                          style={{ width: `${activeInvestPct}%` }}
                          className="bg-emerald-500 transition-all duration-300 relative flex items-center justify-center text-[11px] font-black text-slate-950"
                        >
                          {activeInvestPct >= 15 && `20% Invest`}
                        </div>
                      </div>

                      <div className="divide-y divide-slate-800/60">
                        <div className="py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3.5 h-3.5 rounded-full bg-blue-500" />
                            <div>
                              <div className="text-xs font-bold text-slate-200">Living Needs ({activeNeedsPct}%)</div>
                              <div className="text-[11px] text-slate-400">Rent, groceries, utilities, health, transport</div>
                            </div>
                          </div>
                          <div className="text-base font-black text-slate-100">{formatCurrency(needsAmount)}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                        </div>

                        <div className="py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                            <div>
                              <div className="text-xs font-bold text-slate-200">Discretionary Wants ({activeWantsPct}%)</div>
                              <div className="text-[11px] text-slate-400">Dining, entertainment, subscriptions, hobbies</div>
                            </div>
                          </div>
                          <div className="text-base font-black text-slate-100">{formatCurrency(wantsAmount)}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                        </div>

                        <div className="py-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                            <div>
                              <div className="text-xs font-bold text-slate-200">Wealth Building ({activeInvestPct}%)</div>
                              <div className="text-[11px] text-slate-400">Pag-IBIG MP2, S&P 500, REITs, emergency fund</div>
                            </div>
                          </div>
                          <div className="text-base font-black text-emerald-400">{formatCurrency(investAmount)}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
                        </div>
                      </div>
                    </div>

                    <div className={`p-6 sm:p-7 rounded-3xl border ${
                      isDark ? 'bg-[#0f172a]/90 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                    } flex flex-col md:flex-row items-center gap-6`}>
                      <div className="w-full md:w-1/2 h-60 relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={85}
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
                                borderRadius: '12px',
                                color: '#fff',
                                fontSize: '12px'
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <span className="text-[10px] text-slate-400 uppercase font-black">Monthly Invest</span>
                          <span className="text-lg font-black text-emerald-400">{formatCurrency(investAmount)}</span>
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 space-y-3">
                        <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                          Target Financial Benchmarks
                        </span>
                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                          <div className="text-slate-400 mb-0.5">FIRE Goal (Rule of 300):</div>
                          <div className="text-lg font-black text-slate-100">{formatCurrency(fireTargetGoal)}</div>
                        </div>
                        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-xs">
                          <div className="text-slate-400 mb-0.5">6-Month Safety Net Reserve:</div>
                          <div className="text-lg font-black text-slate-100">{formatCurrency(emergencyFund)}</div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {activeTab === 'fire' && (
                  <div className={`p-6 sm:p-7 rounded-3xl border ${
                    isDark ? 'bg-[#0f172a]/90 border-slate-800/80' : 'bg-white border-slate-200 shadow-sm'
                  } space-y-4`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-black text-slate-100">
                          Portfolio Accumulation Curve
                        </h3>
                        <p className="text-xs text-slate-400">
                          Accumulating {formatCurrency(fireTargetGoal)} with {formatCurrency(investAmount)}/mo at {effectiveReturnRate}% net ROI.
                        </p>
                      </div>

                      <div className="px-3.5 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black">
                        Target: ~{yearsToFire} Years
                      </div>
                    </div>

                    <div className="h-72 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="portfolioGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                          <XAxis dataKey="year" stroke="#64748b" fontSize={11} tickFormatter={(v) => `Yr ${v}`} />
                          <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${currencySymbol}${(v / 1000000).toFixed(1)}M`} />
                          <RechartsTooltip
                            formatter={(val) => formatCurrency(val)}
                            labelFormatter={(yr) => `Year ${yr} (Age ${safeAge + Number(yr)})`}
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '12px'
                            }}
                          />
                          <Area type="monotone" dataKey="portfolio" stroke="#10b981" strokeWidth={3} fill="url(#portfolioGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

              </div>

            </div>

          </main>
        </div>
      )}

      {/* QUICK SETUP WIZARD MODAL */}
      {showWizardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-xl p-8 rounded-3xl border shadow-2xl space-y-6 ${
            isDark ? 'bg-[#0f172a] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <button
              onClick={() => setShowWizardModal(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black">
                  <Flame className="w-4.5 h-4.5 fill-slate-950" />
                </div>
                <span className="font-black text-base">HowToRetire.info</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                Step {onboardingStep} of 2
              </div>
            </div>

            {onboardingStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-100">
                    Personal Profile 👤
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your name and current age to calibrate your FIRE timeline.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Your Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="e.g. Alex"
                      className={`w-full px-4 py-3.5 text-sm font-bold rounded-2xl border outline-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Current Age</label>
                    <input
                      type="number"
                      min="18"
                      max="80"
                      value={currentAge || ''}
                      onChange={(e) => setCurrentAge(e.target.value === '' ? '' : Math.max(18, parseInt(e.target.value) || 18))}
                      className={`w-full px-4 py-3.5 text-sm font-bold rounded-2xl border outline-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                      placeholder="25"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setOnboardingStep(2)}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  Next Step →
                </button>
              </div>
            )}

            {onboardingStep === 2 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-black text-slate-100">
                    Monthly Take-Home & Savings 💰
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Enter your monthly net salary and current savings balance.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Monthly Net Income</label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={monthlyIncome || ''}
                      onChange={(e) => setMonthlyIncome(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full px-4 py-3.5 text-lg font-bold rounded-2xl border outline-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                      placeholder="45,000"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Current Savings</label>
                    <input
                      type="number"
                      min="0"
                      step="1000"
                      value={currentSavings || ''}
                      onChange={(e) => setCurrentSavings(e.target.value === '' ? '' : Math.max(0, parseFloat(e.target.value) || 0))}
                      className={`w-full px-4 py-3.5 text-lg font-bold rounded-2xl border outline-none ${
                        isDark ? 'bg-slate-950 border-slate-800 text-slate-100 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                      placeholder="50,000"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOnboardingStep(1)}
                    className="px-4 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => {
                      setShowWizardModal(false);
                      setCurrentPage('calculator');
                    }}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    Open Calculator Dashboard 🚀
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* LEAD GENERATION & PDF REPORT MODAL */}
      {isPdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-lg p-7 rounded-3xl border shadow-2xl transition-all ${
            isDark ? 'bg-[#0f172a] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <button
              onClick={() => setIsPdfModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                    <Printer className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      Get Your Official FIRE PDF Strategy
                    </h3>
                    <p className="text-xs text-slate-400">
                      Formatted 1-Page PDF Document for {formatCurrency(safeIncome)} monthly cash flow
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs">
                  <div className="font-bold text-slate-300 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    What’s included in your official PDF:
                  </div>
                  <ul className="space-y-1.5 text-slate-400 pl-5 list-disc">
                    <li>Formatted 50/20/30 Cash Flow Allocation ({formatCurrency(needsAmount)} Needs, {formatCurrency(wantsAmount)} Wants, {formatCurrency(investAmount)} Investing)</li>
                    <li>Official FIRE Net Worth accumulation target (<strong>{formatCurrency(fireTargetGoal)}</strong>)</li>
                    <li>6-Month Emergency Reserve Target ({formatCurrency(emergencyFund)})</li>
                    <li>Pag-IBIG MP2 & S&P 500 starter allocation roadmap</li>
                  </ul>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">Email Address <span className="text-emerald-400">*</span></label>
                    <input
                      type="email"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="alex@example.com"
                      className={`w-full px-4 py-3.5 text-xs rounded-2xl border outline-none ${
                        isDark ? 'bg-slate-950 border-slate-700 text-slate-100 focus:border-emerald-500' : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-emerald-500'
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Preparing Official PDF...</span>
                    ) : (
                      <>
                        <Printer className="w-4 h-4" />
                        Generate Official FIRE PDF Document
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
              <div className="space-y-5 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                  <Check className="w-6 h-6" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-100">Your Official PDF Report is Ready!</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Click below to open your executive 1-page PDF document and save/print it instantly.
                  </p>
                </div>

                <button
                  onClick={handlePrintPDF}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  Open & Save Official PDF Document
                </button>

                <div className="pt-4 border-t border-slate-800 text-left space-y-3">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
                    <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                    🚀 RECOMMENDED NEXT STEPS
                  </span>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <a
                      href="https://maribank.ph/c/earnfreemoney?referralCode=BM284604"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                          MariBank (High-Yield 4.5% p.a. Savings)
                          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                        </div>
                        <div className="text-[11px] text-slate-400">Park your {formatCurrency(emergencyFund)} safety net (Code: BM284604)</div>
                      </div>
                    </a>

                    <a
                      href="https://www.pagibigfund.gov.ph"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="font-bold text-slate-200 group-hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                          Pag-IBIG MP2 & S&P 500 Starter Guide
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
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

      {/* LEGAL DISCLAIMER MODAL */}
      {isLegalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`relative w-full max-w-xl p-7 rounded-3xl border shadow-2xl transition-all ${
            isDark ? 'bg-[#0f172a] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            <button
              onClick={() => setIsLegalModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Scale className="w-5 h-5 text-indigo-400" />
              <h3 className="text-base font-bold">HowToRetire.info - Legal Terms & Compliance</h3>
            </div>

            <div className="flex border-b border-slate-800 gap-4 mb-4 text-xs font-semibold">
              <button
                onClick={() => setLegalTab('disclaimer')}
                className={`pb-2 border-b-2 transition-all ${
                  legalTab === 'disclaimer' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                Financial Disclaimer
              </button>
              <button
                onClick={() => setLegalTab('affiliate')}
                className={`pb-2 border-b-2 transition-all ${
                  legalTab === 'affiliate' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                Affiliate Disclosure
              </button>
              <button
                onClick={() => setLegalTab('privacy')}
                className={`pb-2 border-b-2 transition-all ${
                  legalTab === 'privacy' ? 'border-emerald-400 text-emerald-400' : 'border-transparent text-slate-400'
                }`}
              >
                Privacy Policy
              </button>
            </div>

            <div className="text-xs text-slate-300 leading-relaxed max-h-64 overflow-y-auto space-y-3 pr-2">
              {legalTab === 'disclaimer' && (
                <>
                  <p><strong>Educational & Planning Purpose Only:</strong> HowToRetire.info is an educational personal financial planning tool designed to calculate 50/20/30 budget allocations and FIRE targets based on user inputs.</p>
                  <p><strong>Not Regulated Financial Advice:</strong> Nothing contained on HowToRetire.info constitutes professional financial, investment, tax, or legal advice. Financial markets, interest rates, and dividend yields fluctuate. Past or assumed performance (e.g. 7% ROI) is not a guarantee of future investment returns.</p>
                  <p>Always consult with a licensed Registered Financial Planner (RFP) or certified financial advisor before making major financial commitments.</p>
                </>
              )}

              {legalTab === 'affiliate' && (
                <>
                  <p><strong>Referral Link Disclosure:</strong> Some outbound links on HowToRetire.info (including MariBank digital banking referral links) are affiliate/referral links.</p>
                  <p>If you click on a referral link and sign up or open an account, HowToRetire.info may receive a referral bonus or small commission at zero extra cost to you. We only feature platforms and services that provide genuine utility for personal finance planning.</p>
                </>
              )}

              {legalTab === 'privacy' && (
                <>
                  <p><strong>Data Privacy Protection:</strong> HowToRetire.info respects user privacy and complies with global data privacy standards (including the Philippine Data Privacy Act of 2012).</p>
                  <p>When you voluntarily request a personalized FIRE PDF report by entering your email address, your information is used solely to generate and send your requested strategy materials. We never sell, trade, or rent your personal data to third parties. You may unsubscribe at any time.</p>
                </>
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setIsLegalModalOpen(false)}
                className="px-4 py-2 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
              >
                I Understand & Agree
              </button>
            </div>

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 mt-16 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-bold text-slate-400">HowToRetire.info</div>
            <div className="text-[11px] text-slate-600">© {new Date().getFullYear()} HowToRetire.info • 50/20/30 FIRE & Budgeting Framework.</div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => {
                setLegalTab('disclaimer');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Financial Disclaimer
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalTab('affiliate');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Affiliate Disclosure
            </button>
            <span>•</span>
            <button
              onClick={() => {
                setLegalTab('privacy');
                setIsLegalModalOpen(true);
              }}
              className="hover:text-slate-300 transition-colors"
            >
              Privacy Policy
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
}
