
"use client";

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Forzamos que App.tsx solo se cargue en el cliente
const App = dynamic(() => import("../App"), { 
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-indigo-400 font-black text-[10px] uppercase tracking-[0.3em]">Cargando Kernel Osart...</p>
      </div>
    </div>
  )
});

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <App />;
}
