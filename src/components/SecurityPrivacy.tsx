/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { Shield, Lock, Unlock, Eye, Sparkles, CheckCircle, Database, AlertCircle } from "lucide-react";

export default function SecurityPrivacy() {
  const [isLocked, setIsLocked] = useState(true);

  const pillars = [
    {
      title: "100% Read-Only Inspection",
      description: "Our scanner works entirely from the outside. We look up DNS records, audit secure HTTP transmission headers, analyze crawl schemas, and test server-side TLS versions. There is absolutely zero invasive code interaction.",
      icon: Eye,
    },
    {
      title: "No Credentials Necessary",
      description: "We never ask for FTP, WordPress logins, database strings, cloud console keys, or administrator panels. You simply enter a public web address, and the diagnostic runs automatically.",
      icon: Lock,
    },
    {
      title: "No Code Changes Required",
      description: "Solvbeat scans do not require you to paste tracking JavaScript tags, install server-side binary hooks, insert plugins, or modify config files. Your site keeps serving users uninterrupted.",
      icon: Database,
    },
    {
      title: "GDPR & Privacy Guarded",
      description: "We respect user confidentiality. Solvbeat does not store sensitive personally identifiable information (PII) of your users, nor do we run aggressive DDoS-like probes. All evaluations are lightweight and safe.",
      icon: CheckCircle,
    }
  ];

  return (
    <div id="security-privacy-module" className="w-full py-20 px-4 md:px-0 border-t border-zinc-900/50 bg-transparent relative overflow-hidden">
      {/* Background glow flares */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Main 2-Column visual layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Shield and Locks */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center">
            
            {/* Massive Glass Shield container */}
            <div
              onMouseEnter={() => setIsLocked(false)}
              onMouseLeave={() => setIsLocked(true)}
              className="relative w-72 h-80 md:w-80 md:h-[360px] bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center shadow-2xl backdrop-blur-2xl group cursor-pointer overflow-hidden"
            >
              {/* Internal abstract grid line styling */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:16px_16px] opacity-40 pointer-events-none" />

              {/* Glowing shield halo */}
              <div className={`absolute w-44 h-44 rounded-full blur-3xl transition-colors duration-500 pointer-events-none ${
                isLocked ? "bg-purple-500/10" : "bg-sky-500/15"
              }`} />

              {/* Massive Shield visual */}
              <div className="relative z-10 p-6 rounded-full bg-zinc-900/40 border border-zinc-800 flex items-center justify-center shadow-inner">
                {isLocked ? (
                  <Shield className="w-20 h-20 text-purple-400 group-hover:scale-105 duration-300 transition-transform" />
                ) : (
                  <Shield className="w-20 h-20 text-sky-400 group-hover:scale-105 duration-300 transition-transform" />
                )}

                {/* Lock icon relative overlay in middle of shield */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-zinc-950 border border-zinc-800 p-2 rounded-full shadow-lg">
                    {isLocked ? (
                      <Lock className="w-5 h-5 text-purple-300 animate-pulse" />
                    ) : (
                      <Unlock className="w-5 h-5 text-sky-300 animate-bounce" />
                    )}
                  </div>
                </div>
              </div>

              {/* Lock state instructions indicator */}
              <div className="absolute bottom-6 font-mono text-[9px] text-slate-500 tracking-widest text-center uppercase select-none pointer-events-none">
                {isLocked ? "SOLVBEAT SECURITY SHIELD INTACT" : "DECRYPTION HANDSHAKE SIMULATION"}
              </div>
            </div>
          </div>

          {/* Right Column: Safe Analysis Explainer */}
          <div className="lg:col-span-7 text-left space-y-8">
            <div>
              <span className="text-xs font-mono text-purple-400 tracking-widest uppercase flex items-center gap-2 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                ZERO-INTEGRATION GUARANTEE
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-50 tracking-tight leading-tight">
                Secure, Non-Invasive & Safe Analysis
              </h2>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Solvbeat is engineered with confidentiality first. We evaluate your website's cyber posture from the outside, generating extensive architectural threat logs without risking system interruptions or resource strain.
              </p>
            </div>

            {/* Grid of Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((p, idx) => {
                const IconComponent = p.icon;
                return (
                  <div key={idx} className="space-y-2 p-4 bg-zinc-950/20 border border-zinc-900/60 rounded-xl hover:border-zinc-800 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/10">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-display font-medium text-slate-200">{p.title}</h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans pt-1">
                      {p.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
