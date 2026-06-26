'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, Info, Keyboard } from 'lucide-react';

// Web Audio API Synthesizer Class
class KeyboardAudioSynth {
  private ctx: AudioContext | null = null;
  public analyser: AnalyserNode | null = null;

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;
        this.analyser.connect(this.ctx.destination);
      }
    }
  }

  playSwitch(type: 'linear' | 'tactile' | 'clicky') {
    this.init();
    if (!this.ctx || !this.analyser) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;
    const pitchSkew = 0.96 + Math.random() * 0.08; // Slight variation per keypress

    if (type === 'linear') {
      // Linear (Thock): Deep low frequency thud, very short decay, lowpass filtered
      this.playThock(now, 105 * pitchSkew, 0.09, 0.55);
    } else if (type === 'tactile') {
      // Tactile (Clack): Mid frequency bounce + subtle click
      this.playThock(now, 130 * pitchSkew, 0.07, 0.4);
      this.playClick(now, 1300 * pitchSkew, 0.016, 0.18);
    } else if (type === 'clicky') {
      // Clicky (Snap): Low thud + sharp high click
      this.playThock(now, 120 * pitchSkew, 0.06, 0.25);
      this.playClick(now, 2400 * pitchSkew, 0.009, 0.65);
    }
  }

  private playThock(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx || !this.analyser) return;

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.75, time + duration);

    gainNode.gain.setValueAtTime(volume, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(280, time);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.analyser);

    osc.start(time);
    osc.stop(time + duration);
  }

  private playClick(time: number, freq: number, duration: number, volume: number) {
    if (!this.ctx || !this.analyser) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(freq * 0.4, time);

    const osc = this.ctx.createOscillator();
    const gainNode = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.2, time + duration);

    gainNode.gain.setValueAtTime(volume, time);
    gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(this.analyser);

    osc.start(time);
    osc.stop(time + duration);
  }
}

// 60% Keyboard Layout Mappings
interface KeyItem {
  code: string;
  label: string;
  width: string; // Tailwind class
}

const KEYBOARD_ROWS: KeyItem[][] = [
  // Row 1
  [
    { code: 'Escape', label: 'Esc', width: 'w-10 sm:w-12' },
    { code: 'Digit1', label: '1', width: 'w-10 sm:w-12' },
    { code: 'Digit2', label: '2', width: 'w-10 sm:w-12' },
    { code: 'Digit3', label: '3', width: 'w-10 sm:w-12' },
    { code: 'Digit4', label: '4', width: 'w-10 sm:w-12' },
    { code: 'Digit5', label: '5', width: 'w-10 sm:w-12' },
    { code: 'Digit6', label: '6', width: 'w-10 sm:w-12' },
    { code: 'Digit7', label: '7', width: 'w-10 sm:w-12' },
    { code: 'Digit8', label: '8', width: 'w-10 sm:w-12' },
    { code: 'Digit9', label: '9', width: 'w-10 sm:w-12' },
    { code: 'Digit0', label: '0', width: 'w-10 sm:w-12' },
    { code: 'Minus', label: '-', width: 'w-10 sm:w-12' },
    { code: 'Equal', label: '+', width: 'w-10 sm:w-12' },
    { code: 'Backspace', label: 'Backspace', width: 'flex-1' }
  ],
  // Row 2
  [
    { code: 'Tab', label: 'Tab', width: 'w-14 sm:w-16' },
    { code: 'KeyQ', label: 'Q', width: 'w-10 sm:w-12' },
    { code: 'KeyW', label: 'W', width: 'w-10 sm:w-12' },
    { code: 'KeyE', label: 'E', width: 'w-10 sm:w-12' },
    { code: 'KeyR', label: 'R', width: 'w-10 sm:w-12' },
    { code: 'KeyT', label: 'T', width: 'w-10 sm:w-12' },
    { code: 'KeyY', label: 'Y', width: 'w-10 sm:w-12' },
    { code: 'KeyU', label: 'U', width: 'w-10 sm:w-12' },
    { code: 'KeyI', label: 'I', width: 'w-10 sm:w-12' },
    { code: 'KeyO', label: 'O', width: 'w-10 sm:w-12' },
    { code: 'KeyP', label: 'P', width: 'w-10 sm:w-12' },
    { code: 'BracketLeft', label: '[', width: 'w-10 sm:w-12' },
    { code: 'BracketRight', label: ']', width: 'w-10 sm:w-12' },
    { code: 'Backslash', label: '\\', width: 'w-10 sm:w-12' }
  ],
  // Row 3
  [
    { code: 'CapsLock', label: 'Caps', width: 'w-16 sm:w-20' },
    { code: 'KeyA', label: 'A', width: 'w-10 sm:w-12' },
    { code: 'KeyS', label: 'S', width: 'w-10 sm:w-12' },
    { code: 'KeyD', label: 'D', width: 'w-10 sm:w-12' },
    { code: 'KeyF', label: 'F', width: 'w-10 sm:w-12' },
    { code: 'KeyG', label: 'G', width: 'w-10 sm:w-12' },
    { code: 'KeyH', label: 'H', width: 'w-10 sm:w-12' },
    { code: 'KeyJ', label: 'J', width: 'w-10 sm:w-12' },
    { code: 'KeyK', label: 'K', width: 'w-10 sm:w-12' },
    { code: 'KeyL', label: 'L', width: 'w-10 sm:w-12' },
    { code: 'Semicolon', label: 'Ñ / ;', width: 'w-10 sm:w-12' },
    { code: 'Quote', label: '\'', width: 'w-10 sm:w-12' },
    { code: 'Enter', label: 'Enter', width: 'flex-1' }
  ],
  // Row 4
  [
    { code: 'ShiftLeft', label: 'Shift', width: 'w-20 sm:w-24' },
    { code: 'KeyZ', label: 'Z', width: 'w-10 sm:w-12' },
    { code: 'KeyX', label: 'X', width: 'w-10 sm:w-12' },
    { code: 'KeyC', label: 'C', width: 'w-10 sm:w-12' },
    { code: 'KeyV', label: 'V', width: 'w-10 sm:w-12' },
    { code: 'KeyB', label: 'B', width: 'w-10 sm:w-12' },
    { code: 'KeyN', label: 'N', width: 'w-10 sm:w-12' },
    { code: 'KeyM', label: 'M', width: 'w-10 sm:w-12' },
    { code: 'Comma', label: ',', width: 'w-10 sm:w-12' },
    { code: 'Period', label: '.', width: 'w-10 sm:w-12' },
    { code: 'Slash', label: '/', width: 'w-10 sm:w-12' },
    { code: 'ShiftRight', label: 'Shift', width: 'flex-1' }
  ],
  // Row 5
  [
    { code: 'ControlLeft', label: 'Ctrl', width: 'w-10 sm:w-12' },
    { code: 'MetaLeft', label: 'Win', width: 'w-10 sm:w-12' },
    { code: 'AltLeft', label: 'Alt', width: 'w-10 sm:w-12' },
    { code: 'Space', label: 'Spacebar', width: 'w-48 sm:w-64 flex-1' },
    { code: 'AltRight', label: 'Alt', width: 'w-10 sm:w-12' },
    { code: 'MetaRight', label: 'Win', width: 'w-10 sm:w-12' },
    { code: 'ContextMenu', label: 'Menu', width: 'w-10 sm:w-12' },
    { code: 'ControlRight', label: 'Ctrl', width: 'w-10 sm:w-12' }
  ]
];

export default function SoundTesterPage() {
  const [activeSwitch, setActiveSwitch] = useState<'linear' | 'tactile' | 'clicky'>('linear');
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const synthRef = useRef<KeyboardAudioSynth | null>(null);
  const animationRef = useRef<number | null>(null);

  // Initialize synth
  useEffect(() => {
    synthRef.current = new KeyboardAudioSynth();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Set up Canvas visualizer drawing loop
  useEffect(() => {
    if (!canvasRef.current || !synthRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw);
      
      const analyser = synthRef.current?.analyser;
      if (!analyser) {
        // Draw standard flat line if no sound active
        ctx.fillStyle = '#08090d';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        return;
      }

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Determine glow colors based on switch type
      const color = activeSwitch === 'linear' ? 'rgb(168, 85, 247)' : // Purple
                    activeSwitch === 'tactile' ? 'rgb(236, 72, 153)' : // Pink
                    'rgb(6, 182, 212)'; // Cyan

      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 3;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset
    };

    draw();
  }, [activeSwitch]);

  // Hook typing events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling on Spacebar typing
      if (e.code === 'Space') {
        e.preventDefault();
      }

      // Check if key already pressed (prevent auto-repeat firing multiple sounds)
      if (pressedKeys[e.code]) return;

      setPressedKeys(prev => ({ ...prev, [e.code]: true }));
      synthRef.current?.playSwitch(activeSwitch);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => ({ ...prev, [e.code]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeSwitch, pressedKeys]);

  // Manual keypress handler (mouse click)
  const handleKeyClick = (code: string) => {
    synthRef.current?.playSwitch(activeSwitch);
    setPressedKeys(prev => ({ ...prev, [code]: true }));
    setTimeout(() => {
      setPressedKeys(prev => ({ ...prev, [code]: false }));
    }, 120);
  };

  // Helper to color keys depending on switch selection
  const getActiveKeyClass = () => {
    if (activeSwitch === 'linear') return 'bg-primary-neon/20 border-primary-neon text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]';
    if (activeSwitch === 'tactile') return 'bg-secondary-neon/20 border-secondary-neon text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]';
    return 'bg-accent-neon/20 border-accent-neon text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]';
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-neon hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al Catálogo
        </Link>

        {/* Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Keyboard className="text-primary-neon h-7 w-7" /> Switch Sound Tester
            </h1>
            <p className="text-sm text-muted-neon mt-1">
              Probá los distintos perfiles de switches mecánicos. Tipeá libremente en tu teclado para escuchar la acústica en tiempo real.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Left Column: Selectors & Waveform */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* Switch profile selectors */}
            <div className="glass-card border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary-neon" /> Tipo de Switch
              </h3>
              
              <div className="space-y-2">
                {/* Linear */}
                <button
                  onClick={() => {
                    synthRef.current?.playSwitch('linear');
                    setActiveSwitch('linear');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    activeSwitch === 'linear'
                      ? 'bg-primary-neon/10 border-primary-neon text-white glow-primary/5'
                      : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs">ModKey Linear Yellow</span>
                  <span className="text-[10px] text-muted-neon">Sonido: Suave, grave ("Thocky"). Silencioso.</span>
                </button>

                {/* Tactile */}
                <button
                  onClick={() => {
                    synthRef.current?.playSwitch('tactile');
                    setActiveSwitch('tactile');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    activeSwitch === 'tactile'
                      ? 'bg-secondary-neon/10 border-secondary-neon text-white'
                      : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs">Gateron Brown Tactile</span>
                  <span className="text-[10px] text-muted-neon">Sonido: Acústica intermedia ("Clack"). Con tope táctil.</span>
                </button>

                {/* Clicky */}
                <button
                  onClick={() => {
                    synthRef.current?.playSwitch('clicky');
                    setActiveSwitch('clicky');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer ${
                    activeSwitch === 'clicky'
                      ? 'bg-accent-neon/10 border-accent-neon text-white'
                      : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white'
                  }`}
                >
                  <span className="font-bold text-xs">Cherry MX Blue Clicky</span>
                  <span className="text-[10px] text-muted-neon">Sonido: Agudo y metálico ("Snap/Click"). Ruidoso.</span>
                </button>
              </div>
            </div>

            {/* Realtime Waveform Oscilloscope */}
            <div className="glass-card border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider">Osciloscopio Acústico</h3>
              <div className="h-28 rounded-xl overflow-hidden bg-[#08090d] border border-white/5 relative">
                <canvas 
                  ref={canvasRef} 
                  width={300} 
                  height={110} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Virtual Keyboard */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* The Keyboard Case */}
            <div className="bg-[#12141c] border border-white/5 p-4 sm:p-6 rounded-3xl shadow-2xl space-y-3 sm:space-y-4">
              {/* LED strip at the top */}
              <div className="h-1.5 w-full bg-[#1c1f2b] rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full w-1/3 rounded-full blur-[2px] transition-all duration-500 animate-pulse ${
                    activeSwitch === 'linear' ? 'bg-primary-neon ml-0' :
                    activeSwitch === 'tactile' ? 'bg-secondary-neon ml-[33%]' : 'bg-accent-neon ml-[66%]'
                  }`}
                />
              </div>

              {/* Grid of keys */}
              <div className="flex flex-col gap-1.5 sm:gap-2">
                {KEYBOARD_ROWS.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex gap-1.5 sm:gap-2 justify-between">
                    {row.map((keyItem) => {
                      const isPressed = !!pressedKeys[keyItem.code];
                      return (
                        <button
                          key={keyItem.code}
                          onMouseDown={() => handleKeyClick(keyItem.code)}
                          className={`h-10 sm:h-12 border rounded-lg text-[10px] sm:text-xs font-bold transition-all select-none duration-75 flex items-center justify-center cursor-pointer ${keyItem.width} ${
                            isPressed
                              ? getActiveKeyClass()
                              : 'bg-[#181a24] border-white/5 text-muted-neon hover:text-white hover:bg-white/5 active:scale-95 shadow-md'
                          }`}
                        >
                          <span className="truncate px-0.5">{keyItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Instruction / Help Box */}
            <div className="glass-card border border-white/5 rounded-2xl p-5 flex gap-4 items-start text-xs text-muted-neon leading-relaxed">
              <Info className="h-5 w-5 text-primary-neon shrink-0 mt-0.5" />
              <div>
                <span className="text-white font-bold block mb-1">¿Cómo usar el Probador de Sonido?</span>
                Hacé clic en cualquiera de las teclas del teclado virtual para probar el sonido con el mouse. O mejor aún, **dejá esta pestaña abierta y tipea libremente en tu teclado físico**. Vas a notar que el teclado digital en pantalla sigue tu tipeo exacto y reproduce el sonido correspondiente al switch seleccionado en tiempo real.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
