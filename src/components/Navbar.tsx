'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShoppingCart, ShieldCheck, Keyboard, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar: React.FC = () => {
  const { setIsCartOpen, cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogoClick = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Tienda', href: '/#catalog' },
    { name: '🔊 Sound Test', href: '/sound-test', highlight: true },
    { name: 'Teclados', href: '/?cat=keyboards#catalog' },
    { name: 'Switches', href: '/?cat=switches#catalog' },
    { name: 'Keycaps', href: '/?cat=keycaps#catalog' },
    { name: 'Accesorios', href: '/?cat=accessories#catalog' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#08090d]/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 group cursor-pointer"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary-neon to-secondary-neon p-2 text-white shadow-lg shadow-primary-neon/10 group-hover:rotate-6 transition-transform">
                <Keyboard className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white group-hover:text-primary-neon transition-colors">
                Mod<span className="bg-gradient-to-r from-primary-neon to-secondary-neon bg-clip-text text-transparent">Key</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
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
          <div className="flex items-center gap-2 sm:gap-4">
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
              className="relative p-2.5 text-muted-neon hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
            >
              <ShoppingCart className="h-5.5 w-5.5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-primary-neon to-secondary-neon text-[9px] font-bold text-white ring-2 ring-[#08090d]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 text-muted-neon hover:text-white hover:bg-white/5 rounded-xl transition-all cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-white/5 bg-[#08090d] overflow-hidden"
          >
            <div className="px-4 py-4 space-y-2 flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm transition-all font-semibold ${
                    link.highlight 
                      ? 'bg-primary-neon/15 border border-primary-neon/30 text-white flex items-center gap-1.5 shadow-sm'
                      : 'text-muted-neon hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
