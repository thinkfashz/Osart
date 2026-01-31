
import React from 'react';
import { Cpu, Instagram, Twitter, Facebook, Youtube, Mail, Phone, MapPin, Zap, ChevronUp } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  setView: (v: AppView) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="bg-slate-950 text-slate-400 pt-32 pb-44 lg:pb-16 rounded-t-[4rem] relative overflow-hidden mt-20">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-16 lg:gap-24 mb-24">
          
          {/* Brand Info */}
          <div className="lg:col-span-1 space-y-10">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => { setView(AppView.HOME); scrollToTop(); }}>
              <div className="bg-indigo-600 text-white p-3 rounded-[1.25rem] shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                <Cpu size={28} />
              </div>
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">OSART<span className="text-indigo-500">.</span></h2>
            </div>
            <p className="text-lg leading-relaxed font-medium text-slate-300">
              Ingeniería de vanguardia para arquitectos del mañana. Hardware soberano verificado.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all border border-white/5">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Links 1 */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Protocolos</h4>
            <ul className="space-y-4 text-sm font-bold">
              {['Sistemas PTZ', 'Microcontroladores', 'Kits Robótica', 'Sensores de Grado S'].map(item => (
                <li key={item} className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2 group">
                   <div className="w-1 h-1 bg-indigo-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Links 2 */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Soporte Técnico</h4>
            <ul className="space-y-5 text-sm font-bold">
              <li className="flex items-center gap-4 text-slate-300"><Mail size={16} className="text-indigo-500" /> support@osart.cl</li>
              <li className="flex items-center gap-4 text-slate-300"><Phone size={16} className="text-indigo-500" /> +56 9 8765 4321</li>
              <li className="flex items-center gap-4 text-slate-300"><MapPin size={16} className="text-indigo-500" /> Global Distribution</li>
            </ul>
          </div>

          {/* Newsletter / Action */}
          <div className="space-y-8">
            <h4 className="text-white font-black uppercase text-[10px] tracking-[0.3em]">Core Feed</h4>
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 space-y-4 relative overflow-hidden group">
               <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-colors" />
               <p className="text-xs text-slate-400 leading-relaxed font-medium relative z-10">Accede a protocolos y alertas de stock prioritario.</p>
               <div className="flex flex-col gap-3 relative z-10">
                  <input placeholder="Email técnico" className="bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-xs font-bold outline-none focus:border-indigo-500 transition-colors" />
                  <button className="bg-indigo-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20">Sincronizar</button>
               </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col lg:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest">
            <span className="text-slate-600">© 2024 OSART ELITE SYSTEMS</span>
            <div className="hidden lg:flex gap-8">
              <a href="#" className="hover:text-indigo-400">Security Specs</a>
              <a href="#" className="hover:text-indigo-400">Legals</a>
            </div>
          </div>
          
          <button onClick={scrollToTop} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">
            <ChevronUp size={16} /> Volver al Inicio
          </button>

          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <Zap size={14} className="text-indigo-600" /> Powered by Gemini Engineering
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
