/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, XCircle, Filter, Sparkles } from "lucide-react";
import { CheckItem } from "../types";

interface WebsiteChecksProps {
  checks: CheckItem[];
}

export default function WebsiteChecks({ checks }: WebsiteChecksProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "security", label: "Security" },
    { value: "performance", label: "Performance" },
    { value: "seo", label: "SEO" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "compliance", label: "Compliance" },
    { value: "technology", label: "Technology" },
  ];

  const statuses = [
    { value: "all", label: "All Statuses" },
    { value: "passed", label: "Passed" },
    { value: "warning", label: "Warning" },
    { value: "failed", label: "Failed" },
  ];

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />;
      case "failed":
        return <XCircle className="w-5 h-5 text-rose-500 shrink-0" />;
      default:
        return null;
    }
  };

  const getStatusBorderColor = (status: string, isExpanded: boolean) => {
    if (isExpanded) {
      switch (status) {
        case "passed": return "border-emerald-500/40 bg-emerald-500/2 shadow-emerald-500/5";
        case "warning": return "border-amber-500/40 bg-amber-500/2 shadow-amber-500/5";
        case "failed": return "border-rose-500/40 bg-rose-500/2 shadow-rose-500/5";
        default: return "border-zinc-800";
      }
    }
    return "border-zinc-900 hover:border-zinc-800 bg-zinc-950/20";
  };

  // Filter logic
  const filteredChecks = checks.filter((check) => {
    const matchesSearch =
      check.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      check.recommendation.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || check.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || check.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div id="website-checks-module" className="w-full py-16 px-4 md:px-0 bg-zinc-950/25 border-t border-zinc-900/50">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            VULNERABILITY VERIFICATION MATRIX
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-medium text-slate-50 tracking-tight">
            80+ Exhaustive Technical Checks
          </h2>
          <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm leading-relaxed">
            Expand any audit check item below to discover underlying technical definitions and direct security mitigation steps.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-4 bg-zinc-950/60 border border-zinc-900 rounded-2xl backdrop-blur-xl">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search diagnostic audits, errors or recommendations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900/40 border border-zinc-900 rounded-xl py-2 pl-10 pr-4 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500/40 focus:ring-1 focus:ring-purple-500/40 transition-all font-sans"
            />
          </div>

          {/* Selector options */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px]">
              <Filter className="w-3 h-3" />
              FILTERS
            </div>

            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900/40 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500/40 font-medium"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value} className="bg-zinc-950 text-slate-300">
                  {cat.label}
                </option>
              ))}
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-zinc-900/40 border border-zinc-900 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-purple-500/40 font-medium"
            >
              {statuses.map((stat) => (
                <option key={stat.value} value={stat.value} className="bg-zinc-950 text-slate-300">
                  {stat.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Audit List Container */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredChecks.length > 0 ? (
              filteredChecks.map((check) => {
                const isExpanded = expandedId === check.id;
                return (
                  <motion.div
                    key={check.id}
                    layout="position"
                    className={`border rounded-xl transition-all duration-300 ${getStatusBorderColor(check.status, isExpanded)}`}
                  >
                    {/* Collapsed Header trigger */}
                    <div
                      onClick={() => toggleExpand(check.id)}
                      className="p-4 md:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-4 text-left">
                        {getStatusIcon(check.status)}
                        <div>
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-sm md:text-base font-display font-medium text-slate-100">
                              {check.name}
                            </h3>
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider bg-zinc-900 text-slate-400 border border-zinc-800 uppercase">
                              {check.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 line-clamp-1 pr-4">
                            {check.description}
                          </p>
                        </div>
                      </div>

                      {/* Chevron indicators */}
                      <div className="text-slate-400 shrink-0">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </div>

                    {/* Expanded Detail Panel */}
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden border-t border-zinc-900/60"
                      >
                        <div className="p-5 md:p-6 bg-zinc-950/20 text-left space-y-4 font-sans">
                          <div>
                            <span className="text-[10px] font-mono text-purple-400 tracking-wider block uppercase mb-1">Finding Description</span>
                            <p className="text-sm text-slate-300 leading-relaxed">
                              {check.description}
                            </p>
                          </div>
                          <div className="pt-2">
                            <span className="text-[10px] font-mono text-emerald-400 tracking-wider block uppercase mb-1">Recommended Remediation Action</span>
                            <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg text-xs text-emerald-300 leading-relaxed font-mono">
                              {check.recommendation}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            ) : (
              <div className="py-12 text-center bg-zinc-950/40 border border-zinc-900 rounded-2xl">
                <p className="text-slate-400 text-sm font-sans">No diagnostics found matching your search query or filters.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
