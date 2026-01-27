
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Star, ShoppingCart, CheckCircle, BookOpen, Lightbulb, 
  ArrowLeft, Cpu, MessageCircle, ShieldCheck, Box, 
  Settings, Zap, Layers, Info
} from 'lucide-react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onBack: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onAddToCart, onBack }) => {
  const handleWhatsAppClick = () => {
    const message = `¡Hola Osart Elite! 🚀 Me interesa este componente: ${product.name}. 
Precio: $${product.price.toLocaleString()}
¿Cuentan con despacho hoy?`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/56987654321?text=${encodedMessage}`, '_blank');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="max-w-7xl mx-auto space-y-8"
    >
      <button 
        onClick={onBack} 
        className="group flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-all"
      >
        <div className="bg-white p-2 rounded-xl shadow-sm group-hover:bg-blue-50 transition-colors">
          <ArrowLeft size={18} />
        </div>
        Volver al Catálogo
      </button>

      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* Sección de Medios */}
        <div className="relative h-[450px] lg:h-auto bg-slate-50 overflow-hidden group">
          <motion.img 
            layoutId={`product-image-${product.id}`}
            src={product.image} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
            alt={product.name} 
          />
          <div className="absolute top-8 left-8 flex flex-col gap-2">
             <span className="bg-blue-600 text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-2 w-fit">
               <Cpu size={14} /> CERTIFICADO OSART
             </span>
             <span className="bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black text-slate-800 shadow-sm w-fit border border-slate-100">
               {product.category}
             </span>
          </div>
          
          <div className="absolute bottom-8 left-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/90 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 shadow-2xl flex items-center gap-5 text-white"
            >
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Ventas Técnicas</p>
                <p className="text-xs font-bold text-slate-100">+500 pedidos este mes</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Sección de Información */}
        <div className="p-8 md:p-16 flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6">
               <div className="flex items-center gap-1 text-yellow-400 bg-yellow-50 px-3 py-1.5 rounded-full border border-yellow-100">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm font-black">{product.rating}</span>
               </div>
               <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Suministro de Grado Industrial</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight mb-6 tracking-tighter">{product.name}</h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-slate-50 p-7 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl transition-all">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Precio Neto</p>
              <p className="text-5xl font-black text-slate-900 tracking-tighter">${product.price.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 p-7 rounded-[2.5rem] border border-blue-100 relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-blue-500/10 rounded-full group-hover:scale-[5] transition-transform duration-700"></div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2 relative z-10">Inventario Real-Time</p>
              <div className="flex items-center gap-3 relative z-10">
                <CheckCircle className="text-blue-600" size={28} />
                <p className="text-3xl font-black text-blue-700">{product.stock} unids</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-slate-100">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                   <h4 className="font-black text-xs uppercase text-slate-900 mb-1 tracking-widest">Ficha de Ingeniería</h4>
                   <p className="text-sm text-slate-600 leading-relaxed font-semibold">{product.guide}</p>
                </div>
             </div>
             <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex gap-5">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0 border border-red-100">
                  <Lightbulb className="text-red-600" size={24} />
                </div>
                <div>
                   <h4 className="font-black text-xs uppercase text-red-900 mb-1 tracking-widest">Osart Expert Tip</h4>
                   <p className="text-sm text-red-800 leading-relaxed font-bold italic">"{product.proTip}"</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button 
              onClick={() => onAddToCart(product)}
              className="flex-grow bg-[#3483fa] text-white py-6 rounded-2xl font-black text-xl hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <ShoppingCart size={26} /> Agregar al Carrito
            </button>
            
            <button 
              onClick={handleWhatsAppClick}
              className="sm:w-20 w-full h-18 sm:h-auto bg-green-600 text-white p-4 rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center shadow-lg shadow-green-600/20 group"
              title="Consulta Venta Directa"
            >
              <MessageCircle size={30} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] pt-2">
            <ShieldCheck size={16} className="text-green-500" /> Garantía de Satisfacción Técnica 12 Meses
          </div>
        </div>
      </div>

      {/* Sección de Especificaciones Expandida */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl border border-slate-100"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shadow-inner">
              <Layers size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">Especificaciones Técnicas</h3>
              <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Protocolo de Datos Osart Elite</p>
            </div>
          </div>
          <div className="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 flex items-center gap-3">
             <Info size={18} className="text-blue-600" />
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sujeto a cambios del fabricante</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 group hover:border-blue-500 hover:bg-white transition-all hover:shadow-xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-slate-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                 {key === 'Micro' || key === 'Tipo' ? <Cpu size={24} /> : 
                  key === 'Voltaje' || key === 'Potencia' ? <Zap size={24} /> : 
                  <Settings size={24} />}
              </div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{key}</p>
              <p className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors">{value}</p>
            </div>
          ))}
          <div className="bg-slate-900 text-white p-8 rounded-[2rem] flex flex-col justify-center items-center text-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Box size={32} className="text-blue-400 mb-4" />
             <p className="font-black text-sm uppercase tracking-widest mb-2">Envío Regional</p>
             <p className="text-xs font-medium text-slate-400">Protección ESD y embalaje reforzado incluido.</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProductDetail;
