
"use client";

import dynamic from 'next/dynamic';

// Importamos el componente principal de forma dinámica para evitar problemas con SSR 
// en servicios que dependen de window (como el Game o el Ledger local)
const App = dynamic(() => import("../App"), { ssr: false });

export default function Home() {
  return <App />;
}
