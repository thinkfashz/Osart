
import React from 'react';
import { Cpu, Instagram, Twitter, Facebook, Youtube, ChevronRight, Mail, Phone, MapPin } from 'lucide-react';
import { AppView } from '../types';

interface FooterProps {
  setView: (v: AppView) => void;
}

const Footer: React.FC<FooterProps> = ({ setView }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-24 pb-12 rounded-t-[4rem] relative overflow-hidden mt-20">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3" onClick={() => setView(AppView.HOME)}>
              <div className="bg-white/10 text-white p-2 rounded-xl"><Cpu size={24} /></div>
              <h2 className="text-3xl font-black text-white tracking-tighter">OSART<span className="text-indigo-500">.</span></h2>
            </div>
            <p className="text-lg leading-relaxed font-medium">
              Hardware de alta fidelidad y soluciones de ingeniería para la próxima generación de innovadores tecnológicos.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-12 h-12 rounded-2xl bg-white/5 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-sm tracking-widest mb-8">Navegación</h4>
            <ul className="space-y-4">
              {['Microcontroladores', 'Robótica', 'Herramientas', 'Sensores', 'Ofertas'].map(item => (
                <li key={item} className="hover:text-indigo-400 cursor-pointer transition-colors flex items-center gap-2 group">
                  <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 transition-all" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-sm tracking-widest mb-8">Soporte Técnico</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors"><Mail size={18} /> contacto@osart.cl</li>
              <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors"><Phone size={18} /> +56 9 8765 4321</li>
              <li className="flex items-center gap-3 hover:text-white cursor-pointer transition-colors"><MapPin size={18} /> Santiago, Chile</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-sm tracking-widest mb-8">Newsletter</h4>
            <p className="text-sm mb-6">Únete a +5,000 ingenieros suscritos para recibir guías y ofertas exclusivas.</p>
            <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 focus-within:border-indigo-500 transition-all">
              <input type="email" placeholder="tu@email.com" className="bg-transparent border-none text-white px-4 py-2 w-full outline-none text-sm font-medium" />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-black text-sm hover:bg-indigo-500 transition-all">OK</button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-sm font-medium opacity-50 gap-6">
          <p>© 2026 Osart Systems SpA. Ingeniería de Precisión.</p>
          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer">Privacidad</span>
            <span className="hover:text-white cursor-pointer">Garantía</span>
            <span className="hover:text-white cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
