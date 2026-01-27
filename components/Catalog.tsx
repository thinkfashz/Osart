
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Star, ShoppingCart, Filter } from 'lucide-react';
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
    <div id="catalog" className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-4 sticky top-20 z-30 bg-slate-50/95 backdrop-blur-md">
        <div className="relative w-full md:w-96 group">
          <input 
            type="text" 
            placeholder="Buscar componentes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium"
          />
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        </div>

        <div className="flex overflow-x-auto pb-1 gap-2 w-full md:w-auto scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filtered.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => onProductSelect(product)}
            className="group bg-white rounded-[2rem] p-4 shadow-sm border border-slate-100 cursor-pointer hover:shadow-2xl hover:shadow-indigo-900/10 hover:-translate-y-2 transition-all duration-500"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-slate-50">
              <img 
                src={product.image} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                alt={product.name}
              />
              <div className="absolute top-3 right-3 flex gap-2">
                <span className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl text-xs font-black flex items-center gap-1 shadow-sm">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" /> {product.rating}
                </span>
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                  className="w-full bg-slate-900/90 backdrop-blur-md text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-900"
                >
                  <ShoppingCart size={18} /> Agregar al Carrito
                </button>
              </div>
            </div>
            <div className="px-2">
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{product.category}</p>
              <h3 className="text-lg font-bold text-slate-800 line-clamp-2 leading-tight mb-2 group-hover:text-indigo-600 transition-colors">{product.name}</h3>
              <p className="text-2xl font-black text-slate-900">${product.price.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-500 font-medium">No encontramos componentes que coincidan con tu búsqueda.</p>
          <button onClick={() => { setSearchQuery(''); setSelectedCategory('Todos'); }} className="mt-4 text-indigo-600 font-bold hover:underline">Ver todo el catálogo</button>
        </div>
      )}
    </div>
  );
};

export default Catalog;
