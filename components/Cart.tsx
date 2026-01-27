
import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CreditCard, ShieldCheck } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemove: (id: number) => void;
  onCheckout: () => void;
  onBack: () => void;
}

const Cart: React.FC<CartProps> = ({ items, onUpdateQuantity, onRemove, onCheckout, onBack }) => {
  const subtotal = items.reduce((a, b) => a + (b.price * b.quantity), 0);

  if (items.length === 0) {
    return (
      <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-slate-200">
        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">Tu carrito está vacío</h2>
        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Parece que aún no has añadido componentes a tu próximo gran proyecto.</p>
        <button onClick={onBack} className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold">Ir al Catálogo</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} /> Continuar Comprando
        </button>
        <h2 className="text-3xl font-black text-slate-900">Tu Carrito ({items.length})</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 flex gap-6 items-center"
            >
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-slate-50 shrink-0 border border-slate-100">
                <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
              </div>
              <div className="flex-grow">
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-1">{item.category}</p>
                <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-1">{item.name}</h3>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 hover:text-indigo-600 transition-colors">
                      <Minus size={18} />
                    </button>
                    <span className="font-black w-4 text-center">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 hover:text-indigo-600 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                  <p className="text-xl font-black text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </div>
              <button 
                onClick={() => onRemove(item.id)}
                className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
              >
                <Trash2 size={20} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 sticky top-24">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Resumen</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>Envío</span>
                <span className="text-green-600 font-bold">Gratis</span>
              </div>
              <div className="h-px bg-slate-100 my-6"></div>
              <div className="flex justify-between text-3xl font-black text-slate-900">
                <span>Total</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3"
            >
              <CreditCard size={22} /> Finalizar Compra
            </button>
            <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-sm font-medium">
              <ShieldCheck size={18} /> Transacciones Seguras SSL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
