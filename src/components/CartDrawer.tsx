'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const CartDrawer: React.FC = () => {
  const { 
    cartItems, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    cartCount 
  } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#0d0f14] border-l border-white/5 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary-neon h-5 w-5" />
                <h2 className="text-lg font-bold tracking-tight">Tu Carrito</h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary-neon/20 text-primary-neon font-medium">
                  {cartCount}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-muted-neon hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Item List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#161922] flex items-center justify-center text-muted-neon">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Tu carrito está vacío</h3>
                    <p className="text-sm text-muted-neon mt-1">¡Explora la tienda y agrega tu primer teclado custom!</p>
                  </div>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-2.5 bg-primary-neon text-white rounded-lg hover:bg-primary-neon/90 font-medium transition-colors"
                  >
                    Volver a la Tienda
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div 
                    key={`${item.product.id}-${item.selectedSwitch || ''}-${item.selectedLayout || ''}-${idx}`}
                    className="flex gap-4 p-3 rounded-xl bg-[#161922]/50 border border-white/5"
                  >
                    {/* Product Image */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-[#0d0f14]">
                      <Image 
                        src={item.product.image_url} 
                        alt={item.product.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-medium text-white truncate text-sm">{item.product.name}</h4>
                          <span className="font-semibold text-primary-neon text-sm">${item.product.price.toLocaleString('es-AR')}</span>
                        </div>
                        
                        {/* Selected Variants */}
                        {(item.selectedSwitch || item.selectedLayout) && (
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {item.selectedSwitch && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-neon">
                                {item.selectedSwitch}
                              </span>
                            )}
                            {item.selectedLayout && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-muted-neon">
                                Layout: {item.selectedLayout}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls & Delete */}
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-white/10 rounded-lg bg-[#0d0f14]">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1, item.selectedSwitch, item.selectedLayout)}
                            className="p-1 text-muted-neon hover:text-white"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1, item.selectedSwitch, item.selectedLayout)}
                            className="p-1 text-muted-neon hover:text-white"
                            disabled={item.quantity >= item.product.stock}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSwitch, item.selectedLayout)}
                          className="text-muted-neon hover:text-red-400 p-1 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[#12141a]/60 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-neon">Subtotal</span>
                  <span className="text-xl font-bold text-white">${cartTotal.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-muted-neon">
                  El envío y los impuestos se calcularán al finalizar la compra. Envío express gratis para órdenes mayores a $25.000.
                </p>
                <Link 
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-primary-neon to-secondary-neon text-white font-semibold rounded-xl hover:opacity-95 shadow-lg shadow-primary-neon/10 transition-all group"
                >
                  Proceder al Checkout
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
