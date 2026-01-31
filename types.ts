
export type Category = 'Todos' | 'Microcontroladores' | 'Pasivos' | 'Herramientas' | 'Semiconductores' | 'Sensores' | 'Robótica' | 'Seguridad';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  lowStockThreshold?: number;
  category: Category;
  rating: number;
  image: string;
  description: string;
  guide: string;
  proTip: string;
  specs: Record<string, string>;
  installments?: number;
  isFull?: boolean;
  deliveryDays?: string;
  discountPercentage?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: string;
  date: string;
  customerEmail: string;
  customerPhone: string;
  items: { name: string; q: number; price: number }[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'paid' | 'shipped' | 'delivered';
}

export interface Expense {
  id: string;
  date: string;
  category: 'Logística' | 'Marketing' | 'Suministros' | 'Servicios' | 'Otros';
  description: string;
  amount: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  event: string;
  status: 'success' | 'warning' | 'error' | 'security';
  latency: number;
  payloadSize: string;
}

export interface SecurityAudit {
  score: number;
  vulnerabilities: string[];
  recommendations: string[];
}

export interface User {
  name: string;
  email: string;
  role?: 'admin' | 'user';
  learningPoints: number;
  orders: any[];
}

export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  zipCode: string;
}

export interface StoreConfig {
  storeName: string;
  primaryColor: 'blue' | 'indigo' | 'slate';
  paymentUrl: string;
  shippingUrl: string;
  contactEmail: string;
}

export enum AppView {
  HOME = 'home',
  CATALOG = 'catalog',
  DETAIL = 'detail',
  CART = 'cart',
  DELIVERY = 'delivery',
  CHECKOUT = 'checkout',
  LOADING = 'loading',
  GAME = 'game',
  PROFILE = 'profile',
  SUCCESS = 'success',
  ADMIN = 'admin'
}
