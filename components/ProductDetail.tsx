
import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, CheckCircle, Info, BookOpen, Lightbulb, ArrowLeft, Cpu } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
        <ArrowLeft size={20} /> Volver al Catálogo
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Left: Media */}
        <div className="relative h-[400px] lg:h-auto bg-slate-50">
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
          <div className="absolute top-6 left-6 flex gap-2">
             <span className="bg-slate-900 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">{product.category}</span>
          </div>
          <div className="absolute bottom-6 left-6">
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-xl inline-flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center text-[10px] font-black">U{i}</div>)}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">+500 Compras este mes</p>
            </div>
          </div>
        </div>

        {/* Right: Info */}
        <div className="p-8 md:p-16 flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
               <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(product.rating) ? "currentColor" : "none"} />)}
               </div>
               <span className="text-sm font-black text-slate-800">{product.rating} (124 reviews)</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight mb-4 tracking-tighter">{product.name}</h1>
            <p className="text-lg text-slate-500 leading-relaxed font-medium">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precio de Lista</p>
              <p className="text-4xl font-black text-slate-900">${product.price.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-2">Stock Disponible</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" size={24} />
                <p className="text-2xl font-black text-green-700">{product.stock} Unidades</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex gap-4">
                <BookOpen className="text-indigo-600 shrink-0" />
                <div>
                   <h4 className="font-black text-sm uppercase text-indigo-900 mb-1">Guía del Ingeniero</h4>
                   <p className="text-sm text-indigo-800/80 leading-relaxed">{product.guide}</p>
                </div>
             </div>
             <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100 flex gap-4">
                <Lightbulb className="text-yellow-600 shrink-0" />
                <div>
                   <h4 className="font-black text-sm uppercase text-yellow-900 mb-1">Osart Pro-Tip</h4>
                   <p className="text-sm text-yellow-800/80 italic leading-relaxed">"{product.proTip}"</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-grow bg-slate-900 text-white py-5 rounded-2xl font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3"
            >
              <ShoppingCart size={24} /> Agregar al Proyecto
            </button>
            <button className="sm:w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 transition-colors">
               <Star size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Specs Section */}
      <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-100">
        <h3 className="text-3xl font-black mb-10 flex items-center gap-4">
          <Cpu className="text-indigo-600" /> Especificaciones Técnicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {Object.entries(product.specs).map(([key, value]) => (
             <div key={key} className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-500 text-sm">{key}</span>
                <span className="font-black text-slate-900">{value}</span>
             </div>
           ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
