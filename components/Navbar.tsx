
import React, { useState } from 'react';
import { Search, ShoppingCart, Cpu, User as UserIcon, Menu, X, Home, Gamepad2, Bell } from 'lucide-react';
import { AppView, User } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  view: AppView;
  setView: (v: AppView) => void;
  cartCount: number;
  user: User | null;
  onAuthClick: () => void;
  hasLowStockAlert?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView, cartCount, user, onAuthClick, hasLowStockAlert }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-[#3483fa] shadow-lg border-b border-blue-400/20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20 gap-8">
          {/* Logo Interactivo */}
          <div 
            className="flex items-center gap-3 cursor-pointer shrink-0 group" 
            onClick={() => setView(AppView.HOME)}
          >
            <div className="relative">
              <motion.div 
                whileHover={{ rotateY: 180, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="bg-white text-blue-600 p-2.5 rounded-xl shadow-lg relative z-10"
              >
                <Cpu size={28} />
              </motion.div>
              {/* Ping de estado */}
              <div className="absolute -top-1 -right-1 z-20">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 border border-white"></span>
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-white tracking-tighter hidden md:block leading-none group-hover:text-blue-100 transition-colors">OSART ELITE</h1>
              <span className="text-[8px] text-blue-100 font-bold uppercase tracking-[0.3em] hidden md:block">Active Engineering</span>
            </div>
          </div>

          {/* Search Bar (ML Style) */}
          <div className="flex-grow max-w-2xl hidden md:block">
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Busca componentes, kits de robótica y más..."
                className="w-full bg-white border-none py-3 px-5 rounded-lg shadow-inner outline-none text-sm font-semibold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-300 transition-all"
              />
              <div className="absolute right-0 top-0 h-full w-14 flex items-center justify-center text-slate-400 border-l border-slate-100 hover:text-blue-600 cursor-pointer">
                <Search size={22} />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 md:gap-4 text-white">
            <button 
              onClick={() => user ? setView(AppView.PROFILE) : onAuthClick()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold"
            >
              <UserIcon size={20} />
              <span className="hidden lg:inline">{user ? user.name.split(' ')[0] : 'Ingresar'}</span>
            </button>

            <button 
              onClick={() => setView(AppView.GAME)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-sm font-bold bg-white/5"
            >
              <Gamepad2 size={20} />
              <span className="hidden lg:inline">Academia</span>
            </button>

            <div className="relative cursor-pointer p-3 hover:bg-white/10 rounded-xl transition-all" onClick={() => setView(AppView.CART)}>
              <motion.div
                animate={hasLowStockAlert ? { scale: [1, 1.2, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ShoppingCart size={24} />
              </motion.div>
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] min-w-[20px] h-[20px] flex items-center justify-center rounded-full font-black ring-2 ring-[#3483fa] shadow-lg">
                  {cartCount}
                </span>
              )}
              {hasLowStockAlert && (
                <div className="absolute -bottom-1 -right-1">
                   <Bell size={12} className="text-yellow-400 fill-yellow-400 animate-bounce" />
                </div>
              )}
            </div>

            <button className="md:hidden p-2 hover:bg-white/10 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-slate-200 overflow-hidden shadow-2xl"
          >
            <div className="p-6 space-y-4">
               <div className="relative">
                <input type="text" placeholder="¿Qué estás buscando?" className="w-full bg-slate-100 py-4 px-5 rounded-2xl outline-none border border-slate-200" />
                <Search size={20} className="absolute right-5 top-4 text-slate-400" />
               </div>
               <nav className="grid grid-cols-2 gap-3">
                 <button onClick={() => { setView(AppView.CATALOG); setMobileMenuOpen(false); }} className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 flex flex-col items-center gap-2">
                   <Home size={20} className="text-blue-600" /> Inicio
                 </button>
                 <button onClick={() => { setView(AppView.GAME); setMobileMenuOpen(false); }} className="p-4 bg-slate-50 rounded-2xl font-bold text-slate-700 flex flex-col items-center gap-2">
                   <Gamepad2 size={20} className="text-red-500" /> Juegos
                 </button>
               </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
