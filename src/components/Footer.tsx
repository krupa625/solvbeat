/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from "react";
import { motion, useAnimationFrame } from "motion/react";
import { 
  Shield, Mail, Phone, MapPin, Github, Twitter, Linkedin, Instagram, 
  ArrowRight, ChevronRight, Search, Zap, CheckSquare, Cpu, Sparkles, 
  Lock, ShieldAlert, CheckCircle, Send
} from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Subscribe submit handler
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().length > 3) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail("");
      }, 4000);
    }
  };

  // Solutions listing with matching icons
  const solutions = [
    { title: "Website Security Scan", icon: ShieldAlert },
    { title: "SEO Audit", icon: Search },
    { title: "Performance Analysis", icon: Zap },
    { title: "Compliance Check", icon: CheckSquare },
    { title: "Technology Detection", icon: Cpu },
    { title: "AI Digital Health Report", icon: Sparkles },
  ];

  // Quick Links listing
  const quickLinks = [
    { name: "Home", href: "#scanner-anchor" },
    { name: "Features", href: "#how-it-works-module" },
    { name: "How It Works", href: "#how-it-works-module" },
    { name: "Dashboard", href: "#dashboard-anchor" },
    { name: "FAQ", href: "#faq-module" },
    { name: "Pricing", href: "#" },
    { name: "Blog", href: "#" },
  ];

  // Particle configuration for the floating particles effect
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * -20,
  }));

  // Magnetic hover effect values
  const [btnCoords, setBtnCoords] = useState({ x: 0, y: 0 });
  const handleBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setBtnCoords({ x: x * 0.35, y: y * 0.35 });
  };
  const handleBtnMouseLeave = () => {
    setBtnCoords({ x: 0, y: 0 });
  };

  return (
    <footer className="relative w-full overflow-hidden bg-gradient-to-b from-[#050505] via-[#111111] to-[#4A0F06] pt-24 pb-12 px-6 md:px-12 border-t border-white/5 select-none font-sans">
      
      {/* 1. Subtle noise texture overlay */}
      <div className="absolute inset-0 bg-noise-overlay opacity-[0.015] pointer-events-none mix-blend-overlay" />
      
      {/* 2. Soft dynamic radial glows */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-sky-500/5 rounded-full blur-[160px] pointer-events-none" />
      
      {/* 3. Very bottom intense red-orange glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[85%] h-40 bg-[#FF3D00]/10 rounded-full blur-[130px] pointer-events-none" />

      {/* 4. Floating ambient particles using Framer Motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-white/20"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0px", "-120px", "0px"],
              x: ["0px", "30px", "0px"],
              opacity: [0.1, 0.4, 0.1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Main 4-Column responsive layout */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-16"
        >
          
          {/* COLUMN 1: Brand Info & Socials */}
          <div className="lg:col-span-4 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            {/* Logo Brand with breathing slow pulse glow */}
            <a href="#" className="flex items-center gap-2 group">
              <motion.div 
                animate={{ boxShadow: ["0 0 10px rgba(168,85,247,0.2)", "0 0 20px rgba(168,85,247,0.4)", "0 0 10px rgba(168,85,247,0.2)"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-10 h-10 bg-gradient-to-br from-[#A855F7] to-[#38BDF8] rounded-xl flex items-center justify-center p-[1px] shadow-lg shadow-[#A855F7]/10"
              >
                <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center font-bold text-sm text-white">
                  SB
                </div>
              </motion.div>
              <span className="font-display font-bold text-xl text-white tracking-tight group-hover:text-[#A855F7] transition-colors duration-300">
                SOLVBEAT
              </span>
            </a>

            {/* Tagline */}
            <p className="text-sm text-[#94A3B8] font-light leading-relaxed max-w-xs">
              AI-Powered Website Security & Digital Health Platform.
            </p>

            {/* Contact details */}
            <div className="space-y-2.5 font-mono text-xs text-[#94A3B8]">
              <div className="flex items-center justify-center md:justify-start gap-2.5 group">
                <Phone className="w-4 h-4 text-purple-400 group-hover:text-sky-400 transition-colors" />
                <span className="hover:text-white transition-colors cursor-pointer">+91 XXXXX XXXXX</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 group">
                <Mail className="w-4 h-4 text-purple-400 group-hover:text-sky-400 transition-colors" />
                <a href="mailto:hello@solvbeat.com" className="hover:text-white transition-colors">hello@solvbeat.com</a>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2.5 group">
                <MapPin className="w-4 h-4 text-purple-400 group-hover:text-sky-400 transition-colors" />
                <span className="hover:text-white transition-colors cursor-pointer">India</span>
              </div>
            </div>

            {/* Social Connection Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                { icon: Linkedin, href: "#", name: "LinkedIn" },
                { icon: Github, href: "#", name: "GitHub" },
                { icon: Twitter, href: "#", name: "Twitter" },
                { icon: Instagram, href: "#", name: "Instagram" },
              ].map((social, i) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={i}
                    href={social.href}
                    whileHover={{ 
                      scale: 1.12, 
                      y: -5,
                      rotate: 3,
                    }}
                    className="relative w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all duration-300 hover:border-purple-500 hover:shadow-[0_0_15px_rgba(168,85,247,0.45)] cursor-pointer"
                  >
                    <IconComponent className="w-4.5 h-4.5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="lg:col-span-2 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">
              Quick Links
            </h4>
            <ul className="space-y-3.5 w-full">
              {quickLinks.map((link, i) => (
                <li key={i} className="group">
                  <a 
                    href={link.href}
                    className="inline-block text-xs md:text-sm text-[#94A3B8] font-medium transition-all duration-300 group-hover:text-[#A855F7] group-hover:translate-x-1.5 relative py-0.5"
                  >
                    {link.name}
                    {/* Animated custom neon underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#A855F7] transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Solutions */}
          <div className="lg:col-span-3 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">
              Solutions
            </h4>
            <ul className="space-y-4 w-full">
              {solutions.map((sol, i) => {
                const SolIcon = sol.icon;
                return (
                  <li key={i} className="group flex items-center justify-center md:justify-start gap-3">
                    <div className="relative p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors duration-300 shadow-[0_0_10px_rgba(168,85,247,0.1)] group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0">
                      <SolIcon className="w-3.5 h-3.5" />
                    </div>
                    <a 
                      href="#scanner-anchor"
                      onClick={() => document.getElementById("url-scanner-input")?.focus()}
                      className="text-xs md:text-sm text-[#94A3B8] font-medium transition-all duration-300 group-hover:text-white group-hover:translate-x-1 flex items-center gap-1.5"
                    >
                      {sol.title}
                      <ArrowRight className="w-3.5 h-3.5 text-[#A855F7] opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* COLUMN 4: Stay Updated (Newsletter) */}
          <div className="lg:col-span-3 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-widest text-white/90">
                Stay Updated
              </h4>
              <p className="text-xs text-[#94A3B8] font-light leading-relaxed max-w-xs">
                Get cybersecurity tips, product updates and security alerts.
              </p>
            </div>

            {/* Glassmorphism Newsletter Form */}
            <form onSubmit={handleSubscribe} className="w-full max-w-sm space-y-3">
              <div 
                className={`relative flex items-center p-1 bg-white/5 border rounded-2xl backdrop-blur-md transition-all duration-300 ${
                  isFocused ? "border-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.25)]" : "border-white/10"
                }`}
              >
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-xs text-white placeholder-white/30 pl-4 pr-12 py-2.5 focus:ring-0"
                />
                
                {/* Magnetic Subscribe Button */}
                <motion.button
                  type="submit"
                  onMouseMove={handleBtnMouseMove}
                  onMouseLeave={handleBtnMouseLeave}
                  animate={{ x: btnCoords.x, y: btnCoords.y }}
                  transition={{ type: "spring", stiffness: 180, damping: 15 }}
                  className="absolute right-1.5 p-2 rounded-xl bg-[#A855F7] hover:bg-[#9333EA] text-white transition-all cursor-pointer shadow-md shadow-[#A855F7]/20 flex items-center justify-center shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </motion.button>
              </div>

              {/* Success state feedback message */}
              {isSubscribed && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-green-400 font-mono"
                >
                  ✓ Subscribed successfully! Thank you.
                </motion.p>
              )}
            </form>

            {/* Compliance checklist Badges */}
            <div className="flex flex-col gap-2 pt-2 text-left w-full max-w-xs">
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] font-mono">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>SSL Secured Transmission</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] font-mono">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>GDPR Privacy Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#94A3B8] font-mono">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Spam Guarantee</span>
              </div>
            </div>
          </div>

        </motion.div>

        {/* BOTTOM BAR: Divider & Copyright */}
        <div className="relative pt-8 mt-4 border-t border-white/5">
          
          {/* Divider Moving Light Sweep line animation */}
          <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden pointer-events-none">
            <motion.div 
              className="w-48 h-full bg-gradient-to-r from-transparent via-[#A855F7] to-transparent opacity-80 blur-[1px]"
              animate={{
                x: ["-100%", "600%"]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left side Copyright text */}
            <p className="text-xs text-[#94A3B8]/60 font-mono tracking-wide text-center md:text-left">
              © {new Date().getFullYear()} Solvbeat. All rights reserved.
            </p>

            {/* Right side Legal links */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#94A3B8]/60 font-medium">
              <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] underline decoration-transparent hover:decoration-current transition-all duration-300">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] underline decoration-transparent hover:decoration-current transition-all duration-300">Terms & Conditions</a>
              <span>•</span>
              <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] underline decoration-transparent hover:decoration-current transition-all duration-300">Cookie Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-white hover:drop-shadow-[0_0_10px_rgba(168,85,247,0.4)] underline decoration-transparent hover:decoration-current transition-all duration-300">Contact</a>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
