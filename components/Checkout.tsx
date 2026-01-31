
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Truck, Mail, Phone, User as UserIcon, 
  CheckCircle, Package, ChevronRight, CreditCard, ShieldCheck, 
  Globe, Cpu, ShoppingBag, Terminal, Lock, ClipboardCheck
} from 'lucide-react';
import { CartItem, User, ShippingDetails, Sale } from '../types';

interface CheckoutProps {
  items: CartItem[];
  user: User | null;
  onComplete: (sale: Sale) => void;
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
    region: 'Metropolitana',
    zipCode: ''
  });

  const subtotal = useMemo(() => items.reduce((a, b) => a + (b.price * b.quantity), 0), [items]);
  const shippingCost = formData.region === 'Metropolitana' ? 0 : 5490;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    const newSale: Sale = {
      id: `OS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toLocaleDateString('es-CL'),
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: items.map(i => ({ name: i.name, q: i.quantity, price: i.price })),
      subtotal: subtotal,
      discount: 0,
      total: total,
      status: 'paid'
    };
    onComplete(newSale);
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Stepper Pro Visual */}
      <div className="flex items-center justify-between mb-20 max-w-2xl mx-auto px-6 relative">
         <div className="absolute top-7 left-10 right-10 h-0.5 bg-slate-100 -z-10" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center gap-4 relative z-10">
            <motion.div 
              animate={{ scale: step === s ? 1.1 : 1 }}
              className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-700 border-2 ${
              step === s ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl' : 
              step > s ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-300'
            }`}>
              {step > s ? <CheckCircle size={24} /> : <span className="font-black text-lg">{s}</span>}
            </motion.div>
            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${step >= s ? 'text-slate-900' : 'text-slate-300'}`}>
               {s === 1 ? 'Logística' : s === 2 ? 'Finanzas' : 'Auditoría'}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><MapPin size={24} /></div>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Nodo de Entrega</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nombre de Arquitecto" icon={UserIcon} value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} />
                    <InputField label="Email Protocol" icon={Mail} type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                    <InputField label="Canal de Contacto" icon={Phone} type="tel" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                    <InputField label="Ciudad / Hub" icon={Globe} value={formData.city} onChange={v => setFormData({...formData, city: v})} />
                    <div className="md:col-span-2">
                       <InputField label="Dirección de Despliegue Crítico" icon={Package} value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><CreditCard size={24} /></div>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Protocolo de Pago</h3>
                  </div>
                  <div className="space-y-5">
                    <PaymentOption id="webpay" name="Webpay Plus" detail="Tarjeta Crédito/Débito Bancario" icon={ShieldCheck} selected />
                    <PaymentOption id="transfer" name="Transferencia Hub" detail="Confirmación por reporte técnico" icon={Terminal} />
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><ClipboardCheck size={24} /></div>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Validación Final</h3>
                  </div>
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Cpu size={120} /></div>
                    <div className="flex justify-between relative z-10">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Destinatario Validado</p>
                          <p className="text-xl font-black text-slate-950 leading-tight">{formData.fullName}</p>
                          <p className="text-sm text-slate-500">{formData.address}, {formData.city}</p>
                       </div>
                       <button type="button" onClick={() => setStep(1)} className="text-indigo-600 font-black text-[10px] uppercase">Modificar</button>
                    </div>
                    <div className="h-px bg-slate-200" />
                    <div className="space-y-1 relative z-10">
                       <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Contacto Directo</p>
                       <p className="text-lg font-black text-slate-900 leading-tight">{formData.email}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-6 pt-10">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-10 py-5 rounded-[2rem] border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all">Atrás</button>
              )}
              <button 
                type="submit"
                className="flex-grow bg-slate-950 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4"
              >
                {step === 3 ? 'AUTORIZAR DESPLIEGUE' : 'CONTINUAR PROTOCOLO'}
                <ChevronRight size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Resumen Rack */}
        <div className="lg:col-span-5">
           <div className="bg-slate-950 p-10 rounded-[4rem] text-white space-y-10 sticky top-32 border border-white/5">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
                  <ShoppingBag size={22} className="text-indigo-500" /> Reporte de Carga
                </h4>
              </div>
              
              <div className="space-y-5 max-h-[350px] overflow-y-auto pr-4 scrollbar-hide">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5">
                        <img src={item.image} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-white uppercase">{item.name.split(' ').slice(0,2).join(' ')}</p>
                        <p className="text-[10px] text-slate-500 font-black">QTY: {item.quantity} UNITS</p>
                      </div>
                    </div>
                    <p className="text-sm font-black text-indigo-400">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-5 pt-8 border-t border-white/10">
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                  <span>Subtotal Hardware</span>
                  <span className="text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                  <span>Logística Zone</span>
                  <span className={shippingCost === 0 ? 'text-green-500' : 'text-white'}>
                    {shippingCost === 0 ? 'STATUS: FREE' : `$${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                <div className="pt-6 flex flex-col items-end gap-1">
                   <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em]">Total Inversión</p>
                   <p className="text-5xl font-black text-white tracking-tighter">${total.toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-8 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-t border-white/5">
                 <Lock size={16} className="text-indigo-500" /> SECURE CHANNEL: ACTIVE
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{ label: string, icon: any, value: string, onChange: (v: string) => void, type?: string }> = ({ label, icon: Icon, value, onChange, type = 'text' }) => (
  <div className="space-y-3 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
      <input 
        type={type} required value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-[11px] text-slate-950 uppercase tracking-widest"
      />
    </div>
  </div>
);

const PaymentOption: React.FC<{ id: string, name: string, detail: string, icon: any, selected?: boolean }> = ({ id, name, detail, icon: Icon, selected }) => (
  <div className={`p-8 rounded-[2.5rem] border-2 flex items-center justify-between cursor-pointer transition-all ${selected ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
    <div className="flex items-center gap-6">
      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center ${selected ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400'}`}>
        <Icon size={28} />
      </div>
      <div>
        <p className={`font-black uppercase text-sm ${selected ? 'text-indigo-950' : 'text-slate-900'}`}>{name}</p>
        <p className="text-xs text-slate-500 font-bold uppercase mt-0.5">{detail}</p>
      </div>
    </div>
    <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center ${selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-100'}`}>
      {selected && <div className="w-2.5 h-2.5 bg-white rounded-full shadow-lg" />}
    </div>
  </div>
);

export default Checkout;
