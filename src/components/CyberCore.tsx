/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from "react";

export default function CyberCore() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0, targetX: 0, targetY: 0 });

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

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseMove);
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

    // Handle canvas sizing properly with ResizeObserver as suggested in Responsive Design guidelines
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: entryWidth, height: entryHeight } = entry.contentRect;
        // High-DPI canvas adjustment
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

    // Define 3D wireframe vertices for a geodesic neon core (crystal/sphere)
    interface Point3D {
      x: number;
      y: number;
      z: number;
    }

    const vertices: Point3D[] = [];
    const rings = 6;
    const segments = 12;
    const radius = 120;

    // Build standard UV sphere wireframe
    for (let r = 0; r <= rings; r++) {
      const phi = (r * Math.PI) / rings;
      for (let s = 0; s < segments; s++) {
        const theta = (s * 2 * Math.PI) / segments;
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);
        vertices.push({ x, y, z });
      }
    }

    // Add extra outer glowing particle rings
    const particles: { x: number; y: number; z: number; size: number; speed: number; angle: number; axis: string }[] = [];
    for (let p = 0; p < 45; p++) {
      const pRad = radius * (1.2 + Math.random() * 0.4);
      const angle = Math.random() * Math.PI * 2;
      particles.push({
        x: pRad * Math.cos(angle),
        y: (Math.random() - 0.5) * 40,
        z: pRad * Math.sin(angle),
        size: 1.5 + Math.random() * 2,
        speed: 0.005 + Math.random() * 0.01,
        angle: angle,
        axis: Math.random() > 0.5 ? "Y" : "X"
      });
    }

    // 3D Rotation matrices
    const rotateX = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x,
        y: point.y * cos - point.z * sin,
        z: point.y * sin + point.z * cos,
      };
    };

    const rotateY = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos + point.z * sin,
        y: point.y,
        z: -point.x * sin + point.z * cos,
      };
    };

    const rotateZ = (point: Point3D, angle: number): Point3D => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return {
        x: point.x * cos - point.y * sin,
        y: point.x * sin + point.y * cos,
        z: point.z,
      };
    };

    let angleX = 0;
    let angleY = 0;
    let floatTime = 0;
    let scanLineY = 0;

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse interpolation
      setMouse((prev) => {
        const newX = prev.x + (prev.targetX - prev.x) * 0.1;
        const newY = prev.y + (prev.targetY - prev.y) * 0.1;
        angleX = (newY * Math.PI) / 8;
        angleY = (newX * Math.PI) / 6;
        return { ...prev, x: newX, y: newY };
      });

      // Basic rotation over time + gentle float
      floatTime += 0.015;
      const floatOffsetY = Math.sin(floatTime) * 12;
      const autoRotate = floatTime * 0.15;

      const centerX = width / 2;
      const centerY = height / 2 + floatOffsetY;

      // Draw subtle background radial glow centered on the object
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, radius * 2.2);
      glowGrad.addColorStop(0, "rgba(168, 85, 247, 0.18)"); // Purple neon core glow
      glowGrad.addColorStop(0.5, "rgba(56, 189, 248, 0.05)"); // Blue outline
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Project vertices to 2D
      const projected = vertices.map((v) => {
        // Apply auto-rotation + mouse movement rotation
        let rot = rotateY(v, autoRotate + angleY);
        rot = rotateX(rot, angleX + 0.2);
        rot = rotateZ(rot, autoRotate * 0.3);

        // Perspective projection
        const depth = 350;
        const scale = depth / (depth + rot.z);
        return {
          x: centerX + rot.x * scale,
          y: centerY + rot.y * scale,
          z: rot.z,
          scale,
        };
      });

      // Draw wireframe segments
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(56, 189, 248, 0.15)"; // Soft electric blue wire

      // Connect rings (horizontal lines)
      for (let r = 0; r <= rings; r++) {
        ctx.beginPath();
        for (let s = 0; s < segments; s++) {
          const idx = r * segments + s;
          const nextIdx = r * segments + ((s + 1) % segments);
          if (projected[idx] && projected[nextIdx]) {
            ctx.moveTo(projected[idx].x, projected[idx].y);
            ctx.lineTo(projected[nextIdx].x, projected[nextIdx].y);
          }
        }
        ctx.stroke();
      }

      // Connect segments (vertical lines)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(168, 85, 247, 0.12)"; // Soft purple wire
      for (let r = 0; r < rings; r++) {
        for (let s = 0; s < segments; s++) {
          const idx = r * segments + s;
          const downIdx = (r + 1) * segments + s;
          if (projected[idx] && projected[downIdx]) {
            ctx.moveTo(projected[idx].x, projected[idx].y);
            ctx.lineTo(projected[downIdx].x, projected[downIdx].y);
          }
        }
      }
      ctx.stroke();

      // Draw shiny core node spheres (bloom node stars)
      projected.forEach((p, idx) => {
        // Skip some nodes for asymmetry
        if (idx % 3 !== 0) return;

        // Opacity based on depth (z coordinate)
        const alpha = Math.max(0.1, (p.z + radius) / (radius * 2));
        ctx.fillStyle = idx % 5 === 0 
          ? `rgba(232, 121, 249, ${alpha * 0.8})` // pink
          : `rgba(56, 189, 248, ${alpha * 0.8})`; // blue

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fill();

        // Node flare/glow for select vertices
        if (idx % 12 === 0) {
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.35})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 8 * p.scale, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      // Update and draw outer orbital particles
      particles.forEach((part) => {
        part.angle += part.speed;
        let v = {
          x: radius * 1.35 * Math.cos(part.angle),
          y: part.y + Math.sin(part.angle * 2) * 20,
          z: radius * 1.35 * Math.sin(part.angle),
        };

        let rot = rotateY(v, angleY + autoRotate * 0.6);
        rot = rotateX(rot, angleX + 0.2);

        const depth = 350;
        const scale = depth / (depth + rot.z);
        const pX = centerX + rot.x * scale;
        const pY = centerY + rot.y * scale;

        const alpha = Math.max(0.08, (rot.z + radius * 1.5) / (radius * 3));
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.95})`;

        ctx.beginPath();
        ctx.arc(pX, pY, part.size * scale, 0, Math.PI * 2);
        ctx.fill();

        // Draw dynamic connection stream lines between particles and nearest sphere nodes
        if (part.angle % 2 < 0.15) {
          ctx.strokeStyle = `rgba(56, 189, 248, ${alpha * 0.25})`;
          ctx.beginPath();
          ctx.moveTo(pX, pY);
          ctx.lineTo(centerX, centerY);
          ctx.stroke();
        }
      });

      // Draw subtle holographic scan overlay lines
      scanLineY += 1.2;
      if (scanLineY > radius * 1.6) scanLineY = -radius * 1.6;

      ctx.strokeStyle = "rgba(232, 121, 249, 0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(centerX - radius * 1.4, centerY + scanLineY);
      ctx.lineTo(centerX + radius * 1.4, centerY + scanLineY);
      ctx.stroke();

      // Soft scanline fade gradients
      const scanGlow = ctx.createLinearGradient(0, centerY + scanLineY - 10, 0, centerY + scanLineY + 10);
      scanGlow.addColorStop(0, "rgba(232, 121, 249, 0)");
      scanGlow.addColorStop(0.5, "rgba(232, 121, 249, 0.08)");
      scanGlow.addColorStop(1, "rgba(232, 121, 249, 0)");
      ctx.fillStyle = scanGlow;
      ctx.fillRect(centerX - radius * 1.5, centerY + scanLineY - 10, radius * 3, 20);

      // Inner core power bulb (absolute center)
      const coreGrad = ctx.createRadialGradient(centerX, centerY, 2, centerX, centerY, 32);
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.2, "rgba(168, 85, 247, 0.85)");
      coreGrad.addColorStop(0.6, "rgba(56, 189, 248, 0.4)");
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 35, 0, Math.PI * 2);
      ctx.fill();

      // Outer HUD holographic rings
      ctx.strokeStyle = "rgba(56, 189, 248, 0.18)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 12]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.55, autoRotate * 0.5, autoRotate * 0.5 + Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = "rgba(168, 85, 247, 0.08)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 5]);
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.75, -autoRotate * 0.2, -autoRotate * 0.2 + Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]); // Reset line dash

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
      className="relative w-full h-[380px] md:h-[500px] flex items-center justify-center overflow-hidden cursor-crosshair"
    >
      {/* Absolute background visual rings */}
      <div className="absolute inset-0 bg-radial-gradient from-purple-500/5 via-transparent to-transparent pointer-events-none blur-3xl" />
      
      {/* Main Canvas */}
      <canvas ref={canvasRef} className="z-10 block" />

      {/* Sleek Interface Decorative Floating Glass Panels */}
      <div className="absolute top-8 right-8 w-24 h-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl transform rotate-12 pointer-events-none hidden md:block shadow-2xl" />
      <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl transform -rotate-12 shadow-2xl pointer-events-none hidden md:block" />

      {/* Sleek Interface Interactive Neon Nodes */}
      <div className="absolute top-1/4 right-1/4 w-3 h-3 bg-[#A855F7] rounded-full shadow-[0_0_15px_#A855F7] animate-pulse z-0" />
      <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#38BDF8] rounded-full shadow-[0_0_15px_#38BDF8] animate-pulse z-0" />

      {/* Cyber overlay tech metrics for extreme realism */}
      <div className="absolute bottom-4 left-6 font-mono text-[9px] text-gray-500 tracking-wider space-y-1 select-none pointer-events-none hidden md:block">
        <div>CORE STATE: <span className="text-emerald-400">ONLINE</span></div>
        <div>SCAN FREQUENCY: 884.2 GHz</div>
        <div>VECTOR PARALLAX: ACTIVE</div>
      </div>
      
      <div className="absolute top-4 right-6 font-mono text-[9px] text-gray-500 tracking-wider text-right space-y-1 select-none pointer-events-none hidden md:block">
        <div>ORBIT_NODES: 120/120</div>
        <div>SEC_MATRIX: 256-BIT CPL</div>
        <div>THREAT_VECT: NULL</div>
      </div>

      {/* Subtle pulsing cyber center indicator */}
      <div className="absolute pointer-events-none z-0 border border-purple-500/10 rounded-full w-[280px] h-[280px] animate-pulse duration-[4000ms]" />
      <div className="absolute pointer-events-none z-0 border border-sky-500/5 rounded-full w-[360px] h-[360px]" />
    </div>
  );
}
