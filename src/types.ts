/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CheckItem {
  id: string;
  name: string;
  category: 'security' | 'performance' | 'seo' | 'infrastructure' | 'compliance' | 'technology';
  status: 'passed' | 'warning' | 'failed';
  description: string;
  recommendation: string;
}

export interface CategoryScore {
  name: string;
  score: number;
  grade: string;
  checkedCount: number;
  passedCount: number;
  status: 'secure' | 'warning' | 'critical';
  trend: number[];
}

export interface ScanResult {
  url: string;
  overallScore: number;
  ipAddress: string;
  scanTimeMs: number;
  categories: {
    security: CategoryScore;
    performance: CategoryScore;
    seo: CategoryScore;
    infrastructure: CategoryScore;
    compliance: CategoryScore;
    technology: CategoryScore;
  };
  checks: CheckItem[];
  aiAnalysis: string;
}

export interface ScanLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  category?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
