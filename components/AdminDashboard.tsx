
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Server, ShoppingCart, DollarSign, Shield, Cpu, Zap, 
  Activity, Code, Lock, Fingerprint, ShieldCheck, AlertTriangle,
  LogOut, Plus, Search, Edit3, Trash2, X, Network, Terminal, Save,
  ArrowUpDown, ChevronDown, ChevronUp, Package, Filter, MoreHorizontal,
  RefreshCcw, Layers, BarChart3, Archive
} from 'lucide-react';
import { Product, Sale, Expense, Category, StoreConfig, SystemLog, SecurityAudit } from '../types';
import { auditSystemSecurity } from '../services/gemini';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  storeConfig: StoreConfig;
  setStoreConfig: React.Dispatch<React.SetStateAction<StoreConfig>>;
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, setProducts, sales, expenses, setExpenses, 
  storeConfig, setStoreConfig, onClose 
}) => {
  const [activeTab, setActiveTab] = useState('inventory');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<SecurityAudit | null>(null);

  // Estados de Inventario Dedicado
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'Todos'>('Todos');
  const [filterStockStatus, setFilterStockStatus] = useState<'Todos' | 'Critico'>('Todos');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product, direction: 'asc' | 'desc' } | null>({ key: 'stock', direction: 'asc' });
  const [editingThresholdId, setEditingThresholdId] = useState<number | null>(null);

  // Logs de sistema simulados para la estética técnica
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog: SystemLog = {
        id: Math.random().toString(36).substr(2, 5).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        event: ['INV_SYNC', 'STOCK_UPDATE', 'DB_COMMIT', 'AUTH_VALIDATE', 'CORS_AUDIT'][Math.floor(Math.random() * 5)],
        status: Math.random() > 0.95 ? 'error' : Math.random() > 0.9 ? 'warning' : 'success',
        latency: Math.floor(Math.random() * 45) + 5,
        payloadSize: (Math.random() * 4.5).toFixed(1) + 'KB'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 15));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Lógica de Procesamiento de Inventario
  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'Todos' || p.category === filterCategory;
      const isCritical = p.stock <= (p.lowStockThreshold || 5);
      const matchesStatus = filterStockStatus === 'Todos' || (filterStockStatus === 'Critico' && isCritical);
      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === undefined || bVal === undefined) return 0;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [products, searchQuery, filterCategory, filterStockStatus, sortConfig]);

  const toggleSort = (key: keyof Product) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleUpdateStock = (id: number, delta: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ));
    // Aquí iría el update de Supabase en producción
  };

  const handleUpdateThreshold = (id: number, val: number) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, lowStockThreshold: Math.max(0, val) } : p
    ));
    setEditingThresholdId(null);
  };

  const handleAudit = async () => {
    setIsAuditing(true);
    const result = await auditSystemSecurity(JSON.stringify({ 
      store: storeConfig.storeName, 
      items: products.length, 
      sales: sales.length 
    }));
    setAuditResult(result);
    setIsAuditing(false);
  };

  // KPIs de Inventario
  const inventoryStats = useMemo(() => {
    const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
    const criticalItems = products.filter(p => p.stock <= (p.lowStockThreshold || 5)).length;
    const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    return { totalItems, criticalItems, inventoryValue };
  }, [products]);

  return (
    <div className="flex h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar de Infraestructura */}
      <aside className="w-72 bg-slate-950 border-r border-white/5 flex flex-col p-8 shrink-0">
        <div className="flex items-center gap-4 mb-14">
          <div className="w-12 h-12 animated-mesh rounded-2xl flex items-center justify-center shadow-2xl border border-white/10">
            <Cpu size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter uppercase leading-none">OSART <span className="text-indigo-500">ADMIN</span></span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Infrastructure Kernel v6.0</span>
          </div>
        </div>

        <nav className="space-y-3 flex-grow">
          {[
            { id: 'inventory', icon: Archive, label: 'Vault Inventory' },
            { id: 'governance', icon: Shield, label: 'Kernel Security' },
            { id: 'infrastructure', icon: Server, label: 'Cloud Clusters' },
            { id: 'finances', icon: DollarSign, label: 'Ledger Audit' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${
                activeTab === tab.id 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-600/40' 
                : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <tab.icon size={20} strokeWidth={2.5} />
              <span className="font-black text-[10px] uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        <button onClick={onClose} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-500 transition-all font-black text-[10px] uppercase tracking-widest border border-white/5 rounded-2xl mt-auto">
          <LogOut size={20} /> Cerrar Terminal
        </button>
      </aside>

      {/* Viewport Principal */}
      <main className="flex-grow p-12 overflow-y-auto relative scrollbar-hide">
        <header className="flex justify-between items-center mb-16">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">
               {activeTab === 'inventory' ? 'Inventory Management' : activeTab}
            </h2>
            <div className="flex items-center gap-3">
               <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => <div key={i} className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
               </div>
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocolo de Gestión Avanzada Activo</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end bg-slate-900/50 p-4 rounded-3xl border border-white/5 backdrop-blur-3xl px-8">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network Health</p>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                   <p className="text-lg font-black text-green-500 tabular-nums">99.982%</p>
                </div>
             </div>
             <div className="w-14 h-14 bg-indigo-600/20 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                <Activity size={24} />
             </div>
          </div>
        </header>

        {activeTab === 'inventory' && (
          <div className="space-y-10 pb-20">
            {/* KPI Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               <KPICard 
                label="Valor del Stock" 
                value={`$${inventoryStats.inventoryValue.toLocaleString()}`} 
                icon={DollarSign} 
                color="indigo" 
               />
               <KPICard 
                label="Componentes Totales" 
                value={inventoryStats.totalItems.toLocaleString()} 
                icon={Layers} 
                color="blue" 
               />
               <KPICard 
                label="Alertas de Re-stock" 
                value={inventoryStats.criticalItems.toString()} 
                icon={AlertTriangle} 
                color={inventoryStats.criticalItems > 0 ? "red" : "green"} 
                isAlert={inventoryStats.criticalItems > 0}
               />
            </div>

            {/* Control Bar */}
            <div className="bg-slate-900/40 p-8 rounded-[3rem] border border-white/5 backdrop-blur-3xl flex flex-wrap items-center gap-6">
              <div className="relative group flex-grow max-w-xl">
                <Search size={20} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="text" 
                  placeholder="FILTRAR POR SKU O NOMBRE DE COMPONENTE..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-[2rem] py-5 pl-16 pr-6 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest text-white placeholder:text-slate-600"
                />
              </div>

              <div className="relative group min-w-[240px]">
                <Filter size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" />
                <select 
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value as any)}
                  className="w-full bg-slate-950 border border-white/10 rounded-[2rem] py-5 pl-14 pr-10 outline-none focus:border-indigo-500 transition-all font-black text-[10px] uppercase tracking-widest text-white appearance-none cursor-pointer"
                >
                  <option value="Todos">Todas las Categorías</option>
                  <option value="Microcontroladores">Microcontroladores</option>
                  <option value="Seguridad">Seguridad</option>
                  <option value="Sensores">Sensores</option>
                  <option value="Herramientas">Herramientas</option>
                  <option value="Robótica">Robótica</option>
                </select>
                <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>

              <button 
                onClick={() => setFilterStockStatus(prev => prev === 'Todos' ? 'Critico' : 'Todos')}
                className={`flex items-center gap-3 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest transition-all border ${
                  filterStockStatus === 'Critico' 
                  ? 'bg-red-600 border-red-500 text-white shadow-2xl shadow-red-600/40' 
                  : 'bg-slate-950 border-white/10 text-slate-500 hover:border-red-500/50 hover:text-red-500'
                }`}
              >
                <Zap size={16} />
                {filterStockStatus === 'Critico' ? 'Ver Todos' : 'Ver Stock Bajo'}
              </button>

              <button className="bg-indigo-600 text-white px-8 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all ml-auto flex items-center gap-3">
                 <Plus size={18} /> New SKU
              </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-slate-950 border border-white/5 rounded-[4rem] overflow-hidden shadow-2xl">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-white/5">
                     <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                        <th className="px-10 py-8">
                           <button onClick={() => toggleSort('name')} className="flex items-center gap-2 hover:text-white transition-colors">
                              Componente <ArrowUpDown size={14} />
                           </button>
                        </th>
                        <th className="px-10 py-8 text-center">Categoría</th>
                        <th className="px-10 py-8 text-center">
                           <button onClick={() => toggleSort('stock')} className="flex items-center gap-2 hover:text-white transition-colors mx-auto">
                              Inventario <ArrowUpDown size={14} />
                           </button>
                        </th>
                        <th className="px-10 py-8 text-center">Umbral Crítico</th>
                        <th className="px-10 py-8 text-right">
                           <button onClick={() => toggleSort('price')} className="flex items-center gap-2 hover:text-white transition-colors ml-auto">
                              Valor SKU <ArrowUpDown size={14} />
                           </button>
                        </th>
                        <th className="px-10 py-8 text-center">Acciones</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                     <AnimatePresence mode="popLayout">
                        {processedProducts.map((p) => {
                           const isCritical = p.stock <= (p.lowStockThreshold || 5);
                           return (
                              <motion.tr 
                                 key={p.id}
                                 layout
                                 initial={{ opacity: 0 }}
                                 animate={{ opacity: 1 }}
                                 exit={{ opacity: 0 }}
                                 className="group hover:bg-white/[0.02] transition-colors"
                              >
                                 <td className="px-10 py-8">
                                    <div className="flex items-center gap-6">
                                       <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2.5 shadow-xl transition-transform group-hover:scale-105 duration-500">
                                          <img src={p.image} className="w-full h-full object-contain" alt={p.name} />
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-sm font-black text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{p.name}</p>
                                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">SKU-{p.id}992-CL</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8 text-center">
                                    <span className="bg-slate-900 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                       {p.category}
                                    </span>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex flex-col items-center gap-3">
                                       <div className="flex items-center gap-4 bg-slate-900 rounded-2xl p-2 border border-white/5 shadow-inner">
                                          <button 
                                             onClick={() => handleUpdateStock(p.id, -1)}
                                             className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                          >
                                             <ChevronDown size={18} />
                                          </button>
                                          <span className={`text-xl font-black tabular-nums w-10 text-center ${isCritical ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                                             {p.stock}
                                          </span>
                                          <button 
                                             onClick={() => handleUpdateStock(p.id, 1)}
                                             className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                                          >
                                             <ChevronUp size={18} />
                                          </button>
                                       </div>
                                       <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                          <div 
                                             className={`h-full transition-all duration-1000 ${isCritical ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-indigo-600'}`}
                                             style={{ width: `${Math.min(100, (p.stock / 20) * 100)}%` }}
                                          />
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex justify-center">
                                       {editingThresholdId === p.id ? (
                                          <div className="flex items-center gap-2">
                                             <input 
                                                type="number" 
                                                autoFocus
                                                defaultValue={p.lowStockThreshold || 5}
                                                onBlur={(e) => handleUpdateThreshold(p.id, parseInt(e.target.value))}
                                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateThreshold(p.id, parseInt((e.target as HTMLInputElement).value))}
                                                className="w-20 bg-indigo-600 text-white rounded-xl py-2 px-3 text-center text-sm font-black outline-none shadow-2xl shadow-indigo-600/30"
                                             />
                                          </div>
                                       ) : (
                                          <button 
                                             onClick={() => setEditingThresholdId(p.id)}
                                             className="flex flex-col items-center group/threshold"
                                          >
                                             <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest group-hover/threshold:text-indigo-400 transition-colors">Alert at</span>
                                             <span className="text-lg font-black text-slate-300 group-hover/threshold:text-white">{p.lowStockThreshold || 5}</span>
                                          </button>
                                       )}
                                    </div>
                                 </td>
                                 <td className="px-10 py-8 text-right">
                                    <div className="flex flex-col items-end">
                                       <p className="text-lg font-black text-white tabular-nums">${p.price.toLocaleString()}</p>
                                       <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Base Rate</p>
                                    </div>
                                 </td>
                                 <td className="px-10 py-8">
                                    <div className="flex justify-center gap-3">
                                       <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-white hover:bg-white/10 transition-all border border-white/5">
                                          <Edit3 size={18} />
                                       </button>
                                       <button className="p-4 bg-white/5 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all border border-white/5">
                                          <Trash2 size={18} />
                                       </button>
                                    </div>
                                 </td>
                              </motion.tr>
                           );
                        })}
                     </AnimatePresence>
                  </tbody>
               </table>
               {processedProducts.length === 0 && (
                  <div className="py-40 flex flex-col items-center justify-center text-center opacity-20">
                     <Archive size={80} className="mb-6" />
                     <p className="text-3xl font-black uppercase tracking-[0.4em]">Vault Empty</p>
                     <p className="text-sm font-bold mt-2">No se encontraron componentes en el rango de búsqueda.</p>
                  </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'governance' && (
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8 space-y-10">
                {/* Visualizador de Red */}
                <div className="bg-slate-900/40 p-12 rounded-[4rem] border border-white/5 relative overflow-hidden backdrop-blur-3xl group">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                  <h3 className="text-xl font-black flex items-center gap-4 mb-12 uppercase tracking-tighter">
                    <Network size={22} className="text-indigo-500" /> Latencia de Peticiones Globales
                  </h3>
                  
                  <div className="h-64 flex items-end gap-2 relative">
                    {[...Array(40)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        className="flex-grow bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-colors rounded-t-lg"
                        animate={{ height: `${Math.random() * 80 + 20}%` }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', delay: i * 0.05 }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                       <div className="bg-slate-950/80 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-3xl text-center shadow-2xl">
                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Global Average</p>
                          <p className="text-4xl font-black text-white">14.2 <span className="text-sm text-indigo-500">ms</span></p>
                       </div>
                    </div>
                  </div>
                </div>

                {/* Gemini Security Hub */}
                <div className="bg-slate-900/40 p-12 rounded-[4rem] border border-white/5 backdrop-blur-3xl relative">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-8 mb-12">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-3xl flex items-center justify-center border border-purple-500/20">
                        <ShieldCheck size={28} />
                      </div>
                      <div>
                        <h4 className="font-black text-xl uppercase tracking-tighter leading-none">Security Auditor</h4>
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">Powered by Gemini 3 Pro Engineering</p>
                      </div>
                    </div>
                    <button 
                      onClick={handleAudit}
                      disabled={isAuditing}
                      className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-indigo-700 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-3"
                    >
                      {isAuditing ? <Activity size={16} className="animate-spin" /> : <Lock size={16} />}
                      {isAuditing ? 'Auditing...' : 'Run Audit Protocol'}
                    </button>
                  </div>

                  <AnimatePresence mode="wait">
                    {auditResult ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                      >
                        <div className="bg-slate-950/80 p-8 rounded-[2.5rem] border border-white/5 text-center flex flex-col items-center justify-center">
                           <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Integrity Score</p>
                           <p className="text-7xl font-black text-white leading-none">{auditResult.score}</p>
                           <p className="text-[10px] font-black text-green-500 uppercase tracking-widest mt-6">Safe ✓</p>
                        </div>
                        
                        <div className="md:col-span-2 space-y-6">
                           <div className="bg-slate-950/50 p-8 rounded-[2.5rem] border border-white/5 space-y-5">
                              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <AlertTriangle size={12} className="text-amber-500" /> Vulnerabilities Found
                              </h5>
                              <div className="grid grid-cols-1 gap-3">
                                 {auditResult.vulnerabilities.map((v, i) => (
                                   <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                                      <span className="text-xs font-bold text-slate-300">{v}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="py-24 flex flex-col items-center justify-center text-slate-700 border-2 border-dashed border-white/5 rounded-[4rem]">
                         <Fingerprint size={64} className="mb-6 opacity-10" />
                         <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 text-center">Inicie el protocolo para auditoría de capa 3</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Terminal Column */}
              <div className="lg:col-span-4 space-y-10">
                <div className="bg-slate-950 p-8 rounded-[3rem] border border-white/5 h-[800px] flex flex-col font-mono relative overflow-hidden">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-10 pointer-events-none" />
                  <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4 relative z-10">
                     <h4 className="font-black text-[10px] uppercase tracking-[0.4em] text-slate-500 flex items-center gap-2">
                       <Terminal size={12} /> Root Activity Logs
                     </h4>
                     <div className="flex gap-1.5">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                        <div className="w-2 h-2 bg-slate-800 rounded-full" />
                     </div>
                  </div>
                  
                  <div className="space-y-4 flex-grow overflow-y-auto scrollbar-hide relative z-10">
                    {logs.map(log => (
                      <div key={log.id} className="text-[10px] space-y-1 p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-indigo-500/30 transition-colors">
                        <div className="flex justify-between">
                          <span className="text-indigo-400 font-black tracking-tight">[{log.event}]</span>
                          <span className={`${log.status === 'error' ? 'text-red-500' : log.status === 'warning' ? 'text-amber-500' : 'text-green-500'} font-bold`}>{log.status.toUpperCase()}</span>
                        </div>
                        <div className="text-slate-500 flex justify-between font-medium">
                           <span>{log.timestamp}</span>
                           <span className="opacity-50">{log.latency}ms / {log.payloadSize}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 relative z-10">
                     <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
                        <Code size={16} className="text-indigo-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400">Node Ready: Listening...</span>
                     </div>
                  </div>
                </div>
              </div>
           </div>
        )}
      </main>
    </div>
  );
};

// Componentes Atómicos para el Dashboard
const KPICard: React.FC<{ label: string, value: string, icon: any, color: string, isAlert?: boolean }> = ({ label, value, icon: Icon, color, isAlert }) => (
  <div className={`bg-slate-900/40 p-8 rounded-[3.5rem] border transition-all ${isAlert ? 'border-red-500/30 shadow-[0_20px_50px_rgba(239,68,68,0.1)]' : 'border-white/5 hover:border-indigo-500/20'}`}>
     <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-[1.25rem] ${isAlert ? 'bg-red-600 text-white' : `bg-${color}-600/20 text-${color}-400`}`}>
           <Icon size={24} />
        </div>
        <BarChart3 size={18} className="text-slate-700" />
     </div>
     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">{label}</p>
     <p className="text-3xl font-black text-white tracking-tighter tabular-nums">{value}</p>
     {isAlert && (
        <div className="mt-4 flex items-center gap-2 text-[9px] font-black text-red-500 uppercase tracking-widest">
           <AlertTriangle size={12} /> Critically low resources
        </div>
     )}
  </div>
);

export default AdminDashboard;
