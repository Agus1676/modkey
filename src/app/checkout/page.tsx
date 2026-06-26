'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CreditCard, Truck, ShieldCheck, ShoppingBag, ArrowLeft, CheckCircle, Copy, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { db } from '@/services/db';
import { OrderItem } from '@/types';

const VALID_COUPONS: Record<string, { type: 'percent' | 'free_shipping', value: number, desc: string }> = {
  'MODKEY10': { type: 'percent', value: 10, desc: '10% de descuento' },
  'THOCK15': { type: 'percent', value: 15, desc: '15% de descuento' },
  'KEYCAP20': { type: 'percent', value: 20, desc: '20% de descuento' },
  'CYBER25': { type: 'percent', value: 25, desc: '25% de descuento' },
  'FREESHIP': { type: 'free_shipping', value: 0, desc: 'Envío Express Gratis' }
};

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart } = useCart();
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
  });

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  // Coupon states
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  // Load won coupon from lucky wheel on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const won = localStorage.getItem('modkey_coupon_won');
      if (won) {
        setAppliedCoupon(won);
        setCouponCode(won);
      }
    }
  }, []);

  // Form input handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Coupon handlers
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (VALID_COUPONS[code]) {
      setAppliedCoupon(code);
    } else {
      setCouponError('Código de cupón inválido.');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponError('');
  };

  // Submit checkout
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (cartItems.length === 0) return;
    
    setIsSubmitting(true);

    try {
      // Structure order items
      const items: OrderItem[] = cartItems.map(item => ({
        id: `item-${Math.random().toString(36).substring(2, 9)}`,
        order_id: '', // Will be set by db.createOrder
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        product_name: item.product.name,
        product_image: item.product.image_url,
        selected_switch: item.selectedSwitch,
        selected_layout: item.selectedLayout
      }));

      // Calculate final pricing with coupon
      let discountVal = 0;
      let shippingVal = cartTotal > 150000 ? 0 : 4500;

      if (appliedCoupon) {
        const coupon = VALID_COUPONS[appliedCoupon];
        if (coupon) {
          if (coupon.type === 'percent') {
            discountVal = Math.round((cartTotal * coupon.value) / 100);
          } else if (coupon.type === 'free_shipping') {
            shippingVal = 0;
          }
        }
      }

      const totalAmount = Math.max(0, cartTotal - discountVal + shippingVal);

      const order = await db.createOrder({
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address: `${formData.address}, ${formData.city} (CP: ${formData.zip})`,
        total: totalAmount,
        items
      });

      setPlacedOrder(order);
      clearCart();
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Calculate prices for rendering
  let discountAmount = 0;
  let shippingCost = cartTotal > 150000 ? 0 : 4500;

  if (appliedCoupon) {
    const coupon = VALID_COUPONS[appliedCoupon];
    if (coupon) {
      if (coupon.type === 'percent') {
        discountAmount = Math.round((cartTotal * coupon.value) / 100);
      } else if (coupon.type === 'free_shipping') {
        shippingCost = 0;
      }
    }
  }

  const totalAmount = Math.max(0, cartTotal - discountAmount + shippingCost);

  // Success view (Interactive Neon/Glass ticket)
  if (placedOrder) {
    const shipping = shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`;
    
    return (
      <div className="min-h-screen bg-background py-16 px-4 flex justify-center items-center">
        <div className="max-w-md w-full relative">
          
          {/* Neon lights background */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-primary-neon via-secondary-neon to-accent-neon opacity-30 blur-xl animate-pulse-slow" />
          
          {/* Glass Ticket body */}
          <div className="relative glass-card border border-white/10 rounded-3xl overflow-hidden p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col">
            
            {/* Header Success Icon */}
            <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-white/5">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <CheckCircle className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">¡Orden Confirmada!</h2>
                <p className="text-xs text-muted-neon mt-1">Tu teclado customizado ya está en marcha.</p>
              </div>
            </div>

            {/* Ticket Specs */}
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-muted-neon">Código de Compra</span>
                <button 
                  onClick={() => handleCopyId(placedOrder.id)}
                  className="flex items-center gap-1.5 font-bold text-white hover:text-primary-neon transition-colors"
                >
                  <span className="font-mono text-sm">{placedOrder.id}</span>
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Items List inside ticket */}
              <div className="space-y-2.5">
                <span className="font-semibold text-white uppercase tracking-wider text-[10px] block">Resumen del Ticket</span>
                <div className="divide-y divide-white/5 bg-white/5 rounded-xl border border-white/5 p-3.5 space-y-2">
                  {placedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex justify-between py-1.5 first:pt-0 last:pb-0 items-center">
                      <div className="min-w-0 pr-4">
                        <span className="font-medium text-white block truncate text-[11px]">{item.product_name}</span>
                        {item.selected_switch && (
                          <span className="text-[10px] text-muted-neon">{item.selected_switch} | {item.selected_layout}</span>
                        )}
                      </div>
                      <span className="text-white font-semibold shrink-0">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address details */}
              <div className="space-y-1">
                <span className="text-muted-neon block">Destinatario</span>
                <span className="text-white font-medium block">{placedOrder.customer_name}</span>
                <span className="text-muted-neon block leading-relaxed">{placedOrder.shipping_address}</span>
              </div>
            </div>

            {/* Simulated barcode */}
            <div className="py-4 flex flex-col items-center space-y-1 bg-white/5 border border-white/5 rounded-2xl">
              <div className="flex items-stretch h-8 gap-0.5 justify-center">
                <div className="w-1 bg-white" /><div className="w-0.5 bg-white" /><div className="w-1.5 bg-white" /><div className="w-0.5 bg-white" /><div className="w-2 bg-white" /><div className="w-0.5 bg-white" /><div className="w-1 bg-white" /><div className="w-2 bg-white" /><div className="w-0.5 bg-white" /><div className="w-1.5 bg-white" /><div className="w-1 bg-white" /><div className="w-0.5 bg-white" /><div className="w-2 bg-white" /><div className="w-1 bg-white" />
              </div>
              <span className="text-[8px] font-mono tracking-[0.2em] text-muted-neon uppercase">MODKEY-{placedOrder.id.toUpperCase()}</span>
            </div>

            {/* Total and back button */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-muted-neon uppercase font-semibold">Total Pagado</span>
                <h3 className="text-2xl font-black text-white">${placedOrder.total.toLocaleString('es-AR')}</h3>
              </div>
              <Link 
                href="/" 
                className="px-5 py-2.5 bg-primary-neon text-white font-semibold rounded-xl hover:bg-primary-neon/90 transition-colors text-xs"
              >
                Volver a la Tienda
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    );
  }

  // Cart Empty redirect
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background py-24 text-center px-4 flex justify-center items-center">
        <div className="max-w-md w-full glass-card border border-white/5 rounded-3xl p-8 space-y-4">
          <ShoppingBag className="h-12 w-12 text-muted-neon mx-auto" />
          <h2 className="text-xl font-bold text-white">Tu carrito está vacío</h2>
          <p className="text-sm text-muted-neon">Para realizar un checkout, primero agrega componentes o teclados custom en la tienda.</p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-neon text-white font-semibold rounded-xl hover:bg-primary-neon/90 transition-colors text-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a la Tienda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-3xl font-extrabold text-white tracking-tight mb-8">Completar Pedido</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Shipping details */}
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Truck className="text-primary-neon h-5 w-5" /> Datos de Envío
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">Nombre Completo</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Cosme Fulanito"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">Email de Contacto</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ej: cosme@correo.com"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
                <div className="space-y-1.5 col-span-2">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">Dirección de Entrega</label>
                  <input 
                    type="text" 
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Ej: Avenida Siempreviva 742"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">Localidad / Provincia</label>
                  <input 
                    type="text" 
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Ej: CABA"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">Código Postal</label>
                  <input 
                    type="text" 
                    name="zip"
                    required
                    value={formData.zip}
                    onChange={handleInputChange}
                    placeholder="Ej: 1425"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Payment details */}
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="text-secondary-neon h-5 w-5" /> Pago Seguro (Simulado)
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">Número de Tarjeta</label>
                  <input 
                    type="text" 
                    name="cardNumber"
                    required
                    maxLength={19}
                    value={formData.cardNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                      setFormData(prev => ({ ...prev, cardNumber: val }));
                    }}
                    placeholder="4500 1234 5678 9012"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">Vencimiento</label>
                  <input 
                    type="text" 
                    name="cardExpiry"
                    required
                    maxLength={5}
                    value={formData.cardExpiry}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').replace(/(.{2})/g, '$1/').replace(/\/$/, '');
                      setFormData(prev => ({ ...prev, cardExpiry: val }));
                    }}
                    placeholder="MM/AA"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-semibold text-muted-neon">CVC</label>
                  <input 
                    type="password" 
                    name="cardCvc"
                    required
                    maxLength={3}
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Checkout Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card border border-white/5 rounded-2xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-white">Resumen de Compra</h2>
              
              {/* Product list */}
              <div className="divide-y divide-white/5 max-h-60 overflow-y-auto pr-2 space-y-3">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex gap-4 py-3 first:pt-0">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[#161922] shrink-0">
                      <Image 
                        src={item.product.image_url} 
                        alt={item.product.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-white truncate">{item.product.name}</h4>
                      <p className="text-[10px] text-muted-neon truncate mt-0.5">
                        {item.selectedSwitch && `${item.selectedSwitch}`}
                        {item.selectedLayout && ` | Layout: ${item.selectedLayout}`}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-[10px] text-muted-neon">Cant: {item.quantity}</span>
                        <span className="text-xs font-bold text-primary-neon">${(item.product.price * item.quantity).toLocaleString('es-AR')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-4 border-t border-white/5 space-y-3">
                <span className="font-semibold text-white uppercase tracking-wider text-[10px] block">
                  ¿Tenés un Cupón de Descuento?
                </span>
                
                {!appliedCoupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Código (Ej: THOCK15)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon transition-colors placeholder-white/20 uppercase"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-white/5 border border-white/10 hover:border-primary-neon/40 hover:bg-primary-neon/10 text-white rounded-xl text-xs font-semibold transition-all cursor-pointer"
                    >
                      Aplicar
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-xs text-emerald-400">
                    <span className="font-medium">Cupón <strong className="font-bold">{appliedCoupon}</strong> aplicado ({VALID_COUPONS[appliedCoupon]?.desc})</span>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-[10px] text-muted-neon hover:text-red-400 transition-colors uppercase font-bold tracking-wider cursor-pointer"
                    >
                      Quitar
                    </button>
                  </div>
                )}
                {couponError && (
                  <span className="text-[10px] text-red-400 block">{couponError}</span>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pt-4 border-t border-white/5 text-xs">
                <div className="flex justify-between text-muted-neon">
                  <span>Subtotal Productos</span>
                  <span className="text-white">${cartTotal.toLocaleString('es-AR')}</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-[#22c55e]">
                    <span>Descuento ({appliedCoupon})</span>
                    <span>-${discountAmount.toLocaleString('es-AR')}</span>
                  </div>
                )}

                {appliedCoupon && appliedCoupon === 'FREESHIP' && (
                  <div className="flex justify-between text-[#22c55e]">
                    <span>Cupón Envío Gratis ({appliedCoupon})</span>
                    <span>Aplicado</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-neon">
                  <span>Envío Express</span>
                  <span className="text-white">
                    {shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString('es-AR')}`}
                  </span>
                </div>
                
                <div className="flex justify-between text-white font-bold text-sm pt-3 border-t border-white/5">
                  <span>Monto Total</span>
                  <span className="text-lg text-primary-neon">${totalAmount.toLocaleString('es-AR')}</span>
                </div>
              </div>

              {/* Checkout Actions */}
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleSubmit()}
                className="w-full py-4 bg-gradient-to-r from-primary-neon to-secondary-neon text-white font-bold rounded-xl hover:opacity-95 shadow-lg shadow-primary-neon/15 hover:shadow-primary-neon/25 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? 'Procesando Pago...' : 'Confirmar y Pagar'}
              </button>

              <div className="flex justify-center items-center gap-2 text-[10px] text-muted-neon">
                <ShieldCheck className="h-4 w-4 text-[#22c55e]" /> Conexión y pagos cifrados en Sandbox
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
