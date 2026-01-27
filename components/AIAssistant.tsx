
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Bot, Send, Sparkles } from 'lucide-react';
import { askGeminiExpert } from '../services/gemini';

interface AIAssistantProps {
  context: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ context }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: '👋 ¡Hola! Soy el experto de Osart Elite. ¿Necesitas ayuda para elegir un componente o tienes alguna duda técnica?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, originY: 'bottom', originX: 'right' }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="w-[350px] sm:w-[400px] h-[550px] bg-white rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 border border-slate-100 flex flex-col overflow-hidden mb-6"
          >
            {/* Header */}
            <div className="bg-slate-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-600/20 to-transparent"></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="relative">
                  <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center">
                    <Bot size={28} />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 animate-pulse"></span>
                </div>
                <div>
                  <h4 className="font-black text-lg">Osart AI Expert</h4>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Soporte Técnico 24/7</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors relative z-10">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 scrollbar-hide bg-slate-50/50">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm ${
                    m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-[1.5rem] rounded-tl-none border border-slate-100 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Pregunta sobre componentes..."
                className="flex-grow bg-slate-100 border-none rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
              <button 
                type="submit" 
                className="bg-slate-900 text-white p-3.5 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/10"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative"
      >
        <div className="absolute inset-0 bg-indigo-600 rounded-full blur-[15px] opacity-40 group-hover:opacity-70 transition-opacity animate-pulse"></div>
        <div className="relative bg-slate-900 text-white p-5 rounded-3xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 border border-white/10">
          <MessageSquare size={32} className="text-indigo-400" />
          <div className="absolute -top-2 -right-2 bg-indigo-600 text-[10px] font-black px-2 py-0.5 rounded-full border-2 border-slate-50 flex items-center gap-1 shadow-lg">
             AI <Sparkles size={8} />
          </div>
        </div>
      </button>
    </div>
  );
};

export default AIAssistant;
