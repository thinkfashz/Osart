
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, Product, CartItem, User as UserType, Category, Sale, Expense, StoreConfig, ActivityLog } from './types';
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
import { recordActivity, syncUserProfile, updateUserXP } from './services/supabase';
import { CheckCircle, RefreshCw, ShoppingBag, Terminal } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [sales, setSales] = useState<Sale[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
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

  const logActivity = (action: string, category: ActivityLog['category'], details: string) => {
    const newLog: ActivityLog = {
      id: `LOG-${Date.now()}`,
      userId: user?.email || 'guest',
      userName: user?.name || 'Invitado',
      action,
      category,
      timestamp: new Date().toISOString(),
      details
    };
    setActivityLogs(prev => [newLog, ...prev]);
    // Intentamos registrar, si falla (por falta de env vars) no bloqueamos el hilo principal
    recordActivity(newLog).catch(() => {}); 
  };

  const addToCart = (product: Product) => {
    logActivity('🛒 Agregado al Carrito', 'commerce', `SKU: ${product.id} - ${product.name}`);
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleOrderComplete = (sale: Sale) => {
    logActivity('🚀 Compra Finalizada', 'commerce', `Total: $${sale.total} - Order ID: ${sale.id}`);
    setSales(prev => [sale, ...prev]);
    setLastOrder(sale);
    if (user) {
      setUser(u => u ? { ...u, orders: [sale, ...u.orders] } : null);
    }
    setCart([]);
    setView(AppView.SUCCESS);
  };

  const addXP = async (points: number) => {
    if (user) {
      logActivity('⚡ XP Ganada', 'gaming', `Módulo completado: +${points} XP`);
      const updatedTotal = await updateUserXP(user.email, points);
      setUser(u => u ? { ...u, learningPoints: updatedTotal || u.learningPoints + points } : null);
    }
  };

  const handleLogin = async (u: any) => {
    const isAdmin = u.email === 'admin@osart.cl';
    const fullUser = {
      ...u, 
      role: isAdmin ? 'admin' : 'user',
      learningPoints: u.learningPoints || 0,
      orders: [],
      history: []
    } as UserType;
    
    logActivity('🔑 Inicio de Sesión', 'auth', `Provider: ${u.provider || 'Email'}`);
    setUser(fullUser); 
    setShowAuthModal(false); 
    syncUserProfile(fullUser).catch(() => {});
    
    if (isAdmin) setView(AppView.ADMIN);
    else setView(AppView.HOME);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar 
        view={view} setView={setView} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        user={user} 
        onAuthClick={() => setShowAuthModal(true)}
        onMenuToggle={() => setIsMenuOpen(true)}
      />

      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} setView={setView} />

      <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full">
        <AnimatePresence mode="wait">
          {view === AppView.LOADING && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center py-48 text-center">
               <RefreshCw size={48} className="text-indigo-600 animate-spin mb-8" />
               <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Sincronizando Base de Datos</h2>
               <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-2">Encriptación de canal Supabase activa</p>
            </motion.div>
          )}

          {(view === AppView.HOME || view === AppView.CATALOG) && (
            <motion.div key="catalog" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Catalog products={products} onProductSelect={(p) => { setSelectedProduct(p); setView(AppView.DETAIL); }} onAddToCart={addToCart} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
            </motion.div>
          )}

          {view === AppView.DETAIL && selectedProduct && (
            <ProductDetail product={selectedProduct} onAddToCart={addToCart} onBack={() => setView(AppView.CATALOG)} />
          )}

          {view === AppView.CART && (
            <Cart items={cart} onUpdateQuantity={(id, d) => setCart(prev => prev.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={(id) => setCart(prev => prev.filter(i => i.id !== id))} onCheckout={() => setView(AppView.CHECKOUT)} onBack={() => setView(AppView.CATALOG)} />
          )}

          {view === AppView.CHECKOUT && (
            <Checkout items={cart} user={user} onComplete={handleOrderComplete} onBack={() => setView(AppView.CART)} />
          )}

          {view === AppView.GAME && (
            <ElectroGame onClose={() => setView(AppView.HOME)} onAddXP={addXP} />
          )}

          {view === AppView.PROFILE && user && (
            <Profile user={user} onLogout={() => { logActivity('🔒 Cierre de Sesión', 'auth', 'Logout Manual'); setUser(null); setView(AppView.HOME); }} />
          )}

          {view === AppView.SUCCESS && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-4xl mx-auto text-center py-20 space-y-12">
               <div className="w-32 h-32 bg-green-50 text-green-600 rounded-[3rem] flex items-center justify-center mx-auto shadow-2xl">
                 <CheckCircle size={64} />
               </div>
               <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">Orden Registrada</h2>
               <p className="text-slate-400 font-black uppercase text-xs tracking-[0.3em]">Orden #{lastOrder?.id} • Ledger Localizado</p>
               <button onClick={() => setView(AppView.HOME)} className="bg-indigo-600 text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-widest shadow-2xl">Volver al Catálogo</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {view === AppView.ADMIN && (
        <AdminDashboard 
          products={products} setProducts={setProducts} 
          sales={sales} expenses={expenses} setExpenses={setExpenses}
          storeConfig={storeConfig} setStoreConfig={setStoreConfig}
          activityLogs={activityLogs}
          onClose={() => setView(AppView.HOME)} 
        />
      )}

      <Footer setView={setView} />
      <BottomNav currentView={view} setView={setView} cartCount={cart.reduce((a, b) => a + b.quantity, 0)} />
      <AIAssistant context={JSON.stringify(products.map(p => ({ id: p.id, name: p.name, price: p.price })))} />
      
      <AnimatePresence>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
      </AnimatePresence>
    </div>
  );
};

export default App;
