'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Receipt, 
  ArrowLeft, 
  Keyboard, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  LogOut 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const isAuthedLocal = localStorage.getItem('modkey_admin_auth') === 'true';
    const isAuthedSession = sessionStorage.getItem('modkey_admin_auth') === 'true';
    if (isAuthedLocal || isAuthedSession) {
      setIsAuthenticated(true);
    }
    setIsChecking(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === 'admin' || password === 'modkey2026') {
      if (rememberMe) {
        localStorage.setItem('modkey_admin_auth', 'true');
      } else {
        sessionStorage.setItem('modkey_admin_auth', 'true');
      }
      setIsAuthenticated(true);
    } else {
      setError('Contraseña incorrecta. Por favor intente de nuevo.');
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('modkey_admin_auth');
    sessionStorage.removeItem('modkey_admin_auth');
    setIsAuthenticated(false);
    setPassword('');
    setError('');
  };

  const menuItems = [
    {
      name: 'Métricas',
      href: '/admin',
      icon: LayoutDashboard,
    },
    {
      name: 'Inventario',
      href: '/admin/inventory',
      icon: Package,
    },
    {
      name: 'Órdenes',
      href: '/admin/orders',
      icon: Receipt,
    },
  ];

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary-neon border-r-2"></div>
          <p className="text-xs text-muted-neon uppercase tracking-wider font-semibold animate-pulse">Verificando credenciales...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090d] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Glow Effects in Background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-neon/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Logo / Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-primary-neon/10 border border-primary-neon/20 shadow-lg glow-primary/5 mb-3">
              <Keyboard className="h-8 w-8 text-primary-neon" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Mod<span className="text-primary-neon">Key</span> Admin HUD
            </h1>
            <p className="text-xs text-muted-neon uppercase tracking-wider font-semibold">
              Panel de Control de E-Commerce
            </p>
          </div>

          {/* Login Form Container */}
          <motion.div 
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="glass-card p-8 rounded-2xl border border-white/5 space-y-6 bg-[#0b0c10]/80 backdrop-blur-xl relative"
          >
            <div className="space-y-1">
              <h2 className="text-sm font-bold text-white">Ingreso Autorizado</h2>
              <p className="text-xs text-muted-neon">Ingresá la clave del panel de administración.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-muted-neon uppercase font-bold tracking-wider">
                  Contraseña de Administrador
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-neon">
                    <Lock className="h-4 w-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 bg-black/40 border border-white/10 rounded-xl text-sm text-white placeholder-white/20 focus:outline-none focus:border-primary-neon focus:ring-1 focus:ring-primary-neon transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-neon hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl"
                  >
                    <ShieldAlert className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Remember Session */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-white/10 bg-black/40 text-primary-neon focus:ring-0 focus:ring-offset-0 focus:outline-none h-4 w-4 accent-primary-neon cursor-pointer"
                  />
                  <span className="text-xs text-muted-neon group-hover:text-white transition-colors">Recordar sesión</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-primary-neon hover:bg-primary-neon/90 text-black hover:scale-[1.01] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-primary-neon/20 hover:shadow-primary-neon/30 active:scale-[0.99] cursor-pointer"
              >
                Acceder al Panel
              </button>
            </form>

            {/* Helper Hints */}
            <div className="pt-4 border-t border-white/5 text-center">
              <span className="text-[10px] text-muted-neon font-medium">
                Pista para testing: La clave es <code className="bg-white/5 px-1 py-0.5 rounded text-white font-mono">admin</code> o <code className="bg-white/5 px-1 py-0.5 rounded text-white font-mono">modkey2026</code>
              </span>
            </div>
          </motion.div>

          {/* Back Link */}
          <div className="text-center mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs text-muted-neon hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a la Tienda
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090d] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-[#0b0c10] flex flex-col justify-between hidden md:flex">
        <div className="p-6 space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg group">
            <Keyboard className="h-5 w-5 text-primary-neon group-hover:rotate-6 transition-transform" />
            <span>Mod<span className="text-primary-neon">Key</span> <span className="text-[10px] text-muted-neon uppercase font-bold tracking-wider">Admin</span></span>
          </Link>

          {/* Nav menu */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold border transition-all ${
                    isActive
                      ? 'bg-primary-neon/15 border-primary-neon/30 text-white'
                      : 'bg-transparent border-transparent text-muted-neon hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Back Link & Logout at bottom */}
        <div className="p-6 border-t border-white/5 space-y-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-xs text-muted-neon hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a la Tienda
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 text-xs text-red-400/80 hover:text-red-400 transition-colors pt-2 border-t border-white/5 cursor-pointer text-left border-transparent"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Admin Content Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Mobile Header */}
        <header className="md:hidden h-16 border-b border-white/5 bg-[#0b0c10] px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-sm">
            <Keyboard className="h-4 w-4 text-primary-neon" />
            <span>ModKey <span className="text-[9px] text-primary-neon">Admin</span></span>
          </Link>
          <div className="flex gap-2 sm:gap-4 items-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  className={`p-2 rounded-lg text-xs ${isActive ? 'text-primary-neon bg-primary-neon/10' : 'text-muted-neon'}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </Link>
              );
            })}
            <button 
              onClick={handleLogout} 
              className="p-2 rounded-lg text-red-400/80 hover:text-red-400"
              title="Cerrar Sesión"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
            <Link href="/" className="p-2 rounded-lg text-muted-neon">
              <ArrowLeft className="h-4.5 w-4.5" />
            </Link>
          </div>
        </header>
        
        {/* Children Render */}
        <main className="p-4 sm:p-8 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
