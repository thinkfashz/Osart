
import React from 'react';
import { Home, Search, ShoppingBag, Gamepad2, User, Zap } from 'lucide-react';
import { AppView } from '../types';
import { motion } from 'framer-motion';

interface BottomNavProps {
  currentView: AppView;
  setView: (v: AppView) => void;
  cartCount: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView, cartCount }) => {
  const items = [
    { id: AppView.HOME, icon: Home, label: 'Home' },
    { id: AppView.CATALOG, icon: Search, label: 'Explore' },
    { id: AppView.CART, icon: ShoppingBag, label: 'Cart', badge: cartCount },
    { id: AppView.GAME, icon: Zap, label: 'Core' },
    { id: AppView.PROFILE, icon: User, label: 'Me' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-6 left-4 right-4 z-[140]">
      <div className="bg-white/70 backdrop-blur-3xl rounded-[2.5rem] p-3 shadow-[0_25px_60px_rgba(0,0,0,0.15)] border border-white/50 flex justify-between items-center">
        {items.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="relative flex flex-col items-center gap-1.5 flex-1 py-2 active:scale-90 transition-transform"
            >
              <div className={`transition-all duration-500 ${isActive ? 'text-indigo-600 scale-110' : 'text-slate-300'}`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && item.badge > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-red-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full font-black ring-2 ring-white"
                  >
                    {item.badge}
                  </motion.span>
                )}
              </div>
              <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-indigo-600 opacity-100' : 'text-slate-400 opacity-0 h-0 overflow-hidden'}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="active-dot-bottom"
                  className="absolute -bottom-1.5 w-1 h-1 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
