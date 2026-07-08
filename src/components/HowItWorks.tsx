/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Link, Scan, Brain, FileText, CheckSquare, Sparkles } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      num: "01",
      icon: Link,
      title: "Enter Web Domain",
      description: "Provide your public web address. No credentials, access codes, code scripts, or setup integrations are required.",
      color: "text-purple-400 border-purple-500/20 bg-purple-500/5",
    },
    {
      num: "02",
      icon: Scan,
      title: "Real-Time Scan",
      description: "Our distributed scanner probes DNS zones, TLS headers, server handshakes, and asset compressions instantly.",
      color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
    },
    {
      num: "03",
      icon: Brain,
      title: "AI Analysis",
      description: "Solvbeat's server-side AI model parses findings to compile customized vulnerability maps and risk footprints.",
      color: "text-pink-400 border-pink-500/20 bg-pink-500/5",
    },
    {
      num: "04",
      icon: FileText,
      title: "Health Report",
      description: "Receive an executive Digital Health overview covering security, SEO, infrastructure, performance, and compliance.",
      color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
    },
    {
      num: "05",
      icon: CheckSquare,
      title: "Remediation Paths",
      description: "Unlock developer-ready terminal actions and code directives to fix gaps, secure headers, and accelerate loads.",
      color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
    },
  ];

  return (
    <div id="how-it-works-module" className="w-full py-20 px-4 md:px-0 border-t border-zinc-900/50 relative overflow-hidden bg-transparent">
      {/* Absolute visual background glow flares */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-sky-500/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto">
        
        {/* Heading */}
        <div className="text-center mb-16">
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            ENGINE OVERVIEW
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-50 tracking-tight">
            How Solvbeat Operates
          </h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm leading-relaxed">
            Our platform evaluates cyber vulnerability vectors non-invasively, utilizing lightning-fast server lookups and modern AI analysis.
          </p>
        </div>

        {/* Timeline Desktop Grid / Mobile Stack */}
        <div className="relative">
          
          {/* SVG Connector cable flow line (Hidden on Mobile) */}
          <div className="absolute top-16 left-[10%] right-[10%] h-0.5 bg-zinc-900 pointer-events-none hidden lg:block z-0">
            {/* Pulsing signal glow line */}
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-sky-400 to-emerald-500 w-full h-full opacity-40 blur-[1px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="flex flex-col items-center lg:items-start text-center lg:text-left group">
                  
                  {/* Timeline Circle Header */}
                  <div className="relative mb-6">
                    {/* Glowing outer orbit ring */}
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500/15 via-sky-500/10 to-pink-500/15 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Inner core node */}
                    <div className={`relative w-14 h-14 rounded-full border ${step.color} flex items-center justify-center transition-transform group-hover:scale-105 duration-300 shadow-xl`}>
                      <IconComponent className="w-5 h-5" />
                      
                      {/* Step index badge */}
                      <span className="absolute -top-1.5 -right-1.5 bg-zinc-900 border border-zinc-800 rounded-full w-5 h-5 flex items-center justify-center font-mono text-[9px] text-slate-400 font-bold shadow">
                        {step.num}
                      </span>
                    </div>
                  </div>

                  {/* Step Metadata text */}
                  <div className="space-y-2">
                    <h3 className="text-base md:text-lg font-display font-medium text-slate-200 group-hover:text-slate-100 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-xs mx-auto lg:mx-0">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
