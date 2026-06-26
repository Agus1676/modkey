'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Gift, X, Copy, Check, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SEGMENTS = [
  { code: 'CYBER25', label: '25% OFF', color: '#a855f7', desc: '25% de descuento en tu compra' }, // Purple
  { code: 'MODKEY10', label: '10% OFF', color: '#06b6d4', desc: '10% de descuento en tu compra' }, // Cyan
  { code: 'THOCK15', label: '15% OFF', color: '#ec4899', desc: '15% de descuento en tu compra' }, // Pink
  { code: 'FREESHIP', label: 'ENVÍO GRATIS', color: '#22c55e', desc: 'Envío express bonificado' }, // Green
  { code: 'KEYCAP20', label: '20% OFF', color: '#f97316', desc: '20% de descuento en tu compra' }, // Orange
  { code: 'THOCK15', label: '15% OFF', color: '#3b82f6', desc: '15% de descuento en tu compra' }, // Blue
];

export default function LuckyWheel() {
  const [isOpen, setIsOpen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonCoupon, setWonCoupon] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);
  const [copied, setCopied] = useState(false);

  const lastSegmentRef = useRef(-1);

  // Load localStorage data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const spun = localStorage.getItem('modkey_lucky_wheel_spun') === 'true';
      const coupon = localStorage.getItem('modkey_coupon_won');
      if (spun && coupon) {
        setHasSpun(true);
        setWonCoupon(coupon);
      }
    }
  }, []);

  // Web Audio API click sound
  const playTickSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  };

  // Web Audio API victory sound
  const playVictorySound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      // C major arpeggio: C5, E5, G5, C6, E6, G6, C7
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } catch (e) {
      console.warn('Audio Context victory error:', e);
    }
  };

  const handleSpin = () => {
    if (isSpinning || hasSpun) return;

    setIsSpinning(true);
    const winningIdx = Math.floor(Math.random() * SEGMENTS.length);
    
    // Each segment covers 60 degrees.
    // Index 0: 0-60, Index 1: 60-120, etc.
    // The top marker is at 0/360 degrees.
    // The wheel rotates clockwise. The winning segment i needs to land at the top marker (which corresponds to 360 - i*60 - 30).
    const targetAngle = (360 - (winningIdx * 60 + 30)) % 360;
    
    const startTime = performance.now();
    const duration = 4200; // 4.2 seconds
    const startRotation = rotation % 360;
    const targetRotation = startRotation + 2160 + targetAngle; // 6 full spins + target

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Quintic ease-out to feel heavier at the end
      const easeProgress = 1 - Math.pow(1 - progress, 5);
      const currentAngle = startRotation + (targetRotation - startRotation) * easeProgress;
      
      setRotation(currentAngle);
      
      // Tick sound on segment cross
      const currentSegment = Math.floor((currentAngle + 30) / 60);
      if (currentSegment !== lastSegmentRef.current) {
        if (lastSegmentRef.current !== -1) {
          playTickSound();
        }
        lastSegmentRef.current = currentSegment;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        setHasSpun(true);
        setWonCoupon(SEGMENTS[winningIdx].code);
        localStorage.setItem('modkey_lucky_wheel_spun', 'true');
        localStorage.setItem('modkey_coupon_won', SEGMENTS[winningIdx].code);
        playVictorySound();
      }
    };

    requestAnimationFrame(animate);
  };

  const handleCopyCode = () => {
    if (!wonCoupon) return;
    navigator.clipboard.writeText(wonCoupon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper to draw SVG path segments
  const getSlicePath = (startAngle: number, endAngle: number) => {
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = 120 + 120 * Math.cos(startRad);
    const y1 = 120 + 120 * Math.sin(startRad);
    const x2 = 120 + 120 * Math.cos(endRad);
    const y2 = 120 + 120 * Math.sin(endRad);
    return `M 120 120 L ${x1} ${y1} A 120 120 0 0 1 ${x2} ${y2} Z`;
  };

  // Helper to place and rotate labels in segments
  const getLabelTransform = (startAngle: number, endAngle: number) => {
    const midAngle = (startAngle + endAngle) / 2;
    const midRad = (midAngle - 90) * Math.PI / 180;
    const textX = 120 + 75 * Math.cos(midRad);
    const textY = 120 + 75 * Math.sin(midRad);
    return {
      x: textX,
      y: textY,
      transform: `rotate(${midAngle}, ${textX}, ${textY})`,
    };
  };

  return (
    <>
      {/* Floating neon button on the bottom left (shifted to left-20 to avoid Next.js dev indicator overlap) */}
      <div className="fixed bottom-6 left-20 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="relative group bg-[#0b0c10] border border-primary-neon/40 hover:border-primary-neon text-white font-bold p-3.5 sm:px-5 sm:py-3.5 rounded-full flex items-center gap-2.5 transition-all shadow-lg hover:shadow-primary-neon/20 active:scale-95 cursor-pointer glow-primary/10 overflow-hidden"
        >
          {/* Animated glow border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-neon/0 via-primary-neon/10 to-primary-neon/0 group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          
          <Gift className="h-5 w-5 text-primary-neon animate-pulse" />
          <span className="text-xs uppercase tracking-wider hidden sm:inline">¡Girá y Ganá!</span>
        </button>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            
            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="glass-card bg-[#0b0c10]/95 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-2xl w-full flex flex-col md:flex-row items-center gap-8 relative shadow-2xl overflow-hidden"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-xl border border-white/5 bg-white/5 text-muted-neon hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
              >
                <X className="h-4.5 w-4.5" />
              </button>

              {/* Decorative background glows */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-neon/10 rounded-full blur-[70px] pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary-neon/10 rounded-full blur-[70px] pointer-events-none" />

              {/* Left Side: The Neon Wheel */}
              <div className="relative flex flex-col items-center justify-center select-none py-4">
                
                {/* Pointer Indicator */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 z-20 drop-shadow-[0_0_8px_rgba(168,85,247,0.8)] filter">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-primary-neon">
                    <path d="M12 21l-8-14h16z" />
                  </svg>
                </div>

                {/* Rotating Wheel Frame */}
                <div className="relative p-3 rounded-full border border-white/5 bg-black/30 shadow-inner">
                  <div className="absolute inset-0.5 rounded-full border border-primary-neon/10 animate-pulse-slow pointer-events-none" />
                  
                  {/* Wheel SVG */}
                  <svg
                    style={{ transform: `rotate(${rotation}deg)` }}
                    className="w-56 h-56 sm:w-64 sm:h-64 transform transition-transform duration-75 origin-center filter drop-shadow-[0_0_12px_rgba(168,85,247,0.15)]"
                    viewBox="0 0 240 240"
                    width="240"
                    height="240"
                  >
                    <g>
                      {SEGMENTS.map((seg, i) => {
                        const startAngle = i * 60;
                        const endAngle = (i + 1) * 60;
                        const path = getSlicePath(startAngle, endAngle);
                        const labelProps = getLabelTransform(startAngle, endAngle);
                        
                        return (
                          <g key={i}>
                            {/* Segment Slice */}
                            <path 
                              d={path} 
                              fill="#0b0c10"
                              stroke="#ffffff"
                              strokeWidth="0.5"
                              strokeOpacity="0.08"
                            />
                            {/* Segment Neon Color Glow Inner Rim */}
                            <path
                              d={getSlicePath(startAngle, endAngle)}
                              fill={seg.color}
                              fillOpacity="0.15"
                            />
                            {/* Accent divider line */}
                            <path
                              d={path}
                              fill="none"
                              stroke={seg.color}
                              strokeWidth="1.5"
                              strokeOpacity="0.3"
                            />
                            {/* Label text */}
                            <text
                              x={labelProps.x}
                              y={labelProps.y}
                              transform={labelProps.transform}
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              fill={seg.color}
                              fontSize="10"
                              fontWeight="900"
                              letterSpacing="0.05em"
                              className="font-sans filter drop-shadow-[0_0_2px_rgba(255,255,255,0.2)]"
                            >
                              {seg.label}
                            </text>
                          </g>
                        );
                      })}
                      {/* Center Hub */}
                      <circle cx="120" cy="120" r="16" fill="#08090d" stroke="#ffffff" strokeOpacity="0.1" strokeWidth="2" />
                      <circle cx="120" cy="120" r="8" fill="#a855f7" className="animate-pulse" />
                    </g>
                  </svg>
                </div>
              </div>

              {/* Right Side: Information / Call to Action */}
              <div className="flex-1 space-y-5 text-center md:text-left z-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                    Rueda Neón Mod<span className="text-primary-neon">Key</span>
                  </h3>
                  <p className="text-xs text-muted-neon">
                    Probá tu suerte. Girá la rueda y obtené un cupón de descuento inmediato para tu orden.
                  </p>
                </div>

                {!hasSpun ? (
                  // State: Not spun yet
                  <div className="pt-2 space-y-4">
                    <p className="text-[10px] text-muted-neon uppercase font-bold tracking-wider">
                      🎁 100% de probabilidad de ganar un cupón
                    </p>
                    <button
                      onClick={handleSpin}
                      disabled={isSpinning}
                      className="w-full py-3.5 bg-primary-neon hover:bg-primary-neon/90 text-black hover:scale-[1.01] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary-neon/20 hover:shadow-primary-neon/30 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                      {isSpinning ? 'Girando Rueda...' : 'GIRAR RUEDA'}
                    </button>
                  </div>
                ) : (
                  // State: Spun (Won a Coupon)
                  <div className="pt-1 space-y-4">
                    <div className="glass-card bg-black/40 border border-primary-neon/30 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <Sparkles className="h-4.5 w-4.5 text-primary-neon animate-pulse" />
                      </div>
                      
                      <span className="text-[9px] text-primary-neon uppercase font-extrabold tracking-widest block">
                        ¡Felicidades! Ganaste
                      </span>
                      
                      {/* Coupon Code Block */}
                      <h4 className="text-3xl font-black tracking-widest text-white font-mono">
                        {wonCoupon}
                      </h4>
                      
                      <p className="text-[11px] text-white/90 font-medium">
                        {SEGMENTS.find(s => s.code === wonCoupon)?.desc}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleCopyCode}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {copied ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-400" />
                            ¡Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copiar Código
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-3 bg-primary-neon text-black rounded-xl text-xs font-bold transition-all hover:opacity-95 cursor-pointer shadow-md shadow-primary-neon/15"
                      >
                        Ir al Checkout
                      </button>
                    </div>

                    <p className="text-[10px] text-muted-neon text-center md:text-left">
                      💡 El descuento se aplicará de forma automática en la pantalla de checkout.
                    </p>
                  </div>
                )}
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
