
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, ShoppingCart, ArrowLeft, Cpu, ShieldCheck, 
  Truck, Heart, Zap, Clock, Users, ChevronRight, 
  Info, Share2, TrendingUp, AlertCircle, Bookmark, PackageCheck
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  const [activeTab, setActiveTab] = useState<'specs' | 'guide' | 'shipping'>('specs');
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 42, secs: 15 });
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Datos simulados de alta conversión
  const discountPercentage = 35;
  const originalPrice = Math.floor(product.price / (1 - discountPercentage / 100));
  const activeViewers = Math.floor(Math.random() * 20) + 5;
  const stockPercentage = (product.stock / 50) * 100;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        if (prev.mins > 0) return { ...prev, mins: prev.mins - 1, secs: 59 };
        return { ...prev, hours: prev.hours > 0 ? prev.hours - 1 : 0, mins: 59, secs: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white pb-40"
    >
      {/* Header de Navegación Mobile - Cristalino */}
      <div className="sticky top-0 z-[60] bg-white/70 backdrop-blur-2xl px-6 py-5 flex items-center justify-between lg:hidden border-b border-slate-50">
        <button onClick={onBack} className="p-2 -ml-2 text-slate-900 bg-white rounded-full shadow-sm">
          <ArrowLeft size={22} />
        </button>
        <span className="font-black text-[10px] uppercase tracking-[0.2em] text-indigo-600">Protocolo Detalle</span>
        <div className="flex gap-2">
          <button className="p-2 text-slate-900 bg-white rounded-full shadow-sm"><Share2 size={20} /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-12 pt-4 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-24">
          
          {/* Visual Showcase - Columna Izquierda */}
          <div className="space-y-6">
            <div className="relative aspect-[4/5] lg:aspect-square rounded-[3rem] lg:rounded-[4rem] bg-[#f8f9fb] overflow-hidden group shadow-inner">
              {/* Animación de fondo sutil */}
              <div className="absolute inset-0 opacity-20 animated-mesh scale-110 pointer-events-none"></div>
              
              <motion.img 
                layoutId={`product-image-${product.id}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                src={product.image} 
                className="w-full h-full object-contain relative z-10 p-10 lg:p-20 group-hover:scale-105 transition-transform duration-1000"
                alt={product.name}
              />

              {/* Badges Flotantes de Escasez */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
                <motion.div 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  className="bg-red-600 text-white px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 shadow-2xl shadow-red-200"
                >
                  <Zap size={14} fill="white" className="animate-pulse" /> 
                  Ahorra {discountPercentage}% Hoy
                </motion.div>
                <motion.div 
                  initial={{ x: -20, opacity: 0 }} 
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-tighter flex items-center gap-2 shadow-xl border border-white/50"
                >
                  <Users size={14} className="text-indigo-600" /> {activeViewers} Ingenieros interesados
                </motion.div>
              </div>

              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-6 right-6 p-4 bg-white rounded-full text-slate-300 hover:text-red-500 transition-all shadow-xl z-20 active:scale-90"
              >
                <Heart size={22} className={isFavorite ? "fill-red-500 text-red-500" : ""} />
              </button>

              {/* Indicador de Desplazamiento Galería */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                {[1,2,3].map(i => <div key={i} className={`h-1.5 rounded-full transition-all ${i===1 ? 'w-8 bg-indigo-600' : 'w-1.5 bg-slate-200'}`} />)}
              </div>
            </div>

            {/* Desktop thumbnails */}
            <div className="hidden lg:grid grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square rounded-[2rem] bg-[#f8f9fb] border-2 transition-all cursor-pointer hover:border-indigo-200 flex items-center justify-center p-4 ${i === 1 ? 'border-indigo-600' : 'border-transparent opacity-60'}`}>
                   <img src={product.image} className="w-full h-full object-contain opacity-40" alt="thumb" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info - Columna Derecha */}
          <div className="flex flex-col">
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 w-fit px-4 py-1.5 rounded-full">
                <TrendingUp size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">Nº 1 en Ventas: {product.category}</span>
              </div>

              <h1 className="text-4xl lg:text-7xl font-black text-indigo-950 tracking-tighter leading-[0.9] lg:leading-[0.85]">
                {product.name}
              </h1>

              <div className="flex items-center gap-6">
                <div className="flex text-indigo-600 items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />)}
                  <span className="text-sm font-black text-slate-900 ml-1">4.9</span>
                </div>
                <div className="h-4 w-px bg-slate-100" />
                <span className="text-sm font-bold text-slate-400">128 Auditorías Técnicas</span>
              </div>

              <p className="text-lg text-slate-500 leading-relaxed font-medium lg:max-w-lg">
                {product.description}
              </p>
            </div>

            {/* Price & Scarcity Panel */}
            <div className="mt-10 p-8 lg:p-10 rounded-[3.5rem] bg-indigo-950 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden">
              <div className="absolute inset-0 animated-mesh opacity-10 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Oferta Especial Limitada</p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl lg:text-6xl font-black tracking-tighter">${product.price.toLocaleString()}</span>
                    <span className="text-xl text-indigo-300/50 line-through font-bold">${originalPrice.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 bg-white/10 px-6 py-4 rounded-[2rem] border border-white/10 backdrop-blur-md">
                  <Clock size={20} className="text-indigo-400 animate-pulse" />
                  <div className="tabular-nums">
                    <p className="text-[8px] font-black uppercase text-indigo-200">Termina en</p>
                    <p className="text-lg font-black leading-none">{timeLeft.hours}h {timeLeft.mins}m {timeLeft.secs}s</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3 relative z-10">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-indigo-300">Inventario Crítico</span>
                  <span className="text-red-400">{product.stock} Unidades Restantes</span>
                </div>
                <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/5 p-0.5">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stockPercentage}%` }}
                    className={`h-full rounded-full ${product.stock < 10 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`}
                  />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-200/60 uppercase">
                  <AlertCircle size={12} className="text-red-400" />
                  92% de los ingenieros compraron este ítem en el último mes.
                </div>
              </div>
            </div>

            {/* Navigation Tabs - Estilo Minimalista */}
            <div className="mt-12 space-y-8">
              <div className="flex gap-10 border-b border-slate-100 overflow-x-auto scrollbar-hide">
                {[
                  { id: 'specs', label: 'Especificaciones', icon: Cpu },
                  { id: 'guide', label: 'Guía Pro', icon: Bookmark },
                  { id: 'shipping', label: 'Logística', icon: Truck }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative flex items-center gap-2 shrink-0 ${activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <tab.icon size={14} />
                    {tab.label}
                    {activeTab === tab.id && <motion.div layoutId="detail-tab" className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />}
                  </button>
                ))}
              </div>

              <div className="min-h-[140px]">
                <AnimatePresence mode="wait">
                  {activeTab === 'specs' && (
                    <motion.div 
                      key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="grid grid-cols-2 gap-y-6 gap-x-12"
                    >
                      {Object.entries(product.specs).map(([k, v]) => (
                        <div key={k} className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{k}</p>
                          <p className="text-slate-900 font-bold text-sm">{v}</p>
                        </div>
                      ))}
                    </motion.div>
                  )}
                  {activeTab === 'guide' && (
                    <motion.div 
                      key="guide" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 relative group"
                    >
                      <div className="absolute top-0 right-10 -translate-y-1/2 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm text-indigo-600">
                        <Bookmark size={20} fill="currentColor" />
                      </div>
                      <p className="text-slate-700 font-bold italic text-lg leading-relaxed">"{product.guide}"</p>
                      <div className="mt-6 flex items-center gap-3">
                         <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg"><Zap size={18} /></div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Tip de Ingeniería</p>
                            <p className="text-xs text-slate-500 font-medium">{product.proTip}</p>
                         </div>
                      </div>
                    </motion.div>
                  )}
                  {activeTab === 'shipping' && (
                    <motion.div 
                      key="shipping" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-4 p-6 bg-green-50 rounded-[2rem] border border-green-100">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-green-600 shadow-sm"><PackageCheck size={24} /></div>
                         <div>
                            <p className="text-sm font-black text-green-950 uppercase">Listo para Despacho Express</p>
                            <p className="text-xs text-green-700/70 font-bold">Llega hoy si compras antes de las 13:00</p>
                         </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                           <ShieldCheck size={18} className="text-indigo-600" />
                           <p className="text-[10px] font-black text-slate-900 uppercase">Protección ESD</p>
                           <p className="text-[10px] text-slate-500">Embalaje reforzado anti-estático.</p>
                        </div>
                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                           <Truck size={18} className="text-indigo-600" />
                           <p className="text-[10px] font-black text-slate-900 uppercase">Courier Global</p>
                           <p className="text-[10px] text-slate-500">Tracking GPS en tiempo real.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Acción Flotante - Ultra UX Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 lg:p-10 pointer-events-none">
        <div className="max-w-7xl mx-auto flex justify-center lg:justify-end pointer-events-auto">
           <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            className="w-full lg:max-w-md bg-white/70 backdrop-blur-3xl p-3 lg:p-5 rounded-[3rem] shadow-[0_30px_70px_rgba(79,70,229,0.25)] border border-indigo-100 flex items-center gap-4"
           >
              {/* Info Precio en la barra sticky */}
              <div className="flex-grow pl-6 py-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Inversión</p>
                <div className="flex items-center gap-2 mt-1">
                   <p className="text-2xl font-black text-indigo-950">${product.price.toLocaleString()}</p>
                   {discountPercentage > 0 && <span className="text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg">-{discountPercentage}%</span>}
                </div>
              </div>

              <button 
                onClick={() => onAddToCart(product)}
                className="flex-grow sm:flex-none bg-indigo-600 text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 shadow-2xl shadow-indigo-400 hover:bg-indigo-700 hover:shadow-indigo-500 transition-all active:scale-95 group"
              >
                <ShoppingCart size={18} className="group-hover:rotate-12 transition-transform" />
                Añadir al Carrito
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </motion.div>
        </div>
      </div>

      {/* Trust badgets footer detail */}
      <div className="max-w-7xl mx-auto px-6 mt-20 border-t border-slate-50 pt-10 text-center">
         <div className="flex flex-wrap justify-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
            {['ISO 9001', 'ROHS COMPLIANT', 'ESD PROTECTED', 'CE CERTIFIED'].map(tag => (
              <span key={tag} className="text-[9px] font-black tracking-[0.3em] uppercase">{tag}</span>
            ))}
         </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
