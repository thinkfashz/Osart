
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
      <div className="text-center py-48 bg-white space-y-8">
        <div className="w-24 h-24 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShoppingCart size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Your cart is empty</h2>
          <p className="text-slate-400 font-medium">Add components to start your project.</p>
        </div>
        <button 
          onClick={onBack} 
          className="bg-indigo-600 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-10">
      <div className="flex items-center justify-between">
        <h2 className="text-4xl font-black text-slate-950 tracking-tighter">Your Bag</h2>
        <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{items.length} Items</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8">
          {items.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-8 items-start pb-8 border-b border-slate-100 group"
            >
              <div className="w-32 h-32 bg-[#f2f2f7] rounded-[2rem] flex items-center justify-center p-4 shrink-0 transition-transform group-hover:scale-105 duration-500">
                <img src={item.image} className="w-full h-full object-contain" alt={item.name} />
              </div>
              <div className="flex-grow space-y-2 pt-2">
                <div className="flex justify-between items-start">
                   <div>
                     <h3 className="font-black text-slate-900 text-lg leading-tight">{item.name}</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.category}</p>
                   </div>
                   <p className="text-xl font-black text-slate-950">${(item.price * item.quantity).toLocaleString()}</p>
                </div>
                
                <div className="flex items-center justify-between pt-6">
                  <div className="flex items-center gap-6 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                    <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Minus size={16} />
                    </button>
                    <span className="font-black text-sm text-slate-900">{item.quantity}</span>
                    <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-slate-400 hover:text-indigo-600 transition-colors">
                      <Plus size={16} />
                    </button>
                  </div>
                  <button 
                    onClick={() => onRemove(item.id)}
                    className="text-[10px] font-black uppercase text-red-500 hover:text-red-600 transition-colors tracking-widest"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-[#fcfcfd] p-10 rounded-[2.5rem] border border-slate-100 space-y-8">
            <h3 className="text-2xl font-black text-slate-950 tracking-tight">Order Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span>Subtotal</span>
                <span className="text-slate-950">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                <span>Shipping</span>
                <span className="text-green-600 font-black">Free</span>
              </div>
              <div className="h-px bg-slate-100 my-8"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Total</span>
                <span className="text-3xl font-black text-slate-950">${subtotal.toLocaleString()}</span>
              </div>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-indigo-600 text-white py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-100"
            >
              Checkout Now
            </button>
            <div className="pt-4 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck size={16} /> Verified Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
