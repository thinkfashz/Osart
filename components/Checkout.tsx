
import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Truck, Mail, Phone, User as UserIcon, 
  CheckCircle, Package, ChevronRight, CreditCard, ShieldCheck,
  Globe, Navigation, AlertCircle, Info, Key, RefreshCw
} from 'lucide-react';
import { CartItem, User, ShippingDetails } from '../types';
import { saveOrderToSupabase } from '../services/supabase';
import { calculateShipping } from '../tools/shipping_calculator';
import { generateOTP, simulateSendOTP, validateOTP } from '../tools/otp_manager';

interface CheckoutProps {
  items: CartItem[];
  user: User | null;
  onComplete: () => void;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, user, onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpInput, setOtpInput] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState(false);

  const [formData, setFormData] = useState<ShippingDetails>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    region: 'Metropolitana',
    zipCode: ''
  });

  const [loading, setLoading] = useState(false);
  const subtotal = useMemo(() => items.reduce((a, b) => a + (b.price * b.quantity), 0), [items]);
  
  const shippingCost = useMemo(() => 
    calculateShipping(formData.region, items.reduce((a, b) => a + b.quantity, 0)),
    [formData.region, items]
  );

  const total = subtotal + shippingCost;

  const handleNextStep = () => {
    if (step === 1 && !isVerified) {
      handleStartVerification();
      return;
    }
    setStep(prev => prev + 1);
  };

  const handlePrevStep = () => step === 1 ? onBack() : setStep(prev => prev - 1);

  const handleStartVerification = async () => {
    setIsVerifying(true);
    const code = generateOTP();
    setGeneratedCode(code);
    await simulateSendOTP(formData.email, code);
    setOtpSent(true);
    setIsVerifying(false);
  };

  const handleVerifyCode = () => {
    if (validateOTP(otpInput, generatedCode)) {
      setIsVerified(true);
      setVerificationError(false);
      setStep(2);
    } else {
      setVerificationError(true);
      setOtpInput('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const orderData = {
      user_id: user?.id || 'guest',
      items: items.map(i => ({ id: i.id, q: i.quantity })),
      total: total,
      shipping: formData,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    await saveOrderToSupabase(orderData);
    
    setTimeout(() => {
      setLoading(false);
      onComplete();
    }, 2000);
  };

  const regions = ['Metropolitana', 'Valparaíso', 'Biobío', 'Antofagasta', 'Magallanes', 'Atacama', 'Coquimbo', 'O\'Higgins', 'Maule', 'Ñuble', 'Araucanía', 'Los Ríos', 'Los Lagos', 'Aysén', 'Arica y Parinacota', 'Tarapacá'];

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Stepper Superior */}
      <div className="flex items-center justify-between mb-12 px-4">
        <button onClick={handlePrevStep} className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors">
          <ArrowLeft size={20} /> {step === 1 ? 'Volver al Carrito' : 'Regresar'}
        </button>
        
        <div className="flex items-center gap-2 md:gap-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${step >= s ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-slate-200 text-slate-400'}`}>
                {step > s ? <CheckCircle size={22} /> : s}
              </div>
              <p className={`hidden md:block ml-3 text-xs font-black uppercase tracking-widest ${step >= s ? 'text-blue-600' : 'text-slate-400'}`}>
                {s === 1 ? 'Identificación' : s === 2 ? 'Despacho' : 'Confirmación'}
              </p>
              {s < 3 && <div className={`w-8 md:w-16 h-1 mx-3 rounded-full ${step > s ? 'bg-blue-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Formulario Principal */}
        <div className="lg:col-span-7 space-y-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className={`w-14 h-14 ${isVerified ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'} rounded-2xl flex items-center justify-center transition-colors`}>
                    {isVerified ? <CheckCircle size={30} /> : <UserIcon size={30} />}
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                      {isVerified ? 'Identidad Verificada' : 'Tus Datos'}
                    </h2>
                    <p className="text-slate-500 font-medium text-sm">
                      {isVerified ? 'Protocolo de seguridad Osart completado.' : 'Necesitamos validar tu correo antes de continuar.'}
                    </p>
                  </div>
                </div>

                {!otpSent || isVerified ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    <div className="space-y-2 col-span-full">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Nombre Completo</label>
                      <input 
                        disabled={isVerified}
                        required 
                        value={formData.fullName} 
                        onChange={e => setFormData({...formData, fullName: e.target.value})} 
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 outline-none transition-all font-bold text-slate-800 ${isVerified ? 'opacity-60 grayscale' : 'focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500'}`}
                        placeholder="Ej: Nicolás Tesla"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Correo Electrónico</label>
                      <input 
                        disabled={isVerified}
                        required 
                        type="email" 
                        value={formData.email} 
                        onChange={e => setFormData({...formData, email: e.target.value})} 
                        className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 outline-none transition-all font-bold text-slate-800 ${isVerified ? 'opacity-60 grayscale' : 'focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500'}`}
                        placeholder="nicolas@osart.cl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Teléfono</label>
                      <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">+56</span>
                         <input 
                          disabled={isVerified}
                          required 
                          value={formData.phone} 
                          onChange={e => setFormData({...formData, phone: e.target.value})} 
                          className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-4 pl-14 pr-5 outline-none transition-all font-bold text-slate-800 ${isVerified ? 'opacity-60 grayscale' : 'focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500'}`}
                          placeholder="9 1234 5678"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-10 p-8 bg-blue-50 rounded-3xl border border-blue-100 text-center"
                  >
                    <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <Key size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2">Ingresa el código</h3>
                    <p className="text-sm text-slate-500 mb-8 font-medium">Hemos enviado un código de 6 dígitos a <br/><span className="text-blue-600 font-black">{formData.email}</span></p>
                    
                    <div className="relative max-w-[240px] mx-auto">
                      <input 
                        type="text"
                        maxLength={6}
                        value={otpInput}
                        onChange={e => setOtpInput(e.target.value.replace(/\D/g, ''))}
                        className={`w-full text-center text-3xl font-black tracking-[0.5em] py-4 bg-white border-2 rounded-2xl outline-none transition-all ${verificationError ? 'border-red-500 text-red-600 animate-shake' : 'border-blue-200 focus:border-blue-600 text-blue-600'}`}
                        placeholder="000000"
                      />
                    </div>
                    
                    {verificationError && (
                      <p className="text-xs font-black text-red-600 uppercase mt-4">Código incorrecto. Intenta nuevamente.</p>
                    )}

                    <button 
                      onClick={handleStartVerification}
                      className="mt-8 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto"
                    >
                      <RefreshCw size={14} /> Reenviar código
                    </button>
                  </motion.div>
                )}

                <button 
                  onClick={otpSent && !isVerified ? handleVerifyCode : handleNextStep}
                  disabled={isVerifying || !formData.fullName || !formData.email || !formData.phone || (otpSent && !isVerified && otpInput.length < 6)}
                  className={`w-full py-5 rounded-xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50 ${isVerified ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-[#3483fa] text-white hover:bg-blue-600 shadow-blue-500/20'}`}
                >
                  {isVerifying ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generando Token...
                    </div>
                  ) : isVerified ? (
                    <>Continuar a Despacho <ChevronRight size={22} /></>
                  ) : otpSent ? (
                    <>Validar Código <ShieldCheck size={22} /></>
                  ) : (
                    <>Verificar Identidad <Key size={22} /></>
                  )}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                    <Truck size={30} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">¿A dónde enviamos?</h2>
                    <p className="text-slate-500 font-medium text-sm">Llegamos a todo Chile en menos de 48 horas.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="space-y-2 col-span-full">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Calle y Número</label>
                    <input 
                      required 
                      value={formData.address} 
                      onChange={e => setFormData({...formData, address: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                      placeholder="Av. Las Industrias 1234, Of 402"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Región</label>
                    <select 
                      value={formData.region}
                      onChange={e => setFormData({...formData, region: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800 appearance-none"
                    >
                      {regions.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ciudad / Comuna</label>
                    <input 
                      required 
                      value={formData.city} 
                      onChange={e => setFormData({...formData, city: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-bold text-slate-800"
                      placeholder="Santiago Centro"
                    />
                  </div>
                </div>

                <div className="bg-blue-50/50 border border-blue-100 p-6 rounded-2xl flex gap-4 mb-10">
                  <Info className="text-blue-600 shrink-0" />
                  <p className="text-sm font-semibold text-blue-900 leading-relaxed">
                    Costo de envío estimado para {formData.region}: <span className="font-black text-blue-600">${shippingCost.toLocaleString()}</span>. 
                    Envío gratis disponible en compras sobre $50,000.
                  </p>
                </div>

                <button 
                  onClick={handleNextStep}
                  disabled={!formData.address || !formData.city}
                  className="w-full bg-[#3483fa] text-white py-5 rounded-xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-blue-500/20 disabled:opacity-50"
                >
                  Continuar al Pago <ChevronRight size={22} />
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }} 
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
                    <CreditCard size={30} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">Método de Pago</h2>
                    <p className="text-slate-500 font-medium text-sm">Transacciones 100% encriptadas con Supabase Security.</p>
                  </div>
                </div>

                <div className="space-y-4 mb-10">
                  <div className="p-6 rounded-2xl border-2 border-blue-600 bg-blue-50/50 flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                        <Globe size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Webpay Plus / Débito / Crédito</p>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pago Instantáneo</p>
                      </div>
                    </div>
                    <div className="w-6 h-6 rounded-full border-4 border-blue-600 bg-white shadow-inner"></div>
                  </div>

                  <div className="p-6 rounded-2xl border border-slate-200 flex items-center justify-between opacity-50 grayscale cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-200 text-slate-400 rounded-xl flex items-center justify-center">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">Transferencia Bancaria</p>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Verificación en 24h</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-red-600 mb-6 bg-red-50 p-4 rounded-xl border border-red-100">
                    <AlertCircle size={20} />
                    <p className="text-xs font-black uppercase tracking-widest">Al hacer clic en pagar, aceptas los términos de Osart Elite.</p>
                  </div>

                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                        Validando Infraestructura...
                      </div>
                    ) : (
                      <>Pagar Total: ${total.toLocaleString()}</>
                    )}
                  </button>
                  
                  <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <ShieldCheck size={18} className="text-green-500" /> SSL Secured AES-256 Bit Encryption
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resumen Lateral (Sticker) */}
        <div className="lg:col-span-5">
           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white sticky top-24 shadow-2xl border border-white/5">
              <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                <Package className="text-blue-400" /> Detalle del Pedido
              </h3>
              
              <div className="space-y-6 mb-10 overflow-y-auto max-h-[300px] pr-4 scrollbar-hide">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center gap-4 group">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 shrink-0 border border-white/5 p-1 group-hover:border-blue-500/50 transition-all">
                        <img src={item.image} className="w-full h-full object-cover rounded-lg" alt={item.name} />
                      </div>
                      <div className="max-w-[150px]">
                        <p className="font-bold text-sm line-clamp-1 text-slate-200 group-hover:text-white">{item.name}</p>
                        <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">{item.quantity} unidades</p>
                      </div>
                    </div>
                    <p className="font-black text-white text-sm">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-8 space-y-4">
                <div className="flex justify-between text-slate-400 text-sm font-bold">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm font-bold">
                  <span>Envío ({formData.region})</span>
                  <span className={shippingCost === 0 ? "text-green-400 font-black" : "text-slate-200"}>
                    {shippingCost === 0 ? "GRATIS" : `$${shippingCost.toLocaleString()}`}
                  </span>
                </div>
                
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6"></div>
                
                <div className="flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total a Pagar</span>
                      <span className="text-4xl font-black text-white tracking-tighter">${total.toLocaleString()}</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="bg-red-600 text-[8px] font-black px-2 py-0.5 rounded-full mb-1">PROCESO SEGURO</span>
                      <span className="text-[10px] text-blue-400 font-bold uppercase">Incluye IVA</span>
                   </div>
                </div>
              </div>

              <div className="mt-10 p-5 bg-white/5 rounded-2xl border border-white/5 flex gap-4 items-center">
                 <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Navigation className="text-blue-400" size={20} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Destino Final</p>
                    <p className="text-xs font-bold text-white line-clamp-1">{formData.address || 'Esperando dirección...'}</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Checkout;
