
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, Product, CartItem, User as UserType, Category, Sale, Expense, StoreConfig } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Catalog from './components/Catalog';
import ProductDetail from './components/ProductDetail';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import ElectroGame from './components/ElectroGame';
import Profile from './components/Profile';
import AuthModal from './components/AuthModal';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import BottomNav from './components/BottomNav';
import MobileMenu from './components/MobileMenu';
import { CheckCircle, Truck, Package, MapPin, ChevronRight, RefreshCw, ShoppingBag, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig>({
    storeName: 'OSART ELITE',
    primaryColor: 'indigo',
    paymentUrl: 'https://api.webpay.cl/simulated',
    shippingUrl: 'https://api.starken.cl/simulated',
    contactEmail: 'contacto@osart.cl'
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [lastOrder, setLastOrder] = useState<Sale | null>(null);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleCheckoutStart = () => {
    setView(AppView.LOADING);
    setTimeout(() => setView(AppView.DELIVERY), 1200);
  };

  const handleOrderComplete = (sale: Sale) => {
    setSales(prev => [sale, ...prev]);
    setLastOrder(sale);
    if (user) {
      setUser(u => u ? { ...u, orders: [sale, ...u.orders] } : null);
    }
    setCart([]);
    setView(AppView.SUCCESS);
  };

  // Simulación de persistencia de XP
  const addXP = (points: number) => {
    setUser(u => u ? { ...u, learningPoints: u.learningPoints + points } : null);
  };

  if (view === AppView.ADMIN) {
    return (
      <AdminDashboard 
        products={products} setProducts={setProducts} 
        sales={sales} expenses={expenses} setExpenses={setExpenses}
        storeConfig={storeConfig} setStoreConfig={setStoreConfig}
        onClose={() => setView(AppView.HOME)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar 
        view={view} setView={setView} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        user={user} 
        onAuthClick={() => setShowAuthModal(true)}
        onMenuToggle={() => setIsMenuOpen(true)}
      />

      <MobileMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        setView={setView} 
      />

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full">
        <AnimatePresence mode="wait">
          {view === AppView.LOADING && (
            <motion.div 
              key="loading" 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-48 text-center"
            >
               <RefreshCw size={48} className="text-indigo-600 animate-spin mb-8" />
               <h2 className="text-3xl font-black text-slate-900 tracking-tight">Sincronizando Protocolos</h2>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Encriptación de canal activa</p>
            </motion.div>
          )}

          {(view === AppView.HOME || view === AppView.CATALOG) && (
            <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Catalog 
                products={products} 
                onProductSelect={(p) => { setSelectedProduct(p); setView(AppView.DETAIL); }} 
                onAddToCart={addToCart} 
                selectedCategory={selectedCategory} 
                setSelectedCategory={setSelectedCategory} 
              />
            </motion.div>
          )}

          {view === AppView.DETAIL && selectedProduct && (
            <ProductDetail product={selectedProduct} onAddToCart={addToCart} onBack={() => setView(AppView.CATALOG)} />
          )}

          {view === AppView.CART && (
            <Cart items={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={handleCheckoutStart} onBack={() => setView(AppView.CATALOG)} />
          )}

          {view === AppView.DELIVERY && (
            <motion.div key="delivery" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-3xl mx-auto space-y-12 py-16">
               <div className="space-y-4">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Nodo de Distribución</h2>
                  <p className="text-slate-500 font-medium">Selecciona el protocolo de entrega para tus componentes de ingeniería.</p>
               </div>
               <div className="space-y-6">
                  <DeliveryOption 
                    icon={Truck} 
                    title="Despacho Priority" 
                    price={4990} 
                    address="Entrega técnica en 24h a domicilio" 
                    onSelect={() => setView(AppView.CHECKOUT)} 
                  />
                  <DeliveryOption 
                    icon={Package} 
                    title="Retiro en Hub Osart" 
                    price={0} 
                    address="Linares Centro - Protocolo de retiro inmediato" 
                    onSelect={() => setView(AppView.CHECKOUT)} 
                  />
               </div>
            </motion.div>
          )}

          {view === AppView.CHECKOUT && (
            <Checkout items={cart} user={user} onComplete={handleOrderComplete} onBack={() => setView(AppView.DELIVERY)} />
          )}

          {view === AppView.GAME && (
            <ElectroGame onClose={() => setView(AppView.HOME)} onAddXP={addXP} />
          )}

          {view === AppView.PROFILE && user && (
            <Profile user={user} onLogout={() => { setUser(null); setView(AppView.HOME); }} />
          )}

          {view === AppView.SUCCESS && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="max-w-4xl mx-auto text-center py-20 space-y-12"
            >
               <div className="relative inline-block">
                  <div className="absolute inset-0 bg-green-500/20 blur-3xl animate-pulse"></div>
                  <div className="w-32 h-32 bg-green-50 text-green-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl relative z-10">
                    <CheckCircle size={64} />
                  </div>
               </div>
               
               <div className="space-y-4">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter">Despliegue Exitoso</h2>
                  <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Orden #{lastOrder?.id} • Protocolo Validado</p>
               </div>

               <div className="bg-slate-50 p-10 rounded-[3.5rem] border border-slate-100 max-w-lg mx-auto space-y-6 text-left">
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inversión Final</p>
                    <p className="text-2xl font-black text-indigo-600">${lastOrder?.total.toLocaleString()}</p>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><Terminal size={24} /></div>
                    <div>
                      <p className="text-sm font-black text-slate-900 uppercase">Seguimiento en vivo</p>
                      <p className="text-xs text-slate-500 font-medium">Enviamos el enlace de rastreo a {lastOrder?.customerEmail}</p>
                    </div>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-6 justify-center">
                 <button 
                  onClick={() => setView(AppView.HOME)} 
                  className="bg-indigo-600 text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-100"
                 >
                   Regresar al Catálogo
                 </button>
                 <button 
                  onClick={() => setView(AppView.PROFILE)} 
                  className="bg-white border border-slate-200 text-slate-900 px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all"
                 >
                   Ver mis Pedidos
                 </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setView} />
      
      <BottomNav 
        currentView={view} 
        setView={setView} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
      />

      <AIAssistant context={JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price, stock: p.stock, cat: p.category })))} />
      
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            onClose={() => setShowAuthModal(false)} 
            onLogin={(u) => { 
              const fullUser = {
                ...u, 
                role: u.email === 'admin@osart.cl' ? 'admin' : 'user',
                learningPoints: 750, // Puntos iniciales de bienvenida
                orders: []
              } as UserType;
              setUser(fullUser); 
              setShowAuthModal(false); 
              setView(AppView.HOME);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const DeliveryOption: React.FC<{ icon: any, title: string, price: number, address: string, onSelect: () => void }> = ({ icon: Icon, title, price, address, onSelect }) => (
  <button 
    onClick={onSelect} 
    className="w-full bg-white p-8 rounded-[3rem] border-2 border-slate-100 flex items-center justify-between hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-50 transition-all text-left group active:scale-[0.98]"
  >
    <div className="flex gap-6 items-center">
       <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
          <Icon size={32} />
       </div>
       <div>
          <p className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{title}</p>
          <p className="text-sm text-slate-400 font-medium">{address}</p>
       </div>
    </div>
    <div className="flex items-center gap-6">
       <span className="font-black text-slate-950 text-xl">${price.toLocaleString()}</span>
       <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-white group-hover:bg-indigo-600 transition-all shadow-inner">
          <ChevronRight size={22} />
       </div>
    </div>
  </button>
);

export default App;
