/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, ArrowRight, Link as LinkIcon, AlertCircle, RefreshCw, 
  Layers, CheckCircle, Globe, ChevronRight, HelpCircle, Flame, 
  ExternalLink, Menu, X, Users, Terminal, Cpu 
} from "lucide-react";
import Lenis from "lenis";
import { ScanResult } from "./types";
import { generateMockScanResult } from "./utils/mockGenerator";
import CyberCore from "./components/CyberCore";
import LiveScan from "./components/LiveScan";
import DashboardOverview from "./components/DashboardOverview";
import WebsiteChecks from "./components/WebsiteChecks";
import HowItWorks from "./components/HowItWorks";
import SecurityPrivacy from "./components/SecurityPrivacy";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";
import Background from "./components/Background";

// High-performance RAF-based counting statistics component for Vercel/Linear-grade entry animation
function AnimatedCounter({ value, decimals = 0, suffix = "", duration = 1.8 }: { value: number; decimals?: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      // Beautiful easeOutExpo formula
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

  return <span className="font-bold">{count.toFixed(decimals)}{suffix}</span>;
}

export default function App() {
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanned, setIsScanned] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [view, setView] = useState<"landing" | "scan" | "results">("landing");

  // Responsive mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  // Router synchronization with window location path
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const searchParams = new URLSearchParams(window.location.search);
      const urlParam = searchParams.get("url") || "";

      if (path === "/scan") {
        if (urlParam) {
          setUrlInput(urlParam);
        }
        setView("scan");
        setIsScanning(true);
      } else if (path === "/results") {
        if (urlParam) {
          setUrlInput(urlParam);
        }
        setView("results");
        setIsScanning(false);
        setIsScanned(true);
        // Ensure mock data exists to prevent crash
        const targetUrl = urlParam || urlInput || "example.com";
        const fallbackData = generateMockScanResult(targetUrl);
        setScanResult(fallbackData);
      } else {
        setView("landing");
        setIsScanning(false);
        setIsScanned(false);
      }
    };

    window.addEventListener("popstate", handlePopState);
    // Parse current path on initial mounting
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const urlParam = searchParams.get("url") || "";

    if (path === "/scan") {
      const targetUrl = urlParam || "example.com";
      setUrlInput(targetUrl);
      setView("scan");
      setIsScanning(true);
      const fallbackData = generateMockScanResult(targetUrl);
      setScanResult(fallbackData);
    } else if (path === "/results") {
      const targetUrl = urlParam || "example.com";
      setUrlInput(targetUrl);
      setView("results");
      setIsScanning(false);
      setIsScanned(true);
      const fallbackData = generateMockScanResult(targetUrl);
      setScanResult(fallbackData);
    } else {
      setView("landing");
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Navbar transparent background change on scroll and Lenis initialization
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);

    // Initialize Lenis Smooth Scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      gestureOrientation: "vertical",
      smoothWheel: true,
    });

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      lenis.destroy();
    };
  }, []);

  // Ambient mouse coordinate tracker for custom cursor glow overlay
  const [cursorGlow, setCursorGlow] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const updateGlow = (e: MouseEvent) => {
      setCursorGlow({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", updateGlow);
    return () => window.removeEventListener("mousemove", updateGlow);
  }, []);

  // Submit scan function
  const handleStartScan = async (targetUrl?: string) => {
    const activeUrl = targetUrl || urlInput;
    if (!activeUrl) {
      setErrorMsg("Please enter a web address to scan.");
      return;
    }

    // Rough URL syntax validation
    const cleanUrl = activeUrl.trim();
    if (cleanUrl.length < 3) {
      setErrorMsg("Invalid URL. Please enter a valid domain address.");
      return;
    }

    setErrorMsg(null);
    setUrlInput(cleanUrl);
    setIsScanning(true);
    setScanResult(null);
    setIsScanned(false);
    setView("scan");

    // Seamless navigation using History API
    window.history.pushState({}, "", `/scan?url=${encodeURIComponent(cleanUrl)}`);

    try {
      const data = generateMockScanResult(cleanUrl);
      setScanResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An error occurred. Verify the URL is correct or try a different hostname.");
      setIsScanning(false);
      setView("landing");
      window.history.pushState({}, "", "/");
    }
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    setIsScanned(true);
    setView("results");
    window.history.pushState({}, "", `/results?url=${encodeURIComponent(urlInput)}`);
    
    // Smoothly scroll to the top of the dashboard
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  const resetScan = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsScanning(false);
    setIsScanned(false);
    setScanResult(null);
    setUrlInput("");
    setView("landing");
    window.history.pushState({}, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Quick action preset domains for immediate validation
  const scanPresets = ["github.com", "vercel.com", "stripe.com"];

  // Framer Motion staggered orchestration variants for elite page entrances
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 25, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 15,
      },
    },
  };

  if (view === "scan") {
    return (
      <LiveScan
        url={urlInput || "example.com"}
        ipAddress={scanResult?.ipAddress || "Analyzing..."}
        isScanning={isScanning}
        onScanComplete={handleScanComplete}
        onBack={() => {
          setIsScanning(false);
          setIsScanned(false);
          setScanResult(null);
          setUrlInput("");
          setView("landing");
          window.history.pushState({}, "", "/");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F8FAFC] overflow-x-hidden font-sans antialiased selection:bg-purple-500/30 selection:text-slate-50 scroll-smooth">
      
      {/* 1. Custom Pointer Ambient Glow overlay backing the luxury design */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-25 blur-[120px] bg-radial-gradient from-purple-500/15 via-sky-500/5 to-transparent -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ left: `${cursorGlow.x}px`, top: `${cursorGlow.y}px` }}
      />

      {/* Single, unified page background layer */}
      <Background />

      {/* 3. Transparent Floating Glass Navbar */}
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        id="solvbeat-navbar"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "py-3 bg-black/60 border-b border-white/10 backdrop-blur-xl shadow-lg shadow-black/10" 
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo brand */}
          <a href="#" className="flex items-center gap-2 group" onClick={resetScan}>
            <div className="w-8 h-8 bg-gradient-to-br from-[#A855F7] to-[#38BDF8] rounded-lg flex items-center justify-center p-[1px] shadow-lg shadow-[#A855F7]/10 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center font-bold text-xs text-white">
                SB
              </div>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              SOLVBEAT
            </span>
          </a>

          {/* Nav links (Desktop & Laptop >= 1024px) */}
          <div 
            className="hidden lg:flex items-center text-[#94A3B8] font-medium"
            style={{ gap: "clamp(16px, 2vw, 32px)", fontSize: "clamp(0.85rem, 1vw, 1rem)" }}
          >
            <a href="#how-it-works-module" className="hover:text-white transition-colors" onClick={() => { if (view !== "landing") setView("landing"); }}>How It Works</a>
            <a href="#security-privacy-module" className="hover:text-white transition-colors" onClick={() => { if (view !== "landing") setView("landing"); }}>Security Pillars</a>
            <a href="#faq-module" className="hover:text-white transition-colors" onClick={() => { if (view !== "landing") setView("landing"); }}>Support FAQ</a>
            {isScanned && (
              <button onClick={() => setView("results")} className="text-xs font-mono text-[#A855F7] hover:text-[#c084fc] font-bold transition-all flex items-center gap-1.5 bg-[#A855F7]/10 px-2.5 py-1 rounded-full border border-[#A855F7]/25 cursor-pointer">
                ACTIVE REPORT <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              </button>
            )}
          </div>

          {/* CTAs (Desktop & Laptop >= 1024px) */}
          <div className="hidden lg:flex items-center" style={{ gap: "clamp(12px, 1.5vw, 24px)" }}>
            <button 
              onClick={resetScan}
              className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Reset / Home
            </button>
            <button
              onClick={() => {
                if (view !== "landing") {
                  setView("landing");
                  setTimeout(() => {
                    document.getElementById("scanner-anchor")?.scrollIntoView({ behavior: "smooth" });
                    document.getElementById("url-scanner-input")?.focus();
                  }, 150);
                } else {
                  document.getElementById("scanner-anchor")?.scrollIntoView({ behavior: "smooth" });
                  document.getElementById("url-scanner-input")?.focus();
                }
              }}
              className="px-5 py-2 text-sm font-bold bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-full transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] border border-white/20 cursor-pointer hover:scale-105"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle Button (< 1024px) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-slate-400 hover:text-slate-200 focus:outline-none p-2 rounded-xl bg-white/5 border border-white/10"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Slide-out Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-black z-40 lg:hidden"
              />
              
              {/* Drawer Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-zinc-950/98 backdrop-blur-3xl border-l border-white/10 z-50 p-6 flex flex-col justify-between shadow-2xl lg:hidden"
              >
                <div className="space-y-8">
                  {/* Header in Drawer */}
                  <div className="flex items-center justify-between">
                    <a href="#" className="flex items-center gap-2" onClick={(e) => { setMobileMenuOpen(false); resetScan(e); }}>
                      <div className="w-8 h-8 bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] rounded-lg flex items-center justify-center p-[1px]">
                        <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center font-bold text-xs text-white">
                          SB
                        </div>
                      </div>
                      <span className="font-display font-bold text-base text-white tracking-tight">
                        SOLVBEAT
                      </span>
                    </a>
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-1.5 rounded-full bg-white/5 text-slate-400 hover:text-white border border-white/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation Links inside Drawer */}
                  <div className="flex flex-col gap-5 pt-4">
                    <a
                      href="#how-it-works-module"
                      onClick={() => { setMobileMenuOpen(false); if (view !== "landing") setView("landing"); }}
                      className="text-sm font-medium text-slate-300 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
                    >
                      <span>How It Works</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </a>
                    <a
                      href="#security-privacy-module"
                      onClick={() => { setMobileMenuOpen(false); if (view !== "landing") setView("landing"); }}
                      className="text-sm font-medium text-slate-300 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
                    >
                      <span>Security Pillars</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </a>
                    <a
                      href="#faq-module"
                      onClick={() => { setMobileMenuOpen(false); if (view !== "landing") setView("landing"); }}
                      className="text-sm font-medium text-slate-300 hover:text-white py-1.5 border-b border-white/5 flex items-center justify-between"
                    >
                      <span>Support FAQ</span>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </a>
                    {isScanned && (
                      <button 
                        onClick={() => { setMobileMenuOpen(false); setView("results"); }} 
                        className="text-left text-xs font-mono text-[#60A5FA] hover:text-[#93c5fd] font-bold transition-all flex items-center gap-2 bg-[#3B82F6]/10 px-3 py-2 rounded-xl border border-[#3B82F6]/20 cursor-pointer"
                      >
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                        ACTIVE REPORT DETECTED
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Buttons inside Drawer */}
                <div className="flex flex-col gap-3 pt-6 border-t border-white/5">
                  <button
                    onClick={(e) => { setMobileMenuOpen(false); resetScan(e); }}
                    className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold transition-all border border-white/10 cursor-pointer"
                  >
                    Reset / Home
                  </button>
                  <button
                    onClick={() => { 
                      setMobileMenuOpen(false); 
                      if (view !== "landing") {
                        setView("landing");
                        setTimeout(() => {
                          document.getElementById("url-scanner-input")?.focus();
                        }, 150);
                      } else {
                        document.getElementById("url-scanner-input")?.focus();
                      }
                    }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs font-bold transition-all hover:scale-[1.01] cursor-pointer shadow-lg shadow-[#2563EB]/25"
                  >
                    Scan Website
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Main Core View Area with Page Transitions */}
      <AnimatePresence mode="wait">
        {view === "landing" ? (
          <motion.div
            key="landing-view"
            initial={{ opacity: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(4px)" }}
            transition={{ duration: 0.4 }}
          >
            {/* 4. Hero Section */}
            <header 
              id="scanner-anchor" 
              style={{ 
                paddingTop: "clamp(120px, 12vw, 176px)", 
                paddingBottom: "clamp(48px, 8vw, 128px)",
                paddingLeft: "clamp(20px, 5vw, 80px)",
                paddingRight: "clamp(20px, 5vw, 80px)",
              }}
              className="relative max-w-6xl mx-auto z-10"
            >
              <div 
                className="grid grid-cols-1 lg:grid-cols-12 items-center"
                style={{ gap: "clamp(32px, 5vw, 64px)" }}
              >
                
                {/* Left Column: Text & Action inputs */}
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 w-full"
                >
                  <motion.div 
                    variants={staggerItem}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-[#A855F7] hover:border-[#A855F7]/30 transition-colors"
                  >
                    <span className="flex h-2 w-2 rounded-full bg-[#A855F7] animate-pulse"></span>
                    Next-Gen Cyber Intelligence
                  </motion.div>

                  <div className="space-y-4 w-full">
                    <motion.h1 
                      variants={staggerItem}
                      style={{ fontSize: "clamp(2.2rem, 7vw, 5.5rem)", lineHeight: "1.05" }}
                      className="font-display font-bold tracking-tight text-white"
                    >
                      Protect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#94A3B8]">Website</span> Before Attackers Do.
                    </motion.h1>
                    <motion.p 
                      variants={staggerItem}
                      style={{ fontSize: "clamp(1.02rem, 2vw, 1.25rem)" }}
                      className="text-[#94A3B8] leading-relaxed font-light max-w-xl mx-auto lg:mx-0"
                    >
                      Scan your ecosystem in <span className="text-white font-medium">30 seconds</span> and receive an AI-powered Digital Health Report across security, SEO, and performance.
                    </motion.p>
                  </div>

                  {/* Fully responsive, stackable URL Input Form */}
                  <motion.div 
                    variants={staggerItem} 
                    className="w-full mx-auto lg:mx-0 px-5 md:px-0 md:max-w-[680px] lg:max-w-[850px] xl:max-w-[900px] space-y-4 flex flex-col"
                  >
                    <div className="flex flex-col lg:flex-row gap-4 w-full items-stretch">
                      
                      {/* Input Wrapper */}
                      <div className={`relative flex items-center bg-white/5 border rounded-2xl focus-within:border-[#7C3AED]/50 focus-within:ring-2 focus-within:ring-[#7C3AED]/30 transition-all duration-300 shadow-2xl backdrop-blur-md group h-14 w-full lg:w-[calc(65%-10.4px)] xl:w-[calc(70%-11.2px)] hover:border-[#3B82F6]/50 hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
                        isScanning ? "border-[#A855F7]/35 opacity-75" : "border-white/10"
                      }`}>
                        <div className="absolute left-4 text-[#94A3B8] flex items-center gap-1.5 pointer-events-none">
                          <LinkIcon className="w-3.5 h-3.5 opacity-55 text-[#A855F7]" />
                          <span className="text-xs font-mono opacity-50 uppercase tracking-tighter select-none">https://</span>
                        </div>
                        
                        <input
                          id="url-scanner-input"
                          type="text"
                          placeholder="example.com"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleStartScan(); }}
                          disabled={isScanning}
                          className="w-full h-full bg-transparent border-none text-sm text-white placeholder-white/20 focus:outline-none pl-22 pr-4 disabled:text-white/40 font-mono"
                        />
                      </div>

                      {/* Scan Button */}
                      <button
                        onClick={() => handleStartScan()}
                        disabled={isScanning}
                        className="h-14 px-6 bg-white text-black font-bold rounded-2xl hover:bg-gradient-to-r hover:from-[#2563EB] hover:to-[#7C3AED] hover:text-white transition-all duration-300 shadow-xl cursor-pointer flex items-center justify-center gap-1.5 shrink-0 text-xs hover:scale-[1.02] active:scale-[0.98] w-full lg:w-[calc(35%-5.6px)] xl:w-[calc(30%-4.8px)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      >
                        {isScanning ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#A855F7]" />
                            Probing...
                          </>
                        ) : (
                          <>
                            Scan Website
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Error warning notification panel */}
                    {errorMsg && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl w-full font-mono"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errorMsg}
                      </motion.div>
                    )}

                    {/* Quick actions presets */}
                    <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-2 w-full">
                      <span className="text-[10px] font-mono text-slate-500 tracking-wider">POPULAR DOMAINS:</span>
                      {scanPresets.map((preset) => (
                        <button
                          key={preset}
                          onClick={() => { setUrlInput(preset); handleStartScan(preset); }}
                          disabled={isScanning}
                          className="px-2.5 py-1 rounded bg-zinc-950/80 border border-zinc-900 text-slate-400 hover:text-slate-200 hover:border-zinc-800 transition-colors font-mono text-[10px] cursor-pointer"
                        >
                          {preset}
                        </button>
                      ))}
                    </div>
                  </motion.div>

                  {/* Responsive Trust metrics grid */}
                  <motion.div 
                    variants={staggerItem} 
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-12 pt-6 select-none w-full max-w-xl mx-auto lg:mx-0"
                  >
                    <div className="text-center lg:text-left flex flex-col items-center lg:items-start p-4 lg:p-0 rounded-2xl bg-white/[0.02] border border-white/5 lg:bg-transparent lg:border-none backdrop-blur-sm lg:backdrop-blur-none transition-all duration-300">
                      <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
                        <AnimatedCounter value={80} suffix="+" />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-mono mt-1">Automated Checks</div>
                    </div>
                    <div className="text-center lg:text-left flex flex-col items-center lg:items-start p-4 lg:p-0 rounded-2xl bg-white/[0.02] border border-white/5 lg:bg-transparent lg:border-none backdrop-blur-sm lg:backdrop-blur-none transition-all duration-300">
                      <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
                        <AnimatedCounter value={1.2} decimals={1} suffix="M+" />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-mono mt-1">Assets Scanned</div>
                    </div>
                    <div className="col-span-1 sm:col-span-2 lg:col-span-1 text-center lg:text-left flex flex-col items-center lg:items-start p-4 lg:p-0 rounded-2xl bg-white/[0.02] border border-white/5 lg:bg-transparent lg:border-none backdrop-blur-sm lg:backdrop-blur-none transition-all duration-300">
                      <div className="text-2xl sm:text-3xl font-bold text-white font-mono">
                        <AnimatedCounter value={30} suffix="s" />
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-mono mt-1">Report Delivery</div>
                    </div>
                  </motion.div>

                </motion.div>

                {/* Right Column: Holographic 3D Geodesic Cyber Core object */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="lg:col-span-5 w-full max-w-[340px] md:max-w-[400px] lg:max-w-none aspect-square flex items-center justify-center relative mx-auto"
                >
                  <CyberCore />
                </motion.div>

              </div>

              {/* Bottom Feature Bar from Sleek Interface */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-8 border-t border-zinc-900/60"
              >
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-[#A855F7]/20 text-[#A855F7]">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">SSL & DNS</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">Deep verification of security certificates and record integrity.</p>
                </div>
                
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-[#38BDF8]/20 text-[#38BDF8]">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">Infrastructure</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">Detect vulnerabilities in server headers and tech stack configuration.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-1.5 rounded-lg bg-[#E879F9]/20 text-[#E879F9]">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white">AI SEO Check</span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">Intelligent mapping of crawler accessibility and semantic health.</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm border-l-[#A855F7] border-l-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#A855F7]">Live Activity</span>
                    <span className="text-[10px] text-green-400 font-mono flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-white/40">SCAN: enterprise.io</span>
                      <span className="text-green-500">SUCCESS</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono">
                      <span className="text-white/40">SCAN: web3-app.dev</span>
                      <span className="text-[#A855F7]">RUNNING...</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </header>

            {/* 7. How it Works timeline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <HowItWorks />
            </motion.div>

            {/* 8. Security & Privacy assurances panel */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <SecurityPrivacy />
            </motion.div>

            {/* 9. FAQs */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <FAQ />
            </motion.div>

            {/* 10. Final Call to Action scanner bottom */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full py-24 px-4 bg-transparent border-t border-white/5 relative overflow-hidden text-center"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="max-w-4xl mx-auto space-y-8 relative z-10">
                <div className="inline-flex p-3 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-sky-400">
                  <Cpu className="w-8 h-8 animate-pulse" />
                </div>

                <h2 className="text-3xl md:text-5xl font-display font-medium text-slate-50 tracking-tight leading-none max-w-xl mx-auto">
                  Ready to audit your <br />
                  <span className="bg-gradient-to-r from-sky-400 to-purple-500 bg-clip-text text-transparent">website health instantly?</span>
                </h2>

                <p className="text-slate-400 text-sm max-w-md mx-auto leading-relaxed">
                  Diagnose threat exposure indices, speed benchmarks, sitemaps, and SSL vulnerabilities now. No credit cards or setups.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                  <button
                    onClick={() => {
                      document.getElementById("scanner-anchor")?.scrollIntoView({ behavior: "smooth" });
                      document.getElementById("url-scanner-input")?.focus();
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-50 text-zinc-950 text-xs font-semibold hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow hover:scale-105 active:scale-95"
                  >
                    Configure Scanner Now
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="results-view"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="pt-24 min-h-screen"
          >
            {scanResult && (
              <>
                <DashboardOverview scanData={scanResult} />
                <WebsiteChecks checks={scanResult.checks} />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 11. Footer */}
      <Footer />

      {/* Floating Action Trigger Scan Anchor (Bottom Right corner) - Only visible on Landing */}
      {view === "landing" && (
        <div className="fixed bottom-6 right-6 z-40">
          <button
            onClick={() => {
              document.getElementById("scanner-anchor")?.scrollIntoView({ behavior: "smooth" });
              document.getElementById("url-scanner-input")?.focus();
            }}
            className="p-3.5 rounded-full bg-purple-600/90 hover:bg-purple-500 border border-purple-500/20 text-slate-100 hover:shadow-lg hover:shadow-purple-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-2xl flex items-center gap-2 group"
            title="Scan Website"
          >
            <Terminal className="w-4.5 h-4.5" />
            <span className="text-[10px] font-mono tracking-wider font-semibold max-w-0 overflow-hidden group-hover:max-w-24 transition-all duration-300 whitespace-nowrap">
              SCAN NOW
            </span>
          </button>
        </div>
      )}

    </div>
  );
}
