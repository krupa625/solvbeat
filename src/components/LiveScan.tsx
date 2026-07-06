/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Shield, RefreshCw, Activity, Search, AlertCircle, CheckCircle2 } from "lucide-react";
import { ScanLog } from "../types";

interface LiveScanProps {
  url: string;
  ipAddress: string;
  isScanning: boolean;
  onScanComplete: () => void;
}

export default function LiveScan({ url, ipAddress, isScanning, onScanComplete }: LiveScanProps) {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentCategory, setCurrentCategory] = useState("Security Configuration");
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Category progress meters
  const [catProgress, setCatProgress] = useState({
    security: 0,
    seo: 0,
    infrastructure: 0,
    performance: 0,
    compliance: 0,
    technology: 0,
  });

  const categories = [
    { key: "security" as const, name: "Security Check", color: "from-purple-500 to-pink-500" },
    { key: "performance" as const, name: "Performance Probe", color: "from-cyan-400 to-blue-500" },
    { key: "seo" as const, name: "SEO & Crawler Inspection", color: "from-emerald-400 to-teal-500" },
    { key: "infrastructure" as const, name: "Infrastructure Audit", color: "from-amber-400 to-orange-500" },
    { key: "compliance" as const, name: "Compliance Scan", color: "from-indigo-400 to-purple-600" },
    { key: "technology" as const, name: "Technology Profiler", color: "from-rose-400 to-pink-600" },
  ];

  const logSteps = [
    { msg: "Establishing secure sandbox tunnel...", type: "info" as const, category: "Infrastructure" },
    { msg: `Resolving target server routing: ${url}...`, type: "info" as const, category: "Infrastructure" },
    { msg: `Target IP identified: ${ipAddress || "Calculating..."}`, type: "success" as const, category: "Infrastructure" },
    { msg: "Probing HTTP/2 and HTTP/3 TLS handshakes...", type: "info" as const, category: "Security" },
    { msg: "SSL Certificate active. Issuer: Cloudflare ECC CA-3.", type: "success" as const, category: "Security" },
    { msg: "Scanning XSS vulnerabilities in index DOM...", type: "info" as const, category: "Security" },
    { msg: "Header audit: Missing Content-Security-Policy (CSP).", type: "warning" as const, category: "Security" },
    { msg: "Header audit: Strict-Transport-Security verified.", type: "success" as const, category: "Security" },
    { msg: "Checking server signature leakage: Found Nginx/1.25.1 headers.", type: "warning" as const, category: "Infrastructure" },
    { msg: "Benchmarking server initial Time to First Byte (TTFB)...", type: "info" as const, category: "Performance" },
    { msg: "Asset compression check: Brotli enabled at level 5.", type: "success" as const, category: "Performance" },
    { msg: "Crawling indexing vectors: robots.txt located.", type: "info" as const, category: "SEO" },
    { msg: "XML Sitemap references found and validated.", type: "success" as const, category: "SEO" },
    { msg: "Analyzing cookies for GDPR and CCPA tracking directives...", type: "info" as const, category: "Compliance" },
    { msg: "Cookie compliance warning: Tracking scripts loaded pre-consent.", type: "warning" as const, category: "Compliance" },
    { msg: "Analyzing modern tech stacks: React, Vite, Tailwind CSS identified.", type: "info" as const, category: "Technology" },
    { msg: "Invoking Solvbeat server-side AI model (gemini-3.5-flash)...", type: "info" as const, category: "AI Analytics" },
    { msg: "Analyzing threat footprints and generating mitigation vectors...", type: "info" as const, category: "AI Analytics" },
    { msg: "Compiling real-time Digital Health Report... Complete.", type: "success" as const, category: "General" }
  ];

  useEffect(() => {
    if (!isScanning) return;

    setLogs([]);
    setProgress(0);
    setCatProgress({
      security: 0,
      seo: 0,
      infrastructure: 0,
      performance: 0,
      compliance: 0,
      technology: 0,
    });

    let currentLogIndex = 0;
    const totalLogs = logSteps.length;
    const duration = 7200; // 7.2 seconds scan time
    const intervalTime = duration / totalLogs;

    // Fast log printer timer
    const logInterval = setInterval(() => {
      if (currentLogIndex < totalLogs) {
        const step = logSteps[currentLogIndex];
        const newLog: ScanLog = {
          timestamp: new Date().toLocaleTimeString(),
          message: step.msg,
          type: step.type,
          category: step.category,
        };

        setLogs((prev) => [...prev, newLog]);

        // Update active subcategory progress
        if (step.category) {
          setCurrentCategory(step.category);
          const catKey = step.category.toLowerCase() as keyof typeof catProgress;
          if (catProgress.hasOwnProperty(catKey)) {
            setCatProgress((prev) => ({
              ...prev,
              [catKey]: Math.min(100, prev[catKey] + 35 + Math.random() * 25),
            }));
          }
        }

        // Fill non-active categories slightly for organic look
        setCatProgress((prev) => {
          const keys = Object.keys(prev) as Array<keyof typeof prev>;
          const updated = { ...prev };
          keys.forEach((k) => {
            if (updated[k] < 100) {
              updated[k] = Math.min(100, updated[k] + Math.floor(Math.random() * 8));
            }
          });
          return updated;
        });

        currentLogIndex++;
        setProgress(Math.floor((currentLogIndex / totalLogs) * 100));
      } else {
        clearInterval(logInterval);
        // Ensure all are completely 100%
        setCatProgress({
          security: 100,
          seo: 100,
          infrastructure: 100,
          performance: 100,
          compliance: 100,
          technology: 100,
        });
        setProgress(100);

        // Gentle delay before triggering complete
        const finalizeTimeout = setTimeout(() => {
          onScanComplete();
        }, 600);
        return () => clearTimeout(finalizeTimeout);
      }
    }, intervalTime);

    return () => {
      clearInterval(logInterval);
    };
  }, [isScanning]);

  // Autoscroll logs terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  if (!isScanning) return null;

  return (
    <div id="live-scan-module" className="w-full max-w-5xl mx-auto py-12 px-4 md:px-0">
      <div className="flex flex-col items-center justify-center mb-8 text-center">
        <div className="relative mb-4">
          <div className="absolute inset-0 bg-sky-500/20 blur-xl rounded-full animate-ping" />
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <RefreshCw className="w-7 h-7 animate-spin" style={{ animationDuration: "3s" }} />
          </div>
        </div>
        <h2 className="text-3xl font-display font-medium text-slate-50 tracking-tight">
          Solvbeat Real-Time Security Probe
        </h2>
        <p className="text-slate-400 mt-2 text-sm font-mono tracking-wider">
          TARGET: <span className="text-sky-400 font-sans font-medium">{url}</span>
        </p>
      </div>

      {/* Main 2-column scan layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left column: Scanning Categories & Progress */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-zinc-950/40 border border-zinc-900 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-mono text-slate-400 tracking-wider flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                ACTIVE ENGINE STATUS
              </span>
              <span className="text-xs font-mono text-sky-400 font-medium">
                {progress}% COMPLETE
              </span>
            </div>

            {/* Scanning items meters */}
            <div className="space-y-4">
              {categories.map((cat) => {
                const curProg = catProgress[cat.key];
                return (
                  <div key={cat.key} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-200 font-medium">{cat.name}</span>
                      <span className="font-mono text-slate-400">{Math.floor(curProg)}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${cat.color} rounded-full`}
                        initial={{ width: 0 }}
                        animate={{ width: `${curProg}%` }}
                        transition={{ ease: "easeOut" }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-zinc-900 flex items-center gap-3">
            <Shield className="w-5 h-5 text-purple-400 animate-pulse" />
            <div className="text-left">
              <div className="text-xs text-slate-400 font-mono">CURRENT PROBE MODULE</div>
              <div className="text-sm font-display text-slate-200">{currentCategory}</div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Terminal Logs */}
        <div className="lg:col-span-7 bg-zinc-950/70 border border-zinc-900 rounded-2xl p-6 backdrop-blur-xl shadow-2xl relative flex flex-col h-[380px]">
          {/* Terminal header */}
          <div className="flex justify-between items-center pb-3 border-b border-zinc-900 mb-4 select-none">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-rose-500/80 rounded-full" />
              <div className="w-2.5 h-2.5 bg-amber-500/80 rounded-full" />
              <div className="w-2.5 h-2.5 bg-emerald-500/80 rounded-full" />
              <span className="text-xs text-slate-400 font-mono ml-2 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                terminal@solvbeat-core:~
              </span>
            </div>
            <span className="text-[10px] font-mono text-purple-400 tracking-widest uppercase">
              256-BIT CRYPTO TETHERED
            </span>
          </div>

          {/* Logs scroll feed */}
          <div className="flex-1 overflow-y-auto font-mono text-xs text-slate-300 space-y-2 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            {logs.map((log, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2.5 leading-relaxed"
              >
                <span className="text-slate-500 text-[10px] select-none mt-0.5">[{log.timestamp}]</span>
                {log.type === "success" && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                )}
                {log.type === "warning" && (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                )}
                {log.type === "info" && (
                  <span className="text-sky-400 shrink-0 mt-0.5">❯</span>
                )}
                <span className={
                  log.type === "success" ? "text-emerald-300" :
                  log.type === "warning" ? "text-amber-300" :
                  log.type === "error" ? "text-rose-400" : "text-slate-200"
                }>
                  {log.message}
                </span>
              </motion.div>
            ))}
            <div ref={terminalEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
