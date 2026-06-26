'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { db } from '@/services/db';
import { Product } from '@/types';

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form fields
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formFields, setFormFields] = useState({
    name: '',
    slug: '',
    category: 'keyboards' as Product['category'],
    price: '',
    stock: '',
    image_url: '',
    description: '',
    layout: '',
    switches: '',
    connection: '',
    hotswap: true,
    material: '',
  });

  // Load products
  const fetchProducts = async () => {
    try {
      const data = await db.getProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching inventory products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open modal for new product
  const handleNewProduct = () => {
    setEditingProduct(null);
    setFormFields({
      name: '',
      slug: '',
      category: 'keyboards',
      price: '',
      stock: '',
      image_url: '',
      description: '',
      layout: 'ANSI, ISO',
      switches: '',
      connection: '',
      hotswap: true,
      material: '',
    });
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormFields({
      name: prod.name,
      slug: prod.slug,
      category: prod.category,
      price: String(prod.price),
      stock: String(prod.stock),
      image_url: prod.image_url,
      description: prod.description,
      layout: prod.specs?.layout ? prod.specs.layout.join(', ') : '',
      switches: prod.specs?.switches ? prod.specs.switches.join(', ') : '',
      connection: prod.specs?.connection || '',
      hotswap: prod.specs?.hotswap ?? true,
      material: prod.specs?.material || '',
    });
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDeleteProduct = async (id: string) => {
    if (confirm('¿Estás seguro de que querés eliminar este producto de la tienda?')) {
      await db.deleteProduct(id);
      fetchProducts();
    }
  };

  // Form submit handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Auto-generate slug if empty
    const slugVal = formFields.slug.trim() || 
                    formFields.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Structure specs JSON
    const layoutArr = formFields.layout ? formFields.layout.split(',').map(s => s.trim()).filter(Boolean) : undefined;
    const switchesArr = formFields.switches ? formFields.switches.split(',').map(s => s.trim()).filter(Boolean) : undefined;

    const specs: any = {
      hotswap: formFields.hotswap
    };
    if (layoutArr) specs.layout = layoutArr;
    if (switchesArr) specs.switches = switchesArr;
    if (formFields.connection) specs.connection = formFields.connection;
    if (formFields.material) specs.material = formFields.material;

    const productData = {
      id: editingProduct?.id || undefined,
      name: formFields.name,
      slug: slugVal,
      category: formFields.category,
      price: Number(formFields.price),
      stock: Number(formFields.stock),
      image_url: formFields.image_url || 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop',
      description: formFields.description,
      specs
    };

    await db.saveProduct(productData);
    setIsModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="space-y-8">
      {/* Title & Trigger */}
      <div className="flex justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventario de Productos</h1>
          <p className="text-xs text-muted-neon mt-1">Cargar, editar y dar de baja teclados y accesorios de la tienda.</p>
        </div>
        <button
          onClick={handleNewProduct}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary-neon to-secondary-neon text-white font-semibold rounded-xl text-xs hover:opacity-95 shadow-lg shadow-primary-neon/10 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Nuevo Producto
        </button>
      </div>

      {/* Table grid layout */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-12 bg-white/5 rounded-xl" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-white/5 rounded-xl" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center glass-card border border-white/5 rounded-2xl space-y-4">
          <AlertTriangle className="h-10 w-10 text-muted-neon mx-auto" />
          <div>
            <h3 className="font-semibold text-white">Inventario Vacío</h3>
            <p className="text-xs text-muted-neon mt-1">Crea tu primer producto haciendo clic en el botón superior.</p>
          </div>
        </div>
      ) : (
        <div className="glass-card border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#12141a]/60 text-muted-neon uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Producto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-white/[0.01] transition-colors">
                    {/* Img + Name */}
                    <td className="p-4 flex items-center gap-3 min-w-[200px]">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[#161922] border border-white/5">
                        <Image 
                          src={prod.image_url} 
                          alt={prod.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-white">{prod.name}</span>
                    </td>
                    
                    {/* Category */}
                    <td className="p-4 capitalize text-muted-neon">
                      {prod.category === 'keyboards' ? 'Teclado' :
                       prod.category === 'switches' ? 'Switches' :
                       prod.category === 'keycaps' ? 'Keycaps' : 'Accesorios'}
                    </td>
                    
                    {/* Price */}
                    <td className="p-4 font-semibold text-white">${prod.price}</td>
                    
                    {/* Stock Status Badge */}
                    <td className="p-4">
                      {prod.stock === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                          Sin Stock
                        </span>
                      ) : prod.stock <= 5 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          Bajo: {prod.stock}u
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                          Disponible: {prod.stock}u
                        </span>
                      )}
                    </td>

                    {/* Action buttons */}
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEditProduct(prod)}
                          className="p-2 text-muted-neon hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="p-2 text-muted-neon hover:text-red-400 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Modal dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            onClick={() => setIsModalOpen(false)}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal Card content */}
          <div className="relative glass-card border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-white/5 flex justify-between items-center bg-[#0d0f14]">
              <h2 className="text-sm font-bold text-white">
                {editingProduct ? `Editar: ${editingProduct.name}` : 'Crear Nuevo Producto'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-muted-neon hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scrollable Form */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-muted-neon">Nombre del Producto</label>
                  <input 
                    type="text" 
                    required
                    value={formFields.name}
                    onChange={(e) => setFormFields(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: ModKey Carbon-X"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                  />
                </div>

                {/* Category select */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-neon">Categoría</label>
                  <select
                    value={formFields.category}
                    onChange={(e) => setFormFields(prev => ({ ...prev, category: e.target.value as Product['category'] }))}
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                  >
                    <option value="keyboards">Teclado</option>
                    <option value="switches">Switches</option>
                    <option value="keycaps">Keycaps</option>
                    <option value="accessories">Accesorios</option>
                  </select>
                </div>

                {/* Slug optional */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-neon">Slug URL (Opcional)</label>
                  <input 
                    type="text" 
                    value={formFields.slug}
                    onChange={(e) => setFormFields(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="ej: carbon-x"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                  />
                </div>

                {/* Price numeric */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-neon">Precio ($ USD)</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={formFields.price}
                    onChange={(e) => setFormFields(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="Ej: 189"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                  />
                </div>

                {/* Stock count */}
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-muted-neon">Cantidad en Stock</label>
                  <input 
                    type="number" 
                    required
                    min={0}
                    value={formFields.stock}
                    onChange={(e) => setFormFields(prev => ({ ...prev, stock: e.target.value }))}
                    placeholder="Ej: 12"
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-muted-neon">URL de Imagen</label>
                  <input 
                    type="text" 
                    value={formFields.image_url}
                    onChange={(e) => setFormFields(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-[10px] uppercase font-bold text-muted-neon">Descripción Detallada</label>
                  <textarea 
                    value={formFields.description}
                    onChange={(e) => setFormFields(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Escribe los detalles y beneficios de este producto..."
                    rows={3}
                    className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                  />
                </div>

                {/* Tech specifications subsection */}
                <div className="sm:col-span-2 border-t border-white/5 pt-3">
                  <span className="text-[10px] uppercase font-black text-white tracking-wider block mb-3">Especificaciones Técnicas</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Switches values */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-muted-neon">Switches (Separados por coma)</label>
                      <input 
                        type="text" 
                        value={formFields.switches}
                        onChange={(e) => setFormFields(prev => ({ ...prev, switches: e.target.value }))}
                        placeholder="Ej: Linear Yellow, Tactile Brown"
                        className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                      />
                    </div>

                    {/* Layout values */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-muted-neon">Layouts (Separados por coma)</label>
                      <input 
                        type="text" 
                        value={formFields.layout}
                        onChange={(e) => setFormFields(prev => ({ ...prev, layout: e.target.value }))}
                        placeholder="Ej: ANSI, ISO"
                        className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                      />
                    </div>

                    {/* Material */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-muted-neon">Material del Chasis</label>
                      <input 
                        type="text" 
                        value={formFields.material}
                        onChange={(e) => setFormFields(prev => ({ ...prev, material: e.target.value }))}
                        placeholder="Ej: Aluminio CNC / Madera"
                        className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                      />
                    </div>

                    {/* Connection */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-muted-neon">Conexión</label>
                      <input 
                        type="text" 
                        value={formFields.connection}
                        onChange={(e) => setFormFields(prev => ({ ...prev, connection: e.target.value }))}
                        placeholder="Ej: USB-C Cable / Wireless"
                        className="w-full bg-[#161922]/50 border border-white/5 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary-neon"
                      />
                    </div>

                    {/* Hotswap */}
                    <div className="flex items-center gap-2 pt-2 sm:col-span-2">
                      <input 
                        type="checkbox"
                        id="hotswap"
                        checked={formFields.hotswap}
                        onChange={(e) => setFormFields(prev => ({ ...prev, hotswap: e.target.checked }))}
                        className="h-4 w-4 rounded border-white/5 bg-[#161922]/50 accent-primary-neon text-white"
                      />
                      <label htmlFor="hotswap" className="text-xs text-white select-none font-semibold">Es Hot-Swappable (Switches extraíbles sin soldar)</label>
                    </div>

                  </div>
                </div>

              </div>

              {/* Submit footer actions */}
              <div className="pt-4 border-t border-white/5 flex justify-end gap-2 bg-[#0d0f14]/40">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleSave()}
                  className="px-5 py-2 bg-gradient-to-r from-primary-neon to-secondary-neon text-white font-semibold rounded-xl text-xs hover:opacity-95 shadow-lg shadow-primary-neon/10 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
