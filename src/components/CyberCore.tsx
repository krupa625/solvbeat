/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";

export default function CyberCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0, isOver: false });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // Normalize coordinates between -1 and 1 relative to container center
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      setMouse((prev) => ({
        ...prev,
        targetX: x,
        targetY: y,
      }));
    };

    const handleMouseEnter = () => {
      setMouse((prev) => ({ ...prev, isOver: true }));
    };

    const handleMouseLeave = () => {
      setMouse((prev) => ({ ...prev, isOver: false, targetX: 0, targetY: 0 }));
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Handle canvas sizing properly with ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        const dpr = window.devicePixelRatio || 1;
        width = entryWidth;
        height = entryHeight;
        canvas.width = entryWidth * dpr;
        canvas.height = entryHeight * dpr;
        canvas.style.width = `${entryWidth}px`;
        canvas.style.height = `${entryHeight}px`;
        ctx.scale(dpr, dpr);
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // 3D Point Interface
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    // Build premium Geodesic Icosahedron for the inner security core
    const t = (1.0 + Math.sqrt(5.0)) / 2.0;
    const innerVertices: Point3D[] = [
      { x: -1, y: t, z: 0 }, { x: 1, y: t, z: 0 }, { x: -1, y: -t, z: 0 }, { x: 1, y: -t, z: 0 },
      { x: 0, y: -1, z: t }, { x: 0, y: 1, z: t }, { x: 0, y: -1, z: -t }, { x: 0, y: 1, z: -t },
      { x: t, y: 0, z: -1 }, { x: t, y: 0, z: 1 }, { x: -t, y: 0, z: -1 }, { x: -t, y: 0, z: 1 }
    ];

    // Scale icosahedron to appropriate visual radius
    const innerRadius = 70;
    innerVertices.forEach(v => {
      const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
      v.x = (v.x / length) * innerRadius;
      v.y = (v.y / length) * innerRadius;
      v.z = (v.z / length) * innerRadius;
    });

    // Build an outer sphere grid (holographic shield mesh)
    const outerVertices: Point3D[] = [];
    const rings = 5;
    const segments = 10;
    const outerRadius = 140;

    for (let r = 1; r < rings; r++) {
      const phi = (r * Math.PI) / rings;
      for (let s = 0; s < segments; s++) {
        const theta = (s * 2 * Math.PI) / segments;
        const x = outerRadius * Math.sin(phi) * Math.cos(theta);
        const y = outerRadius * Math.cos(phi);
        const z = outerRadius * Math.sin(phi) * Math.sin(theta);
        outerVertices.push({ x, y, z });
      }
    }

    // Add 3D particles for floating neural network constellation
    interface Particle3D {
      x: number;
      y: number;
      z: number;
      size: number;
      speed: number;
      angle: number;
      offsetY: number;
      color: string;
    }

    const particles: Particle3D[] = [];
    const particleCount = 60;
    const colors = ["#A855F7", "#38BDF8", "#F472B6"];

    for (let p = 0; p < particleCount; p++) {
      const pRad = outerRadius * (1.1 + Math.random() * 0.4);
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: pRad * Math.cos(angle),
        y: (Math.random() - 0.5) * 120,
        z: pRad * Math.sin(angle),
        size: 1.2 + Math.random() * 2,
        speed: 0.003 + Math.random() * 0.005,
        angle: angle,
        offsetY: (Math.random() - 0.5) * 50,
        color: colors[p % colors.length]
      });
    }

    // 3D rotation functions
    const rotateX = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos };
    };

    const rotateY = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos };
    };

    const rotateZ = (p: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos, z: p.z };
    };

    let angleX = 0;
    let angleY = 0;
    let floatTime = 0;
    let scanLineY = 0;
    let sweepAngle = 0;

    // Smooth spring parameters for mouse interactive parallax
    let currentMouseX = 0;
    let currentMouseY = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse spring interpolation
      setMouse((prev) => {
        const dx = prev.targetX - currentMouseX;
        const dy = prev.targetY - currentMouseY;
        currentMouseX += dx * 0.08;
        currentMouseY += dy * 0.08;
        angleY = currentMouseX * 0.35; // Parallax Y axis
        angleX = currentMouseY * 0.25; // Parallax X axis
        return prev;
      });

      floatTime += 0.01;
      sweepAngle += 0.005;
      const floatOffset = Math.sin(floatTime * 1.5) * 8;
      const autoRotate = floatTime * 0.12;

      const centerX = width / 2;
      const centerY = height / 2 + floatOffset;

      // Draw beautiful dual radial gradients in background for subtle neon depth
      const pulseRadius = outerRadius * (1.8 + Math.sin(floatTime * 2) * 0.15);
      const gradient = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, pulseRadius);
      gradient.addColorStop(0, "rgba(24, 12, 44, 0.45)");
      gradient.addColorStop(0.35, "rgba(168, 85, 247, 0.045)");
      gradient.addColorStop(0.7, "rgba(56, 189, 248, 0.015)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
      ctx.fill();

      // Outer revolving technical HUD Rings (Hologram dashboard style)
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 18]);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.25)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius * 1.35, autoRotate, autoRotate + Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([3, 10]);
      ctx.strokeStyle = "rgba(168, 85, 247, 0.18)";
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius * 1.5, -autoRotate * 0.6, -autoRotate * 0.6 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

      // Project and draw the Outer Wireframe Sphere Grid (Transparent Cyber Shield)
      const projectedOuter = outerVertices.map((v) => {
        let rot = rotateY(v, autoRotate * 0.5 + angleY);
        rot = rotateX(rot, angleX + 0.15);
        rot = rotateZ(rot, autoRotate * 0.15);

        const depth = 450;
        const scale = depth / (depth + rot.z);
        return {
          x: centerX + rot.x * scale,
          y: centerY + rot.y * scale,
          z: rot.z,
          scale,
        };
      });

      // Draw transparent grid lines on the outer shield
      ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
      ctx.lineWidth = 1;
      for (let r = 0; r < rings - 1; r++) {
        ctx.beginPath();
        for (let s = 0; s < segments; s++) {
          const idx = r * segments + s;
          const nextIdx = r * segments + ((s + 1) % segments);
          if (projectedOuter[idx] && projectedOuter[nextIdx] && projectedOuter[idx].z > -100) {
            ctx.moveTo(projectedOuter[idx].x, projectedOuter[idx].y);
            ctx.lineTo(projectedOuter[nextIdx].x, projectedOuter[nextIdx].y);
          }
        }
        ctx.stroke();
      }

      // Project and draw the Inner Geodesic Security Crystal (Icosahedron)
      const projectedInner = innerVertices.map((v) => {
        // Rotates opposite to outer sphere for structural dynamic contrast
        let rot = rotateY(v, -autoRotate * 0.8 + angleY);
        rot = rotateX(rot, -angleX * 0.5 + 0.3);
        rot = rotateZ(rot, -autoRotate * 0.2);

        const depth = 450;
        const scale = depth / (depth + rot.z);
        return {
          x: centerX + rot.x * scale,
          y: centerY + rot.y * scale,
          z: rot.z,
          scale,
        };
      });

      // Draw Icosahedron faces and wireframes with depth buffering
      ctx.strokeStyle = "rgba(168, 85, 247, 0.22)";
      ctx.lineWidth = 1.2;
      
      // Icosahedron faces indices configuration
      const faces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
      ];

      faces.forEach(([a, b, c]) => {
        const pA = projectedInner[a];
        const pB = projectedInner[b];
        const pC = projectedInner[c];

        // Back-face culling logic using depth check (only render faces that point forward)
        const zValue = (pA.z + pB.z + pC.z) / 3;
        if (zValue < 30) {
          ctx.beginPath();
          ctx.moveTo(pA.x, pA.y);
          ctx.lineTo(pB.x, pB.y);
          ctx.lineTo(pC.x, pC.y);
          ctx.closePath();

          // Fill faces with highly polished, glassmorphic semi-transparent neon glow
          const fillAlpha = Math.max(0.01, (zValue + innerRadius) / (innerRadius * 3)) * 0.12;
          ctx.fillStyle = `rgba(168, 85, 247, ${fillAlpha})`;
          ctx.fill();
          
          // Outer edge stroke
          ctx.stroke();
        }
      });

      // Draw shimmering vector starburst nodes on Icosahedron corners
      projectedInner.forEach((p, i) => {
        const alpha = Math.max(0.15, (p.z + innerRadius) / (innerRadius * 2));
        ctx.fillStyle = i % 2 === 0 ? `rgba(168, 85, 247, ${alpha})` : `rgba(56, 189, 248, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4 * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Elegant light star bloom cross effect
        if (i % 3 === 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.4})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(p.x - 8 * p.scale, p.y);
          ctx.lineTo(p.x + 8 * p.scale, p.y);
          ctx.moveTo(p.x, p.y - 8 * p.scale);
          ctx.lineTo(p.x, p.y + 8 * p.scale);
          ctx.stroke();
        }
      });

      // Interactive Cursor Attraction tethering (Light reaction on cursor mouseover)
      const virtualCursor3D = {
        x: currentMouseX * outerRadius * 1.2,
        y: currentMouseY * outerRadius * 1.2,
        z: 50
      };

      const virtualCursor2D = {
        x: centerX + virtualCursor3D.x,
        y: centerY + virtualCursor3D.y
      };

      // 3D Particles Simulation and Constellation connection mesh
      const projectedParticles = particles.map((part) => {
        part.angle += part.speed;
        let v = {
          x: (outerRadius + Math.sin(floatTime + part.angle) * 15) * Math.cos(part.angle),
          y: part.offsetY + Math.sin(part.angle * 3) * 25,
          z: (outerRadius + Math.sin(floatTime + part.angle) * 15) * Math.sin(part.angle)
        };

        let rot = rotateY(v, autoRotate * 0.4 + angleY);
        rot = rotateX(rot, angleX + 0.15);

        const depth = 450;
        const scale = depth / (depth + rot.z);
        return {
          x: centerX + rot.x * scale,
          y: centerY + rot.y * scale,
          z: rot.z,
          scale,
          color: part.color,
          size: part.size
        };
      });

      // Render neural network links between nearby floating particles
      ctx.lineWidth = 0.6;
      for (let i = 0; i < projectedParticles.length; i++) {
        const p1 = projectedParticles[i];
        if (p1.z > 80) continue; // Skip backmost links

        let connectionsCount = 0;
        for (let j = i + 1; j < projectedParticles.length; j++) {
          const p2 = projectedParticles[j];
          if (connectionsCount >= 2) break; // Limit lines per node for high performance and sleek minimalism

          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 65) {
            const opacity = (1.0 - dist / 65) * 0.15 * Math.max(0, (p1.z + outerRadius) / (outerRadius * 2));
            ctx.strokeStyle = `rgba(148, 163, 184, ${opacity})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
            connectionsCount++;
          }
        }
      }

      // Draw the floating particles
      projectedParticles.forEach((p) => {
        const opacity = Math.max(0.12, (p.z + outerRadius) / (outerRadius * 2.2));
        ctx.fillStyle = p.color;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Micro glows on foreground particles
        if (p.z < -40 && p.size > 2.5) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.scale * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Render Interactive Cursor tether lasers when mouse is over
      const isMouseOverContainer = document.getElementById("cyber-core-container")?.matches(":hover");
      if (isMouseOverContainer) {
        let drawCount = 0;
        projectedParticles.forEach((p) => {
          if (drawCount >= 4) return;
          const distanceToCursor = Math.hypot(p.x - virtualCursor2D.x, p.y - virtualCursor2D.y);
          if (distanceToCursor < 120) {
            const glowAlpha = (1.0 - distanceToCursor / 120) * 0.35;
            ctx.strokeStyle = `rgba(56, 189, 248, ${glowAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(virtualCursor2D.x, virtualCursor2D.y);
            ctx.stroke();

            // Tiny light burst on target particle
            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.scale * 1.5, 0, Math.PI * 2);
            ctx.fill();
            
            drawCount++;
          }
        });
      }

      // Inner Glowing Fusion Core (Power Center bulb)
      const corePulse = 30 + Math.sin(floatTime * 4) * 4;
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 1, centerX, centerY, corePulse);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      coreGrad.addColorStop(0.2, "rgba(168, 85, 247, 0.9)");
      coreGrad.addColorStop(0.65, "rgba(56, 189, 248, 0.3)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, corePulse, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal security laser scanning sweep line
      scanLineY += 1.8;
      if (scanLineY > outerRadius * 1.5) scanLineY = -outerRadius * 1.5;

      ctx.strokeStyle = "rgba(236, 72, 153, 0.22)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - outerRadius * 1.2, centerY + scanLineY);
      ctx.lineTo(centerX + outerRadius * 1.2, centerY + scanLineY);
      ctx.stroke();

      // Glowing scan haze
      const scanGlow = ctx.createLinearGradient(0, centerY + scanLineY - 12, 0, centerY + scanLineY + 12);
      scanGlow.addColorStop(0, "rgba(236, 72, 153, 0)");
      scanGlow.addColorStop(0.5, "rgba(236, 72, 153, 0.08)");
      scanGlow.addColorStop(1, "rgba(236, 72, 153, 0)");
      ctx.fillStyle = scanGlow;
      ctx.fillRect(centerX - outerRadius * 1.2, centerY + scanLineY - 12, outerRadius * 2.4, 24);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="cyber-core-container"
      className="relative w-full h-[380px] md:h-[500px] flex items-center justify-center overflow-hidden cursor-crosshair group"
    >
      {/* Absolute background ambient overlays */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 via-transparent to-transparent pointer-events-none blur-3xl transition-opacity duration-1000 group-hover:opacity-100" />
      
      {/* 3D Visualizer Canvas */}
      <canvas ref={canvasRef} className="z-10 block pointer-events-none" />

      {/* Futuristic Floating Glass Panels */}
      <div className="absolute top-10 right-8 w-24 h-24 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-2xl transform rotate-[15deg] pointer-events-none hidden md:block shadow-2xl transition-transform duration-500 group-hover:rotate-[20deg]" />
      <div className="absolute bottom-10 left-8 w-32 h-32 bg-white/[0.03] backdrop-blur-lg border border-white/10 rounded-2xl transform -rotate-[15deg] shadow-2xl pointer-events-none hidden md:block transition-transform duration-500 group-hover:-rotate-[25deg]" />

      {/* Cyber overlay tech metrics */}
      <div className="absolute bottom-6 left-8 font-mono text-[9px] text-[#64748B] tracking-widest space-y-1 select-none pointer-events-none hidden md:block">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          CORE STATE: <span className="text-emerald-400 font-bold">STABLE</span>
        </div>
        <div>PROB_FREQ: <span className="text-white/60">884.2 GHz</span></div>
        <div>VECTOR_ROT: <span className="text-white/60">DYNAMIC</span></div>
      </div>
      
      <div className="absolute top-6 right-8 font-mono text-[9px] text-[#64748B] tracking-widest text-right space-y-1 select-none pointer-events-none hidden md:block">
        <div>ORBIT_NODES: <span className="text-[#38BDF8]">120/120</span></div>
        <div>ENCRYPT_KEY: <span className="text-[#A855F7]">RSA_4096</span></div>
        <div>LATENCY: <span className="text-emerald-400">0.04ms</span></div>
      </div>

      {/* Multi-layered dynamic orbit circles backing the 3D core */}
      <div className="absolute pointer-events-none z-0 border border-purple-500/10 rounded-full w-[280px] h-[280px] animate-pulse duration-[3000ms]" />
      <div className="absolute pointer-events-none z-0 border border-sky-500/5 rounded-full w-[360px] h-[360px]" />
    </div>
  );
}
