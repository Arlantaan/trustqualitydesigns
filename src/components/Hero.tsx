'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { AnimatedText } from './AnimatedText';
import { useRef, useEffect, useState } from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  cta?: {
    label: string;
    href: string;
  };
  backgroundVideo?: string;
  backgroundImage?: string;
}

export function Hero({
  title,
  subtitle,
  description,
  cta,
}: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const demoTimeoutsRef = useRef<number[]>([]);
  const [showDemoPrompt, setShowDemoPrompt] = useState(false);
  const [showGhostCursor, setShowGhostCursor] = useState(false);
  const [ghostPos, setGhostPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
    };

    const clearDemoTimeouts = () => {
      demoTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
      demoTimeoutsRef.current = [];
    };

    const clearCanvas = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    const drawPath = (
      points: { x: number; y: number }[],
      duration = 1400,
      delay = 0,
      onPoint?: (point: { x: number; y: number }) => void
    ) => {
      const ctx = canvas.getContext('2d');
      if (!ctx || points.length < 2) return;
      let start = 0;
      const totalSegments = points.length - 1;

      const step = (timestamp: number) => {
        if (delay > 0 && !start) {
          start = timestamp;
        }
        if (delay > 0 && timestamp - start < delay) {
          requestAnimationFrame(step);
          return;
        }
        if (delay > 0 && start && timestamp - start >= delay) {
          start = timestamp;
        }
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const t = Math.min(1, elapsed / duration);
        const currentSegment = Math.max(1, Math.floor(t * totalSegments));

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i <= currentSegment; i += 1) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
        if (onPoint) onPoint(points[currentSegment]);

        if (t < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
    };

    const runDemo = () => {
      clearDemoTimeouts();
      clearCanvas();
      setShowDemoPrompt(false);
      setShowGhostCursor(true);

      const rect = canvas.getBoundingClientRect();
      const padX = rect.width * 0.18;
      const padY = rect.height * 0.22;
      const w = rect.width - padX * 2;
      const h = rect.height - padY * 2;

      const signWidth = Math.min(w * 0.9, h * 3.2);
      const signHeight = signWidth / 3;
      const left = padX + (w - signWidth) / 2;
      const top = padY + (h - signHeight) / 2;
      const right = left + signWidth;
      const bottom = top + signHeight;
      const r = Math.min(signHeight * 0.22, 16);

      const rectPath = [
        { x: left + r, y: top },
        { x: right - r, y: top },
        { x: right, y: top + r },
        { x: right, y: bottom - r },
        { x: right - r, y: bottom },
        { x: left + r, y: bottom },
        { x: left, y: bottom - r },
        { x: left, y: top + r },
        { x: left + r, y: top },
      ];

      drawPath(rectPath, 900, 0, (p) => setGhostPos(p));

      demoTimeoutsRef.current.push(
        window.setTimeout(() => {
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.save();
          ctx.font = `${Math.max(14, signHeight * 0.28)}px ${'var(--font-display), system-ui, sans-serif'}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(239, 68, 68, 0.9)';
          ctx.shadowBlur = 18;
          ctx.fillStyle = 'rgba(255, 235, 235, 0.95)';
          ctx.fillText('Trust Quality Design', (left + right) / 2, (top + bottom) / 2);
          ctx.restore();

          ctx.save();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.55)';
          ctx.lineWidth = 2;
          ctx.shadowColor = 'rgba(239, 68, 68, 0.6)';
          ctx.shadowBlur = 14;
          ctx.strokeRect(left + 6, top + 6, signWidth - 12, signHeight - 12);
          ctx.restore();
        }, 700)
      );

      demoTimeoutsRef.current.push(
        window.setTimeout(() => {
          clearCanvas();
          setShowDemoPrompt(true);
          setShowGhostCursor(false);
        }, 2000)
      );

      demoTimeoutsRef.current.push(
        window.setTimeout(() => {
          setShowDemoPrompt(false);
          setShowGhostCursor(false);
        }, 3200)
      );
    };

    resize();
    runDemo();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      setShowGhostCursor(false);
      demoTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  const getPoint = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    const point = getPoint(event);
    if (!point) return;
    drawingRef.current = true;
    lastPointRef.current = point;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const point = getPoint(event);
    const last = lastPointRef.current;
    if (!point || !last) return;
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    drawingRef.current = false;
    lastPointRef.current = null;
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const frameY = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', '24%']);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: 'easeOut' },
    },
  };

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[95vh] flex items-center overflow-visible pt-36 sm:pt-40 lg:pt-44 pb-16 bg-black"
    >
      <div className="absolute inset-0 phi-grid-bg opacity-20" />
      <div className="absolute inset-0 pyth-grid opacity-30" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,38,56,0.3),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(122,13,27,0.4),transparent_60%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[0.45fr_0.55fr] items-center phi-gap-lg">
          <motion.div
            style={{ y: contentY }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            {subtitle && (
              <motion.div variants={itemVariants} className="mb-5">
                <span className="inline-flex items-center gap-3 px-5 py-2.5 border border-red-400/40 text-red-200 text-xs font-semibold uppercase tracking-[0.2em] rounded-full bg-red-900/20 mx-auto">
                  {subtitle}
                </span>
              </motion.div>
            )}

            <AnimatedText
              className="font-display text-[clamp(2.8rem,6vw,6.2rem)] leading-[1.02] tracking-[-0.01em] text-white mb-6 max-w-2xl mx-auto"
              delay={0.2}
            >
              {title}
            </AnimatedText>

            {description && (
              <motion.p
                variants={itemVariants}
                className="text-[clamp(1rem,2vw,1.6rem)] text-gray-200 mb-8 leading-relaxed max-w-xl mx-auto"
              >
                {description}
              </motion.p>
            )}

          </motion.div>

          <motion.div style={{ y: frameY }} className="relative">
            <div className="relative">
              <div className="absolute -top-6 -left-6 h-16 w-40 border border-red-500/30" />
              <div className="absolute -bottom-8 -right-8 h-24 w-24 border border-white/10" />
              <div className="phi-golden-frame bg-black/60 triangle-frame">
                <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-red-950/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />
                <div className="absolute inset-0 ring-1 ring-red-500/25" />
                <div className="absolute inset-0 mix-blend-screen opacity-20 bg-[radial-gradient(circle_at_40%_20%,rgba(255,255,255,0.35),transparent_45%)]" />
                <div
                  className={`pointer-events-none absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.4em] text-red-100 transition-opacity duration-500 ${
                    showDemoPrompt ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  Let&apos;s create
                </div>
                {showGhostCursor && ghostPos && (
                  <div
                    className="pointer-events-none absolute h-6 w-6 rounded-full border border-red-300/60 bg-red-500/20 shadow-[0_0_18px_rgba(239,68,68,0.65)]"
                    style={{
                      left: ghostPos.x,
                      top: ghostPos.y,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                )}
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    touchAction: 'none',
                    cursor: 'url(/pencil-cursor.svg) 3 20, auto',
                  }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                />
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 text-xs uppercase tracking-[0.3em] text-red-100 border border-red-500/30 rounded-full bg-black/50 hover:bg-red-500/20 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 max-w-2xl w-full mx-auto">
          {cta && (
            <motion.div variants={itemVariants} className="flex items-center gap-4 justify-center mb-3">
              <Link
                href={cta.href}
                className="group relative inline-flex items-center gap-3 px-8 py-[18px] bg-red-600 text-white text-base font-semibold rounded-full hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-500"
              >
                <span className="relative z-10">{cta.label}</span>
                <span className="h-[6px] w-[34px] bg-white/80 rounded-full transition-all duration-500 group-hover:w-[55px]" />
              </Link>
            </motion.div>
          )}

          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center"
          >
            <div className="grid grid-cols-3 gap-10 text-xs uppercase tracking-[0.3em] text-gray-500 text-center w-full">
              <div className="flex flex-col items-center">
                <div className="text-red-200 text-lg font-semibold leading-none">18+</div>
                <span className="mt-1 leading-none">Years</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-red-200 text-lg font-semibold leading-none">220+</div>
                <span className="mt-1 leading-none">Installs</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-red-200 text-lg font-semibold leading-none">60+</div>
                <span className="mt-1 leading-none">Partners</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
