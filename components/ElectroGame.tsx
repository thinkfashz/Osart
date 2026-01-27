
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, Zap, Heart, Battery, ArrowRight, Lightbulb, 
  Gamepad2, X, Sparkles, AlertCircle, CheckCircle2 
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
      setScore(s => s + 250);
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
    <div className="max-w-3xl mx-auto py-10 relative">
      <AnimatePresence mode="wait">
        {gameState === 'gameover' ? (
          <motion.div 
            key="gameover"
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-slate-900 text-white rounded-[3rem] shadow-2xl border-4 border-red-500/30 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-red-500/20 to-transparent"></div>
            <div className="relative z-10">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-24 h-24 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-red-500/50">
                <Zap size={48} fill="currentColor" />
              </motion.div>
              <h2 className="text-5xl font-black mb-4 tracking-tighter">CIRCUITO QUEMADO</h2>
              <p className="text-slate-400 mb-10 max-w-sm mx-auto font-medium">Has sobrecargado el sistema con demasiados errores. Reinicia tu lógica y vuelve a intentarlo.</p>
              <button onClick={onClose} className="bg-red-500 text-white px-10 py-5 rounded-2xl font-black hover:bg-red-600 transition shadow-xl shadow-red-500/40 uppercase tracking-widest text-sm">Regresar al Laboratorio</button>
            </div>
          </motion.div>
        ) : gameState === 'finished' ? (
          <motion.div 
            key="finished"
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-20 bg-white rounded-[3rem] shadow-2xl border-4 border-indigo-600/20 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
            <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-lg">
              <Trophy size={48} />
            </div>
            <h2 className="text-5xl font-black mb-2 tracking-tighter">¡INGENIERO ELITE!</h2>
            <p className="text-slate-500 mb-10 uppercase text-xs font-black tracking-[0.3em]">Nivel de Hardware: Máximo</p>
            <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-10 max-w-xs mx-auto border border-slate-100 shadow-inner">
              <p className="text-6xl font-black text-indigo-600 mb-2">{score}</p>
              <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">PUNTOS DE EXPERIENCIA (XP)</p>
            </div>
            <button onClick={onClose} className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/30 uppercase tracking-widest text-sm">Guardar Progreso</button>
          </motion.div>
        ) : (
          <motion.div 
            key="playing"
            animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Super HUD */}
            <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-2xl flex flex-wrap justify-between items-center relative overflow-hidden border border-white/10">
               <div className="absolute inset-0 opacity-10 pointer-events-none">
                 <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 to-transparent"></div>
               </div>
               
               <div className="flex items-center gap-5 relative z-10">
                 <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center border border-indigo-500/30">
                   <Gamepad2 className="text-indigo-400" size={32} />
                 </div>
                 <div>
                   <p className="text-[10px] text-indigo-400 font-black uppercase tracking-[0.2em]">Rango Actual</p>
                   <p className="text-xl font-black tracking-tight">TECNÓLOGO NIVEL 4</p>
                 </div>
               </div>

               <div className="flex gap-3 relative z-10 bg-black/40 px-6 py-4 rounded-[2rem] border border-white/5">
                 {[...Array(3)].map((_, i) => (
                   <motion.div 
                    key={i}
                    animate={i < lives ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                    transition={{ repeat: i < lives ? Infinity : 0, duration: 2 }}
                   >
                     <Heart 
                      size={28} 
                      className={`${i < lives ? 'fill-red-500 text-red-500' : 'text-slate-800'}`} 
                     />
                   </motion.div>
                 ))}
               </div>

               <div className="text-right relative z-10 hidden sm:block">
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Batería del Sistema</p>
                 <div className="w-48 h-4 bg-slate-800 rounded-full overflow-hidden border border-white/5 p-0.5">
                   <motion.div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${Math.round(((currentQ + 1) / QUIZ_DATA.length) * 100)}%` }}
                   />
                 </div>
               </div>
            </div>

            {/* Main Question Unit */}
            <div className="bg-white rounded-[3.5rem] shadow-2xl border border-slate-100 overflow-hidden relative">
              <div className="p-8 md:p-14">
                <div className="flex justify-between items-center mb-10">
                  <div className="flex items-center gap-3">
                    <span className="bg-indigo-600 text-white px-5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">Misión {currentQ + 1}</span>
                    <span className="text-slate-300 font-black">/</span>
                    <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">{QUIZ_DATA.length} Total</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-2xl">
                    <Sparkles size={16} className="text-indigo-600" />
                    <span className="text-indigo-600 font-black text-lg">{score} <span className="text-[10px] uppercase">XP</span></span>
                  </div>
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 leading-tight tracking-tight">{QUIZ_DATA[currentQ].question}</h3>
                
                {QUIZ_DATA[currentQ].image && (
                  <motion.div 
                    layoutId={`img-${currentQ}`}
                    className="mb-10 rounded-[2.5rem] overflow-hidden aspect-video bg-slate-50 border-4 border-slate-50 shadow-inner group"
                  >
                    <img src={QUIZ_DATA[currentQ].image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="Hardware Challenge" />
                  </motion.div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {QUIZ_DATA[currentQ].options.map((opt, idx) => (
                    <button
                      key={idx}
                      disabled={gameState !== 'playing'}
                      onClick={() => handleAnswer(idx)}
                      className={`w-full p-6 rounded-3xl border-2 font-black text-left transition-all relative overflow-hidden group active:scale-95 ${
                        gameState !== 'playing'
                          ? idx === QUIZ_DATA[currentQ].correct
                            ? 'border-green-500 bg-green-50 text-green-700 shadow-lg shadow-green-500/10'
                            : idx === selectedOption
                              ? 'border-red-500 bg-red-50 text-red-700'
                              : 'border-slate-100 opacity-40'
                          : 'border-slate-100 hover:border-indigo-600 hover:bg-indigo-50/50 hover:shadow-xl hover:shadow-indigo-600/5'
                      }`}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs border-2 ${
                          gameState !== 'playing' && idx === QUIZ_DATA[currentQ].correct ? 'bg-green-500 border-green-500 text-white' : 'border-slate-200 text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-grow">{opt}</span>
                        {gameState !== 'playing' && idx === QUIZ_DATA[currentQ].correct && <CheckCircle2 size={24} className="text-green-500" />}
                        {gameState !== 'playing' && idx === selectedOption && idx !== QUIZ_DATA[currentQ].correct && <AlertCircle size={24} className="text-red-500" />}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {gameState !== 'playing' && (
                <motion.div 
                  initial={{ y: 100, opacity: 0 }} 
                  animate={{ y: 0, opacity: 1 }}
                  className={`p-10 ${gameState === 'correct' ? 'bg-indigo-600' : 'bg-red-600'} text-white relative overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Zap size={120} fill="currentColor" />
                  </div>
                  <div className="flex flex-col md:flex-row gap-8 items-center relative z-10">
                    <div className="p-5 bg-white/20 rounded-3xl backdrop-blur-md shrink-0">
                      {gameState === 'correct' ? <Sparkles size={40} className="text-yellow-300" /> : <AlertCircle size={40} />}
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <h4 className="text-2xl font-black mb-3">{gameState === 'correct' ? '¡Óptima Decisión!' : 'Falla en el Sistema'}</h4>
                      <p className="text-base opacity-90 leading-relaxed max-w-xl font-medium mb-6">
                        {QUIZ_DATA[currentQ].explanation}
                      </p>
                    </div>
                    <button 
                      onClick={nextStep}
                      className="bg-white text-slate-900 px-10 py-5 rounded-2xl font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/20 shrink-0 whitespace-nowrap"
                    >
                      {currentQ === QUIZ_DATA.length - 1 ? 'Finalizar Misión' : 'Siguiente Protocolo'} <ArrowRight size={20} />
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
