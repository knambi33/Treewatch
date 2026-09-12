import React, { useEffect, useRef, useState } from 'react';
import { Wind, Sun } from 'lucide-react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  type: 'leaf' | 'spore';
  opacity: number;
}

export const ActiveTreeBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [breezeActive, setBreezeActive] = useState(true);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Nature leaf colors
    const colors = ['#22c55e', '#16a34a', '#86efac', '#4ade80', '#15803d', '#a3e635'];

    // Initialize floating particles
    const particles: Particle[] = [];
    const count = Math.min(width > 768 ? 40 : 20, 50);

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 8 + 6,
        speedX: Math.random() * 1.2 + 0.3,
        speedY: Math.random() * 0.8 + 0.4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.3 ? 'leaf' : 'spore',
        opacity: Math.random() * 0.5 + 0.25,
      });
    }

    const drawLeaf = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      if (p.type === 'leaf') {
        // Draw realistic leaf shape
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.7, -p.size * 0.5, p.size * 0.7, p.size * 0.5, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.5, -p.size * 0.7, -p.size * 0.5, 0, -p.size);
        ctx.fill();

        // Draw leaf vein
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 0.8);
        ctx.lineTo(0, p.size * 0.8);
        ctx.stroke();
      } else {
        // Glowing spore
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    let swayAngle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Ambient light gradient
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, 'rgba(240, 253, 244, 0.4)');
      grad.addColorStop(1, 'rgba(254, 252, 232, 0.3)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle mouse aura
      const auraGrad = ctx.createRadialGradient(
        mousePos.current.x,
        mousePos.current.y,
        10,
        mousePos.current.x,
        mousePos.current.y,
        180
      );
      auraGrad.addColorStop(0, 'rgba(134, 239, 172, 0.15)');
      auraGrad.addColorStop(1, 'rgba(134, 239, 172, 0)');
      ctx.fillStyle = auraGrad;
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      swayAngle += 0.02;
      const breezeMultiplier = breezeActive ? 1 : 0.2;

      particles.forEach((p) => {
        if (breezeActive) {
          p.x += (p.speedX + Math.sin(swayAngle + p.y * 0.01) * 0.5) * breezeMultiplier;
          p.y += (p.speedY + Math.cos(swayAngle + p.x * 0.01) * 0.3) * breezeMultiplier;
          p.rotation += p.rotationSpeed * breezeMultiplier;

          // Mouse repelling physics
          const dx = p.x - mousePos.current.x;
          const dy = p.y - mousePos.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            p.x += (dx / dist) * 2;
            p.y += (dy / dist) * 2;
          }

          // Wrap edges
          if (p.x > width + 20) p.x = -20;
          if (p.y > height + 20) {
            p.y = -20;
            p.x = Math.random() * width;
          }
        }

        drawLeaf(p);
      });

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [breezeActive]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Dynamic Animated Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Decorative Organic Tree Canopy Silhouette at Bottom Right */}
      <div className="absolute -bottom-16 -right-16 w-96 h-96 opacity-10 md:opacity-15 transform transition-transform duration-1000 origin-bottom-right animate-sway-slow pointer-events-none">
        <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-800 fill-current">
          {/* Main Trunk */}
          <path d="M190 400 C185 320 170 260 150 200 C140 170 120 140 100 120 C110 125 130 135 145 155 C160 175 170 210 180 260 C190 220 210 180 240 150 C260 130 280 120 300 115 C280 125 265 145 250 175 C230 215 210 280 215 400 Z" />
          {/* Canopy Foliage Masses */}
          <circle cx="100" cy="110" r="65" />
          <circle cx="170" cy="80" r="75" />
          <circle cx="250" cy="90" r="70" />
          <circle cx="310" cy="130" r="60" />
          <circle cx="200" cy="140" r="70" />
          <circle cx="140" cy="160" r="55" />
          <circle cx="260" cy="170" r="50" />
        </svg>
      </div>

      {/* Decorative Sprouting Branch at Top Left */}
      <div className="absolute -top-12 -left-12 w-64 h-64 opacity-5 md:opacity-10 transform origin-top-left animate-sway-slow pointer-events-none">
        <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-emerald-700 fill-current">
          <path d="M0 0 C50 30 100 80 130 140 C120 120 90 90 60 70 C40 55 20 35 0 0 Z" />
          <circle cx="90" cy="80" r="30" />
          <circle cx="130" cy="130" r="35" />
          <circle cx="60" cy="60" r="25" />
        </svg>
      </div>

      {/* Ambient Nature Breeze Controller (bottom left corner) */}
      <div className="absolute bottom-4 left-4 pointer-events-auto flex items-center gap-2">
        <button
          onClick={() => setBreezeActive(!breezeActive)}
          title={breezeActive ? 'Pause living tree breeze' : 'Activate living tree breeze'}
          className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 shadow-sm border backdrop-blur-md transition-all ${
            breezeActive
              ? 'bg-emerald-100/80 text-emerald-900 border-emerald-300 hover:bg-emerald-200/90'
              : 'bg-stone-100/80 text-stone-600 border-stone-300 hover:bg-stone-200'
          }`}
        >
          <Wind className={`w-3.5 h-3.5 ${breezeActive ? 'animate-pulse text-emerald-600' : ''}`} />
          <span>{breezeActive ? 'Living Tree Breeze: Active' : 'Living Tree Breeze: Paused'}</span>
        </button>
      </div>
    </div>
  );
};
