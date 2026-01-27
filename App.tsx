
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, ShoppingCart, Cpu, User, Menu, X, 
  Home, Gamepad2, Package, LogOut, ChevronRight, CheckCircle, AlertTriangle, Truck, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView, Product, CartItem, User as UserType, Category } from './types';
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

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [lowStockAlerts, setLowStockAlerts] = useState<string[]>([]);

  // Persistent Hydration
  useEffect(() => {
    const savedCart = localStorage.getItem('osart_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedUser = localStorage.getItem('osart_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // REAL-TIME STOCK MONITOR
  useEffect(() => {
    const criticalItems = cart.filter(item => item.stock < 5).map(item => item.name);
    setLowStockAlerts(prev => {
      const isDifferent = criticalItems.length !== prev.length || criticalItems.some(i => !prev.includes(i));
      return isDifferent ? criticalItems : prev;
    });
  }, [cart]);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('osart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (user) localStorage.setItem('osart_user', JSON.stringify(user));
    else localStorage.removeItem('osart_user');
  }, [user]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setView(AppView.DETAIL);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Variantes de Animación para Vistas SPA
  const pageVariants = {
    initial: { opacity: 0, x: 10, y: 10 },
    animate: { opacity: 1, x: 0, y: 0 },
    exit: { opacity: 0, x: -10, y: -10 }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Barra de envío dinámico */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="bg-[#fff159] py-2 px-4 text-center text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] hidden md:block border-b border-black/5"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <Truck size={16} className="text-blue-600" /> 
          Envíos gratis en 24h para compras sobre $49.990
          <span className="bg-blue-600 text-white px-3 py-0.5 rounded-full text-[9px] animate-pulse">SISTEMA SEGURO</span>
        </div>
      </motion.div>

      <Navbar 
        view={view} 
        setView={setView} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        hasLowStockAlert={lowStockAlerts.length > 0}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Toast Notification Container */}
        <div className="fixed top-24 right-6 z-[100] flex flex-col gap-4 pointer-events-none">
          <AnimatePresence>
            {lowStockAlerts.map((itemName) => (
              <motion.div
                key={itemName}
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8, x: 20 }}
                className="bg-white border-l-8 border-red-600 shadow-2xl p-5 rounded-2xl flex items-center gap-5 pointer-events-auto border border-slate-100 max-w-sm"
              >
                <div className="bg-red-50 p-3 rounded-xl shadow-inner">
                  <Bell className="text-red-600 animate-ring" size={24} />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-0.5">Stock Crítico</p>
                  <p className="text-sm font-black text-slate-800 line-clamp-1">{itemName}</p>
                </div>
                <button 
                  onClick={() => setLowStockAlerts(prev => prev.filter(n => n !== itemName))} 
                  className="p-2 hover:bg-slate-50 rounded-xl text-slate-300 hover:text-red-600 transition-all"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {view === AppView.HOME && (
            <motion.div 
              key="home" 
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <HeroSection onExplore={() => setView(AppView.CATALOG)} />
              <div className="mb-16">
                 <div className="flex items-center justify-between mb-10">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
                     <Package className="text-blue-600" /> Ingeniería Destacada
                   </h2>
                   <button onClick={() => setView(AppView.CATALOG)} className="bg-white px-6 py-3 rounded-2xl border border-slate-200 text-sm font-black text-blue-600 hover:border-blue-500 transition-all uppercase tracking-widest">Ver Catálogo</button>
                 </div>
                 <Catalog 
                  products={INITIAL_PRODUCTS} 
                  onProductSelect={handleProductSelect}
                  onAddToCart={addToCart}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                />
              </div>
            </motion.div>
          )}

          {view === AppView.CATALOG && (
            <motion.div 
              key="catalog" 
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Catalog 
                products={INITIAL_PRODUCTS} 
                onProductSelect={handleProductSelect}
                onAddToCart={addToCart}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </motion.div>
          )}

          {view === AppView.DETAIL && selectedProduct && (
            <motion.div 
              key="detail" 
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <ProductDetail 
                product={selectedProduct} 
                onAddToCart={addToCart} 
                onBack={() => setView(AppView.CATALOG)} 
              />
            </motion.div>
          )}

          {view === AppView.CART && (
            <motion.div 
              key="cart" 
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Cart 
                items={cart} 
                onUpdateQuantity={updateQuantity} 
                onRemove={removeFromCart} 
                onCheckout={() => setView(AppView.CHECKOUT)} 
                onBack={() => setView(AppView.CATALOG)}
              />
            </motion.div>
          )}

          {view === AppView.CHECKOUT && (
            <motion.div 
              key="checkout" 
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Checkout 
                items={cart} 
                user={user} 
                onComplete={() => { setCart([]); setView(AppView.SUCCESS); }}
                onBack={() => setView(AppView.CART)}
              />
            </motion.div>
          )}

          {view === AppView.SUCCESS && (
            <motion.div 
              key="success" 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              className="flex flex-col items-center justify-center py-24 bg-white rounded-[4rem] shadow-2xl border border-slate-100 max-w-3xl mx-auto text-center"
            >
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-10 shadow-xl shadow-green-500/10">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter text-slate-900 leading-none uppercase">¡Órden Recibida!</h2>
              <p className="text-lg text-slate-500 mb-12 max-w-md mx-auto font-medium leading-relaxed px-6">Tu pedido ha sido procesado exitosamente por nuestra red de logística. Recibirás una notificación en breve.</p>
              <div className="flex flex-col sm:flex-row gap-5 px-6 w-full max-w-md">
                <button onClick={() => setView(AppView.HOME)} className="flex-grow bg-[#3483fa] text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 uppercase tracking-widest">Seguir Comprando</button>
                <button onClick={() => setView(AppView.PROFILE)} className="flex-grow bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-black/10 uppercase tracking-widest">Mis Órdenes</button>
              </div>
            </motion.div>
          )}

          {view === AppView.GAME && (
            <motion.div key="game" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <ElectroGame onClose={() => setView(AppView.HOME)} onAddXP={(xp) => user && setUser({...user, learningPoints: user.learningPoints + xp})} />
            </motion.div>
          )}

          {view === AppView.PROFILE && user && (
            <motion.div key="profile" variants={pageVariants} initial="initial" animate="animate" exit="exit">
              <Profile user={user} onLogout={() => { setUser(null); setView(AppView.HOME); }} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setView} />
      
      <AIAssistant context={JSON.stringify(INITIAL_PRODUCTS.map(p => ({ n: p.name, p: p.price, s: p.stock, c: p.category })))} />
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={(u) => { setUser(u); setShowAuthModal(false); }} />
      )}

      <style>{`
        @keyframes ring {
          0% { transform: rotate(0deg); }
          5% { transform: rotate(15deg); }
          10% { transform: rotate(-15deg); }
          15% { transform: rotate(10deg); }
          20% { transform: rotate(-10deg); }
          25% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-ring {
          animation: ring 2s infinite;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const HeroSection: React.FC<{ onExplore: () => void }> = ({ onExplore }) => (
  <section className="relative rounded-[4rem] overflow-hidden mb-16 h-[450px] md:h-[600px] shadow-2xl border-4 border-white">
    <motion.img 
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80" 
      className="absolute inset-0 w-full h-full object-cover"
      alt="Hardware Hero"
    />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-950/95 via-blue-950/60 to-transparent"></div>
    <div className="relative z-10 p-10 md:p-24 flex flex-col justify-center h-full max-w-4xl text-white">
      <motion.div 
        initial={{ x: -50, opacity: 0 }} 
        animate={{ x: 0, opacity: 1 }} 
        transition={{ delay: 0.2, type: "spring" }}
        className="mb-8"
      >
        <span className="text-[10px] font-black uppercase tracking-[0.5em] bg-red-600 px-8 py-3 rounded-full w-fit shadow-[0_0_30px_rgba(220,38,38,0.4)] border border-red-400/30">
          Hardware de Precisión 2024
        </span>
      </motion.div>
      <motion.h1 
        initial={{ y: 30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-6xl md:text-8xl font-black mb-8 leading-[0.85] tracking-tighter"
      >
        Arquitecturas <br/> Que Definen El <span className="text-blue-500">Futuro.</span>
      </motion.h1>
      <motion.p 
        initial={{ y: 30, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ delay: 0.4 }}
        className="text-xl md:text-2xl text-blue-100/70 mb-14 font-medium max-w-2xl leading-relaxed"
      >
        Potencia tus desarrollos con suministros certificados y asesoría técnica experta en tiempo real. 
      </motion.p>
      <div className="flex flex-wrap gap-6 items-center">
        <motion.button 
          whileHover={{ scale: 1.05, rotate: -1 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore} 
          className="bg-[#3483fa] text-white px-14 py-6 rounded-[2rem] font-black text-2xl hover:bg-blue-600 transition-all shadow-[0_20px_40px_rgba(52,131,250,0.3)]"
        >
          Explorar Ahora
        </motion.button>
        <div className="flex items-center gap-5 bg-white/5 backdrop-blur-2xl px-8 py-5 rounded-[2.5rem] border border-white/10 shadow-2xl">
           <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
              <div className="w-3.5 h-3.5 bg-green-500 rounded-full animate-ping"></div>
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-0.5">Estado Global</p>
              <p className="text-sm font-black text-white">Stock 100% Sincronizado</p>
           </div>
        </div>
      </div>
    </div>
  </section>
);

export default App;
