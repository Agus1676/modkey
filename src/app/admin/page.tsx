'use client';

import React, { useState, useEffect } from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, ArrowRight, Shield } from 'lucide-react';
import { db } from '@/services/db';
import { DashboardMetrics } from '@/types';

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await db.getDashboardMetrics();
        setMetrics(data);
      } catch (err) {
        console.error('Error fetching admin metrics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-white/5 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-2xl" />
          ))}
        </div>
        <div className="h-[300px] bg-white/5 rounded-2xl" />
      </div>
    );
  }

  if (!metrics) return null;

  // Chart configuration math
  const maxSales = Math.max(...metrics.salesHistory.map(d => d.amount), 1);
  const padding = 40;
  const width = 500;
  const height = 180;
  
  // Calculate points for SVG line chart
  const points = metrics.salesHistory.map((day, idx) => {
    const x = padding + (idx * (width - padding * 2)) / (metrics.salesHistory.length - 1);
    const y = height - padding - (day.amount * (height - padding * 2)) / maxSales;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="text-primary-neon h-6 w-6" /> Resumen de Control
        </h1>
        <p className="text-xs text-muted-neon mt-1">Supervisión de métricas, inventario y facturación de la tienda.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Sales Card */}
        <div className="glass-card border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-24 w-24 bg-primary-neon/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-neon tracking-wider">Facturación Total</span>
              <h3 className="text-3xl font-black text-white mt-1">${metrics.totalSales.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-primary-neon/10 rounded-xl text-primary-neon">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Orders Card */}
        <div className="glass-card border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-24 w-24 bg-secondary-neon/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-neon tracking-wider">Órdenes Realizadas</span>
              <h3 className="text-3xl font-black text-white mt-1">{metrics.totalOrders}</h3>
            </div>
            <div className="p-3 bg-secondary-neon/10 rounded-xl text-secondary-neon">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div className="glass-card border border-white/5 p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] uppercase font-bold text-muted-neon tracking-wider">Alerta de Stock Bajo</span>
              <h3 className="text-3xl font-black text-white mt-1">{metrics.lowStockCount}</h3>
            </div>
            <div className={`p-3 rounded-xl ${metrics.lowStockCount > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-white/5 text-muted-neon'}`}>
              <AlertTriangle className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales history graph */}
        <div className="lg:col-span-2 glass-card border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-white text-sm">Historial de Ventas (Últimos 7 días)</h3>
            <p className="text-[11px] text-muted-neon mt-0.5">Ingresos acumulados a través de checkouts diarios.</p>
          </div>
          
          {/* Custom SVG Line Chart */}
          <div className="w-full aspect-[21/9] sm:aspect-[21/7] mt-6">
            {metrics.totalSales === 0 ? (
              <div className="h-full flex items-center justify-center border border-white/5 rounded-xl bg-white/[0.01] text-xs text-muted-neon">
                Esperando primeras ventas para dibujar gráfico...
              </div>
            ) : (
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Horizontal grid lines */}
                {[0, 0.5, 1].map((r, i) => {
                  const y = padding + r * (height - padding * 2);
                  return (
                    <line 
                      key={i} 
                      x1={padding} 
                      y1={y} 
                      x2={width - padding} 
                      y2={y} 
                      stroke="rgba(255,255,255,0.04)" 
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* The Chart Line */}
                <polyline
                  fill="none"
                  stroke="url(#salesGrad)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />

                {/* Dots on nodes */}
                {metrics.salesHistory.map((day, idx) => {
                  const x = padding + (idx * (width - padding * 2)) / (metrics.salesHistory.length - 1);
                  const y = height - padding - (day.amount * (height - padding * 2)) / maxSales;
                  return (
                    <g key={idx} className="group/dot">
                      <circle
                        cx={x}
                        cy={y}
                        r="4.5"
                        className="fill-primary-neon stroke-[#08090d] stroke-2 hover:r-6 cursor-pointer transition-all"
                      />
                      <title>{`${day.date}: $${day.amount}`}</title>
                    </g>
                  );
                })}

                {/* X Axis Labels */}
                {metrics.salesHistory.map((day, idx) => {
                  const x = padding + (idx * (width - padding * 2)) / (metrics.salesHistory.length - 1);
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={height - 12}
                      textAnchor="middle"
                      className="fill-muted-neon text-[8px] font-semibold"
                    >
                      {day.date}
                    </text>
                  );
                })}

                {/* Definitions (gradients) */}
                <defs>
                  <linearGradient id="salesGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="rgb(var(--primary))" />
                    <stop offset="100%" stopColor="rgb(var(--secondary))" />
                  </linearGradient>
                </defs>
              </svg>
            )}
          </div>
        </div>

        {/* Category breakdown progress indicators */}
        <div className="glass-card border border-white/5 p-6 rounded-2xl space-y-6">
          <div>
            <h3 className="font-bold text-white text-sm">Distribución de Ventas</h3>
            <p className="text-[11px] text-muted-neon mt-0.5">Participación por categoría de hardware.</p>
          </div>
          
          <div className="space-y-4 pt-2">
            {metrics.categorySales.map((cat) => {
              const maxVal = Math.max(...metrics.categorySales.map(c => c.value), 1);
              const percentage = Math.round((cat.value / (metrics.totalSales || 1)) * 100);
              
              return (
                <div key={cat.category} className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-white">{cat.category}</span>
                    <span className="text-primary-neon">${cat.value.toLocaleString()} <span className="text-muted-neon text-[10px]">({percentage}%)</span></span>
                  </div>
                  {/* Progress bar */}
                  <div className="h-2 w-full bg-[#161922] rounded-full overflow-hidden border border-white/5">
                    <div 
                      style={{ width: `${metrics.totalSales === 0 ? 0 : (cat.value / maxVal) * 100}%` }}
                      className="h-full bg-gradient-to-r from-primary-neon to-secondary-neon rounded-full"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
