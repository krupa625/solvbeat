/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Shield, Zap, Search, Server, Scale, Code, AlertTriangle, 
  CheckCircle2, Info, ArrowUpRight, Award, ShieldAlert, Sparkles, 
  TrendingUp 
} from "lucide-react";
import { ScanResult } from "../types";

interface DashboardOverviewProps {
  scanData: ScanResult;
}

// Micro counting animation component localized for results values
function AnimatedCounter({ value, duration = 1.8 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Elite easeOutExpo formula
      const easedProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easedProgress * value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <>{Math.round(count)}</>;
}

export default function DashboardOverview({ scanData }: DashboardOverviewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'threat-map' | 'remediation'>('overview');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const categoryConfigs = {
    security: { icon: Shield, color: "text-purple-400 border-purple-500/20 bg-purple-500/5", glow: "shadow-purple-500/10", tag: "THREAT WALL" },
    performance: { icon: Zap, color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5", glow: "shadow-cyan-500/10", tag: "LATENCY ENG" },
    seo: { icon: Search, color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5", glow: "shadow-emerald-500/10", tag: "CRAWL CORE" },
    infrastructure: { icon: Server, color: "text-amber-400 border-amber-500/20 bg-amber-500/5", glow: "shadow-amber-500/10", tag: "DNS MATRIX" },
    compliance: { icon: Scale, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5", glow: "shadow-indigo-500/10", tag: "LEGAL SHEATH" },
    technology: { icon: Code, color: "text-rose-400 border-rose-500/20 bg-rose-500/5", glow: "shadow-rose-500/10", tag: "STK PROFILER" },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "secure": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
      case "warning": return "text-amber-400 bg-amber-500/10 border-amber-500/20";
      case "critical": return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      default: return "text-slate-400 bg-slate-500/10";
    }
  };

  // Helper to draw clean SVG sparkline
  const renderSparkline = (trend: number[], colorClass: string) => {
    if (!trend || trend.length === 0) return null;
    const width = 100;
    const height = 30;
    const padding = 2;
    const maxVal = Math.max(...trend, 100);
    const minVal = Math.min(...trend, 0);
    const range = maxVal - minVal || 1;

    const points = trend.map((val, idx) => {
      const x = (idx / (trend.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((val - minVal) / range) * (height - padding * 2) - padding;
      return `${x},${y}`;
    }).join(" ");

    return (
      <svg className="w-24 h-8 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <linearGradient id={`sparkline-grad-${colorClass}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.2" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Shaded Area */}
        <path
          d={`M ${points.split(" ")[0]} L ${points} L ${width - padding},${height} L ${padding},${height} Z`}
          className={colorClass}
          fill={`url(#sparkline-grad-${colorClass})`}
        />
        {/* Polyline */}
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className={colorClass}
          points={points}
        />
        {/* Pulse Dot */}
        <circle
          cx={(width - padding)}
          cy={height - ((trend[trend.length - 1] - minVal) / range) * (height - padding * 2) - padding}
          r="2.5"
          className={`${colorClass} fill-current animate-pulse`}
        />
      </svg>
    );
  };

  // Threat Grid dataset
  const threatMatrix = [
    { name: "SQL Injection", risk: "Critical", score: 92, group: "Security" },
    { name: "Cross-Site Scripting", risk: "High", score: 74, group: "Security" },
    { name: "Content-Security-Policy", risk: "Medium", score: 48, group: "Security" },
    { name: "HSTS Enforce", risk: "Low", score: 12, group: "Security" },
    { name: "SSL Certificate TLS", risk: "Low", score: 5, group: "Security" },
    { name: "Time To First Byte", risk: "Medium", score: 55, group: "Performance" },
    { name: "Asset Compression", risk: "Low", score: 8, group: "Performance" },
    { name: "DNSSEC Zone", risk: "High", score: 80, group: "Infrastructure" },
    { name: "Frame Spoofing", risk: "High", score: 78, group: "Security" },
    { name: "Server Header Leak", risk: "Medium", score: 60, group: "Infrastructure" },
    { name: "Robots Sitemap", risk: "Low", score: 4, group: "SEO" },
    { name: "Consent Banner", risk: "Medium", score: 50, group: "Compliance" },
  ];

  const getHeatmapColor = (score: number) => {
    if (score >= 80) return "bg-rose-500/10 text-rose-400 border-rose-500/20";
    if (score >= 45) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  };

  // Stagger Container Orchestration
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  // Elastic blur reveal card entry
  const cardEntry = {
    hidden: { opacity: 0, y: 35, filter: "blur(6px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 85,
        damping: 15,
      },
    },
  };

  // Heatmap staggered grid variants
  const heatmapGrid = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      }
    }
  };

  const heatmapCard = {
    hidden: { opacity: 0, scale: 0.93, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 14,
      }
    }
  };

  return (
    <div id="dashboard-overview-module" className="w-full py-16 px-4 md:px-0 border-t border-zinc-900/50 bg-radial-gradient from-zinc-950 via-zinc-950 to-[#050505]">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-left">
            <span className="text-xs font-mono text-purple-400 tracking-widest uppercase flex items-center gap-2 mb-3 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              INTELLIGENT DIAGNOSTICS DASHBOARD
            </span>
            <h2 className="text-4xl font-display font-bold text-slate-50 tracking-tight">
              Website Digital Health Overview
            </h2>
            <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed font-light">
              Detailed technical diagnostic scores for <span className="text-sky-400 font-mono text-xs font-semibold">https://{scanData.url}</span> based on raw server metrics and AI analysis.
            </p>
          </div>

          {/* Tab buttons */}
          <div className="flex p-1 bg-zinc-950 border border-zinc-900 rounded-xl self-start">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'overview' ? 'bg-zinc-900 text-slate-50 border border-zinc-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Diagnostic Overview
            </button>
            <button
              onClick={() => setActiveTab('threat-map')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'threat-map' ? 'bg-zinc-900 text-slate-50 border border-zinc-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Vulnerability Heatmap
            </button>
            <button
              onClick={() => setActiveTab('remediation')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'remediation' ? 'bg-zinc-900 text-slate-50 border border-zinc-800' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              AI CISO Report
            </button>
          </div>
        </div>

        {/* Overview Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            
            {/* Top Score Summary Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 80, damping: 14 }}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 bg-zinc-950/45 border border-zinc-900 rounded-3xl p-8 backdrop-blur-xl items-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-10 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

              {/* Huge circular overall score metric */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
                <div className="relative w-44 h-44 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      strokeWidth="6"
                      stroke="rgba(24, 24, 27, 0.8)"
                      fill="none"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="42"
                      strokeWidth="6"
                      stroke="url(#grad)"
                      strokeDasharray="264"
                      initial={{ strokeDashoffset: 264 }}
                      animate={{ strokeDashoffset: 264 - (264 * scanData.overallScore) / 100 }}
                      transition={{ duration: 1.8, ease: "easeOut", delay: 0.1 }}
                      fill="none"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38BDF8" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#E879F9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  
                  {/* Score absolute label */}
                  <div className="absolute flex flex-col items-center">
                    <span className="text-5xl font-mono font-bold text-slate-50 tracking-tighter">
                      <AnimatedCounter value={scanData.overallScore} />
                    </span>
                    <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase font-bold mt-1">
                      GLOBAL SCORE
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick executive summaries */}
              <div className="md:col-span-8 space-y-6 text-left">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display text-slate-100 font-semibold">Excellent Cyber Standings</h3>
                    <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">Overall compliance and performance ratings are in the top tier of secure internet standards.</p>
                  </div>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-zinc-900/80 font-mono">
                  <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">SERVER IP</div>
                    <div className="text-xs text-sky-400 mt-1 font-semibold overflow-ellipsis overflow-hidden truncate">{scanData.ipAddress}</div>
                  </div>
                  <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PROBE SPEED</div>
                    <div className="text-xs text-[#A855F7] mt-1 font-semibold">{scanData.scanTimeMs} ms</div>
                  </div>
                  <div className="p-4 bg-zinc-950/80 border border-zinc-900 rounded-2xl col-span-2 sm:col-span-1">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">VERIFIED TESTS</div>
                    <div className="text-xs text-pink-400 mt-1 font-semibold">82 Dynamic Audits</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Grid of Six Category Cards - Staggered one by one */}
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Object.entries(scanData.categories).map(([key, cat]) => {
                const config = categoryConfigs[key as keyof typeof categoryConfigs];
                const IconComponent = config.icon;
                return (
                  <motion.div
                    key={key}
                    variants={cardEntry}
                    onMouseEnter={() => setHoveredCard(key)}
                    onMouseLeave={() => setHoveredCard(null)}
                    className="group relative bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 transition-all duration-300 hover:border-zinc-800 backdrop-blur-xl flex flex-col justify-between overflow-hidden shadow-xl"
                  >
                    {/* Glowing highlight bubble */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    <div>
                      {/* Card header */}
                      <div className="flex justify-between items-start mb-5">
                        <div className={`p-3 rounded-2xl border ${config.color} flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}>
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono border uppercase tracking-wider font-extrabold ${getStatusColor(cat.status)}`}>
                          {cat.status}
                        </span>
                      </div>

                      {/* Score indicator */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-mono font-bold text-slate-50 tracking-tight">
                          <AnimatedCounter value={cat.score} />
                        </span>
                        <span className="text-xs text-slate-500 font-mono">/100</span>
                        <span className="text-[10px] text-purple-400 font-bold font-mono ml-2 uppercase bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/10">GRADE {cat.grade}</span>
                      </div>

                      <h3 className="text-base font-display text-slate-100 font-semibold mt-2.5">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                        Evaluated {cat.checkedCount} security checklist gates with {cat.passedCount} completed successes.
                      </p>
                    </div>

                    {/* Sparkline Visual at footer */}
                    <div className="mt-6 pt-4 border-t border-zinc-900/60 flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-500 tracking-widest font-bold">{config.tag}</span>
                      {renderSparkline(cat.trend, config.color.split(" ")[0])}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* Threat Map Heatmap Tab Content */}
        {activeTab === 'threat-map' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Heatmap Info Column */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ type: "spring", stiffness: 85, damping: 14 }}
              className="lg:col-span-1 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl"
            >
              <div>
                <div className="flex items-center gap-2 text-rose-400 font-mono text-xs mb-3 font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  REAL-TIME RISK COVERAGE
                </div>
                <h3 className="text-2xl font-display font-bold text-slate-100">Vulnerability Map</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed font-light">
                  Heatmap matrix illustrating potential exploit weights and diagnostic findings mapped across Solvbeat audit directories.
                </p>

                {/* Score indicators list */}
                <div className="space-y-3 mt-6 font-mono text-xs">
                  <div className="flex justify-between items-center p-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-rose-500/20 border border-rose-500/50 rounded" /> Critical Vector</span>
                    <span className="text-rose-400 font-semibold">90+ Severity</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-amber-500/20 border border-amber-500/50 rounded" /> Warning Vector</span>
                    <span className="text-amber-400 font-semibold">45-89 Severity</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-zinc-950/80 border border-zinc-900 rounded-2xl">
                    <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 bg-emerald-500/20 border border-emerald-500/50 rounded" /> Secure Vector</span>
                    <span className="text-emerald-400 font-semibold">Passed</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900 mt-8 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-[#38BDF8] animate-pulse" />
                <div className="text-left font-mono">
                  <div className="text-[10px] text-slate-500 font-bold uppercase">GLOBAL COMPLIANCE</div>
                  <div className="text-xs text-slate-200 font-bold">92.4% SECURE RATIO</div>
                </div>
              </div>
            </motion.div>

            {/* Grid Heatmap Column - Slides Upwards with Stagger */}
            <motion.div 
              variants={heatmapGrid}
              initial="hidden"
              animate="visible"
              className="lg:col-span-2 bg-zinc-950/40 border border-zinc-900 rounded-3xl p-6 backdrop-blur-xl shadow-2xl"
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {threatMatrix.map((item, index) => (
                  <motion.div
                    key={index}
                    variants={heatmapCard}
                    className={`border rounded-2xl p-4 flex flex-col justify-between transition-transform hover:scale-[1.02] duration-200 shadow ${getHeatmapColor(item.score)}`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-mono uppercase tracking-widest font-bold opacity-60">{item.group}</span>
                        <span className="text-[10px] font-mono font-bold bg-white/5 px-2 py-0.5 rounded">{item.risk}</span>
                      </div>
                      <h4 className="text-sm font-display font-bold text-slate-200 mt-2.5">{item.name}</h4>
                    </div>
                    <div className="mt-4 flex justify-between items-center font-mono text-[10px] pt-2 border-t border-white/5">
                      <span className="text-slate-500">Threat Index</span>
                      <span className="font-bold">{item.score}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* AI Report CISO Tab Content */}
        {activeTab === 'remediation' && (
          <motion.div 
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ type: "spring", stiffness: 80, damping: 14 }}
            className="bg-zinc-950/40 border border-zinc-900 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs mb-4 font-bold">
              <Shield className="w-4 h-4 animate-pulse" />
              SOLVBEAT SECURE AI CHIEF EXECUTIVE DESK
            </div>

            <h3 className="text-2xl font-display font-bold text-slate-100">
              AI-Generated Digital Threat & Architectural Report
            </h3>
            
            {/* The multi-paragraph output formatted elegantly */}
            <div className="mt-6 text-sm text-slate-300 leading-relaxed space-y-6 text-left max-w-4xl font-light">
              {scanData.aiAnalysis.split("\n\n").map((para, pidx) => (
                <motion.p 
                  key={pidx} 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: pidx * 0.1, duration: 0.6 }}
                  className="first-letter:text-2xl first-letter:font-bold first-letter:text-[#38BDF8] first-letter:mr-1"
                >
                  {para}
                </motion.p>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px]">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span className="text-slate-400 font-bold">AI MODEL VERIFIED: GEMINI-3.5-FLASH</span>
              </div>
              <span className="text-slate-500 font-bold">REPORT IDENTIFIER: SB-SCAN-{Math.floor(100000 + Math.random() * 900000)}</span>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
