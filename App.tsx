
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, ShoppingCart, Cpu, User, Menu, X, 
  Home, Gamepad2, Package, LogOut, ChevronRight, CheckCircle, AlertTriangle
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

  // Persistence logic compatible with Supabase (mocked)
  useEffect(() => {
    const savedCart = localStorage.getItem('osart_cart');
    if (savedCart) setCart(JSON.parse(savedCart));
    const savedUser = localStorage.getItem('osart_user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  // Real-time Stock Monitor (Simulating Supabase Channel)
  useEffect(() => {
    const lowStockItems = cart
      .filter(item => item.stock < 5)
      .map(item => item.name);
    
    setLowStockAlerts(lowStockItems);
  }, [cart]);

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

  const handleLogin = (u: UserType) => {
    setUser(u);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setUser(null);
    setView(AppView.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      <Navbar 
        view={view} 
        setView={setView} 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        user={user}
        onAuthClick={() => setShowAuthModal(true)}
        hasLowStockAlert={lowStockAlerts.length > 0}
      />

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Real-time Toast Notification Container */}
        <div className="fixed top-24 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
          <AnimatePresence>
            {lowStockAlerts.map((itemName, idx) => (
              <motion.div
                key={itemName}
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                className="bg-white border-l-4 border-red-500 shadow-2xl p-4 rounded-2xl flex items-center gap-4 pointer-events-auto max-w-xs"
              >
                <div className="bg-red-50 p-2 rounded-xl">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Stock Crítico</p>
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">{itemName}</p>
                  <p className="text-[9px] text-slate-400">¡Quedan pocas unidades!</p>
                </div>
                <button 
                  onClick={() => setLowStockAlerts(prev => prev.filter(n => n !== itemName))}
                  className="ml-auto text-slate-300 hover:text-slate-500"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {view === AppView.HOME && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <HeroSection onExplore={() => setView(AppView.CATALOG)} onPlay={() => setView(AppView.GAME)} />
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

          {view === AppView.CATALOG && (
            <motion.div key="catalog" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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
            <ProductDetail 
              product={selectedProduct} 
              onAddToCart={addToCart} 
              onBack={() => setView(AppView.CATALOG)} 
            />
          )}

          {view === AppView.CART && (
            <Cart 
              items={cart} 
              onUpdateQuantity={updateQuantity} 
              onRemove={removeFromCart} 
              onCheckout={() => setView(AppView.CHECKOUT)} 
              onBack={() => setView(AppView.CATALOG)}
            />
          )}

          {view === AppView.CHECKOUT && (
            <Checkout 
              items={cart} 
              user={user} 
              onComplete={() => {
                setCart([]);
                setView(AppView.SUCCESS);
              }}
              onBack={() => setView(AppView.CART)}
            />
          )}

          {view === AppView.SUCCESS && (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-green-200/50">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter text-slate-900">¡Órden Exitosa!</h2>
              <p className="text-lg text-slate-500 mb-10 max-w-md mx-auto font-medium">Estamos preparando tus componentes. Recibirás una notificación vía Supabase en tiempo real.</p>
              <button onClick={() => setView(AppView.HOME)} className="bg-slate-900 text-white px-12 py-5 rounded-[2rem] font-black text-lg hover:scale-105 active:scale-95 transition-all shadow-2xl">Ir a mi Panel de Control</button>
            </motion.div>
          )}

          {view === AppView.GAME && (
            <ElectroGame 
              onClose={() => setView(AppView.HOME)} 
              onAddXP={(xp) => {
                if(user) {
                  setUser({ ...user, learningPoints: user.learningPoints + xp });
                }
              }}
            />
          )}

          {view === AppView.PROFILE && user && (
            <Profile user={user} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </main>

      <Footer setView={setView} />
      
      <AIAssistant context={JSON.stringify(INITIAL_PRODUCTS.map(p => ({ n: p.name, c: p.category, p: p.price })))} />
      
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />
      )}
    </div>
  );
};

const HeroSection: React.FC<{ onExplore: () => void, onPlay: () => void }> = ({ onExplore, onPlay }) => (
  <section className="relative rounded-[3.5rem] overflow-hidden bg-slate-900 text-white mb-20 shadow-2xl border border-white/5 group">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/95 via-indigo-900/80 to-transparent z-10 transition-opacity group-hover:opacity-90"></div>
    <motion.img 
      initial={{ scale: 1.1 }}
      animate={{ scale: 1 }}
      transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
      src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80" 
      className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
      alt="Hardware Background"
    />
    <div className="relative z-20 p-8 md:p-24 flex flex-col items-start max-w-4xl">
      <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.4em] px-5 py-2 rounded-full mb-8 inline-block shadow-lg">Turbo Engineering 2026</span>
      </motion.div>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-6xl md:text-8xl font-black leading-[1] mb-10 tracking-tighter">
        Llevamos tu <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-300">Visión al Silicio.</span>
      </motion.h1>
      <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl text-blue-100/70 mb-12 leading-relaxed font-medium max-w-2xl">
        La plataforma más avanzada para la adquisición de componentes electrónicos de grado industrial. Integración nativa con Supabase para seguimiento 24/7.
      </motion.p>
      <div className="flex flex-wrap gap-6">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExplore} 
          className="bg-white text-slate-900 px-10 py-5 rounded-[2rem] font-black text-lg hover:bg-indigo-50 transition-all shadow-2xl shadow-white/10 flex items-center gap-3"
        >
          Explorar Catálogo <ChevronRight size={22} className="text-indigo-600" />
        </motion.button>
        <motion.button 
          whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlay} 
          className="bg-white/10 backdrop-blur-2xl border border-white/20 text-white px-10 py-5 rounded-[2rem] font-black text-lg transition-all flex items-center gap-3"
        >
          <Gamepad2 size={24} className="text-indigo-400" /> Academia Osart
        </motion.button>
      </div>
    </div>
    <div className="absolute bottom-10 right-10 z-20 hidden lg:flex items-center gap-4 bg-black/30 backdrop-blur-xl p-4 rounded-[2rem] border border-white/10">
      <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center animate-pulse">
         <div className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.8)]"></div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Supabase</p>
        <p className="text-sm font-black text-white">Sincronización Activa</p>
      </div>
    </div>
  </section>
);

export default App;
