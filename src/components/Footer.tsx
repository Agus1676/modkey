'use client';

import React from 'react';
import Link from 'next/link';
import { Keyboard, Heart, Globe, Share2, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 bg-[#0b0c10] text-muted-neon py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group text-white font-bold text-lg">
              <Keyboard className="h-5 w-5 text-primary-neon group-hover:rotate-6 transition-transform" />
              <span>Mod<span className="text-primary-neon">Key</span></span>
            </Link>
            <p className="text-xs leading-relaxed">
              La boutique definitiva para entusiastas del hardware y teclados mecánicos personalizados. Diseñado para ofrecer la máxima calidad y acústica de tecleo.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="hover:text-white transition-colors"><Globe className="h-4 w-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><Share2 className="h-4 w-4" /></a>
              <a href="#" className="hover:text-white transition-colors"><MessageSquare className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Catalog categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Productos</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/?cat=keyboards#catalog" className="hover:text-white transition-colors">Teclados Custom</Link></li>
              <li><Link href="/?cat=switches#catalog" className="hover:text-white transition-colors">Switches Lubricados</Link></li>
              <li><Link href="/?cat=keycaps#catalog" className="hover:text-white transition-colors">Keycaps Sets</Link></li>
              <li><Link href="/?cat=accessories#catalog" className="hover:text-white transition-colors">Cables & Accesorios</Link></li>
            </ul>
          </div>

          {/* Support / Info */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Ayuda & Info</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">Envíos y Entregas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Garantía de Satisfacción</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto de Soporte</a></li>
            </ul>
          </div>

          {/* Newsletter / Mock */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm">Suscribite al Newsletter</h4>
            <p className="text-xs leading-relaxed">
              Enterate antes que nadie de lanzamientos de keycaps artesanales de edición limitada.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input 
                type="email" 
                placeholder="Tu email..."
                required
                className="w-full bg-[#161922] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon transition-colors"
              />
              <button 
                type="submit"
                className="bg-primary-neon hover:bg-primary-neon/90 text-white font-semibold text-xs px-4 py-2 rounded-lg transition-colors"
              >
                Unirme
              </button>
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} ModKey. Todos los derechos reservados. <span className="block sm:inline mt-1 sm:mt-0 text-muted-neon">Sitio web desarrollado por <span className="font-semibold text-white hover:text-primary-neon border-b border-white/10 hover:border-primary-neon/40 pb-0.5 ml-1 transition-all duration-300">Agustin Pollan</span></span></p>
          <p className="flex items-center gap-1.5">
            Hecho con <Heart className="h-3.5 w-3.5 text-secondary-neon fill-secondary-neon" /> para desarrolladores.
          </p>
        </div>
      </div>
    </footer>
  );
};
