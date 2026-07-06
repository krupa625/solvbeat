/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ChevronUp, HelpCircle, Sparkles } from "lucide-react";
import { FAQItem } from "../types";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems: FAQItem[] = [
    {
      question: "Is the website scan really free and without login?",
      answer: "Yes, absolutely. Solvbeat offers basic domain audits completely free and without requiring you to create an account, log in, or integrate code. Simply enter your URL in the scanner, and you will receive a full Digital Health Report in 30 seconds."
    },
    {
      question: "How does the AI CISO analysis operate?",
      answer: "When a scan is triggered, our backend retrieves server headers, tests DNS, and checks TLS suites. It then safely feeds these structural findings to Solvbeat's server-side AI model (powered by Google Gemini). The model evaluates threat vectors, SEO indexing guidelines, and performance metrics, creating a customized, detailed mitigation assessment."
    },
    {
      question: "Will running a scan slow down my production website?",
      answer: "Not at all. Solvbeat performs non-invasive external probes. Unlike heavy network vulnerability scanners, we do not launch DDoS, brute-force requests, or high-intensity script payloads. All assessments are lightweight, secure, and run from external nodes with virtually zero footprint."
    },
    {
      question: "Do you store my domain data or scan history?",
      answer: "We respect privacy. Solvbeat does not monetize domain details or sell list metrics to third parties. We index past domain results only to display trend scores for returning users. Our scanner is fully read-only and collects no PII (Personally Identifiable Information)."
    },
    {
      question: "What specific security vectors do you check?",
      answer: "We check over 80 standard configurations, including active TLS/SSL version cipher compatibility, DNSSEC zone flags, frame clickjacking controls inside Content Security Policy (CSP) headers, HSTS transport protocols, CORS configurations, server header signatures, and robots/sitemap crawler indexes."
    }
  ];

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div id="faq-module" className="w-full py-20 px-4 md:px-0 border-t border-zinc-900/50 bg-[#050505]">
      <div className="max-w-4xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            SUPPORT ASSISTANCE
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-50 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
            Everything you need to know about Solvbeat's scanning security, AI models, and non-invasive web diagnostics.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`bg-zinc-950/40 border rounded-2xl transition-colors duration-300 ${
                  isOpen ? "border-zinc-800" : "border-zinc-900/80 hover:border-zinc-800"
                }`}
              >
                {/* Trigger Button */}
                <button
                  onClick={() => handleToggle(index)}
                  className="w-full p-5 md:p-6 flex items-center justify-between gap-4 text-left focus:outline-none"
                >
                  <span className="text-sm md:text-base font-display font-medium text-slate-100 flex items-center gap-3">
                    <HelpCircle className={`w-4.5 h-4.5 shrink-0 ${isOpen ? "text-purple-400" : "text-slate-500"}`} />
                    {item.question}
                  </span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {/* Answer panel (collapsible) */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden border-t border-zinc-900/40"
                    >
                      <div className="p-5 md:p-6 bg-zinc-950/10 text-xs md:text-sm text-slate-400 leading-relaxed font-sans">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
