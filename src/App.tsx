/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, ArrowRight, Link as LinkIcon, AlertCircle, RefreshCw, Layers, CheckCircle, Globe, ChevronRight, HelpCircle, Flame, ExternalLink, Menu, X, Users, Terminal, Cpu } from "lucide-react";
import { ScanResult } from "./types";
import CyberCore from "./components/CyberCore";
import LiveScan from "./components/LiveScan";
import DashboardOverview from "./components/DashboardOverview";
import WebsiteChecks from "./components/WebsiteChecks";
import HowItWorks from "./components/HowItWorks";
import SecurityPrivacy from "./components/SecurityPrivacy";
import FAQ from "./components/FAQ";
import Footer from "./components/Footer";

export default function App() {
  const [urlInput, setUrlInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanned, setIsScanned] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Responsive mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Navbar transparent background change on scroll
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    setIsScanning(true);
    setScanResult(null);
    setIsScanned(false);

    // Scroll smoothly to Live Scan Terminal anchoring point
    setTimeout(() => {
      document.getElementById("scanning-anchor")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 150);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: cleanUrl }),
      });

      if (!response.ok) {
        throw new Error("Target server response error. Please verify domain name.");
      }

      const data: ScanResult = await response.json();
      setScanResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg("An error occurred. Verify the URL is correct or try a different hostname.");
      setIsScanning(false);
    }
  };

  const handleScanComplete = () => {
    setIsScanning(false);
    setIsScanned(true);

    // Smoothly scroll down to Dashboard overview anchor
    setTimeout(() => {
      document.getElementById("dashboard-anchor")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  // Quick action preset domains for immediate validation
  const scanPresets = ["github.com", "vercel.com", "stripe.com"];

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#F8FAFC] overflow-x-hidden font-sans antialiased selection:bg-purple-500/30 selection:text-slate-50">
      
      {/* 1. Custom Pointer Ambient Glow overlay backing the luxury design */}
      <div
        className="fixed w-[600px] h-[600px] rounded-full pointer-events-none z-0 opacity-25 blur-[120px] bg-radial-gradient from-purple-500/15 via-sky-500/5 to-transparent -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
        style={{ left: `${cursorGlow.x}px`, top: `${cursorGlow.y}px` }}
      />

      {/* Sleek Interface Background Layers */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 opacity-[0.15]" style={{ backgroundImage: "linear-gradient(#ffffff08 1px, transparent 1px), linear-gradient(90deg, #ffffff08 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#A855F7] opacity-20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-[#38BDF8] opacity-10 blur-[100px] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="fixed inset-0 bg-noise-overlay opacity-[0.02] pointer-events-none z-0" />

      {/* 3. Transparent Floating Glass Navbar */}
      <nav
        id="solvbeat-navbar"
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "py-3 bg-black/50 border-b border-white/10 backdrop-blur-xl shadow-lg shadow-black/10" 
            : "py-5 bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo brand */}
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-[#A855F7] to-[#38BDF8] rounded-lg flex items-center justify-center p-[1px] shadow-lg shadow-[#A855F7]/10">
              <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center font-bold text-xs text-white">
                SB
              </div>
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              SOLVBEAT
            </span>
          </a>

          {/* Nav links (Desktop) */}
          <div className="hidden md:flex items-center gap-8 text-sm text-[#94A3B8] font-medium">
            <a href="#how-it-works-module" className="hover:text-white transition-colors">How It Works</a>
            <a href="#security-privacy-module" className="hover:text-white transition-colors">Security Pillars</a>
            <a href="#faq-module" className="hover:text-white transition-colors">Support FAQ</a>
            {isScanned && (
              <a href="#dashboard-anchor" className="text-xs font-mono text-purple-400 hover:text-purple-300 font-bold transition-all flex items-center gap-1">
                ACTIVE REPORT <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
              </a>
            )}
          </div>

          {/* CTAs (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => {
                document.getElementById("scanner-anchor")?.scrollIntoView({ behavior: "smooth" });
                document.getElementById("url-scanner-input")?.focus();
              }}
              className="px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors cursor-pointer bg-transparent border-none"
            >
              Login
            </button>
            <button
              onClick={() => {
                document.getElementById("scanner-anchor")?.scrollIntoView({ behavior: "smooth" });
                document.getElementById("url-scanner-input")?.focus();
              }}
              className="px-5 py-2 text-sm font-bold bg-[#A855F7] hover:bg-[#9333EA] text-white rounded-full transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] border border-white/20 cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-400 hover:text-slate-200 focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-b border-zinc-900 bg-zinc-950/95 backdrop-blur-2xl py-4 px-6 space-y-4"
            >
              <a
                href="#how-it-works-module"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-mono text-slate-400 hover:text-slate-200"
              >
                HOW IT WORKS
              </a>
              <a
                href="#security-privacy-module"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-mono text-slate-400 hover:text-slate-200"
              >
                SECURITY PILLARS
              </a>
              <a
                href="#faq-module"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-mono text-slate-400 hover:text-slate-200"
              >
                SUPPORT FAQ
              </a>
              <div className="pt-2 border-t border-zinc-900 flex flex-col gap-3">
                <a
                  href="#scanner-anchor"
                  onClick={() => { setMobileMenuOpen(false); document.getElementById("url-scanner-input")?.focus(); }}
                  className="w-full text-center py-2 rounded-lg bg-slate-50 text-zinc-950 text-xs font-semibold"
                >
                  Scan Website
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 4. Hero Section */}
      <header id="scanner-anchor" className="relative pt-32 pb-24 md:pt-44 md:pb-32 px-4 max-w-6xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Text & Action inputs */}
          <div className="lg:col-span-7 text-left space-y-8">
            
            {/* Tag badge with hover drawing effect */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-[#A855F7] hover:border-[#A855F7]/30 transition-colors">
              <span className="flex h-2 w-2 rounded-full bg-[#A855F7] animate-pulse"></span>
              Next-Gen Cyber Intelligence
            </div>

            {/* Huge display typography */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-[68px] leading-[0.95] font-display font-bold tracking-tight text-white">
                Protect Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-[#94A3B8]">Website</span> Before Attackers Do.
              </h1>
              <p className="text-[#94A3B8] text-base md:text-lg leading-relaxed font-light max-w-xl">
                Scan your ecosystem in <span className="text-white font-medium">30 seconds</span> and receive an AI-powered Digital Health Report across security, SEO, and performance.
              </p>
            </div>

            {/* URL Input Form with micro animations */}
            <div className="space-y-3">
              <div className="relative max-w-lg bg-white/5 border border-white/10 rounded-2xl p-1.5 focus-within:border-[#A855F7]/50 focus-within:ring-1 focus-within:ring-[#A855F7]/50 transition-all flex items-center shadow-2xl backdrop-blur-md group">
                <div className="absolute left-4 text-[#94A3B8] flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 opacity-50" />
                  <span className="text-xs font-mono opacity-40 uppercase tracking-tighter">https://</span>
                </div>
                
                <input
                  id="url-scanner-input"
                  type="text"
                  placeholder="example.com"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleStartScan(); }}
                  disabled={isScanning}
                  className="w-full bg-transparent border-none text-xs md:text-sm text-white placeholder-white/20 focus:outline-none pl-24 pr-4"
                />

                <button
                  onClick={() => handleStartScan()}
                  disabled={isScanning}
                  className="px-6 py-2.5 bg-white text-black font-bold rounded-xl hover:bg-[#A855F7] hover:text-white transition-all shadow-xl cursor-pointer flex items-center gap-1.5 shrink-0 text-xs"
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Scanning...
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
                  className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/5 border border-rose-500/15 p-3 rounded-xl max-w-lg font-mono"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </motion.div>
              )}

              {/* Quick actions presets */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
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
            </div>

            {/* Trust metric footers */}
            <div className="flex items-center gap-12 pt-4 select-none">
              <div>
                <div className="text-xl font-bold text-white">80+</div>
                <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-mono">Automated Checks</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">1.2M+</div>
                <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-mono">Assets Scanned</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">30s</div>
                <div className="text-[10px] uppercase tracking-widest text-[#94A3B8] font-mono">Report Delivery</div>
              </div>
            </div>

          </div>

          {/* Right Column: Original 3D Geodesic Cyber Core object */}
          <div className="lg:col-span-5 h-[380px] md:h-auto flex items-center justify-center">
            <CyberCore />
          </div>

        </div>

        {/* Bottom Feature Bar from Sleek Interface */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-8 border-t border-zinc-900">
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
        </div>
      </header>

      {/* 5. Live Scanner Terminal Section (Dynamic appearance) */}
      <div id="scanning-anchor" className="scroll-mt-24">
        {isScanning && (
          <LiveScan
            url={urlInput}
            ipAddress={scanResult?.ipAddress || "Analyzing..."}
            isScanning={isScanning}
            onScanComplete={handleScanComplete}
          />
        )}
      </div>

      {/* 6. Scan Results Dashboard Section (Reveal upon scanning success) */}
      <div id="dashboard-anchor" className="scroll-mt-24">
        {isScanned && scanResult && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <DashboardOverview scanData={scanResult} />
            <WebsiteChecks checks={scanResult.checks} />
          </motion.div>
        )}
      </div>

      {/* 7. How it Works timeline */}
      <HowItWorks />

      {/* 8. Security & Privacy assurances panel */}
      <SecurityPrivacy />

      {/* 9. FAQs */}
      <FAQ />

      {/* 10. Final Call to Action scanner bottom */}
      <div className="w-full py-24 px-4 bg-radial-gradient from-zinc-950 via-zinc-950 to-black border-t border-zinc-900/50 relative overflow-hidden text-center">
        {/* Background glowing particles and vector core halo */}
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
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-50 text-zinc-950 text-xs font-semibold hover:bg-slate-200 transition-all cursor-pointer flex items-center justify-center gap-2 shadow"
            >
              Configure Scanner Now
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 11. Footer */}
      <Footer />

      {/* Floating Action Trigger Scan Anchor (Bottom Right corner) */}
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

    </div>
  );
}
