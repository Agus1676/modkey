export interface ProductSpecs {
  layout?: string[];
  switches?: string[];
  connection?: string;
  hotswap?: boolean;
  material?: string;
  [key: string]: any;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  category: 'keyboards' | 'switches' | 'keycaps' | 'accessories';
  stock: number;
  specs: ProductSpecs;
  created_at?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSwitch?: string;
  selectedLayout?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name: string;
  product_image: string;
  selected_switch?: string;
  selected_layout?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  shipping_address: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
  created_at: string;
}

export interface DashboardMetrics {
  totalSales: number;
  totalOrders: number;
  lowStockCount: number;
  salesHistory: { date: string; amount: number }[];
  categorySales: { category: string; value: number }[];
}
