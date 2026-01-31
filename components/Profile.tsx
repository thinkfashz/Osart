
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
// Fixed: Added missing ShoppingBag and Package icons to imports
import { User, LogOut, Award, Clock, ChevronRight, Settings, Star, Zap, ShieldCheck, Trophy, ShoppingBag, Package } from 'lucide-react';
import { User as UserType } from '../types';

interface ProfileProps {
  user: UserType;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  const userLevel = useMemo(() => {
    if (user.learningPoints > 5000) return { name: 'Arquitecto Master', color: 'text-purple-500', icon: Trophy };
    if (user.learningPoints > 2000) return { name: 'Ingeniero Senior', color: 'text-indigo-500', icon: Award };
    if (user.learningPoints > 500) return { name: 'Técnico Especialista', color: 'text-blue-500', icon: Zap };
    return { name: 'Aspirante de Hardware', color: 'text-slate-400', icon: User };
  }, [user.learningPoints]);

  return (
    <div className="max-w-4xl mx-auto py-10 space-y-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden"
      >
        {/* Banner Premium */}
        <div className="h-48 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 animated-mesh opacity-20"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
          <button 
            onClick={onLogout} 
            className="absolute top-8 right-8 bg-white/10 hover:bg-red-500 text-white p-3 rounded-2xl transition-all backdrop-blur-md flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>

        {/* Content Avatar & Identity */}
        <div className="px-10 pb-16 relative">
          <div className="relative -mt-20 mb-8 inline-block">
            <div className="w-36 h-36 bg-white rounded-[3rem] p-2 shadow-2xl border border-slate-50">
              <div className="w-full h-full bg-slate-900 rounded-[2.5rem] flex items-center justify-center text-5xl font-black text-white shadow-inner">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="absolute bottom-2 right-2 bg-indigo-600 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
              <userLevel.icon size={18} className="text-white" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-slate-900 tracking-tighter">{user.name}</h2>
                <div className={`flex items-center gap-2 font-black uppercase text-[10px] tracking-[0.2em] ${userLevel.color}`}>
                   <userLevel.icon size={14} /> {userLevel.name}
                </div>
                <p className="text-xs text-slate-400 font-bold">{user.email}</p>
              </div>
              
              <div className="flex gap-4">
                 <button className="flex-grow bg-slate-950 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200">
                   <Settings size={16} /> Configurar Nodo
                 </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-center flex flex-col items-center justify-center group hover:bg-white hover:shadow-xl transition-all">
                <p className="text-5xl font-black text-indigo-600 mb-1 group-hover:scale-110 transition-transform">{user.learningPoints.toLocaleString()}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">XP de Ingeniería</p>
              </div>
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 text-center flex flex-col items-center justify-center group hover:bg-white hover:shadow-xl transition-all">
                <p className="text-5xl font-black text-slate-900 mb-1 group-hover:scale-110 transition-transform">{user.orders.length}</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolos de Compra</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats & Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100 flex flex-col"
        >
           <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-slate-900">
             <Clock size={24} className="text-indigo-600" /> Registro de Despliegues
           </h3>
           <div className="space-y-4 flex-grow">
             {user.orders.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
                  <div className="p-4 bg-white rounded-2xl text-slate-300"><ShoppingBag size={32} /></div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sin transacciones registradas</p>
               </div>
             ) : (
               user.orders.map((o, i) => (
                 <div key={i} className="p-6 bg-slate-50 rounded-[2rem] flex justify-between items-center group cursor-pointer hover:bg-indigo-600 hover:text-white transition-all border border-transparent shadow-sm">
                    <div>
                      <p className="font-black uppercase text-xs tracking-widest">Orden #{o.id || `OS-202${i}`}</p>
                      <p className="text-[10px] opacity-60 font-bold uppercase tracking-widest">En preparación • May 2024</p>
                    </div>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </div>
               ))
             )}
           </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-slate-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden"
        >
           <div className="absolute top-0 right-0 p-10 opacity-5 -translate-y-1/2 translate-x-1/2"><Zap size={180} /></div>
           <h3 className="text-2xl font-black mb-8 flex items-center gap-4 text-indigo-400 relative z-10">
             <Trophy size={24} /> Logros de Ingeniería
           </h3>
           <div className="space-y-6 relative z-10">
              <AchievementItem 
                unlocked={true} 
                icon={Zap} 
                title="Primera Conexión" 
                desc="Nodo verificado en la red Osart Elite." 
              />
              <AchievementItem 
                unlocked={user.learningPoints > 1000} 
                icon={ShieldCheck} 
                title="Certificado Core" 
                desc="Supera los 1.000 XP en el ElectroGame." 
              />
              <AchievementItem 
                unlocked={user.orders.length > 0} 
                icon={Package} 
                title="Arquitecto Activo" 
                desc="Realiza tu primer despliegue de hardware." 
              />
           </div>
        </motion.div>
      </div>
    </div>
  );
};

const AchievementItem: React.FC<{ unlocked: boolean, icon: any, title: string, desc: string }> = ({ unlocked, icon: Icon, title, desc }) => (
  <div className={`flex gap-5 p-6 rounded-[2rem] border transition-all ${unlocked ? 'bg-white/10 border-indigo-500/30' : 'bg-white/5 border-white/5 opacity-40 grayscale'}`}>
     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-xl ${unlocked ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-slate-800 text-slate-500'}`}>
        <Icon size={24} />
     </div>
     <div className="space-y-1">
        <p className="font-black text-sm uppercase tracking-widest">{title}</p>
        <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{desc}</p>
     </div>
  </div>
);

export default Profile;
