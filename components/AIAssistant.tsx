
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
    { role: 'assistant', content: '👋 Saludos. Soy **Core Intelligence**. ¿En qué protocolo técnico podemos trabajar hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
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
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-[380px] sm:w-[440px] h-[650px] bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden mb-8"
          >
            {/* Header Audix Style */}
            <div className="bg-slate-950 p-8 text-white relative overflow-hidden shrink-0 flex justify-between items-center">
              <div className="absolute inset-0 animated-mesh opacity-20"></div>
              <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-indigo-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-indigo-600/30">
                  <Bot size={28} />
                </div>
                <div>
                  <h4 className="font-black text-xl tracking-tighter">CORE AI</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Protocol Sync</span>
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-3 rounded-full text-slate-400 hover:text-white transition-all relative z-10">
                <X size={20} />
              </button>
            </div>

            {/* Chat Body */}
            <div ref={scrollRef} className="flex-grow p-8 overflow-y-auto space-y-6 bg-[#fcfcfd] scrollbar-hide">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                    m.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none font-bold shadow-lg shadow-indigo-100' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none font-medium'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-1.5 p-4 bg-white rounded-full w-fit border border-slate-50">
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-6 bg-white border-t border-slate-50 flex gap-4 shrink-0">
              <input 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask technical Core..."
                className="flex-grow bg-slate-50 border-none rounded-full px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-600 transition-all placeholder:text-slate-400"
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isTyping}
                className="bg-slate-950 text-white p-4 rounded-full hover:bg-indigo-600 disabled:opacity-30 transition-all shadow-xl shadow-indigo-100"
              >
                <Send size={20} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button onClick={() => setIsOpen(!isOpen)} className="group relative">
        <div className="absolute inset-0 bg-indigo-600 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
        <div className="relative bg-slate-950 text-white p-6 rounded-[2.25rem] shadow-2xl hover:scale-110 transition-all flex items-center gap-4 border border-white/5">
           <MessageSquare size={32} className="text-indigo-400" />
           {!isOpen && <span className="text-sm font-black uppercase tracking-widest hidden lg:block">Ask Core</span>}
           <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full border-4 border-white animate-pulse"></div>
        </div>
      </button>
    </div>
  );
};

export default AIAssistant;
