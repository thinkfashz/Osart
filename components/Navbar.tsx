
import React, { useState } from 'react';
import { Search, ShoppingCart, Cpu, User as UserIcon, Menu, X, Home, Gamepad2, AlertCircle } from 'lucide-react';
import { AppView, User } from '../types';
import { motion } from 'framer-motion';

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

  const navItems = [
    { label: 'Inicio', icon: Home, view: AppView.HOME },
    { label: 'Catálogo', icon: Cpu, view: AppView.CATALOG },
    { label: 'Aprende', icon: Gamepad2, view: AppView.GAME },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView(AppView.HOME)}>
            <div className="bg-slate-900 text-white p-2.5 rounded-xl transition-transform group-hover:rotate-3">
              <Cpu size={24} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">OSART<span className="text-indigo-600">.</span></h1>
              <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">SYSTEMS</span>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                className={`flex items-center gap-2 font-bold text-sm transition-colors ${view === item.view ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <item.icon size={18} />
                {item.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="relative group cursor-pointer" onClick={() => setView(AppView.CART)}>
              <motion.div 
                animate={hasLowStockAlert ? { scale: [1, 1.05, 1], backgroundColor: ['rgba(255,255,255,1)', 'rgba(254,226,226,1)', 'rgba(255,255,255,1)'] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`p-2.5 rounded-xl transition-colors relative ${view === AppView.CART ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-700'} ${hasLowStockAlert ? 'ring-2 ring-red-500/20 shadow-lg shadow-red-500/10' : ''}`}
              >
                <ShoppingCart size={24} />
                {hasLowStockAlert && (
                  <div className="absolute -top-1 -left-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                    </span>
                  </div>
                )}
              </motion.div>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold ring-2 ring-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </div>

            <button
              onClick={() => user ? setView(AppView.PROFILE) : onAuthClick()}
              className={`p-2.5 rounded-xl transition-colors ${view === AppView.PROFILE ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <UserIcon size={24} />
            </button>

            <button 
              className="md:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 p-4 space-y-4 shadow-xl">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { setView(item.view); setMobileMenuOpen(false); }}
              className="flex items-center gap-4 w-full p-4 rounded-2xl bg-slate-50 font-bold text-slate-700"
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
