
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Heart, Battery, ArrowRight, Lightbulb, 
  Gamepad2, X, Sparkles, AlertCircle, CheckCircle2, ShieldCheck, Cpu
} from 'lucide-react';
import { QUIZ_DATA } from '../constants';

interface ElectroGameProps {
  onClose: () => void;
  onAddXP: (xp: number) => void;
}

const ElectroGame: React.FC<ElectroGameProps> = ({ onClose, onAddXP }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'playing' | 'correct' | 'incorrect' | 'finished' | 'gameover'>('playing');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (gameState === 'incorrect') {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [gameState]);

  const handleAnswer = (index: number) => {
    if (gameState !== 'playing') return;
    setSelectedOption(index);
    if (index === QUIZ_DATA[currentQ].correct) {
      setScore(s => s + 500);
      setGameState('correct');
    } else {
      setLives(l => l - 1);
      setGameState('incorrect');
    }
  };

  const nextStep = () => {
    if (lives <= 0 && gameState === 'incorrect') {
      setGameState('gameover');
      return;
    }
    if (currentQ < QUIZ_DATA.length - 1) {
      setCurrentQ(currentQ + 1);
      setGameState('playing');
      setSelectedOption(null);
    } else {
      setGameState('finished');
      onAddXP(score);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 relative">
      <AnimatePresence mode="wait">
        {gameState === 'gameover' ? (
          <motion.div 
            key="gameover"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-slate-950 text-white rounded-[4rem] border-2 border-indigo-500/20 relative overflow-hidden"
          >
            <div className="absolute inset-0 animated-mesh opacity-10"></div>
            <div className="relative z-10 space-y-6">
              <Zap size={64} className="mx-auto text-indigo-500 animate-pulse" />
              <h2 className="text-6xl font-black tracking-tighter text-indigo-500">SYSTEM FAILURE</h2>
              <p className="text-slate-500 font-black uppercase text-xs tracking-widest">Circuito quemado • Reintentar protocolo</p>
              <button onClick={onClose} className="bg-indigo-600 text-white px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30">Restart Engine</button>
            </div>
          </motion.div>
        ) : gameState === 'finished' ? (
          <motion.div 
            key="finished"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-white rounded-[4rem] shadow-2xl space-y-8"
          >
            <Trophy size={80} className="mx-auto text-indigo-600 animate-bounce" />
            <div className="space-y-2">
              <h2 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">MASTER ENGINEER</h2>
              <p className="text-indigo-600 font-black uppercase text-xs tracking-[0.3em]">Certificación Nivel S Sincronizada</p>
            </div>
            <div className="bg-slate-50 rounded-[3rem] p-12 max-w-sm mx-auto border border-slate-100">
               <p className="text-6xl font-black text-slate-900 mb-2">{score}</p>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Engineering XP Earned</p>
            </div>
            <button onClick={onClose} className="bg-indigo-600 text-white px-16 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-200 transition-all active:scale-95">Sincronizar Progreso</button>
          </motion.div>
        ) : (
          <motion.div 
            key="playing"
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            className="space-y-10"
          >
            {/* Cyber HUD Audix */}
            <div className="bg-slate-950 text-white p-10 rounded-[3.5rem] flex justify-between items-center border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 animated-mesh opacity-5"></div>
               <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 bg-indigo-600/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                   <Cpu className="text-indigo-400" size={32} />
                 </div>
                 <div>
                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1">Status Enlace</p>
                   <p className="text-xl font-black">CORE ACTIVO</p>
                 </div>
               </div>
               <div className="flex gap-4 relative z-10 bg-white/5 p-4 rounded-full border border-white/10">
                 {[...Array(3)].map((_, i) => (
                   <Heart 
                    key={i}
                    size={28} 
                    className={`${i < lives ? 'fill-indigo-600 text-indigo-600' : 'text-slate-800'}`} 
                   />
                 ))}
               </div>
            </div>

            {/* Question Box */}
            <div className="bg-white rounded-[4rem] shadow-2xl overflow-hidden border border-slate-50">
              <div className="p-16">
                <div className="flex justify-between items-center mb-12">
                   <span className="bg-slate-950 text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">Módulo {currentQ + 1}</span>
                   <div className="flex items-center gap-2 text-indigo-600">
                      <Sparkles size={18} />
                      <span className="text-2xl font-black">{score} XP</span>
                   </div>
                </div>
                
                <h3 className="text-4xl lg:text-5xl font-black text-slate-900 mb-12 leading-tight tracking-tighter">
                  {QUIZ_DATA[currentQ].question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {QUIZ_DATA[currentQ].options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={gameState !== 'playing'}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-8 rounded-[2.5rem] border-2 font-black text-left transition-all ${
                        gameState !== 'playing'
                          ? idx === QUIZ_DATA[currentQ].correct
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                            : idx === selectedOption
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'opacity-40 border-slate-100'
                          : 'border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/20'
                      }`}
                    >
                      <span className="text-lg tracking-tight">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              {gameState !== 'playing' && (
                <motion.div 
                  initial={{ y: 100 }} 
                  animate={{ y: 0 }}
                  className={`p-12 ${gameState === 'correct' ? 'bg-indigo-600' : 'bg-red-600'} text-white`}
                >
                  <div className="flex flex-col lg:flex-row gap-10 items-center justify-between">
                    <div className="space-y-2 text-center lg:text-left">
                      <h4 className="text-2xl font-black uppercase tracking-widest">{gameState === 'correct' ? 'Protocolo Validado' : 'Fallo en la Red'}</h4>
                      <p className="text-lg opacity-80 font-medium italic">"{QUIZ_DATA[currentQ].explanation}"</p>
                    </div>
                    <button 
                      onClick={nextStep}
                      className="bg-white text-slate-950 px-12 py-5 rounded-full font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
                    >
                      Siguiente Módulo
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ElectroGame;
