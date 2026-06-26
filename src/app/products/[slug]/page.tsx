'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingCart, Shield, RefreshCcw, Award, Check } from 'lucide-react';
import { db } from '@/services/db';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSwitch, setSelectedSwitch] = useState<string>('');
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const prod = await db.getProductBySlug(slug);
        if (prod) {
          setProduct(prod);
          // Set defaults
          if (prod.specs?.switches && prod.specs.switches.length > 0) {
            setSelectedSwitch(prod.specs.switches[0]);
          }
          if (prod.specs?.layout && prod.specs.layout.length > 0) {
            setSelectedLayout(prod.specs.layout[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product detail:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity, selectedSwitch || undefined, selectedLayout || undefined);
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 animate-pulse">
        <div className="h-6 w-24 bg-white/5 rounded mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="h-96 bg-white/5 rounded-2xl" />
          <div className="space-y-6">
            <div className="h-8 bg-white/10 w-2/3 rounded" />
            <div className="h-4 bg-white/5 w-1/3 rounded" />
            <div className="h-32 bg-white/5 w-full rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-32 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Producto No Encontrado</h2>
        <p className="text-sm text-muted-neon max-w-md mx-auto">Lo sentimos, el teclado o accesorio que buscás no existe o ha sido retirado de nuestra base de datos.</p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary-neon text-white rounded-lg hover:bg-primary-neon/90 font-medium transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Volver a la Tienda
        </Link>
      </div>
    );
  }

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

        {/* Product Page Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: Product Image */}
          <div className="relative w-full aspect-video sm:aspect-square bg-[#11131a] rounded-3xl overflow-hidden border border-white/5 group shadow-2xl">
            <Image 
              src={product.image_url} 
              alt={product.name}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Right: Product Info & Config */}
          <div className="space-y-8">
            <div className="space-y-3">
              <span className="text-xs px-2.5 py-1 rounded bg-primary-neon/10 text-primary-neon border border-primary-neon/15 font-semibold uppercase tracking-wider">
                {product.category === 'keyboards' ? 'Teclado Mecánico Custom' :
                 product.category === 'switches' ? 'Switch Pack' :
                 product.category === 'keycaps' ? 'Set de Keycaps' : 'Accesorio Premium'}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">{product.name}</h1>
              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-3xl font-black text-primary-neon">${product.price.toLocaleString('es-AR')}</span>
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="text-xs text-red-400 font-semibold animate-pulse">
                    ¡Apurate, solo quedan {product.stock} unidades en stock!
                  </span>
                )}
                {product.stock === 0 && (
                  <span className="text-xs text-red-500 font-bold">
                    Temporalmente sin stock
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-base text-muted-neon leading-relaxed">
              {product.description}
            </p>

            {/* Selectors / Configurator */}
            {product.stock > 0 && (
              <div className="space-y-6 pt-4 border-t border-white/5">
                {/* Switch Selector */}
                {product.specs?.switches && product.specs.switches.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-white uppercase tracking-wider block">
                      Seleccionar Switch
                    </label>
                    <div className="flex flex-col gap-2">
                      {product.specs.switches.map((sw) => (
                        <button
                          key={sw}
                          onClick={() => setSelectedSwitch(sw)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-xs text-left transition-all ${
                            selectedSwitch === sw
                              ? 'bg-primary-neon/10 border-primary-neon text-white font-medium'
                              : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white hover:bg-white/5'
                          }`}
                        >
                          <span>{sw}</span>
                          {selectedSwitch === sw && <Check className="h-4 w-4 text-primary-neon" />}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Layout Selector */}
                {product.specs?.layout && product.specs.layout.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-white uppercase tracking-wider block">
                      Distribución de Teclado (Layout)
                    </label>
                    <div className="flex gap-2">
                      {product.specs.layout.map((lay) => (
                        <button
                          key={lay}
                          onClick={() => setSelectedLayout(lay)}
                          className={`px-5 py-2.5 rounded-xl border text-xs font-medium transition-all ${
                            selectedLayout === lay
                              ? 'bg-primary-neon/10 border-primary-neon text-white'
                              : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white'
                          }`}
                        >
                          {lay}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity & Add to Cart button */}
                <div className="flex gap-4 items-end pt-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white uppercase tracking-wider block">
                      Cantidad
                    </label>
                    <select
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="bg-[#161922] border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
                    >
                      {[...Array(Math.min(10, product.stock))].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-primary-neon to-secondary-neon text-white font-bold rounded-xl hover:opacity-95 shadow-lg shadow-primary-neon/10 hover:shadow-primary-neon/20 transition-all text-sm group"
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 animate-bounce" />
                        ¡Agregado al Carrito!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 group-hover:-translate-y-0.5 transition-transform" />
                        Añadir al Carrito
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Quality assurances block */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/5 text-xs text-muted-neon">
              <div className="flex items-center gap-2 bg-[#161922]/30 p-3 rounded-xl border border-white/5">
                <Shield className="h-4 w-4 text-primary-neon shrink-0" />
                <span>Garantía de 1 año</span>
              </div>
              <div className="flex items-center gap-2 bg-[#161922]/30 p-3 rounded-xl border border-white/5">
                <RefreshCcw className="h-4 w-4 text-secondary-neon shrink-0" />
                <span>Cambios rápidos</span>
              </div>
              <div className="flex items-center gap-2 bg-[#161922]/30 p-3 rounded-xl border border-white/5">
                <Award className="h-4 w-4 text-accent-neon shrink-0" />
                <span>Materiales de Lujo</span>
              </div>
            </div>

            {/* Tech Specs Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="space-y-4 pt-6">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Especificaciones Técnicas</h3>
                <div className="glass-card rounded-2xl overflow-hidden border border-white/5 text-xs">
                  <div className="divide-y divide-white/5">
                    {Object.entries(product.specs).map(([key, val]) => {
                      if (key === 'switches' || key === 'layout') return null; // already shown in selectors
                      return (
                        <div key={key} className="grid grid-cols-3 p-4">
                          <span className="text-muted-neon capitalize font-medium">{key.replace('_', ' ')}</span>
                          <span className="col-span-2 text-white font-medium">
                            {Array.isArray(val) ? val.join(', ') : typeof val === 'boolean' ? (val ? 'Sí' : 'No') : String(val)}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
