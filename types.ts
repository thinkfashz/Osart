
export type Category = 'Todos' | 'Microcontroladores' | 'Pasivos' | 'Herramientas' | 'Semiconductores' | 'Sensores' | 'Robótica';

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: Category;
  rating: number;
  image: string;
  description: string;
  guide: string;
  proTip: string;
  specs: Record<string, string>;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id?: string;
  name: string;
  email: string;
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

export enum AppView {
  HOME = 'home',
  CATALOG = 'catalog',
  DETAIL = 'detail',
  CART = 'cart',
  CHECKOUT = 'checkout',
  GAME = 'game',
  PROFILE = 'profile',
  SUCCESS = 'success'
}
