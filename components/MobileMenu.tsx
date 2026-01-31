
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, MessageCircle, Book, Shield, Zap, Globe, Package, ShoppingBag, Terminal, ShieldCheck } from 'lucide-react';
import { AppView } from '../types';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  setView: (v: AppView) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, setView }) => {
  const menuSections = [
    {
      title: 'Sistema Central',
      items: [
        { label: 'Catálogo de Hardware', icon: Cpu, view: AppView.CATALOG },
        { label: 'Carrito de Órdenes', icon: ShoppingBag, view: AppView.CART },
        { label: 'Estado de Envío', icon: Package, view: AppView.PROFILE },
      ]
    },
    {
      title: 'Protocolos y Ayuda',
      items: [
        { label: 'Soporte Directo', icon: MessageCircle, link: 'https://wa.me/56987654321' },
        { label: 'Certificación Core', icon: ShieldCheck, view: AppView.GAME },
        { label: 'Docs de Ingeniería', icon: Book, link: '#' },
      ]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[150] bg-slate-900/40 backdrop-blur-md"
          />
          <motion.div 
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-[90%] max-w-sm z-[160] bg-white shadow-2xl flex flex-col"
          >
            {/* Header Menú */}
            <div className="p-8 pb-4 flex justify-between items-center border-b border-slate-50">
              <div className="flex items-center gap-3">
                 <div className="bg-indigo-600 text-white p-2 rounded-xl"><Terminal size={18} /></div>
                 <h2 className="text-xl font-black text-slate-950 tracking-tighter uppercase">Menú Protocol</h2>
              </div>
              <button onClick={onClose} className="p-3 bg-slate-50 rounded-2xl text-slate-400">
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-10 scrollbar-hide">
              {menuSections.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">{section.title}</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {section.items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          if (item.view) { setView(item.view); onClose(); }
                          if (item.link) window.open(item.link, '_blank');
                        }}
                        className="flex items-center gap-5 p-5 bg-slate-50 rounded-[2rem] hover:bg-indigo-50 transition-all group active:scale-95"
                      >
                        <div className="p-3 bg-white rounded-2xl shadow-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                          <item.icon size={20} strokeWidth={2.5} />
                        </div>
                        <span className="font-black text-sm text-slate-900 uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Promo Card Menu */}
              <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="absolute inset-0 animated-mesh opacity-20 pointer-events-none group-hover:opacity-40 transition-opacity"></div>
                <Zap size={48} className="absolute -bottom-4 -right-4 opacity-10 -rotate-12" />
                <h4 className="font-black text-xl mb-2 relative z-10">Acceso Elite</h4>
                <p className="text-[10px] text-indigo-300 font-black uppercase tracking-widest mb-6 relative z-10">Precios mayoristas verificados</p>
                <button className="bg-white text-slate-950 w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl relative z-10">Solicitar Cuenta Pro</button>
              </div>
            </div>

            {/* Footer Menú */}
            <div className="p-8 border-t border-slate-50 bg-slate-50/50">
               <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Osart v2.4.0</span>
                  <div className="flex gap-4">
                    <Globe size={14} />
                    <span>Chile</span>
                  </div>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
