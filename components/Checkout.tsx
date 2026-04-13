
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, Mail, Phone, User as UserIcon, 
  CheckCircle, Package, ChevronRight, CreditCard, ShieldCheck, 
  Globe, Cpu, ShoppingBag, Terminal, Lock, ClipboardCheck,
  Banknote, ArrowLeft, Loader2, CheckCheck
} from 'lucide-react';
import { CartItem, User, ShippingDetails, Sale } from '../types';

type PaymentMethod = 'webpay' | 'mercadopago' | 'transfer';

interface CardData {
  number: string;
  name: string;
  expiry: string;
  cvv: string;
}

interface CheckoutProps {
  items: CartItem[];
  user: User | null;
  onComplete: (sale: Sale) => void;
  onBack: () => void;
}

const REGIONS = [
  'Arica y Parinacota','Tarapacá','Antofagasta','Atacama','Coquimbo',
  'Valparaíso','Metropolitana','Libertador Gral. B. O\'Higgins','Maule',
  'Ñuble','Biobío','La Araucanía','Los Ríos','Los Lagos',
  'Aysén','Magallanes'
];

const formatCardNumber = (v: string) => v.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
const formatExpiry   = (v: string) => { const d = v.replace(/\D/g,'').slice(0,4); return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d; };

const Checkout: React.FC<CheckoutProps> = ({ items, user, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('webpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardData, setCardData] = useState<CardData>({ number: '', name: '', expiry: '', cvv: '' });
  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    region: 'Metropolitana',
    zipCode: ''
  });

  const subtotal    = useMemo(() => items.reduce((a, b) => a + (b.price * b.quantity), 0), [items]);
  const shippingCost = formData.region === 'Metropolitana' ? 0 : 5490;
  const total       = subtotal + shippingCost;

  const simulatePayment = async (): Promise<boolean> => {
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    setIsProcessing(false);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const ok = await simulatePayment();
    if (!ok) return;

    const newSale: Sale = {
      id: `OS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      date: new Date().toLocaleDateString('es-CL'),
      customerEmail: formData.email,
      customerPhone: formData.phone,
      items: items.map(i => ({ name: i.name, q: i.quantity, price: i.price })),
      subtotal,
      discount: 0,
      total,
      status: 'paid'
    };
    onComplete(newSale);
  };

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Stepper */}
      <div className="flex items-center justify-between mb-16 max-w-2xl mx-auto px-6 relative">
        <div className="absolute top-7 left-10 right-10 h-0.5 bg-slate-100 -z-10" />
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center gap-4 relative z-10">
            <motion.div 
              animate={{ scale: step === s ? 1.1 : 1 }}
              className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-700 border-2 ${
                step === s  ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200' : 
                step > s    ? 'bg-green-500 border-green-500 text-white' 
                            : 'bg-white border-slate-200 text-slate-300'}`}
            >
              {step > s ? <CheckCircle size={24} /> : <span className="font-black text-lg">{s}</span>}
            </motion.div>
            <span className={`text-[9px] font-black uppercase tracking-[0.3em] ${step >= s ? 'text-slate-900' : 'text-slate-300'}`}>
              {s === 1 ? 'Envío' : s === 2 ? 'Pago' : 'Revisión'}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-12">
            <AnimatePresence mode="wait">

              {/* ── PASO 1: ENVÍO ── */}
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><MapPin size={24} /></div>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Datos de Envío</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField label="Nombre Completo" icon={UserIcon}  value={formData.fullName} onChange={v => setFormData({...formData, fullName: v})} />
                    <InputField label="Correo Electrónico" icon={Mail}   type="email" value={formData.email} onChange={v => setFormData({...formData, email: v})} />
                    <InputField label="Teléfono" icon={Phone}            type="tel" value={formData.phone} onChange={v => setFormData({...formData, phone: v})} />
                    <InputField label="Ciudad" icon={Globe}              value={formData.city} onChange={v => setFormData({...formData, city: v})} />
                    <div className="md:col-span-2">
                      <InputField label="Dirección Completa" icon={Package} value={formData.address} onChange={v => setFormData({...formData, address: v})} />
                    </div>
                    <SelectField label="Región" value={formData.region} onChange={v => setFormData({...formData, region: v})} options={REGIONS} />
                    <InputField label="Código Postal" icon={MapPin}     value={formData.zipCode} onChange={v => setFormData({...formData, zipCode: v})} required={false} />
                  </div>
                </motion.div>
              )}

              {/* ── PASO 2: PAGO ── */}
              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><CreditCard size={24} /></div>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Método de Pago</h3>
                  </div>

                  <div className="space-y-4">
                    <PaymentOption
                      id="webpay"
                      name="Webpay Plus"
                      detail="Crédito / Débito / Prepago — Transbank"
                      icon={ShieldCheck}
                      selected={paymentMethod === 'webpay'}
                      onSelect={() => setPaymentMethod('webpay')}
                    />
                    <PaymentOption
                      id="mercadopago"
                      name="MercadoPago"
                      detail="Tarjeta, cuotas sin interés disponibles"
                      icon={CreditCard}
                      selected={paymentMethod === 'mercadopago'}
                      onSelect={() => setPaymentMethod('mercadopago')}
                    />
                    <PaymentOption
                      id="transfer"
                      name="Transferencia Bancaria"
                      detail="Datos se envían al correo — confirmación manual"
                      icon={Banknote}
                      selected={paymentMethod === 'transfer'}
                      onSelect={() => setPaymentMethod('transfer')}
                    />
                  </div>

                  {/* Formulario de tarjeta solo para webpay / mercadopago */}
                  <AnimatePresence>
                    {(paymentMethod === 'webpay' || paymentMethod === 'mercadopago') && (
                      <motion.div
                        key="card-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-gradient-to-br from-slate-950 to-indigo-950 rounded-[3rem] p-8 space-y-6 border border-white/5">
                          {/* Vista tarjeta */}
                          <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-6 text-white space-y-4 shadow-2xl">
                            <div className="flex justify-between items-start">
                              <div className="space-y-0.5">
                                <p className="text-[8px] font-black uppercase tracking-widest text-indigo-200">Osart Pay</p>
                                <p className="text-[10px] font-bold text-indigo-200">{paymentMethod === 'webpay' ? 'Transbank WebPay Plus' : 'MercadoPago'}</p>
                              </div>
                              <CreditCard size={28} className="text-indigo-300" />
                            </div>
                            <p className="text-xl font-black tracking-[0.3em] mt-2 font-mono">
                              {cardData.number || '•••• •••• •••• ••••'}
                            </p>
                            <div className="flex justify-between items-end">
                              <div>
                                <p className="text-[8px] text-indigo-300 uppercase tracking-widest">Titular</p>
                                <p className="text-sm font-black uppercase">{cardData.name || 'NOMBRE TITULAR'}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-[8px] text-indigo-300 uppercase tracking-widest">Vencimiento</p>
                                <p className="text-sm font-black">{cardData.expiry || 'MM/AA'}</p>
                              </div>
                            </div>
                          </div>

                          {/* Campos */}
                          <div className="grid grid-cols-1 gap-4">
                            <CardInputField
                              label="Número de Tarjeta"
                              placeholder="1234 5678 9012 3456"
                              value={cardData.number}
                              maxLength={19}
                              onChange={v => setCardData(c => ({ ...c, number: formatCardNumber(v) }))}
                            />
                            <CardInputField
                              label="Nombre en la Tarjeta"
                              placeholder="JUAN PÉREZ"
                              value={cardData.name}
                              onChange={v => setCardData(c => ({ ...c, name: v.toUpperCase() }))}
                            />
                            <div className="grid grid-cols-2 gap-4">
                              <CardInputField
                                label="Vencimiento"
                                placeholder="MM/AA"
                                value={cardData.expiry}
                                maxLength={5}
                                onChange={v => setCardData(c => ({ ...c, expiry: formatExpiry(v) }))}
                              />
                              <CardInputField
                                label="CVV"
                                placeholder="123"
                                value={cardData.cvv}
                                maxLength={4}
                                onChange={v => setCardData(c => ({ ...c, cvv: v.replace(/\D/g,'').slice(0,4) }))}
                                type="password"
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {paymentMethod === 'transfer' && (
                      <motion.div
                        key="transfer-info"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 space-y-4">
                          <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Datos Bancarios</p>
                          <div className="space-y-2 text-sm font-bold text-slate-700">
                            <p>Banco: <span className="text-slate-950">Banco Estado</span></p>
                            <p>Cuenta Corriente: <span className="text-slate-950">0123456789</span></p>
                            <p>RUT: <span className="text-slate-950">76.543.210-K</span></p>
                            <p>Nombre: <span className="text-slate-950">OSART Elite SpA</span></p>
                            <p>Email: <span className="text-indigo-600">pagos@osart.cl</span></p>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold mt-4">Envía el comprobante a pagos@osart.cl para confirmar tu pedido en máximo 24h.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* ── PASO 3: REVISIÓN FINAL ── */}
              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-10">
                  <div className="flex items-center gap-5">
                    <div className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl"><ClipboardCheck size={24} /></div>
                    <h3 className="text-3xl font-black text-slate-950 tracking-tighter uppercase">Confirmar Pedido</h3>
                  </div>

                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Cpu size={120} /></div>
                    <div className="flex justify-between relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Destinatario</p>
                        <p className="text-xl font-black text-slate-950 leading-tight">{formData.fullName}</p>
                        <p className="text-sm text-slate-500">{formData.address}, {formData.city}, {formData.region}</p>
                      </div>
                      <button type="button" onClick={() => setStep(1)} className="text-indigo-600 font-black text-[10px] uppercase hover:underline">Editar</button>
                    </div>
                    <div className="h-px bg-slate-200" />
                    <div className="flex justify-between relative z-10">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Método de Pago</p>
                        <p className="text-lg font-black text-slate-900 leading-tight capitalize">
                          {paymentMethod === 'webpay' ? 'Webpay Plus' : paymentMethod === 'mercadopago' ? 'MercadoPago' : 'Transferencia Bancaria'}
                        </p>
                        {(paymentMethod === 'webpay' || paymentMethod === 'mercadopago') && cardData.number && (
                          <p className="text-sm text-slate-500 font-mono">•••• •••• •••• {cardData.number.replace(/\s/g,'').slice(-4)}</p>
                        )}
                      </div>
                      <button type="button" onClick={() => setStep(2)} className="text-indigo-600 font-black text-[10px] uppercase hover:underline">Editar</button>
                    </div>
                    <div className="h-px bg-slate-200" />
                    <div className="space-y-1 relative z-10">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Contacto</p>
                      <p className="text-base font-black text-slate-900">{formData.email}</p>
                      <p className="text-base font-black text-slate-900">{formData.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-5 bg-green-50 border border-green-100 rounded-[2rem]">
                    <CheckCheck size={20} className="text-green-600 shrink-0" />
                    <p className="text-xs font-bold text-green-800">
                      Al confirmar aceptas los <span className="font-black underline cursor-pointer">términos y condiciones</span> de Osart Elite.
                    </p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>

            <div className="flex items-center gap-6 pt-10">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} disabled={isProcessing} className="flex items-center gap-2 px-8 py-5 rounded-[2rem] border border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50 transition-all disabled:opacity-50">
                  <ArrowLeft size={16} /> Atrás
                </button>
              )}
              <button 
                type="submit"
                disabled={isProcessing}
                className="flex-grow bg-slate-950 text-white py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <><Loader2 size={20} className="animate-spin" /> Procesando Pago...</>
                ) : step === 3 ? (
                  <><Lock size={16} /> Confirmar y Pagar ${total.toLocaleString('es-CL')}</>
                ) : (
                  <>Continuar <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Sidebar Resumen ── */}
        <div className="lg:col-span-5">
          <div className="bg-slate-950 p-10 rounded-[4rem] text-white space-y-10 sticky top-32 border border-white/5">
            <h4 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <ShoppingBag size={22} className="text-indigo-500" /> Resumen
            </h4>

            <div className="space-y-5 max-h-[350px] overflow-y-auto pr-4 scrollbar-hide">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-3xl border border-white/5">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5">
                      <img src={item.image} className="w-full h-full object-contain" alt={item.name} loading="lazy" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase leading-tight">{item.name.split(' ').slice(0,3).join(' ')}</p>
                      <p className="text-[10px] text-slate-500 font-black mt-0.5">x{item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-indigo-400">${(item.price * item.quantity).toLocaleString('es-CL')}</p>
                </div>
              ))}
            </div>

            <div className="space-y-5 pt-8 border-t border-white/10">
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                <span>Subtotal</span>
                <span className="text-white">${subtotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black uppercase text-slate-500">
                <span>Envío</span>
                <span className={shippingCost === 0 ? 'text-green-500' : 'text-white'}>
                  {shippingCost === 0 ? 'GRATIS' : `$${shippingCost.toLocaleString('es-CL')}`}
                </span>
              </div>
              <div className="pt-6 flex flex-col items-end gap-1">
                <p className="text-[10px] font-black uppercase text-indigo-500 tracking-[0.4em]">Total</p>
                <p className="text-5xl font-black text-white tracking-tighter">${total.toLocaleString('es-CL')}</p>
              </div>
            </div>

            <div className="pt-8 flex items-center justify-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500 border-t border-white/5">
              <Lock size={16} className="text-indigo-500" /> Canal Seguro Activo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Subcomponentes ─── */

const InputField: React.FC<{
  label: string; icon: any; value: string; onChange: (v: string) => void;
  type?: string; required?: boolean;
}> = ({ label, icon: Icon, value, onChange, type = 'text', required = true }) => (
  <div className="space-y-3 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <Icon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
      <input 
        type={type} required={required} value={value} onChange={e => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-[11px] text-slate-950 uppercase tracking-widest"
      />
    </div>
  </div>
);

const SelectField: React.FC<{ label: string; value: string; onChange: (v: string) => void; options: string[] }> = ({ label, value, onChange, options }) => (
  <div className="space-y-3 group">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <select
      required value={value} onChange={e => onChange(e.target.value)}
      className="w-full bg-slate-50 border border-slate-100 rounded-[1.5rem] py-5 px-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-[11px] text-slate-950 uppercase tracking-widest appearance-none cursor-pointer"
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const CardInputField: React.FC<{ label: string; placeholder: string; value: string; onChange: (v: string) => void; maxLength?: number; type?: string }> = ({ label, placeholder, value, onChange, maxLength, type = 'text' }) => (
  <div className="space-y-2">
    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <input
      type={type} placeholder={placeholder} value={value}
      maxLength={maxLength} onChange={e => onChange(e.target.value)}
      className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 px-5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all font-black text-sm text-white placeholder:text-white/20 tracking-widest"
    />
  </div>
);

const PaymentOption: React.FC<{ id: string; name: string; detail: string; icon: any; selected: boolean; onSelect: () => void }> = ({ name, detail, icon: Icon, selected, onSelect }) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full p-6 rounded-[2.5rem] border-2 flex items-center justify-between cursor-pointer transition-all text-left ${selected ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-slate-100 bg-white hover:border-indigo-200 hover:shadow-sm'}`}
  >
    <div className="flex items-center gap-5">
      <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center ${selected ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-slate-50 text-slate-400'}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className={`font-black uppercase text-sm ${selected ? 'text-indigo-950' : 'text-slate-900'}`}>{name}</p>
        <p className="text-xs text-slate-500 font-bold mt-0.5">{detail}</p>
      </div>
    </div>
    <div className={`w-7 h-7 rounded-full border-4 flex items-center justify-center shrink-0 ${selected ? 'border-indigo-600 bg-indigo-600' : 'border-slate-200'}`}>
      {selected && <div className="w-2 h-2 bg-white rounded-full" />}
    </div>
  </button>
);

export default Checkout;
