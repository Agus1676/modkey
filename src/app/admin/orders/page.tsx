'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, Clock, Truck, ShieldCheck, CheckCircle } from 'lucide-react';
import { db } from '@/services/db';
import { Order, OrderStatus } from '@/types';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const data = await db.getOrders();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    await db.updateOrderStatus(orderId, status);
    fetchOrders(); // Refresh orders state
  };

  // Helper for status styling
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="h-3 w-3" /> Pendiente
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="h-3 w-3" /> En Preparación
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Truck className="h-3 w-3" /> Enviado
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-green-500/10 text-green-400 border border-green-500/20">
            <CheckCircle className="h-3 w-3" /> Entregado
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">Monitoreo de Órdenes</h1>
        <p className="text-xs text-muted-neon mt-1">Hacer seguimiento de los pedidos, envíos y cambiar estados de facturación.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center glass-card border border-white/5 rounded-2xl space-y-4">
          <AlertCircle className="h-10 w-10 text-muted-neon mx-auto" />
          <div>
            <h3 className="font-semibold text-white">No hay órdenes registradas</h3>
            <p className="text-xs text-muted-neon mt-1">Los pedidos de los clientes aparecerán listados aquí en tiempo real.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div 
              key={order.id}
              className="glass-card border border-white/5 p-6 rounded-2xl flex flex-col lg:flex-row justify-between gap-6 shadow-xl"
            >
              
              {/* Order Info & Client details */}
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono font-bold text-sm text-white">{order.id}</span>
                  {getStatusBadge(order.status)}
                  <span className="text-[10px] text-muted-neon">
                    {new Date(order.created_at).toLocaleString('es-AR', {
                      day: '2-digit', month: '2-digit', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-neon block">Cliente</span>
                    <span className="text-white font-semibold mt-0.5 block">{order.customer_name}</span>
                    <span className="text-muted-neon block">{order.customer_email}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-muted-neon block">Dirección de Entrega</span>
                    <span className="text-white font-medium mt-0.5 block leading-relaxed">{order.shipping_address}</span>
                  </div>
                </div>

                {/* Items Purchased details */}
                <div className="border-t border-white/5 pt-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-muted-neon block">Ítems Comprados</span>
                  <div className="divide-y divide-white/5 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2 space-y-2">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 text-xs">
                        <div>
                          <span className="text-white font-semibold">{item.product_name}</span>
                          {item.selected_switch && (
                            <span className="text-[10px] text-muted-neon block mt-0.5">
                              {item.selected_switch} | Layout: {item.selected_layout}
                            </span>
                          )}
                        </div>
                        <span className="text-white font-medium shrink-0">
                          {item.quantity}u × ${item.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Changer & Total Price */}
              <div className="lg:w-64 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 flex flex-row lg:flex-col justify-between items-center lg:items-start gap-4">
                
                {/* Total amount */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-muted-neon">Monto de la Orden</span>
                  <h3 className="text-2xl font-black text-white">${order.total}</h3>
                </div>

                {/* Status selector dropdown */}
                <div className="space-y-2 w-full max-w-[180px] lg:max-w-none">
                  <label className="text-[9px] uppercase font-bold text-muted-neon block">Actualizar Estado</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                    className="w-full bg-[#161922] border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon transition-colors cursor-pointer"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">En Preparación</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                  </select>
                </div>

              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
