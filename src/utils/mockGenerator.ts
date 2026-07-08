/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ScanResult } from "../types";

export function generateMockScanResult(inputUrl: string): ScanResult {
  let domain = inputUrl.trim();
  // Remove protocol prefix for simple display
  domain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").split("/")[0];
  if (!domain) domain = "example.com";

  // Generate a realistic public IP address based on domain characters
  const hash = domain.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const octet1 = 104 + (hash % 10);
  const octet2 = 24 + (hash % 20);
  const octet3 = 12 + (hash % 8);
  const octet4 = 40 + (hash % 110);
  const ipAddress = `${octet1}.${octet2}.${octet3}.${octet4}`;

  return {
    url: domain,
    overallScore: 91,
    ipAddress,
    scanTimeMs: 1650 + (hash % 300),
    categories: {
      security: {
        name: "Security",
        score: 95,
        grade: "A",
        checkedCount: 18,
        passedCount: 17,
        status: "secure",
        trend: [88, 92, 95]
      },
      performance: {
        name: "Performance",
        score: 92,
        grade: "A",
        checkedCount: 12,
        passedCount: 11,
        status: "secure",
        trend: [85, 89, 92]
      },
      seo: {
        name: "SEO",
        score: 86,
        grade: "A-",
        checkedCount: 15,
        passedCount: 13,
        status: "secure",
        trend: [80, 84, 86]
      },
      infrastructure: {
        name: "Infrastructure",
        score: 94,
        grade: "A",
        checkedCount: 10,
        passedCount: 9,
        status: "secure",
        trend: [88, 90, 94]
      },
      compliance: {
        name: "Compliance",
        score: 89,
        grade: "B+",
        checkedCount: 11,
        passedCount: 10,
        status: "warning",
        trend: [82, 85, 89]
      },
      technology: {
        name: "Technology",
        score: 94,
        grade: "A",
        checkedCount: 14,
        passedCount: 13,
        status: "secure",
        trend: [90, 92, 94]
      }
    },
    checks: [
      {
        id: "ssl-cert",
        name: "SSL/TLS Certification",
        category: "security",
        status: "passed",
        description: `Active TLS 1.3 secure cryptographic certificate verified successfully for ${domain}. Issued by Cloudflare ECC CA-3.`,
        recommendation: "Maintain automated certificate rotation and monitor cipher suite compatibility yearly."
      },
      {
        id: "hsts-header",
        name: "HTTP Strict Transport Security (HSTS)",
        category: "security",
        status: "passed",
        description: `HSTS is fully configured on ${domain} with max-age=63072000, force-redirecting browsers to secure pathways.`,
        recommendation: "Submit your domain directly to the Chrome/Mozilla preloads registry to safeguard first-time visitors."
      },
      {
        id: "csp-header",
        name: "Content Security Policy (CSP)",
        category: "security",
        status: "warning",
        description: `CSP headers are active on ${domain}, but lack explicit frame-ancestors definitions, introducing slight frame-injection vulnerabilities.`,
        recommendation: "Add 'frame-ancestors: self' guidelines to protect against cross-site clickjacking attacks."
      },
      {
        id: "cors-wildcard",
        name: "Cross-Origin Resource Sharing (CORS)",
        category: "security",
        status: "passed",
        description: `Access-Control headers on ${domain} are locked down, preventing wildcard injections on backend microservices.`,
        recommendation: "Continue standard auditing on newly created API endpoints to ensure origin validation."
      },
      {
        id: "server-signature",
        name: "Server Fingerprinting Protection",
        category: "infrastructure",
        status: "failed",
        description: `Exposed tech signatures (Nginx response identifiers) detected in ${domain} network headers.`,
        recommendation: "Disable server signature tokens inside configuration files (set 'exposeHeaders' or 'ServerTokens off')."
      },
      {
        id: "dnssec-auth",
        name: "DNSSEC Cryptographic Signing",
        category: "infrastructure",
        status: "passed",
        description: `DNSSEC cryptographic signing verified for the ${domain} zone file, securing routing routes against hijacking.`,
        recommendation: "No immediate action required. Maintain DS hashes on the primary domain registrar."
      },
      {
        id: "gzip-compression",
        name: "Brotli Asset Compression",
        category: "performance",
        status: "passed",
        description: `All eligible text/json payloads on ${domain} are compressed using Brotli Level 5 compression.`,
        recommendation: "Integrate Brotli static pre-compression routines into your asset build system for additional speed gains."
      },
      {
        id: "cache-control",
        name: "Static Cache Directives",
        category: "performance",
        status: "passed",
        description: `Static image, font, and script assets on ${domain} serve with strict Cache-Control headers of max-age=31536000.`,
        recommendation: "Keep CDN cache hit ratios above 85% to minimize origin compute resource overhead."
      },
      {
        id: "robots-txt",
        name: "Robots.txt Validation",
        category: "seo",
        status: "passed",
        description: `Sitemap files and crawler directives are declared and parseable at ${domain}/robots.txt.`,
        recommendation: "Ensure backend login routes continue to be shielded from standard public search crawler indices."
      },
      {
        id: "sitemap-xml",
        name: "XML Sitemap Validation",
        category: "seo",
        status: "passed",
        description: `Valid sitemap index schemas found, detailing chronological page modification indices correctly.`,
        recommendation: "Submit sitemap URLs directly to Google Search Console to speed up new route indexing."
      },
      {
        id: "meta-tags",
        name: "Metadata and OpenGraph Tags",
        category: "seo",
        status: "warning",
        description: `Essential meta description and OpenGraph tags are active, but lack structured JSON-LD schema markers on secondary folders.`,
        recommendation: "Inject JSON-LD Schema.org structured metadata models to enable premium rich-results visual search layouts."
      },
      {
        id: "gdpr-cookies",
        name: "GDPR Banner Directives",
        category: "compliance",
        status: "warning",
        description: `Consent banner detected on ${domain}, but several tracking/analytics cookies fire prior to explicit visitor validation.`,
        recommendation: "Integrate proper cookie gating blockades to prevent telemetry scripts from running pre-consent."
      },
      {
        id: "privacy-policy",
        name: "Privacy & Terms Layout",
        category: "compliance",
        status: "passed",
        description: "Explicit privacy documentation and legal cookies disclosure links are crawlable at footer boundaries.",
        recommendation: "Ensure terms are updated to align with the latest CCPA/GDPR compliance guidelines."
      },
      {
        id: "js-framework",
        name: "React/Vite Infrastructure",
        category: "technology",
        status: "passed",
        description: `Modern React framework alongside high-performance Vite compiler detected on ${domain} frontend layer.`,
        recommendation: "Continue keeping NPM packages updated to safeguard against client-side package exploits."
      },
      {
        id: "font-subsetting",
        name: "Optimized Web Font Delivery",
        category: "performance",
        status: "passed",
        description: "Google Fonts and system fonts serve with proper font-display: swap descriptors to optimize visual rendering.",
        recommendation: "Keep font assets self-hosted on the primary origin server to avoid cross-domain connection penalties."
      }
    ],
    aiAnalysis: `Solvbeat security audit successfully parsed ${domain} at server address ${ipAddress}. The digital ecosystem exhibits an incredibly robust and modern baseline architecture, showcasing top-tier HTTPS/TLS parameters and highly secure DNS structures. Security and infrastructure segments score exceptional values, illustrating an enterprise-grade focus on encryption and zone file protection.\n\nFrom a performance and crawlers indexing standpoint, ${domain} displays highly optimized Brotli compression and cache declarations, but would benefit significantly from structured rich metadata injections. There are slight vulnerability footprints in the server-side headers, specifically exposed Nginx signature tokens and missing frame-ancestors clickjacking blockades. Resolving these simple configuration flaws will fully lock down your perimeter.\n\nFinally, compliance metrics should be tightened to comply with international regulations. We detected third-party tracking scripts initiating prior to active visitor validation on the GDPR cookie consent banner. Resolving this compliance warning will render your corporate telemetry and audit logs fully watertight across CCPA and GDPR regulations.`
  };
}
