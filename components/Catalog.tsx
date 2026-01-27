
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Star, ShoppingCart, Filter, Box, Zap, Heart } from 'lucide-react';
import { Product, Category } from '../types';

interface CatalogProps {
  products: Product[];
  onProductSelect: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (c: Category) => void;
}

const Catalog: React.FC<CatalogProps> = ({ 
  products, onProductSelect, onAddToCart, 
  searchQuery, setSearchQuery, selectedCategory, setSelectedCategory 
}) => {
  const categories: Category[] = ['Todos', 'Microcontroladores', 'Pasivos', 'Herramientas', 'Semiconductores', 'Sensores', 'Robótica'];

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div id="catalog" className="space-y-10">
      {/* Barra de Filtros y Búsqueda */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 py-6 sticky top-20 z-30 bg-[#f5f5f5]/90 backdrop-blur-xl border-b border-slate-200/50">
        <div className="relative w-full lg:w-[450px] group">
          <input 
            type="text" 
            placeholder="Busca el componente ideal..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-[1.25rem] py-4 pl-14 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none font-bold text-slate-800 shadow-sm"
          />
          <Search size={24} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>

        <div className="flex overflow-x-auto pb-2 gap-3 w-full lg:w-auto scrollbar-hide no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30 scale-105' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Productos */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={() => onProductSelect(product)}
              className="group bg-white rounded-[2.5rem] p-5 shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:shadow-blue-900/10 hover:-translate-y-3 transition-all duration-500 relative"
            >
              {/* Badge de Stock Crítico */}
              {product.stock < 10 && (
                <div className="absolute top-8 left-8 z-20">
                  <span className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-widest animate-pulse">
                    ¡Stock Crítico!
                  </span>
                </div>
              )}
              
              <div className="relative aspect-square rounded-3xl overflow-hidden mb-6 bg-slate-50 border border-slate-100">
                <motion.img 
                  layoutId={`product-image-${product.id}`}
                  src={product.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                  alt={product.name}
                />
                
                {/* Botón de Like Rápido */}
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-2.5 rounded-2xl text-slate-300 hover:text-red-500 transition-colors shadow-sm opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                  <Heart size={20} />
                </button>

                {/* Acción Rápida Hover */}
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="w-full bg-[#3483fa] text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-600 shadow-2xl shadow-blue-600/30 active:scale-95 transition-all"
                  >
                    <ShoppingCart size={18} /> Agregar al Carrito
                  </button>
                </div>
              </div>

              <div className="px-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{product.category}</p>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-[10px] font-black text-slate-500">{product.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-black text-slate-800 line-clamp-2 leading-tight mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                  {product.name}
                </h3>
                <div className="flex items-end justify-between">
                   <p className="text-3xl font-black text-slate-900 tracking-tighter">${product.price.toLocaleString()}</p>
                   <div className="bg-green-50 text-green-600 p-2 rounded-xl">
                      <Zap size={18} />
                   </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty State */}
      <AnimatePresence>
        {filtered.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-slate-100 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[2rem] flex items-center justify-center mb-8">
              <Box size={48} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">Sin resultados en la red</h2>
            <p className="text-slate-500 font-bold max-w-sm mx-auto mb-10">No encontramos componentes que coincidan con tus parámetros de búsqueda.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }} 
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 uppercase tracking-widest text-sm"
            >
              Reiniciar Protocolo de Búsqueda
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Catalog;
