import { createClient } from '@supabase/supabase-js';
import { Product, Order, OrderStatus, DashboardMetrics } from '../types';

// Detect Supabase config
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Default Seed Products
const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-carbon-x',
    name: 'ModKey Carbon-X',
    slug: 'modkey-carbon-x',
    description: 'Teclado mecánico premium de formato 75%. Chasis de fibra de carbono pulido, montaje Gasket Mount para una acústica profunda y placa de bronce. Completamente hot-swappable con soporte de 5 pines y retroiluminación RGB direccionable por tecla.',
    price: 245000,
    image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop',
    category: 'keyboards',
    stock: 12,
    specs: {
      layout: ['ANSI', 'ISO'],
      switches: ['ModKey Linear Yellow (Lubed)', 'Gateron Brown Tactile', 'Cherry MX Blue Clicky'],
      connection: 'USB-C Cable / Inalámbrico 2.4Ghz / Bluetooth 5.1',
      hotswap: true,
      material: 'Fibra de Carbono y Aluminio CNC'
    }
  },
  {
    id: 'prod-vaporwave-80',
    name: 'VaporWave Retro 80',
    slug: 'vaporwave-retro-80',
    description: 'Estética retro-futurista de los 80 en formato TKL (80%). Chasis acrílico traslúcido esmerilado que difumina los colores de los LEDs inferiores. Keycaps PBT perfil Cherry con leyendas clásicas de vaporwave.',
    price: 210000,
    image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop',
    category: 'keyboards',
    stock: 8,
    specs: {
      layout: ['ANSI'],
      switches: ['Gateron Yellow Linear', 'Kailh Box Brown Tactile'],
      connection: 'USB-C extraíble',
      hotswap: true,
      material: 'Acrílico Esmerilado'
    }
  },
  {
    id: 'prod-artisan-60',
    name: 'KeebForge Artisan-60',
    slug: 'keebforge-artisan-60',
    description: 'Teclado compacto de formato 60% montado sobre un bloque sólido de madera de nogal americano tallada a mano y tratada con aceites naturales. Placa interna de latón para un peso contundente y un tono acústico cálido.',
    price: 280000,
    image_url: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=600&auto=format&fit=crop',
    category: 'keyboards',
    stock: 5,
    specs: {
      layout: ['ANSI', 'ISO'],
      switches: ['Alpaca Linear (Lubed)', 'NovelKeys Cream Linear', 'Cherry MX Brown'],
      connection: 'USB-C chapado en oro',
      hotswap: true,
      material: 'Nogal Americano Macizo y Latón'
    }
  },
  {
    id: 'prod-stealth-96',
    name: 'ModKey Stealth-96',
    slug: 'modkey-stealth-96',
    description: 'La máxima productividad sin comprometer espacio. Formato 96% compacto con chasis metálico anodizado negro mate, absorbedor de sonido interno de silicona de alta densidad y keycaps oscuras minimalistas.',
    price: 320000,
    image_url: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600&auto=format&fit=crop',
    category: 'keyboards',
    stock: 4,
    specs: {
      layout: ['ANSI', 'ISO'],
      switches: ['ModKey Silent Black', 'Cherry MX Silent Red'],
      connection: 'Cable USB-C de Kevlar',
      hotswap: true,
      material: 'Aluminio CNC Anodizado'
    }
  },
  {
    id: 'prod-cyberpunk-87',
    name: 'ModKey Cyberpunk 87',
    slug: 'modkey-cyberpunk-87',
    description: 'Teclado mecánico TKL (87 teclas) de edición limitada cyberpunk, con chasis de acrílico grabado láser y switches táctiles lubricados con una iluminación neón deslumbrante.',
    price: 230000,
    image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop',
    category: 'keyboards',
    stock: 6,
    specs: {
      layout: ['ANSI'],
      switches: ['Kailh Box Jade Clicky', 'Gateron Yellow Linear'],
      connection: 'USB-C / Bluetooth',
      hotswap: true,
      material: 'Acrílico y Aluminio'
    }
  },
  {
    id: 'prod-chromakey-set',
    name: 'ChromaKey PBT Keycaps Set',
    slug: 'chromakey-pbt-set',
    description: 'Set completo de 124 keycaps PBT de doble inyección (Double-shot) con perfil OEM. Diseñadas para resistir el brillo y el desgaste a largo plazo, con leyendas translúcidas para RGB.',
    price: 65000,
    image_url: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600&auto=format&fit=crop',
    category: 'keycaps',
    stock: 25,
    specs: {
      material: 'Double-shot PBT',
      profile: 'Perfil OEM',
      compatibility: 'Compatible con layouts Cherry MX de 60%, 65%, 75%, TKL y Full-Size'
    }
  },
  {
    id: 'prod-aero-switches',
    name: 'AeroLinear Switches (90pcs)',
    slug: 'aerolinear-switches-90',
    description: 'Pack de 90 interruptores de tipo lineal suave de 5 pines. Pre-lubricados de fábrica con Krytox 205g0. Cuentan con un vástago de POM ultra-deslizante y un retorno ultra suave.',
    price: 45000,
    image_url: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=600&auto=format&fit=crop',
    category: 'switches',
    stock: 30,
    specs: {
      type: 'Linear',
      actuation: '45g',
      bottom_out: '62g',
      pre_lubed: true,
      pins: 5
    }
  },
  {
    id: 'prod-helix-cable',
    name: 'Helix Coiled Aviator Cable',
    slug: 'helix-coiled-cable',
    description: 'Cable USB-C premium con bobina (coiled) reforzada con doble funda de malla Techflex y Paracord. Equipado con un conector aviador GX16 metálico de desconexión rápida.',
    price: 38000,
    image_url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?q=80&w=600&auto=format&fit=crop',
    category: 'accessories',
    stock: 40,
    specs: {
      length: '1.8 metros total',
      connector: 'GX16 Aviator & USB-C a USB-A',
      shielding: 'Doble blindaje'
    }
  },
  {
    id: 'prod-retrowave-mat',
    name: 'Retrowave Sun Deskmat',
    slug: 'retrowave-sun-deskmat',
    description: 'Pad de escritorio extra grande (900x400x4mm) con superficie de tela microtejida optimizada para sensores ópticos de mouse y base de goma antideslizante. Diseño de atardecer synthwave.',
    price: 25000,
    image_url: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=600&auto=format&fit=crop',
    category: 'accessories',
    stock: 15,
    specs: {
      size: '900x400x4mm',
      material: 'Tela microtejida y goma antideslizante',
      edge: 'Borde cosido de alta densidad'
    }
  },
  {
    id: 'prod-lube-kit',
    name: 'ModKey Switch Lube Kit',
    slug: 'modkey-switch-lube-kit',
    description: 'Kit profesional para el modding y lubricación de tus switches. Incluye abridor de switches metálico CNC (compatible con Cherry y Kailh), pincel, lubricante Krytox 205g0 de 5g y pinza.',
    price: 18500,
    image_url: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=600&auto=format&fit=crop',
    category: 'accessories',
    stock: 20,
    specs: {
      kit_contents: 'CNC Opener, Krytox 205g0, Pincel, Pinzas, Sujeta Vástagos',
      compatibility: 'Switches Cherry MX / Kailh / Gateron'
    }
  },
  {
    id: 'prod-lavender-switches',
    name: 'Lavender Tactile Switches (90pcs)',
    slug: 'lavender-tactile-switches-90',
    description: 'Switches táctiles premium con una protuberancia (bump) de pulsación súper nítida y redonda. Pre-lubricados a mano con Tribosys 3203. Fuerza de fondo de 62g para un tipeo descansado.',
    price: 48000,
    image_url: 'https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?q=80&w=600&auto=format&fit=crop',
    category: 'switches',
    stock: 18,
    specs: {
      type: 'Táctil',
      actuation: '53g',
      bottom_out: '62g',
      pre_lubed: true,
      pins: 5
    }
  },
  {
    id: 'prod-ink-black-switches',
    name: 'Gateron Ink Black V2 (90pcs)',
    slug: 'gateron-ink-black-v2-90',
    description: 'Los legendarios switches lineales pesados de gama alta. Chasis ahumado traslúcido de material propietario y vástago de POM ultra deslizante para una acústica baja y profunda.',
    price: 62000,
    image_url: 'https://images.unsplash.com/photo-1603481588273-2f908a9a7a1b?q=80&w=600&auto=format&fit=crop',
    category: 'switches',
    stock: 15,
    specs: {
      type: 'Lineal',
      actuation: '60g',
      bottom_out: '70g',
      pre_lubed: false,
      pins: 5
    }
  },
  {
    id: 'prod-retro-wave-keys',
    name: 'Retrowave Cherry Profile Keycaps Set',
    slug: 'retrowave-cherry-keycaps',
    description: 'Set completo de 136 keycaps de perfil Cherry, fabricadas en plástico PBT ultra grueso de 1.5mm mediante sublimación térmica de 5 caras. Diseño retro neón rosa y cian con leyendas japonesas.',
    price: 72000,
    image_url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=600&auto=format&fit=crop',
    category: 'keycaps',
    stock: 12,
    specs: {
      material: 'PBT Dyesub',
      profile: 'Perfil Cherry',
      compatibility: 'Compatible con todos los layouts clásicos y Alice'
    }
  },
  {
    id: 'prod-botanical-keys',
    name: 'Botanical Forest Keycaps Set',
    slug: 'botanical-forest-keycaps',
    description: 'Set de 142 keycaps inspirado en la naturaleza. Fabricado en material PBT de doble inyección con perfil Cherry. Combinación de colores verde bosque, salvia y blanco marfil.',
    price: 68000,
    image_url: 'https://images.unsplash.com/photo-1626908013351-800ddd734b8a?q=80&w=600&auto=format&fit=crop',
    category: 'keycaps',
    stock: 10,
    specs: {
      material: 'Double-shot PBT',
      profile: 'Perfil Cherry',
      compatibility: 'Compatible con layouts del 60% al 100% y layouts customizados ISO'
    }
  }
];

// Helper database functions utilizing LocalStorage fallback
const getLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

const setLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting localStorage key "${key}":`, error);
  }
};

// Seed LocalStorage database on load in client browser
const initializeLocalStorage = () => {
  if (typeof window !== 'undefined') {
    const currentVersion = window.localStorage.getItem('modkey_db_version');
    if (currentVersion !== '4.0') {
      window.localStorage.setItem('modkey_products', JSON.stringify(SEED_PRODUCTS));
      window.localStorage.setItem('modkey_orders', JSON.stringify([]));
      window.localStorage.setItem('modkey_db_version', '4.0');
    }
  }
};
initializeLocalStorage();

export const db = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (!error && data) return data as Product[];
      } catch (err) {
        console.warn("Supabase query failed, falling back to LocalStorage", err);
      }
    }
    return getLocalStorage<Product[]>('modkey_products', SEED_PRODUCTS);
  },

  async getProductBySlug(slug: string): Promise<Product | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();
        if (!error && data) return data as Product;
      } catch (err) {
        console.warn("Supabase query failed, falling back to LocalStorage", err);
      }
    }
    const products = getLocalStorage<Product[]>('modkey_products', SEED_PRODUCTS);
    return products.find(p => p.slug === slug) || null;
  },

  async saveProduct(productData: Omit<Product, 'id'> & { id?: string }): Promise<Product> {
    const id = productData.id || `prod-${Math.random().toString(36).substring(2, 9)}`;
    const newProduct: Product = {
      ...productData,
      id,
      created_at: productData.created_at || new Date().toISOString()
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.from('products').upsert(newProduct).select().single();
        if (!error && data) return data as Product;
      } catch (err) {
        console.warn("Supabase save failed, falling back to LocalStorage", err);
      }
    }

    const products = getLocalStorage<Product[]>('modkey_products', SEED_PRODUCTS);
    const existingIndex = products.findIndex(p => p.id === id);

    if (existingIndex >= 0) {
      products[existingIndex] = newProduct;
    } else {
      products.unshift(newProduct);
    }
    setLocalStorage('modkey_products', products);
    return newProduct;
  },

  async deleteProduct(id: string): Promise<boolean> {
    if (supabase) {
      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (!error) return true;
      } catch (err) {
        console.warn("Supabase delete failed, falling back to LocalStorage", err);
      }
    }

    const products = getLocalStorage<Product[]>('modkey_products', SEED_PRODUCTS);
    const filtered = products.filter(p => p.id !== id);
    setLocalStorage('modkey_products', filtered);
    return true;
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            items:order_items(*)
          `)
          .order('created_at', { ascending: false });
        if (!error && data) return data as Order[];
      } catch (err) {
        console.warn("Supabase query failed, falling back to LocalStorage", err);
      }
    }
    return getLocalStorage<Order[]>('modkey_orders', []);
  },

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'status'>): Promise<Order> {
    const id = `order-${Math.random().toString(36).substring(2, 9)}`;
    const newOrder: Order = {
      ...orderData,
      id,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    // Update product stock and save order
    const products = getLocalStorage<Product[]>('modkey_products', SEED_PRODUCTS);
    newOrder.items.forEach(item => {
      const prod = products.find(p => p.id === item.product_id);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
      }
    });
    setLocalStorage('modkey_products', products);

    if (supabase) {
      try {
        // Insert order details
        const { error: orderErr } = await supabase.from('orders').insert({
          id: newOrder.id,
          customer_name: newOrder.customer_name,
          customer_email: newOrder.customer_email,
          shipping_address: newOrder.shipping_address,
          status: newOrder.status,
          total: newOrder.total
        });

        if (!orderErr) {
          // Insert order items
          const dbItems = newOrder.items.map(item => ({
            order_id: newOrder.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
            product_name: item.product_name,
            product_image: item.product_image,
            selected_switch: item.selected_switch,
            selected_layout: item.selected_layout
          }));
          await supabase.from('order_items').insert(dbItems);

          // Update stock in Supabase
          for (const item of newOrder.items) {
            const prod = products.find(p => p.id === item.product_id);
            if (prod) {
              await supabase.from('products').update({ stock: prod.stock }).eq('id', prod.id);
            }
          }
          return newOrder;
        }
      } catch (err) {
        console.warn("Supabase order creation failed, falling back to LocalStorage", err);
      }
    }

    const orders = getLocalStorage<Order[]>('modkey_orders', []);
    orders.unshift(newOrder);
    setLocalStorage('modkey_orders', orders);
    return newOrder;
  },

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .update({ status })
          .eq('id', id)
          .select()
          .single();
        if (!error && data) {
          // fetch items to return full Order object
          const { data: items } = await supabase.from('order_items').select('*').eq('order_id', id);
          return { ...data, items } as Order;
        }
      } catch (err) {
        console.warn("Supabase update failed, falling back to LocalStorage", err);
      }
    }

    const orders = getLocalStorage<Order[]>('modkey_orders', []);
    const existingIndex = orders.findIndex(o => o.id === id);
    if (existingIndex >= 0) {
      orders[existingIndex].status = status;
      setLocalStorage('modkey_orders', orders);
      return orders[existingIndex];
    }
    return null;
  },

  // ANALYTICS & METRICS
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const orders = getLocalStorage<Order[]>('modkey_orders', []);
    const products = getLocalStorage<Product[]>('modkey_products', SEED_PRODUCTS);

    const totalSales = orders.reduce((sum, o) => sum + Number(o.total), 0);
    const totalOrders = orders.length;
    const lowStockCount = products.filter(p => p.stock <= 5).length;

    // Generate sales history for last 7 days
    const salesMap = new Map<string, number>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      salesMap.set(dateStr, 0);
    }

    orders.forEach(order => {
      const date = new Date(order.created_at);
      const dateStr = date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
      if (salesMap.has(dateStr)) {
        salesMap.set(dateStr, salesMap.get(dateStr)! + Number(order.total));
      }
    });

    const salesHistory = Array.from(salesMap.entries()).map(([date, amount]) => ({
      date,
      amount
    }));

    // Category Sales breakdown
    const categoryMap = new Map<string, number>();
    orders.forEach(order => {
      order.items.forEach(item => {
        // find product to get category
        const prod = products.find(p => p.id === item.product_id);
        const cat = prod ? prod.category : 'Otros';
        categoryMap.set(cat, (categoryMap.get(cat) || 0) + (Number(item.price) * item.quantity));
      });
    });

    // default categories if empty
    const categoriesList = ['keyboards', 'switches', 'keycaps', 'accessories'];
    categoriesList.forEach(c => {
      if (!categoryMap.has(c)) {
        categoryMap.set(c, 0);
      }
    });

    const categorySales = Array.from(categoryMap.entries()).map(([category, value]) => ({
      category: category === 'keyboards' ? 'Teclados' :
                category === 'switches' ? 'Switches' :
                category === 'keycaps' ? 'Keycaps' :
                category === 'accessories' ? 'Accesorios' : category,
      value
    }));

    return {
      totalSales,
      totalOrders,
      lowStockCount,
      salesHistory,
      categorySales
    };
  }
};
