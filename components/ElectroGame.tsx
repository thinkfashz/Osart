
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
      const timer = setTimeout(() => setShake(false), 500);
      return () => clearTimeout(timer);
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
    <div className="max-w-4xl mx-auto py-6 relative">
      <AnimatePresence mode="wait">
        {gameState === 'gameover' ? (
          <motion.div 
            key="gameover"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-slate-950 text-white rounded-[3rem] shadow-[0_0_50px_rgba(239,68,68,0.2)] border-2 border-red-500/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10">
              <motion.div 
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} 
                transition={{ repeat: Infinity, duration: 2 }} 
                className="w-24 h-24 bg-red-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(220,38,38,0.5)]"
              >
                <Zap size={48} fill="currentColor" />
              </motion.div>
              <h2 className="text-6xl font-black mb-4 tracking-tighter text-red-500">SYSTEM FAILURE</h2>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto font-bold uppercase tracking-widest text-sm">Circuito quemado por sobrecarga de errores.</p>
              <button onClick={onClose} className="bg-red-600 text-white px-12 py-5 rounded-2xl font-black hover:bg-red-700 transition-all shadow-xl shadow-red-600/40 uppercase tracking-[0.2em] text-sm">Reiniciar Protocolo</button>
            </div>
          </motion.div>
        ) : gameState === 'finished' ? (
          <motion.div 
            key="finished"
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-white rounded-[3rem] shadow-2xl border-4 border-blue-600/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-red-500 to-blue-600 animate-pulse"></div>
            <div className="w-28 h-28 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-xl">
              <Trophy size={56} />
            </div>
            <h2 className="text-6xl font-black mb-2 tracking-tighter text-slate-900 leading-none">MASTER ENGINEER</h2>
            <p className="text-blue-600 mb-10 uppercase text-xs font-black tracking-[0.4em]">Certificación de Hardware Osart Nivel S</p>
            <div className="bg-slate-900 rounded-[2.5rem] p-12 mb-10 max-w-sm mx-auto shadow-2xl relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black">BONUS XP</div>
              <p className="text-7xl font-black text-white mb-2 tracking-tighter">{score}</p>
              <p className="text-blue-400 font-black uppercase tracking-widest text-[10px]">Unidades de Aprendizaje (AU)</p>
            </div>
            <button onClick={onClose} className="bg-[#3483fa] text-white px-16 py-6 rounded-[2rem] font-black hover:bg-blue-600 transition-all shadow-2xl shadow-blue-600/30 uppercase tracking-[0.2em] text-base">Sincronizar Progreso</button>
          </motion.div>
        ) : (
          <motion.div 
            key="playing"
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Cyber HUD */}
            <div className="bg-slate-950 text-white p-8 rounded-[3rem] shadow-2xl flex flex-wrap justify-between items-center relative overflow-hidden border border-white/5">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_rgba(59,130,246,0.1),transparent)]"></div>
               
               <div className="flex items-center gap-6 relative z-10">
                 <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                   <Cpu className="text-blue-400" size={36} />
                 </div>
                 <div>
                   <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.3em] mb-1">Status de Conexión</p>
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,1)]"></div>
                      <p className="text-xl font-black tracking-tight">ENLACE ACTIVO</p>
                   </div>
                 </div>
               </div>

               <div className="flex gap-4 relative z-10 bg-white/5 px-8 py-5 rounded-[2.5rem] border border-white/5 backdrop-blur-md">
                 {[...Array(3)].map((_, i) => (
                   <motion.div 
                    key={i}
                    animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 0.8, opacity: 0.2 }}
                    transition={{ repeat: i < lives ? Infinity : 0, duration: 3 }}
                   >
                     <Heart 
                      size={32} 
                      className={`${i < lives ? 'fill-red-600 text-red-600' : 'text-slate-600'}`} 
                     />
                   </motion.div>
                 ))}
               </div>

               <div className="text-right relative z-10 hidden lg:block">
                 <div className="flex items-center gap-4 mb-3">
                   <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Memoria de Buffer</p>
                   <span className="text-[10px] font-black text-blue-400">{Math.round(((currentQ + 1) / QUIZ_DATA.length) * 100)}%</span>
                 </div>
                 <div className="w-56 h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                   <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentQ + 1) / QUIZ_DATA.length) * 100}%` }}
                   />
                 </div>
               </div>
            </div>

            {/* Content Unit */}
            <div className="bg-white rounded-[4rem] shadow-2xl border border-slate-100 overflow-hidden relative">
              <div className="p-10 md:p-16">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <span className="bg-slate-900 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-[0.2em]">Célula {currentQ + 1}</span>
                    <span className="text-slate-200 font-light text-2xl">|</span>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">Protocolo {QUIZ_DATA.length}</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <Sparkles size={20} className="text-blue-600" />
                    <span className="text-blue-600 font-black text-2xl">{score} <span className="text-xs uppercase tracking-widest opacity-60">AU</span></span>
                  </div>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 leading-[1.1] tracking-tighter">{QUIZ_DATA[currentQ].question}</h3>
                
                {QUIZ_DATA[currentQ].image && (
                  <motion.div 
                    layoutId={`img-${currentQ}`}
                    className="mb-12 rounded-[3rem] overflow-hidden aspect-video bg-slate-100 border-8 border-slate-50 shadow-inner group"
                  >
                    <img src={QUIZ_DATA[currentQ].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]" alt="Neural Challenge" />
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {QUIZ_DATA[currentQ].options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={gameState !== 'playing'}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-8 rounded-[2.5rem] border-2 font-black text-left transition-all relative overflow-hidden group ${
                        gameState !== 'playing'
                          ? idx === QUIZ_DATA[currentQ].correct
                            ? 'border-green-500 bg-green-50 text-green-700 shadow-xl'
                            : idx === selectedOption
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-slate-50 opacity-40 scale-95'
                          : 'border-slate-100 hover:border-blue-600 hover:bg-blue-50/30 hover:-translate-y-1'
                      }`}
                    >
                      <div className="flex items-center gap-6 relative z-10">
                        <span className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm border-2 transition-colors ${
                          gameState !== 'playing' && idx === QUIZ_DATA[currentQ].correct ? 'bg-green-600 border-green-600 text-white' : 'border-slate-200 text-slate-400 group-hover:border-blue-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="text-lg flex-grow tracking-tight">{opt}</span>
                        {gameState !== 'playing' && idx === QUIZ_DATA[currentQ].correct && <CheckCircle2 size={30} className="text-green-600 animate-bounce" />}
                        {gameState !== 'playing' && idx === selectedOption && idx !== QUIZ_DATA[currentQ].correct && <AlertCircle size={30} className="text-red-600" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {gameState !== 'playing' && (
                <motion.div 
                  initial={{ y: 200 }} 
                  animate={{ y: 0 }}
                  className={`p-12 ${gameState === 'correct' ? 'bg-blue-600 shadow-[0_-20px_50px_rgba(37,99,235,0.2)]' : 'bg-red-600 shadow-[0_-20px_50px_rgba(220,38,38,0.2)]'} text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                    <ShieldCheck size={200} fill="currentColor" />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-10 items-center relative z-10">
                    <div className="p-6 bg-white/20 rounded-[2.5rem] backdrop-blur-xl shrink-0 shadow-xl">
                      {gameState === 'correct' ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
                    </div>
                    <div className="flex-grow text-center lg:text-left">
                      <h4 className="text-3xl font-black mb-4 tracking-tight">{gameState === 'correct' ? 'CÓDIGO VALIDADO' : 'ERROR DE COMPILACIÓN'}</h4>
                      <p className="text-lg opacity-90 leading-relaxed max-w-2xl font-semibold italic">
                        "{QUIZ_DATA[currentQ].explanation}"
                      </p>
                    </div>
                    <button 
                      onClick={nextStep}
                      className="bg-white text-slate-950 px-12 py-6 rounded-[2rem] font-black flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-2xl shrink-0 uppercase tracking-widest text-sm"
                    >
                      {currentQ === QUIZ_DATA.length - 1 ? 'Finalizar Misión' : 'Siguiente Módulo'} <ArrowRight size={22} />
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
