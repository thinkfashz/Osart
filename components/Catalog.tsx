
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added ShieldCheck to the imports below to fix "Cannot find name 'ShieldCheck'" error
import { ShoppingCart, Plus, Star, Zap, TrendingDown, Clock, ChevronRight, Search, SlidersHorizontal, PackageSearch, Terminal, Eye, ShieldCheck } from 'lucide-react';
import { Product, Category } from '../types';

interface CatalogProps {
  products: Product[];
  onProductSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  selectedCategory: Category;
  setSelectedCategory: (c: Category) => void;
}

const Catalog: React.FC<CatalogProps> = ({ products, onProductSelect, onAddToCart, selectedCategory, setSelectedCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const categories: Category[] = ['Todos', 'Microcontroladores', 'Seguridad', 'Herramientas', 'Robótica', 'Sensores'];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12 py-6">
      {/* Hero Header Estilo Industrial */}
      <div className="relative w-full bg-slate-950 rounded-[4rem] overflow-hidden group shadow-2xl border border-white/5">
        <div className="absolute inset-0 animated-mesh opacity-10"></div>
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none -translate-y-1/2 translate-x-1/2">
          <Terminal size={400} />
        </div>
        
        <div className="relative z-10 px-8 lg:px-20 py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <span className="bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-2xl">Phase 5 Active</span>
              <div className="flex items-center gap-2 text-indigo-400">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
                <span className="text-[9px] font-black uppercase tracking-widest">Sync: 12ms</span>
              </div>
            </div>
            
            <h2 className="text-white text-5xl lg:text-8xl font-black tracking-tighter leading-[0.85]">
              Hardware <br /><span className="text-indigo-500">Soberano.</span>
            </h2>
            
            <p className="text-slate-400 font-medium text-lg leading-relaxed max-w-sm">
              Infraestructura crítica certificada para los arquitectos del nuevo hardware global.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-white text-slate-950 px-10 py-5 rounded-3xl font-black text-[11px] uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3 shadow-2xl">
                Deploy Catalog <ChevronRight size={18} />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
                 <div className="text-left">
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Protocol XP</p>
                    <p className="text-sm font-black text-white">+500 PTS</p>
                 </div>
              </div>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 10 }}
            animate={{ opacity: 1, scale: 1, rotate: 5 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="hidden lg:flex items-center justify-center p-12"
          >
             <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] animate-pulse"></div>
                <img 
                  src="https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&q=80&w=800"
                  className="w-[500px] h-[500px] object-contain relative z-10 drop-shadow-[0_40px_80px_rgba(0,0,0,0.5)] group-hover:rotate-0 transition-transform duration-1000"
                  alt="Architecture Component"
                />
             </div>
          </motion.div>
        </div>
      </div>

      {/* Control Layer (Filtros y Búsqueda) */}
      <div className="sticky top-28 z-40 bg-white/70 backdrop-blur-3xl p-6 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/20 space-y-6">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-950 text-white rounded-2xl">
              <Zap size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tighter uppercase leading-none">Engineering Hub</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Status: Sincronizando Catálogo</p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto">
             <div className="relative group flex-grow lg:w-96">
                <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="BUSCAR POR SKU O NOMBRE..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-4 pl-14 pr-6 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-300"
                />
             </div>
             <button className="p-4 bg-white border border-slate-200 text-slate-900 rounded-[1.5rem] hover:bg-slate-50 transition-colors shadow-sm">
                <SlidersHorizontal size={20} />
             </button>
          </div>
        </div>

        {/* Categorías con Scroll Nativo */}
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`whitespace-nowrap px-8 py-4 rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all border ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 scale-105' 
                : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50 hover:border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Despliegue */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-20 pt-10"
          >
            {filteredProducts.map((p, idx) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group cursor-pointer flex flex-col relative"
                onClick={() => onProductSelect(p)}
              >
                {/* Visual Artifact (Imagen) */}
                <div className="aspect-[4/5] rounded-[3.5rem] bg-[#f8f9fb] flex items-center justify-center p-12 relative overflow-hidden transition-all duration-700 group-hover:bg-white group-hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] group-hover:-translate-y-4">
                   <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-indigo-500/5 transition-all duration-700"></div>
                   
                   {/* Badges de Inventario */}
                   <div className="absolute top-8 left-8 z-20 flex flex-col gap-2">
                     {p.stock < 10 && (
                       <div className="bg-red-600 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-2xl animate-pulse">
                         <TrendingDown size={10} strokeWidth={3} /> STOCK BAJO
                       </div>
                     )}
                     {p.price > 30000 && (
                       <div className="bg-slate-950 text-white text-[8px] font-black uppercase px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xl border border-white/10">
                         <ShieldCheck size={10} className="text-indigo-400" /> PRO GRADE
                       </div>
                     )}
                   </div>

                   <motion.img 
                    src={p.image} 
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-1000 ease-out" 
                    alt={p.name} 
                    layoutId={`product-image-${p.id}`}
                   />

                   {/* Quick Actions Overlay */}
                   <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-500 z-30">
                      <button className="bg-white text-slate-900 p-4 rounded-2xl shadow-2xl hover:bg-slate-50 active:scale-90 transition-all">
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onAddToCart(p); }}
                        className="bg-indigo-600 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-indigo-700 active:scale-90 transition-all flex items-center gap-2"
                      >
                        <Plus size={18} /> Add
                      </button>
                   </div>
                </div>

                {/* Metadata del Producto */}
                <div className="mt-8 px-4 space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <span>SKU-{p.id}00X</span>
                       <div className="flex items-center gap-1 text-indigo-600">
                          <Star size={10} fill="currentColor" />
                          <span>{p.rating}</span>
                       </div>
                    </div>
                    <h4 className="text-lg font-black text-slate-950 leading-tight group-hover:text-indigo-600 transition-colors">
                      {p.name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                       <span className="text-2xl font-black text-slate-950">${p.price.toLocaleString()}</span>
                       <span className="text-[9px] font-black text-green-600 uppercase tracking-widest mt-1">Despacho en 24h</span>
                    </div>
                    <div className="flex -space-x-3">
                       {[...Array(3)].map((_, i) => (
                         <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                            {['+','A','B'][i]}
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-40 flex flex-col items-center justify-center text-center space-y-8"
          >
            <div className="w-28 h-28 bg-slate-50 rounded-[3rem] flex items-center justify-center text-slate-200 border border-slate-100 shadow-inner">
               <PackageSearch size={56} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Sin Sincronización</h4>
              <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">Protocolo de búsqueda fallido para "{searchQuery}"</p>
            </div>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }}
              className="bg-slate-950 text-white px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
            >
              Reiniciar Protocolo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalog;
