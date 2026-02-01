
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, ArrowRight, ShieldCheck, Globe, Users } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (u: any) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'Arquitecto Osart',
      email: formData.email,
      learningPoints: 100,
      orders: [],
      provider: 'Email'
    });
  };

  const handleSocialLogin = (provider: 'Google' | 'Facebook') => {
    // Simulación de flujo OAuth
    const mockUser = {
      Google: { name: 'G-Engineer Alpha', email: 'google.dev@osart.cl', points: 250 },
      Facebook: { name: 'FB-Architect Delta', email: 'fb.social@osart.cl', points: 150 }
    };

    onLogin({
      name: mockUser[provider].name,
      email: mockUser[provider].email,
      learningPoints: mockUser[provider].points,
      orders: [],
      provider: provider
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        exit={{ opacity: 0, scale: 0.9, y: 20 }} 
        className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100"
      >
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
          <X size={24} />
        </button>
        <div className="p-10 pt-16 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">IDENTITY PROTOCOL</h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-10">Acceso a Infraestructura Soberana</p>

          <div className="space-y-4 mb-8">
             <button onClick={() => handleSocialLogin('Google')} className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 transition-all group">
                <Globe size={18} className="text-blue-500 group-hover:rotate-12 transition-transform" /> Sincronizar con Google Cloud
             </button>
             <button onClick={() => handleSocialLogin('Facebook')} className="w-full flex items-center justify-center gap-4 bg-white border-2 border-slate-100 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-blue-600 transition-all group">
                <Users size={18} className="text-indigo-600 group-hover:rotate-12 transition-transform" /> Sincronizar con Meta Identity
             </button>
          </div>

          <div className="relative flex items-center gap-4 mb-8">
             <div className="flex-grow h-px bg-slate-100" />
             <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Protocolo Email</span>
             <div className="flex-grow h-px bg-slate-100" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input required type="email" placeholder="Email de Ingeniero" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all font-bold text-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={20} />
              <input required type="password" placeholder="Clave de Encriptación" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:border-indigo-500 transition-all font-bold text-sm" />
            </div>
            <button className="w-full bg-slate-950 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3 mt-6 group">
              Ejecutar Acceso <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8">
            <button onClick={() => setIsRegister(!isRegister)} className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
              {isRegister ? '¿Ya estás verificado? Acceder' : '¿Nuevo Arquitecto? Registrar Nodo'}
            </button>
          </div>
          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-300 text-[9px] font-black uppercase tracking-widest">
            <ShieldCheck size={14} className="text-indigo-400" /> Seguridad Validada por Osart Elite
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
