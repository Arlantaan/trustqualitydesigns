'use client';

import { useEffect, useRef } from 'react';

export function LiquidBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let mouseX = 0.5;
    let mouseY = 0.5;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create gradient based on time and mouse
      const gradient = ctx.createRadialGradient(
        canvas.width * (0.5 + mouseX * 0.3),
        canvas.height * (0.5 + mouseY * 0.3),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );

      const hue1 = 0 + Math.sin(time * 0.001) * 10;
      const hue2 = 10 + Math.cos(time * 0.0015) * 10;

      gradient.addColorStop(0, `hsla(${hue1}, 85%, 45%, 0.3)`);
      gradient.addColorStop(0.5, `hsla(${hue2}, 80%, 40%, 0.2)`);
      gradient.addColorStop(1, `hsla(${hue1 + 5}, 75%, 35%, 0.1)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw flowing blobs
      for (let i = 0; i < 3; i++) {
        const offset = i * 2.094;
        const x = canvas.width * (0.5 + Math.sin(time * 0.0008 + offset) * 0.3);
        const y = canvas.height * (0.5 + Math.cos(time * 0.001 + offset) * 0.3);
        const size = 200 + Math.sin(time * 0.002 + offset) * 100;

        const blobGradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        blobGradient.addColorStop(0, `rgba(220, 38, 38, ${0.3})`);
        blobGradient.addColorStop(0.5, `rgba(185, 28, 28, ${0.15})`);
        blobGradient.addColorStop(1, `rgba(153, 27, 27, 0)`);

        ctx.fillStyle = blobGradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      time++;
      animationFrameId = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.5 }}
    />
  );
}
