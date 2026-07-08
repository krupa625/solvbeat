import React from "react";
import { motion } from "motion/react";

export default function Background() {
  // Pre-generated stable particle properties to prevent mismatch/hydration issues
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    size: (i % 3 === 0 ? 4 : i % 2 === 0 ? 3 : 2), // varied sizes: 2px, 3px, 4px
    x: ((i * 17) % 95) + 2.5, // pseudo-random stable x percentage
    y: ((i * 23) % 90) + 5,   // pseudo-random stable y percentage
    duration: 15 + (i % 12) * 2.5, // varied speeds
    delay: -(i % 8) * 3, // negative delay for immediate presence
  }));

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] overflow-hidden pointer-events-none z-0">
      
      {/* 1. Very subtle dark navy underlay to enrich the dark spectrum */}
      <div className="absolute inset-0 bg-[#070B14]/40 pointer-events-none" />

      {/* 2. Low opacity noise texture overlay for high-end organic texture */}
      <div className="absolute inset-0 bg-noise-overlay opacity-[0.015] pointer-events-none mix-blend-overlay backdrop-blur-md" />

      {/* 3. Soft vertical cyber grid lines with extremely low opacity */}
      <div 
        className="absolute inset-0 opacity-[0.08] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`, 
          backgroundSize: "40px 100%" 
        }} 
      />

      {/* 4. Subtle ambient lighting: very subtle blue & purple glows (opacity well under 10%) */}
      <motion.div 
        animate={{
          x: [-15, 15, -15],
          y: [-10, 10, -10],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[600px] h-[600px] bg-[#3B82F6]/4 rounded-full blur-[130px] pointer-events-none" 
      />
      
      <motion.div 
        animate={{
          x: [15, -15, 15],
          y: [10, -10, 10],
          scale: [1, 1.08, 1]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[700px] h-[700px] bg-[#7C3AED]/4 rounded-full blur-[150px] pointer-events-none" 
      />

      {/* 5. Animated particles drifting up across the viewport for premium spatial continuity */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-br from-[#60A5FA] to-[#8B5CF6] opacity-25 shadow-[0_0_8px_rgba(96,165,250,0.3)]"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
            }}
            animate={{
              y: ["0px", "-160px", "0px"],
              x: ["0px", "40px", "0px"],
              opacity: [0.1, 0.35, 0.1],
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

    </div>
  );
}
