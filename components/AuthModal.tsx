
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (u: UserType) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      name: formData.name || 'Usuario Osart',
      email: formData.email,
      learningPoints: 0,
      orders: []
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative z-10 overflow-hidden"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
          <X size={24} />
        </button>

        <div className="p-10 pt-16 text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <User size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">{isRegister ? 'Crear Cuenta' : 'Bienvenido'}</h2>
          <p className="text-slate-500 font-medium mb-10">Gestiona tus proyectos y acumula XP.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                <input 
                  required 
                  placeholder="Nombre Completo" 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                required 
                type="email"
                placeholder="Correo Electrónico" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
              <input 
                required 
                type="password"
                placeholder="Tu Contraseña" 
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold"
              />
            </div>
            
            <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-3 mt-6">
              {isRegister ? 'Registrarme Ahora' : 'Acceder al Sistema'} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-6">
            <button onClick={() => setIsRegister(!isRegister)} className="text-sm font-black text-indigo-600 hover:underline">
              {isRegister ? '¿Ya tienes cuenta?' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
             <ShieldCheck size={16} /> Seguridad Garantizada Osart
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
