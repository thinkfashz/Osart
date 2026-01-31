
import React from 'react';
import { Search, ShoppingCart, Cpu, Menu, LogIn, User, Bell, Terminal, ShieldCheck, LayoutGrid } from 'lucide-react';
import { AppView, User as UserType } from '../types';
import { motion } from 'framer-motion';

interface NavbarProps {
  view: AppView;
  setView: (v: AppView) => void;
  cartCount: number;
  user: UserType | null;
  onAuthClick: () => void;
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ view, setView, cartCount, user, onAuthClick, onMenuToggle }) => {
  const isAdmin = user?.role === 'admin';

  return (
    <header className="w-full sticky top-0 z-[100] bg-white/80 backdrop-blur-3xl border-b border-slate-100">
      {/* Alerta de Sistema Superior */}
      <div className="bg-slate-950 py-1.5 px-6 overflow-hidden border-b border-white/5">
        <motion.div 
          animate={{ x: [0, -300, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="whitespace-nowrap flex gap-16 items-center"
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-indigo-400">
                STATUS: SISTEMA NOMINAL
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/50">
                LOGÍSTICA: DESPACHO PRIORITARIO ACTIVO EN LINARES
              </span>
              <span className="text-[8px] font-black uppercase tracking-[0.4em] text-green-500">
                DISPONIBILIDAD: PTZ CAM V3 RE-STOCK COMPLETO
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
        {/* Identidad Visual */}
        <div className="flex items-center gap-12">
          <motion.div 
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setView(AppView.HOME)}
          >
            <div className="bg-indigo-600 text-white p-2.5 rounded-2xl shadow-xl shadow-indigo-100 group-hover:bg-slate-950 transition-colors duration-500">
              <Cpu size={22} className="group-hover:rotate-180 transition-transform duration-700" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-slate-950 tracking-tighter uppercase leading-none">
                osart<span className="text-indigo-600">.</span>elite
              </h1>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Engineering Solutions</span>
            </div>
          </motion.div>

          {/* Nav Desktop - Estilo Terminal */}
          <nav className="hidden lg:flex items-center gap-10">
            {['Catálogo', 'Proyectos', 'Laboratorio'].map((item) => (
              <button 
                key={item} 
                onClick={() => setView(AppView.CATALOG)}
                className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-indigo-600 transition-all flex items-center gap-2 group"
              >
                <div className="w-1 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                {item}
              </button>
            ))}
            
            {/* Acceso rápido Admin si el usuario tiene el rol */}
            {isAdmin && (
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setView(AppView.ADMIN)}
                className="bg-indigo-600/10 text-indigo-600 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border border-indigo-200 flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Terminal size={14} /> Admin Panel
              </motion.button>
            )}
          </nav>
        </div>

        {/* Command Center */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="hidden sm:flex items-center gap-2 text-slate-400 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
            <Search size={16} />
            <input placeholder="BUSCAR SKU..." className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest w-24" />
          </div>

          <div className="h-8 w-px bg-slate-100 hidden sm:block" />

          {/* Cart Hub */}
          <div className="relative group cursor-pointer" onClick={() => setView(AppView.CART)}>
            <div className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-900 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all shadow-sm">
              <ShoppingCart size={20} strokeWidth={2.5} />
            </div>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full ring-4 ring-white shadow-lg">
                {cartCount}
              </span>
            )}
          </div>

          {/* Login / Profile Hub */}
          <button 
            onClick={user ? () => setView(AppView.PROFILE) : onAuthClick}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all ${
              user 
              ? 'bg-indigo-50 border-indigo-100 text-indigo-700 shadow-sm' 
              : 'bg-slate-950 border-slate-950 text-white shadow-xl shadow-slate-200 hover:bg-indigo-600 hover:border-indigo-600'
            }`}
          >
            {user ? (
              <>
                <div className="w-6 h-6 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start text-left">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-0.5">{user.name.split(' ')[0]}</span>
                  <span className="text-[8px] font-bold text-indigo-400 uppercase tracking-tighter">{user.role === 'admin' ? 'ROOT ADMIN' : `LVL ${Math.floor(user.learningPoints / 500)} ENGINEER`}</span>
                </div>
              </>
            ) : (
              <>
                <Terminal size={18} />
                <span className="hidden sm:block text-[10px] font-black uppercase tracking-widest">Login Protocol</span>
              </>
            )}
          </button>

          {/* Bento Menu Trigger */}
          <button 
            onClick={onMenuToggle}
            className="lg:hidden p-3 bg-white border border-slate-100 text-slate-900 rounded-2xl active:scale-90 transition-transform shadow-sm"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
