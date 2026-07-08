/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Terminal, Shield, RefreshCw, Activity, Search, AlertCircle, 
  CheckCircle2, ShieldAlert, Cpu, Globe, Zap, CheckSquare, Sparkles, 
  Eye, Lock, Mail, ServerCrash, FileCode, Check, ArrowLeft
} from "lucide-react";
import { ScanLog } from "../types";
import CyberCore from "./CyberCore";

function ScanningCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Particle nodes definition
    const particlesCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      pulse: number;
    }> = [];

    for (let i = 0; i < particlesCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: Math.random() * 2 + 1,
        pulse: Math.random() * Math.PI,
      });
    }

    let radarAngle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw animated cyber grid
      ctx.strokeStyle = "rgba(168, 85, 247, 0.04)";
      ctx.lineWidth = 1;
      const gridSize = 45;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // 2. Radar sweep glow effect around center screen
      radarAngle += 0.005;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadarRadius = Math.max(width, height) * 0.6;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(radarAngle);

      // Gradient for radar sweep wedge
      const radarGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadarRadius);
      radarGrad.addColorStop(0, "rgba(56, 189, 248, 0.04)");
      radarGrad.addColorStop(1, "rgba(56, 189, 248, 0)");

      ctx.fillStyle = radarGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, maxRadarRadius, 0, Math.PI / 4);
      ctx.lineTo(0, 0);
      ctx.fill();

      // Sharp sweep line
      ctx.strokeStyle = "rgba(56, 189, 248, 0.12)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(maxRadarRadius, 0);
      ctx.stroke();

      ctx.restore();

      // 3. Update and draw connection node networks
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const currentRadius = p.r + Math.sin(p.pulse) * 0.5;

        // Draw node
        ctx.fillStyle = idx % 3 === 0 ? "rgba(168, 85, 247, 0.35)" : "rgba(56, 189, 248, 0.35)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes
        for (let j = idx + 1; j < particlesCount; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.15;
            ctx.strokeStyle = idx % 2 === 0 ? `rgba(168, 85, 247, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // 4. Subtle center scanning concentric rings
      ctx.strokeStyle = "rgba(168, 85, 247, 0.03)";
      ctx.lineWidth = 1;
      for (let r = 100; r < maxRadarRadius; r += 150) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

interface LiveScanProps {
  url: string;
  ipAddress: string;
  isScanning: boolean;
  onScanComplete: () => void;
  onBack: () => void;
}

export default function LiveScan({ url, ipAddress, isScanning, onScanComplete, onBack }: LiveScanProps) {
  const [progress, setProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<ScanLog[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const emittedRef = useRef<Set<number>>(new Set());

  // 15 Live modules requested
  const liveModulesList = [
    { name: "DNS Lookup", icon: Globe },
    { name: "SSL Certificate", icon: Lock },
    { name: "HTTP Headers", icon: Terminal },
    { name: "Security Headers", icon: Shield },
    { name: "Cookie Analysis", icon: Eye },
    { name: "Robots.txt", icon: FileCode },
    { name: "Sitemap", icon: Search },
    { name: "SEO", icon: Search },
    { name: "Technology Detection", icon: Cpu },
    { name: "Performance", icon: Zap },
    { name: "Infrastructure", icon: ServerCrash },
    { name: "Compliance", icon: CheckSquare },
    { name: "Email Security", icon: Mail },
    { name: "OWASP Security", icon: ShieldAlert },
    { name: "AI Analysis", icon: Sparkles },
  ];

  // 10 animated terminal log steps requested
  const logMilestones = [
    { progress: 0, msg: "Connecting...", type: "info" as const },
    { progress: 10, msg: "Resolving DNS...", type: "info" as const },
    { progress: 20, msg: "Checking SSL...", type: "info" as const },
    { progress: 30, msg: "Reading Headers...", type: "info" as const },
    { progress: 42, msg: "Checking CSP...", type: "info" as const },
    { progress: 55, msg: "Detecting Technologies...", type: "info" as const },
    { progress: 68, msg: "Running Security Checks...", type: "info" as const },
    { progress: 80, msg: "Analyzing SEO...", type: "info" as const },
    { progress: 90, msg: "Generating AI Report...", type: "info" as const },
    { progress: 97, msg: "Preparing Dashboard...", type: "info" as const },
  ];

  // Map progress to active module states dynamically
  const getModuleState = (idx: number, currentProgress: number) => {
    // 15 modules distributed across 0-100%
    const startPercents = [0, 8, 16, 23, 30, 37, 44, 51, 58, 65, 72, 79, 85, 91, 96];
    const endPercents =   [7, 15, 22, 29, 36, 43, 50, 57, 64, 71, 78, 84, 90, 95, 100];
    
    const start = startPercents[idx];
    const end = endPercents[idx];
    
    if (currentProgress < start) {
      return { status: "pending", text: "Waiting", percent: 0 };
    } else if (currentProgress >= end) {
      return { status: "completed", text: "Completed", percent: 100 };
    } else {
      const subPercent = Math.floor(((currentProgress - start) / (end - start)) * 100);
      return { status: "scanning", text: `${subPercent}%`, percent: subPercent };
    }
  };

  // Determine bottom stages progress highlight
  const stages = [
    { name: "Connecting", min: 0, max: 15 },
    { name: "Analyzing", min: 16, max: 35 },
    { name: "Scanning", min: 36, max: 65 },
    { name: "Processing", min: 66, max: 85 },
    { name: "Generating Report", min: 86, max: 99 },
    { name: "Completed", min: 100, max: 100 },
  ];

  // Dynamic status text in top header
  const getStatusText = (prog: number) => {
    if (prog < 15) return "Establishing Sandbox Connection...";
    if (prog < 35) return "Performing Zone Queries & DNS audits...";
    if (prog < 65) return "Scanning DOM structures & Headers...";
    if (prog < 85) return "Benchmarking Assets & Accessibility...";
    if (prog < 99) return "Invoking Solvbeat AI CISO engine...";
    return "Scan Completed successfully!";
  };

  // Run smooth progress ticker
  useEffect(() => {
    if (!isScanning) return;

    setProgress(0);
    setTerminalLogs([]);
    emittedRef.current.clear();

    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress < 100) {
        // Non-jumping continuous increments of 1-2% every 80ms for a perfectly smooth flow
        const increment = Math.random() > 0.7 ? 2 : 1;
        currentProgress = Math.min(100, currentProgress + increment);
        setProgress(currentProgress);
      } else {
        clearInterval(interval);
        
        // Hold on 100% for exactly 1 second, display success notification, then complete
        const timeout = setTimeout(() => {
          onScanComplete();
        }, 1000);
        return () => clearTimeout(timeout);
      }
    }, 80);

    return () => {
      clearInterval(interval);
    };
  }, [isScanning]);

  // Feed terminal logs dynamically based on progress
  useEffect(() => {
    logMilestones.forEach((m) => {
      if (progress >= m.progress && !emittedRef.current.has(m.progress)) {
        emittedRef.current.add(m.progress);
        const timestamp = new Date().toLocaleTimeString();
        setTerminalLogs((prev) => [
          ...prev,
          {
            timestamp,
            message: m.msg,
            type: m.progress === 97 || m.progress === 0 ? "success" : "info"
          }
        ]);
      }
    });
  }, [progress]);

  // Handle automatic terminal scroll down
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  if (!isScanning) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="fixed inset-0 z-50 bg-[#040406] overflow-y-auto flex flex-col justify-between p-4 md:p-8 font-sans selection:bg-[#A855F7]/30 selection:text-white"
      >
        {/* Animated Cyber Hologram Grid Overlays */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <ScanningCanvas />
          <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#A855F7]/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#38BDF8]/5 rounded-full blur-[100px]" />
          
          {/* Moving scanline laser sweep */}
          <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#A855F7]/30 to-transparent top-0 animate-[scan_6s_infinite_linear]" />
        </div>

        {/* TOP NAVBAR / HEADER */}
        <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-between border-b border-white/5 pb-4 md:pb-6 mb-6">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-xs md:text-sm font-mono text-slate-400 hover:text-white transition-colors cursor-pointer bg-transparent border-none py-1.5 px-3 rounded-lg hover:bg-white/5 border border-white/10"
          >
            <ArrowLeft className="w-4 h-4 text-[#A855F7]" />
            ← Back to Home
          </button>

          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-2xl px-4 py-2 text-right">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono text-[#A855F7] tracking-wider uppercase font-bold">TARGET HOST</span>
              <span className="text-xs md:text-sm text-white font-mono font-bold truncate max-w-[180px] sm:max-w-xs">{url}</span>
            </div>
          </div>
        </div>

        {/* MAIN RESPONSIVE TWO-COLUMN GRID */}
        <div className="relative z-10 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch flex-1 py-2">
          
          {/* Left Column: Progress, Modules, Terminal Logs */}
          <div className="lg:col-span-8 flex flex-col justify-start space-y-6">
            
            {/* OVERALL PROGRESS PANEL */}
            <div className="bg-zinc-950/40 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl relative overflow-hidden shadow-2xl space-y-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">Current Status</div>
                  <div className="text-lg font-bold font-display text-white flex items-center gap-2">
                    {progress === 100 ? (
                      <span className="text-emerald-400 flex items-center gap-1.5 font-mono text-base font-extrabold uppercase tracking-wide">
                        <CheckCircle2 className="w-5 h-5" />
                        ✓ Scan Complete
                      </span>
                    ) : (
                      <span className="text-sky-400 flex items-center gap-2 font-mono text-base font-extrabold uppercase tracking-wide animate-pulse">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Scanning...
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Global Progress</div>
                  <div className="text-3xl font-mono font-black text-white">{progress}%</div>
                </div>
              </div>

              {/* Real animated progress bar smoothly increasing */}
              <div className="w-full bg-zinc-900/40 h-3.5 rounded-full overflow-hidden border border-white/5 p-[1.5px] relative">
                <motion.div 
                  className="h-full bg-gradient-to-r from-sky-400 via-[#A855F7] to-pink-500 rounded-full shadow-[0_0_12px_rgba(168,85,247,0.5)]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear", duration: 0.1 }}
                />
              </div>

              {progress === 100 && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-2 bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20"
                >
                  <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                  Preparing Results...
                </motion.div>
              )}
            </div>

            {/* SCAN MODULES GRID */}
            <div className="bg-black/60 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl relative overflow-hidden shadow-2xl space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-white/5">
                <span className="text-[10px] font-mono text-[#94A3B8] tracking-widest flex items-center gap-2 uppercase font-bold">
                  <ShieldAlert className="w-4 h-4 text-[#A855F7] animate-pulse" />
                  CYBERSECURITY AUDIT SEGMENTS ({liveModulesList.length})
                </span>
                <span className="text-[9px] font-mono text-[#38BDF8] tracking-wider uppercase font-extrabold bg-[#38BDF8]/10 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/20">
                  REALTIME SCAN
                </span>
              </div>

              {/* 15 Modules Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {liveModulesList.map((mod, idx) => {
                  const state = getModuleState(idx, progress);
                  const ModIcon = mod.icon;
                  const isCompleted = state.status === "completed";
                  const isScanning = state.status === "scanning";

                  return (
                    <motion.div
                      key={idx}
                      className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between gap-3 relative overflow-hidden backdrop-blur-md ${
                        isCompleted 
                          ? "bg-emerald-500/[0.03] border-emerald-500/25 shadow-[0_0_15px_rgba(16,185,129,0.02)]" 
                          : isScanning 
                          ? "bg-[#A855F7]/[0.03] border-[#A855F7]/35 shadow-[0_0_15px_rgba(168,85,247,0.03)]" 
                          : "bg-white/[0.01] border-white/5 opacity-40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className={`p-1.5 rounded-lg shrink-0 ${
                          isCompleted ? "text-emerald-400 bg-emerald-500/10" : isScanning ? "text-[#38BDF8] bg-sky-500/10" : "text-slate-500 bg-white/5"
                        }`}>
                          <ModIcon className={`w-4 h-4 ${isScanning ? "animate-pulse" : ""}`} />
                        </div>
                        <div className="truncate">
                          <div className="text-[11px] text-slate-100 font-medium font-display leading-tight truncate">
                            {mod.name}
                          </div>
                          <div className={`text-[9px] font-mono mt-0.5 leading-none font-medium ${
                            isCompleted ? "text-emerald-400" : isScanning ? "text-[#38BDF8]" : "text-slate-500"
                          }`}>
                            {isCompleted ? "Completed" : isScanning ? `Analyzing ${state.text}` : "Waiting"}
                          </div>
                        </div>
                      </div>

                      {/* Spinner or Check icon */}
                      {isCompleted ? (
                        <div className="w-4.5 h-4.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shadow-[0_0_6px_#10B981] shrink-0">
                          <Check className="w-3 h-3 stroke-[3px]" />
                        </div>
                      ) : isScanning ? (
                        <div className="relative flex items-center justify-center shrink-0">
                          <RefreshCw className="w-3.5 h-3.5 text-[#38BDF8] animate-spin" />
                        </div>
                      ) : (
                        <div className="w-2 h-2 rounded-full bg-slate-800 shrink-0" />
                      )}

                      {/* Individual mini progress track in card bottom */}
                      {isScanning && (
                        <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-[#A855F7]/10">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-[#38BDF8] to-[#A855F7]"
                            initial={{ width: 0 }}
                            animate={{ width: `${state.percent}%` }}
                            transition={{ ease: "easeInOut" }}
                          />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM TERMINAL LOGS FEED */}
            <div className="bg-[#050508]/85 border border-white/10 rounded-3xl p-5 backdrop-blur-xl shadow-2xl relative flex flex-col h-[200px]">
              {/* Terminal Top bar */}
              <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3 select-none">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
                  <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-[#94A3B8] font-mono ml-2.5 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-[#A855F7]" />
                    solvbeat-core@sandbox:~
                  </span>
                </div>
                <span className="text-[9px] font-mono text-[#A855F7] tracking-widest uppercase bg-[#A855F7]/10 px-2.5 py-0.5 rounded-full border border-[#A855F7]/25 font-bold">
                  AES-256 BUFFER
                </span>
              </div>

              {/* Scrollable logs */}
              <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#CBD5E1] space-y-2 pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                <AnimatePresence>
                  {terminalLogs.map((log, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-2 text-left"
                    >
                      <span className="text-slate-600 text-[10px] font-bold select-none mt-0.5 font-mono">[{log.timestamp}]</span>
                      {log.type === "success" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 shadow-[0_0_6px_#10B981]" />
                      ) : (
                        <span className="text-[#38BDF8] shrink-0 mt-0.5 font-bold">❯</span>
                      )}
                      <span className={log.type === "success" ? "text-emerald-400 font-semibold" : "text-slate-300 font-mono"}>
                        {log.message}
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <div ref={terminalEndRef} />
              </div>
            </div>

          </div>

          {/* Right Column: 3D Animated Cybersecurity Visualization */}
          <div className="lg:col-span-4 flex flex-col justify-start">
            <div className="bg-zinc-950/40 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-2xl relative overflow-hidden h-full flex flex-col justify-between min-h-[380px] lg:min-h-0">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A855F7]/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 backdrop-blur-md">
                <span className="text-[10px] font-mono text-slate-300 font-bold uppercase flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#A855F7] animate-pulse" />
                  GEODESIC SECURITY ENGINE CORE
                </span>
                <span className="text-[9px] font-mono text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">3D VECTOR</span>
              </div>

              {/* Cyber Core 3D visualizer canvas occupies middle section */}
              <div className="flex-1 flex items-center justify-center relative my-4 min-h-[260px]">
                <div className="absolute inset-0 z-0">
                  <CyberCore />
                </div>
              </div>

              {/* Bottom system indicators */}
              <div className="border-t border-white/5 pt-4 text-left font-mono text-[10px] text-slate-500 space-y-2">
                <div className="flex justify-between">
                  <span>VECTOR_STATE:</span>
                  <span className="text-emerald-400 font-bold">STABLE_COMPUTE</span>
                </div>
                <div className="flex justify-between">
                  <span>CRYPTO_SHIELD:</span>
                  <span className="text-pink-500 font-bold">ACTIVE_ENCRYPT</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ACTIVE STAGE INDICATOR ROW */}
        <div className="relative z-10 w-full max-w-7xl mx-auto mt-6 pt-4 border-t border-white/5">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {stages.map((stage, idx) => {
              const isActive = progress >= stage.min && progress <= stage.max;
              const isFinished = progress > stage.max;
              
              return (
                <div 
                  key={idx}
                  className={`py-3 px-4 rounded-2xl border transition-all duration-300 flex flex-col justify-center text-center relative overflow-hidden backdrop-blur-md ${
                    isActive 
                      ? "bg-[#A855F7]/15 border-[#A855F7]/50 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-[#A855F7]/30 scale-[1.02]" 
                      : isFinished 
                      ? "bg-emerald-500/[0.04] border-emerald-500/20 opacity-70" 
                      : "bg-white/[0.01] border-white/5 opacity-35"
                  }`}
                >
                  {/* Subtle pulsing dot inside active segment */}
                  {isActive && (
                    <span className="absolute top-2 right-2 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EC4899] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#EC4899]"></span>
                    </span>
                  )}
                  
                  <div className={`text-[10px] font-mono tracking-widest font-extrabold uppercase ${
                    isActive ? "text-[#EC4899]" : isFinished ? "text-emerald-400" : "text-slate-500"
                  }`}>
                    STAGE_0{idx + 1}
                  </div>
                  <div className={`text-xs font-display font-bold tracking-tight mt-1 truncate ${
                    isActive ? "text-white" : isFinished ? "text-slate-400" : "text-slate-600"
                  }`}>
                    {stage.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
