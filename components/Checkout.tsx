
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Truck, Mail, Phone, User as UserIcon, 
  CheckCircle, Package, ChevronRight, CreditCard, ShieldCheck,
  Globe, Navigation
} from 'lucide-react';
import { CartItem, User, ShippingDetails } from '../types';
import { saveOrderToSupabase } from '../services/supabase';

interface CheckoutProps {
  items: CartItem[];
  user: User | null;
  onComplete: () => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, user, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    region: '',
    zipCode: ''
  });

  const [loading, setLoading] = useState(false);
  const subtotal = items.reduce((a, b) => a + (b.price * b.quantity), 0);

  const handleNextStep = () => setStep(prev => prev + 1);
  const handlePrevStep = () => step === 1 ? onBack() : setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Integración con Supabase
    const orderData = {
      user_id: user?.id || 'guest',
      items: items.map(i => ({ id: i.id, q: i.quantity })),
      total: subtotal,
      shipping: formData,
      created_at: new Date().toISOString()
    };

    await saveOrderToSupabase(orderData);
    
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      <div className="flex items-center justify-between mb-12">
        <button onClick={handlePrevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-indigo-600 transition-colors">
          <ArrowLeft size={20} /> {step === 1 ? 'Volver al Carrito' : 'Regresar'}
        </button>
        
        <div className="flex items-center gap-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'bg-slate-200 text-slate-400'}`}>
                {step > s ? <CheckCircle size={20} /> : s}
              </div>
              {s < 3 && <div className={`w-12 h-1 mx-2 rounded-full ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-slate-100">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <Mail className="text-indigo-600" /> Contacto Directo
                </h2>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Nombre Completo</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" placeholder="Juan Pérez" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Email de Seguimiento</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" placeholder="juan@ejemplo.com" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Teléfono</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" placeholder="+56 9 1234 5678" />
                    </div>
                  </div>
                </div>
                <button onClick={handleNextStep} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
                  Continuar a Ubicación <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <MapPin className="text-indigo-600" /> Datos de Ubicación
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex items-center gap-4 mb-4">
                    <Globe className="text-indigo-600 animate-spin-slow" />
                    <p className="text-xs font-bold text-indigo-900 leading-tight">Calculamos el tiempo de entrega basándonos en tu ubicación exacta.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Dirección Exacta</label>
                    <div className="relative">
                      <Navigation className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" placeholder="Calle, Número, Depto" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Ciudad</label>
                      <input required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 ml-1">Región</label>
                      <input required value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Código Postal</label>
                    <input required value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium" placeholder="1234567" />
                  </div>
                </div>
                <button onClick={handleNextStep} className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
                  Continuar al Pago <ChevronRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                  <CreditCard className="text-indigo-600" /> Método de Pago
                </h2>
                <div className="space-y-4">
                  <div className="p-6 rounded-3xl border-2 border-indigo-600 bg-indigo-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white">
                        <Globe size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Transferencia Bancaria / Webpay</p>
                        <p className="text-xs text-slate-500 font-medium">Pago seguro procesado por Transbank</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-indigo-600 bg-white"></div>
                  </div>
                  
                  <div className="p-6 rounded-3xl border border-slate-200 flex items-center justify-between opacity-50 grayscale">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Cripto (Próximamente)</p>
                        <p className="text-xs text-slate-500 font-medium">Bitcoin, Ethereum, USDC</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-2 border-slate-200 bg-white"></div>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        Finalizando...
                      </div>
                    ) : (
                      <>Confirmar Compra por ${subtotal.toLocaleString()}</>
                    )}
                  </button>
                  <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
                    <ShieldCheck size={18} className="text-green-500" /> Transacción Encriptada AES-256
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resumen Lateral */}
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white self-start lg:sticky lg:top-24 shadow-2xl">
          <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
            <Package className="text-indigo-400" /> Resumen de Ingeniería
          </h3>
          <div className="space-y-6 mb-10 overflow-y-auto max-h-80 pr-2 scrollbar-hide">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center gap-4 group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/10 shrink-0 border border-white/5 p-1 group-hover:scale-105 transition-transform">
                    <img src={item.image} className="w-full h-full object-cover rounded-xl" alt={item.name} />
                  </div>
                  <div>
                    <p className="font-bold line-clamp-1 group-hover:text-indigo-400 transition-colors">{item.name}</p>
                    <p className="text-slate-400 text-xs font-medium">{item.quantity} unidades</p>
                  </div>
                </div>
                <p className="font-black text-indigo-400">${(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/10 pt-8 space-y-4">
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-medium">
              <span>Envío (Turbo Express)</span>
              <span className="text-green-400 font-black">GRATIS</span>
            </div>
            <div className="flex justify-between text-4xl font-black pt-4 text-white">
              <span>Total</span>
              <span className="text-indigo-400">${subtotal.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="mt-10 bg-white/5 p-6 rounded-[2rem] border border-white/10 flex gap-4 backdrop-blur-sm">
            <Truck className="text-indigo-400 shrink-0" size={24} />
            <div>
              <p className="text-xs text-white font-bold mb-1">Entrega Garantizada</p>
              <p className="text-[10px] text-slate-400 leading-relaxed uppercase tracking-widest">
                Envío prioritario con seguimiento en tiempo real vía Supabase Cloud.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
