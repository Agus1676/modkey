'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingCart, ShieldCheck, Keyboard } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { setIsCartOpen, cartCount } = useCart();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#08090d]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-neon to-secondary-neon p-2 text-white shadow-lg shadow-primary-neon/10 group-hover:rotate-6 transition-transform">
                <Keyboard className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary-neon transition-colors">
                Mod<span className="bg-gradient-to-r from-primary-neon to-secondary-neon bg-clip-text text-transparent">Key</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/#catalog" 
              className="text-sm font-medium text-muted-neon hover:text-white transition-colors"
            >
              Tienda
            </Link>
            <Link 
              href="/sound-test" 
              className="text-sm font-semibold text-primary-neon hover:text-white transition-colors flex items-center gap-1"
            >
              <span>🔊</span> Sound Test
            </Link>
            <Link 
              href="/?cat=keyboards#catalog" 
              className="text-sm font-medium text-muted-neon hover:text-white transition-colors"
            >
              Teclados
            </Link>
            <Link 
              href="/?cat=switches#catalog" 
              className="text-sm font-medium text-muted-neon hover:text-white transition-colors"
            >
              Switches
            </Link>
            <Link 
              href="/?cat=keycaps#catalog" 
              className="text-sm font-medium text-muted-neon hover:text-white transition-colors"
            >
              Keycaps
            </Link>
            <Link 
              href="/?cat=accessories#catalog" 
              className="text-sm font-medium text-muted-neon hover:text-white transition-colors"
            >
              Accesorios
            </Link>
          </div>

          {/* Actions (Admin Panel & Cart) */}
          <div className="flex items-center gap-4">
            {/* Admin Portal Button */}
            <Link 
              href="/admin"
              title="Panel de Administración"
              className="p-2.5 text-muted-neon hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <ShieldCheck className="h-5.5 w-5.5" />
            </Link>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-muted-neon hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-primary-neon to-secondary-neon text-[9px] font-bold text-white ring-2 ring-[#08090d]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
