
import React from 'react';
import { motion } from 'framer-motion';
import { User, LogOut, Award, Clock, ChevronRight, Settings, Star } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Banner */}
        <div className="h-48 bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-blue-900 opacity-50"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <button onClick={onLogout} className="absolute top-8 right-8 bg-white/10 hover:bg-red-500 text-white p-3 rounded-2xl transition-all backdrop-blur-md flex items-center gap-2 font-bold text-sm">
            <LogOut size={18} /> Cerrar Sesión
          </button>
        </div>

        {/* Content */}
        <div className="px-10 pb-16 relative">
          <div className="relative -mt-20 mb-8 inline-block">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-xl">
              <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-4xl font-black text-indigo-600 border border-slate-100">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-8 h-8 rounded-2xl border-4 border-white flex items-center justify-center">
              <Star size={12} className="text-white fill-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{user.name}</h2>
                <p className="text-slate-500 font-bold flex items-center gap-2 mt-2"><Award size={18} className="text-indigo-600" /> Ingeniero en Entrenamiento</p>
              </div>
              <div className="flex gap-4">
                 <button className="flex-grow bg-slate-900 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
                   <Settings size={18} /> Editar Perfil
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-indigo-600 mb-1">{user.learningPoints}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">XP Acumulada</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 text-center flex flex-col items-center justify-center">
                <p className="text-4xl font-black text-slate-900 mb-1">{user.orders.length}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Órdenes Totales</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
           <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
             <Clock size={24} className="text-indigo-600" /> Historial de Pedidos
           </h3>
           <div className="space-y-4">
             {user.orders.length === 0 ? (
               <p className="text-slate-500 py-10 text-center font-medium bg-slate-50 rounded-3xl border border-dashed border-slate-200">No tienes pedidos registrados.</p>
             ) : (
               user.orders.map((o, i) => (
                 <div key={i} className="p-5 bg-slate-50 rounded-2xl flex justify-between items-center group cursor-pointer hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-slate-100">
                    <div>
                      <p className="font-black text-slate-800">Pedido #OS-202{i}</p>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">En preparación</p>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-indigo-600 transition-colors" />
                 </div>
               ))
             )}
           </div>
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl">
           <h3 className="text-2xl font-black mb-8 flex items-center gap-3 text-indigo-400">
             <Star size={24} /> Logros Obtenidos
           </h3>
           <div className="space-y-6">
              <div className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/10 items-center">
                 <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
                    <User size={24} />
                 </div>
                 <div>
                    <p className="font-bold">Primera Conexión</p>
                    <p className="text-xs text-slate-400">Te has unido a la red Osart Elite.</p>
                 </div>
              </div>
              <div className="flex gap-4 p-5 bg-white/5 rounded-3xl border border-white/10 items-center opacity-40">
                 <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center shrink-0">
                    <Award size={24} />
                 </div>
                 <div>
                    <p className="font-bold">Gran Arquitecto</p>
                    <p className="text-xs text-slate-400">Realiza tu primera compra técnica.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
