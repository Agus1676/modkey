'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, ArrowDown, ChevronRight, Star, Cpu, Volume2, Truck, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/services/db';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

const INSPIRATIONS = [
  {
    id: 1,
    title: 'Vaporwave Retro Space',
    style: 'Estilo Retro / Vaporwave',
    keyboardName: 'VaporWave Retro 80',
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=800&auto=format&fit=crop',
    category: 'keyboards',
    slug: 'vaporwave-retro-80'
  },
  {
    id: 2,
    title: 'Stealth Minimalist Workspace',
    style: 'Estilo Minimalista / Stealth',
    keyboardName: 'ModKey Stealth-96',
    image: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=800&auto=format&fit=crop',
    category: 'keyboards',
    slug: 'modkey-stealth-96'
  },
  {
    id: 3,
    title: 'Cozy American Walnut Setup',
    style: 'Estilo Rústico / Artesanal',
    keyboardName: 'KeebForge Artisan-60',
    image: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=800&auto=format&fit=crop',
    category: 'keyboards',
    slug: 'keebforge-artisan-60'
  },
  {
    id: 4,
    title: 'High-Performance Carbon Setup',
    style: 'Estilo Carbono / Cyberpunk',
    keyboardName: 'ModKey Carbon-X',
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=800&auto=format&fit=crop',
    category: 'keyboards',
    slug: 'modkey-carbon-x'
  }
];


function HomeContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [isInspirationsOpen, setIsInspirationsOpen] = useState(false);
  
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // Load products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await db.getProducts();
        setProducts(data);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    // Check if category parameter exists in URL
    const catParam = searchParams.get('cat');
    if (catParam) {
      setSelectedCategory(catParam);
    }
    
    fetchProducts();
  }, [searchParams]);

  // Filter and Sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'stock') return b.stock - a.stock;
    return 0; // 'featured' (default order)
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-36 border-b border-white/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-neon/10 via-background to-background">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-neon/10 text-primary-neon border border-primary-neon/20 animate-pulse">
              <Star className="h-3 w-3 fill-primary-neon" /> ModKey Custom Keyboards
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
              El Tipeo Perfecto <br />
              <span className="bg-gradient-to-r from-primary-neon via-secondary-neon to-accent-neon bg-clip-text text-transparent">
                Comienza Aquí
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-neon max-w-2xl mx-auto">
              Diseñá tu escritorio con teclados mecánicos premium, chasis de fibra de carbono y madera CNC, keycaps de diseño y switches lubricados a mano para una acústica inigualable.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link 
                href="#catalog"
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary-neon to-secondary-neon text-white font-semibold rounded-xl hover:opacity-95 shadow-lg shadow-primary-neon/15 hover:shadow-primary-neon/25 transition-all text-sm flex items-center justify-center gap-2"
              >
                Explorar Catálogo
                <ChevronRight className="h-4 w-4" />
              </Link>
              <button 
                onClick={() => setIsInspirationsOpen(true)}
                className="w-full sm:w-auto px-8 py-3.5 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                Ver Inspiraciones
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features highlight */}
      <section className="py-12 bg-[#0b0c10]/40 border-b border-white/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex gap-4 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#161922] border border-white/5 text-primary-neon">
                <Cpu className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Gasket Mounted</h3>
                <p className="text-xs text-muted-neon mt-0.5">Sensación de tipeo flexible y acústica amortiguada.</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#161922] border border-white/5 text-secondary-neon">
                <Volume2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Switches Lubricados</h3>
                <p className="text-xs text-muted-neon mt-0.5">Pre-lubricados a mano con Krytox 205g0.</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#161922] border border-white/5 text-accent-neon">
                <SlidersHorizontal className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Hot-Swappable</h3>
                <p className="text-xs text-muted-neon mt-0.5">Cambia tus switches en segundos sin soldar.</p>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#161922] border border-white/5 text-[#22c55e]">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Envíos Rápidos</h3>
                <p className="text-xs text-muted-neon mt-0.5">Envío bonificado en todo el país desde $25.000.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog & Filter Section */}
      <section id="catalog" className="py-16 scroll-mt-10 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Nuestra Colección</h2>
              <p className="text-sm text-muted-neon mt-1">Explora componentes individuales o teclados completos listos para usar.</p>
            </div>
            
            {/* Search & Sort controls */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 sm:w-64">
                <input 
                  type="text" 
                  placeholder="Buscar teclado, switches..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#161922] border border-white/5 rounded-xl px-4 py-2.5 pl-10 text-sm text-white focus:outline-none focus:border-primary-neon focus:ring-1 focus:ring-primary-neon/20 transition-all placeholder:text-muted-neon"
                />
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-neon" />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-[#161922] border border-white/5 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary-neon transition-colors"
              >
                <option value="featured">Destacados</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="stock">Disponibilidad</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-white/5 pb-5">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === 'all' 
                  ? 'bg-primary-neon/15 border-primary-neon text-white glow-primary/10' 
                  : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white hover:bg-white/5'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedCategory('keyboards')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === 'keyboards' 
                  ? 'bg-primary-neon/15 border-primary-neon text-white glow-primary/10' 
                  : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white hover:bg-white/5'
              }`}
            >
              Teclados Custom
            </button>
            <button
              onClick={() => setSelectedCategory('switches')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === 'switches' 
                  ? 'bg-primary-neon/15 border-primary-neon text-white glow-primary/10' 
                  : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white hover:bg-white/5'
              }`}
            >
              Switches
            </button>
            <button
              onClick={() => setSelectedCategory('keycaps')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === 'keycaps' 
                  ? 'bg-primary-neon/15 border-primary-neon text-white glow-primary/10' 
                  : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white hover:bg-white/5'
              }`}
            >
              Keycaps
            </button>
            <button
              onClick={() => setSelectedCategory('accessories')}
              className={`px-5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                selectedCategory === 'accessories' 
                  ? 'bg-primary-neon/15 border-primary-neon text-white glow-primary/10' 
                  : 'bg-[#161922]/40 border-white/5 text-muted-neon hover:text-white hover:bg-white/5'
              }`}
            >
              Cables y Accesorios
            </button>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card rounded-2xl h-[380px] animate-pulse p-4 space-y-4">
                  <div className="w-full h-48 bg-white/5 rounded-xl" />
                  <div className="h-4 bg-white/10 w-2/3 rounded" />
                  <div className="h-4 bg-white/5 w-1/3 rounded" />
                  <div className="h-8 bg-white/5 w-full rounded-lg pt-4" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="py-24 text-center space-y-3">
              <SlidersHorizontal className="h-10 w-10 text-muted-neon mx-auto" />
              <h3 className="font-semibold text-lg">No encontramos productos</h3>
              <p className="text-sm text-muted-neon max-w-xs mx-auto">Probá cambiando los términos de búsqueda o filtrando otra categoría.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <div 
                  key={product.id}
                  className="glass-card glass-card-hover rounded-2xl overflow-hidden flex flex-col group h-full"
                >
                  {/* Product Image */}
                  <Link 
                    href={`/products/${product.slug}`} 
                    className="relative w-full h-48 bg-[#11131a] overflow-hidden block"
                  >
                    <Image 
                      src={product.image_url} 
                      alt={product.name}
                      fill
                      sizes="(max-w-768px) 100vw, 300px"
                      priority={false}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.stock <= 5 && (
                      <span className="absolute top-3 left-3 bg-red-500/90 text-white font-semibold text-[10px] px-2 py-0.5 rounded-full shadow-lg">
                        {product.stock === 0 ? 'Sin Stock' : `¡Solo ${product.stock} restan!`}
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white/80 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border border-white/10">
                      {product.category === 'keyboards' ? 'Teclado' :
                       product.category === 'switches' ? 'Switch' :
                       product.category === 'keycaps' ? 'Keycaps' : 'Accesorios'}
                    </span>
                  </Link>

                  {/* Product Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-white text-base group-hover:text-primary-neon transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-muted-neon mt-2 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-muted-neon uppercase font-medium">Precio</span>
                        <span className="text-lg font-black text-white">${product.price.toLocaleString('es-AR')}</span>
                      </div>
                      
                      <Link 
                        href={`/products/${product.slug}`}
                        className="px-4 py-2 bg-white/5 border border-white/10 hover:border-primary-neon/40 hover:bg-primary-neon/10 text-white hover:text-white rounded-lg text-xs font-semibold transition-all"
                      >
                        Ver Detalle
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Inspirations Modal */}
          <AnimatePresence>
            {isInspirationsOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="glass-card bg-[#0b0c10]/95 border border-white/10 rounded-3xl p-6 sm:p-8 max-w-4xl w-full relative shadow-2xl overflow-y-auto max-h-[90vh] z-50"
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setIsInspirationsOpen(false)}
                    className="absolute top-4 right-4 p-1.5 rounded-xl border border-white/5 bg-white/5 text-muted-neon hover:text-white hover:bg-white/10 transition-all cursor-pointer z-20"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>

                  {/* Title Header */}
                  <div className="text-center md:text-left mb-6 space-y-1 pr-8">
                    <h3 className="text-xl font-black text-white flex items-center justify-center md:justify-start gap-2">
                      <Sparkles className="h-5 w-5 text-primary-neon animate-pulse" />
                      Galería de Inspiraciones ModKey
                    </h3>
                    <p className="text-xs text-muted-neon">
                      Espacios de trabajo únicos para el máximo rendimiento y confort acústico. Hacé clic en cualquier setup para ver su teclado custom.
                    </p>
                  </div>

                  {/* Grid of Inspirations */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {INSPIRATIONS.map((insp) => (
                      <div 
                        key={insp.id}
                        onClick={() => {
                          setIsInspirationsOpen(false);
                          setSelectedCategory(insp.category);
                          
                          // Smooth scroll to catalog
                          const catalogSection = document.getElementById('catalog');
                          if (catalogSection) {
                            catalogSection.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className="relative rounded-2xl overflow-hidden border border-white/5 bg-black/30 group aspect-video cursor-pointer"
                      >
                        {/* Setup Image */}
                        <Image
                          src={insp.image}
                          alt={insp.title}
                          fill
                          sizes="(max-w-768px) 100vw, 400px"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                        />

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                        {/* Content overlays */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-end space-y-3 z-10">
                          <div>
                            <span className="text-[9px] font-extrabold uppercase tracking-widest text-primary-neon block mb-0.5">
                              {insp.style}
                            </span>
                            <h4 className="text-sm font-bold text-white leading-tight">
                              {insp.title}
                            </h4>
                            <p className="text-[10px] text-muted-neon mt-1">
                              Teclado: <strong className="text-white font-medium">{insp.keyboardName}</strong>
                            </p>
                          </div>

                          <div className="py-2 px-4 bg-primary-neon group-hover:bg-primary-neon/90 text-black font-bold text-[10px] uppercase tracking-wider rounded-lg transition-all text-center self-start flex items-center gap-1 shadow-md shadow-primary-neon/10">
                            Ver Teclado
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom notes */}
                  <div className="mt-6 pt-4 border-t border-white/5 text-center">
                    <span className="text-[10px] text-muted-neon">
                      💡 ¿Querés una cotización a medida para tu setup? Escribinos haciendo clic en el botón flotante de WhatsApp.
                    </span>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-muted-neon text-xs">
        Cargando catálogo de teclados...
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
