
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bot, Send, Sparkles, Cpu, Zap } from 'lucide-react';
import { askGeminiExpert } from '../services/gemini';

interface AIAssistantProps {
  context: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: '👋 ¡Saludos Ingeniero! Soy el **Core Intelligence de Osart Elite**. ¿Tienes algún desafío técnico o buscas componentes específicos hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    const response = await askGeminiExpert(userMsg, context);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8, originY: 'bottom', originX: 'right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.5 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="w-[380px] sm:w-[440px] h-[650px] bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.15)] border border-slate-100 flex flex-col overflow-hidden mb-8"
          >
            {/* Cabecera Futurista */}
            <div className="bg-slate-950 p-7 text-white flex justify-between items-center relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              
              <div className="flex items-center gap-5 relative z-10">
                <div className="relative">
                  <motion.div 
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  >
                    <Bot size={32} />
                  </motion.div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-slate-950 shadow-lg"></span>
                </div>
                <div>
                  <h4 className="font-black text-xl tracking-tighter">OSART CORE AI</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Protocolo Activo</span>
                    <Zap size={10} className="text-yellow-400 fill-yellow-400 animate-pulse" />
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:bg-white/10 p-3 rounded-2xl transition-all relative z-10 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Chat Messages con Estilo de Burbujas */}
            <div ref={scrollRef} className="flex-grow p-7 overflow-y-auto space-y-6 scrollbar-hide bg-[#f9fafb]">
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[88%] p-5 rounded-[2.25rem] text-sm leading-relaxed shadow-sm relative ${
                    m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none font-bold' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                  }`}>
                    {m.content}
                    {m.role === 'assistant' && (
                      <div className="absolute -left-2 -top-2 opacity-10">
                         <Sparkles size={16} />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-5 rounded-[2rem] rounded-tl-none border border-slate-100 flex gap-1.5 shadow-sm">
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Área de Entrada Mejorada */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-100 flex gap-3 shrink-0">
              <div className="relative flex-grow">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Solicita consejos técnicos..."
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-slate-400 pr-12"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500/30">
                  <Cpu size={18} />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="bg-slate-950 text-white p-5 rounded-2xl hover:bg-blue-600 active:scale-95 transition-all shadow-xl shadow-blue-500/10 disabled:opacity-50 disabled:grayscale"
              >
                <Send size={24} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón Flotante Principal */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative"
      >
        <motion.div 
          animate={!isOpen ? { scale: [1, 1.1, 1] } : {}}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute inset-0 bg-blue-600 rounded-[2.5rem] blur-[25px] opacity-30 group-hover:opacity-60 transition-opacity"
        ></motion.div>
        <div className="relative bg-slate-950 text-white p-6 rounded-[2.5rem] shadow-2xl hover:scale-110 active:scale-90 transition-all duration-300 border border-white/10 flex items-center gap-4">
          <MessageSquare size={36} className="text-blue-400" />
          {!isOpen && (
             <div className="hidden lg:flex flex-col items-start pr-2">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Expert AI</p>
                <p className="text-sm font-black text-white leading-none">Preguntar Core</p>
             </div>
          )}
          <div className="absolute -top-3 -right-3 bg-red-600 text-[9px] font-black px-3 py-1.5 rounded-full border-4 border-[#f5f5f5] flex items-center gap-1.5 shadow-xl">
             LIVE <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default AIAssistant;
