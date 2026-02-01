
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Server, ShoppingCart, DollarSign, Shield, Cpu, Zap, 
  Activity, Lock, ShieldCheck, AlertTriangle,
  LogOut, Plus, Search, Edit3, Trash2, X, Network, Terminal, Save,
  ArrowUpDown, ChevronDown, ChevronUp, Package, MoreHorizontal,
  RefreshCcw, Layers, BarChart3, Settings, Globe, Mail, Palette,
  History, Users, Image as ImageIcon, Check, Database, Boxes
} from 'lucide-react';
import { Product, Sale, Expense, Category, StoreConfig, SystemLog, SecurityAudit, ActivityLog } from '../types';
import { auditSystemSecurity } from '../services/gemini';

interface AdminDashboardProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  sales: Sale[];
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  storeConfig: StoreConfig;
  setStoreConfig: React.Dispatch<React.SetStateAction<StoreConfig>>;
  activityLogs: ActivityLog[];
  onClose: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, setProducts, sales, expenses, setExpenses, 
  storeConfig, setStoreConfig, activityLogs, onClose 
}) => {
  const [activeTab, setActiveTab] = useState('products');
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<SecurityAudit | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Estados de Gestión de Productos
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<Category | 'Todos'>('Todos');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product, direction: 'asc' | 'desc' } | null>({ key: 'id', direction: 'desc' });

  // Estado del Modal de Producto
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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

  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'Todos' || p.category === filterCategory;
      return matchesSearch && matchesCategory;
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
  }, [products, searchQuery, filterCategory, sortConfig]);

  const handleUpdateStock = (id: number, delta: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  const handleAudit = async () => {
    setIsAuditing(true);
    const result = await auditSystemSecurity(JSON.stringify({ store: storeConfig.storeName, items: products.length }));
    setAuditResult(result);
    setIsAuditing(false);
  };

  const handleSaveProduct = (p: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    } else {
      setProducts(prev => [...prev, { ...p, id: Math.floor(Math.random() * 100000) }]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('¿Confirmas la eliminación permanente de este recurso de hardware?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const requestSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSaveSettings = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaveStatus('saving');
    const formData = new FormData(e.currentTarget);
    const updatedConfig: StoreConfig = {
      storeName: formData.get('storeName') as string,
      primaryColor: formData.get('primaryColor') as any,
      paymentUrl: formData.get('paymentUrl') as string,
      shippingUrl: formData.get('shippingUrl') as string,
      contactEmail: formData.get('contactEmail') as string,
    };
    setTimeout(() => { setStoreConfig(updatedConfig); setSaveStatus('saved'); setTimeout(() => setSaveStatus('idle'), 2000); }, 1000);
  };

  const inventoryStats = useMemo(() => {
    const totalItems = products.reduce((acc, p) => acc + p.stock, 0);
    const criticalItems = products.filter(p => p.stock <= (p.lowStockThreshold || 5)).length;
    const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);
    return { totalItems, criticalItems, inventoryValue };
  }, [products]);

  const tabs = [
    { id: 'products', icon: Database, label: 'Products' },
    { id: 'governance', icon: Shield, label: 'Security' },
    { id: 'activity', icon: History, label: 'Ledger' },
    { id: 'finances', icon: DollarSign, label: 'Finance' },
    { id: 'settings', icon: Settings, label: 'Config' }
  ];

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-[#020617] text-slate-200 font-sans overflow-hidden">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-slate-950 border-r border-white/5 flex-col p-8 shrink-0">
        <div className="flex items-center gap-4 mb-14">
          <div className="w-12 h-12 animated-mesh rounded-2xl flex items-center justify-center border border-white/10">
            <Cpu size={24} className="text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-xl tracking-tighter uppercase leading-none">OSART <span className="text-indigo-500">ADMIN</span></span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.3em] mt-1">Kernel v6.0</span>
          </div>
        </div>
        <nav className="space-y-3 flex-grow">
          {tabs.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${activeTab === tab.id ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-600/40' : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-300'}`}
            >
              <tab.icon size={20} />
              <span className="font-black text-[10px] uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </nav>
        <button onClick={onClose} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-red-500 font-black text-[10px] uppercase border border-white/5 rounded-2xl mt-auto">
          <LogOut size={20} /> Logout
        </button>
      </aside>

      <main className="flex-grow flex flex-col relative overflow-hidden pb-24 lg:pb-0">
        <header className="lg:hidden flex justify-between items-center p-6 bg-slate-950/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 animated-mesh rounded-xl flex items-center justify-center"><Cpu size={20} className="text-white" /></div>
             <span className="font-black text-sm uppercase tracking-tighter">OSART <span className="text-indigo-500">ADMIN</span></span>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 rounded-xl text-slate-400"><X size={20} /></button>
        </header>

        <div className="flex-grow overflow-y-auto p-4 lg:p-12 space-y-6 lg:space-y-10 scrollbar-hide">
          <div className="space-y-1">
            <h2 className="text-2xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none">
               {activeTab === 'products' ? 'Product Management' : activeTab === 'settings' ? 'Store Config' : activeTab === 'activity' ? 'Activity Ledger' : activeTab}
            </h2>
            <div className="flex items-center gap-2">
               <div className="w-1 h-3 bg-indigo-500 rounded-full animate-pulse" />
               <span className="text-[8px] lg:text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocolo de Administración Activo</span>
            </div>
          </div>

          {activeTab === 'products' && (
            <>
              {/* Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
                 <KPICard label="Inventory Value" value={`$${inventoryStats.inventoryValue.toLocaleString()}`} icon={DollarSign} color="indigo" />
                 <KPICard label="Critical Stock" value={inventoryStats.criticalItems.toString()} icon={AlertTriangle} color="red" isAlert={inventoryStats.criticalItems > 0} />
                 <div className="hidden lg:block">
                   <KPICard label="Total Catalog SKU" value={products.length.toString()} icon={Boxes} color="blue" />
                 </div>
              </div>

              {/* Filtering Controls */}
              <div className="flex flex-col lg:flex-row gap-4 bg-slate-900/40 p-6 lg:p-8 rounded-[2rem] lg:rounded-[3rem] border border-white/5 backdrop-blur-3xl">
                <div className="relative flex-grow">
                  <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Search components by name or description..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-2xl py-4 pl-14 pr-6 outline-none focus:border-indigo-500 font-black text-[10px] uppercase text-white placeholder:text-slate-700"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative">
                    <select 
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value as any)}
                      className="bg-slate-950 border border-white/10 rounded-2xl py-4 px-6 pr-12 outline-none font-black text-[10px] uppercase text-slate-400 appearance-none focus:border-indigo-500"
                    >
                      <option value="Todos">All Categories</option>
                      <option value="Microcontroladores">MCUs</option>
                      <option value="Pasivos">Pasivos</option>
                      <option value="Sensores">Sensors</option>
                      <option value="Robótica">Robotics</option>
                      <option value="Seguridad">Security</option>
                      <option value="Herramientas">Tools</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                  <button 
                    onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                    className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 shadow-2xl hover:bg-indigo-700 transition-all"
                  >
                    <Plus size={18} /> Add Component
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-slate-900/20 rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div className="hidden lg:grid grid-cols-12 gap-4 px-10 py-6 bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                   <button onClick={() => requestSort('name')} className="col-span-4 flex items-center gap-2 hover:text-white transition-colors">
                      Identity <ArrowUpDown size={12} />
                   </button>
                   <button onClick={() => requestSort('category')} className="col-span-2 flex items-center gap-2 hover:text-white transition-colors">
                      Class <ArrowUpDown size={12} />
                   </button>
                   <button onClick={() => requestSort('stock')} className="col-span-2 flex items-center gap-2 hover:text-white transition-colors">
                      Stock Level <ArrowUpDown size={12} />
                   </button>
                   <button onClick={() => requestSort('price')} className="col-span-2 flex items-center gap-2 hover:text-white transition-colors">
                      Market Value <ArrowUpDown size={12} />
                   </button>
                   <div className="col-span-2 text-right">Protocol Actions</div>
                </div>

                <div className="divide-y divide-white/5">
                  <AnimatePresence mode="popLayout">
                    {processedProducts.map((p) => (
                      <ProductRow 
                        key={p.id} 
                        product={p} 
                        onEdit={() => { setEditingProduct(p); setShowProductModal(true); }}
                        onDelete={() => handleDeleteProduct(p.id)}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                {processedProducts.length === 0 && (
                  <div className="py-32 flex flex-col items-center justify-center text-center opacity-20">
                    <Database size={64} className="mb-4" />
                    <p className="font-black uppercase tracking-widest">No matching assets in database</p>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-4">
               {activityLogs.map((log) => (
                 <div key={log.id} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:bg-white/[0.02] transition-all">
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                         log.category === 'auth' ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' :
                         log.category === 'commerce' ? 'bg-green-600/10 border-green-500/30 text-green-400' :
                         'bg-purple-600/10 border-purple-500/30 text-purple-400'
                       }`}>
                          <History size={24} />
                       </div>
                       <div>
                          <p className="font-black text-sm uppercase text-white tracking-tight">{log.action}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{log.userName} • {new Date(log.timestamp).toLocaleString()}</p>
                       </div>
                    </div>
                    <div className="text-right hidden sm:block">
                       <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">Payload Entry</p>
                       <p className="text-[11px] font-bold text-slate-400 max-w-[300px] truncate">{log.details}</p>
                    </div>
                 </div>
               ))}
               {activityLogs.length === 0 && <div className="py-20 text-center opacity-20 font-black uppercase tracking-widest"><History size={64} className="mx-auto mb-4" /> System idle - No ledger entries</div>}
            </div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl space-y-8">
              <form onSubmit={handleSaveSettings} className="space-y-6 lg:space-y-10">
                <div className="bg-slate-900/40 p-10 rounded-[2.5rem] lg:rounded-[4rem] border border-white/5 backdrop-blur-3xl space-y-8">
                  <div className="space-y-6">
                    <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400"><Terminal size={16} /> Identity_Protocol</label>
                    <div className="bg-slate-950/50 border border-white/10 rounded-3xl p-6">
                      <input name="storeName" defaultValue={storeConfig.storeName} required className="w-full bg-transparent border-none outline-none text-3xl font-black text-white uppercase tracking-tighter" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500"><Globe size={14} /> Gateway_Sync</label>
                      <div className="bg-slate-950/50 border border-white/10 rounded-2xl p-5"><input name="paymentUrl" defaultValue={storeConfig.paymentUrl} className="w-full bg-transparent border-none outline-none text-[11px] font-black text-indigo-400 uppercase tracking-widest" /></div>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500"><ShieldCheck size={14} /> Social Integration</label>
                      <div className="flex gap-4">
                        <div className="p-4 bg-slate-950 border border-blue-500/20 rounded-2xl text-blue-400"><Globe size={22} /></div>
                        <div className="p-4 bg-slate-950 border border-indigo-500/20 rounded-2xl text-indigo-400"><Users size={22} /></div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="submit" disabled={saveStatus !== 'idle'} className={`px-12 py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-4 shadow-2xl ${saveStatus === 'saved' ? 'bg-green-600 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {saveStatus === 'saving' ? <RefreshCcw size={18} className="animate-spin" /> : saveStatus === 'saved' ? <ShieldCheck size={18} /> : <Save size={18} />}
                  {saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'saved' ? 'System Updated' : 'Save Config'}
                </button>
              </form>
            </motion.div>
          )}

          {activeTab === 'governance' && (
             <div className="space-y-8">
                <div className="bg-slate-900/40 p-10 rounded-[3rem] lg:rounded-[4rem] border border-white/5 backdrop-blur-3xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none"><Network size={200} /></div>
                  <h3 className="text-xl font-black flex items-center gap-4 mb-10 uppercase tracking-tighter relative z-10">
                    <Network size={24} className="text-indigo-500" /> Active Latency Monitor
                  </h3>
                  <div className="h-48 lg:h-64 flex items-end gap-1.5 relative">
                    {[...Array(40)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        className="flex-grow bg-indigo-500/20 rounded-t-md"
                        animate={{ height: `${Math.random() * 80 + 20}%` }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', delay: i * 0.02 }}
                      />
                    ))}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-slate-950/90 border border-white/10 px-8 py-5 rounded-3xl text-center backdrop-blur-3xl">
                          <p className="text-4xl lg:text-5xl font-black text-white tabular-nums tracking-tighter">14.2ms</p>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Avg Sync Speed</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-10 rounded-[3rem] border border-white/5 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-purple-600/20 text-purple-400 rounded-3xl flex items-center justify-center border border-purple-500/20">
                       <ShieldCheck size={32} />
                    </div>
                    <div>
                       <h4 className="font-black uppercase text-xl tracking-tighter">Gemini Security Auditor</h4>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Deep Scan Analysis Protocol</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleAudit} 
                    disabled={isAuditing}
                    className="w-full lg:w-auto bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-[11px] uppercase shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4"
                  >
                    {isAuditing ? <Activity size={18} className="animate-spin" /> : <Lock size={18} />}
                    Execute Full System Audit
                  </button>
                </div>
                
                {auditResult && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 p-10 rounded-[3rem] border border-white/10 space-y-6">
                     <div className="flex justify-between items-center">
                        <span className="text-[12px] font-black text-slate-500 uppercase tracking-widest">Integrity Score</span>
                        <span className="text-4xl font-black text-green-500">{auditResult.score}%</span>
                     </div>
                     <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${auditResult.score}%` }} className="h-full bg-green-500 shadow-[0_0_20px_rgba(34,197,94,0.6)] rounded-full" />
                     </div>
                  </motion.div>
                )}
             </div>
          )}
        </div>

        {/* Global Action Trigger */}
        <button 
          onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
          className="fixed bottom-28 lg:bottom-12 right-6 lg:right-12 w-16 h-16 lg:w-20 lg:h-20 bg-indigo-600 text-white rounded-3xl lg:rounded-[2.5rem] shadow-2xl shadow-indigo-600/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60] border border-white/10 group"
        >
           <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        {/* Product Modal */}
        <AnimatePresence>
          {showProductModal && (
            <div className="fixed inset-0 z-[200] flex items-end lg:items-center justify-center">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
              <motion.div 
                initial={{ y: '100%', opacity: 0 }} 
                animate={{ y: 0, opacity: 1 }} 
                exit={{ y: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="bg-[#0f172a] w-full max-w-4xl lg:rounded-[4rem] rounded-t-[3rem] shadow-2xl relative z-10 overflow-hidden border-t border-white/10 lg:border"
              >
                <div className="p-8 lg:p-14 overflow-y-auto max-h-[90vh] lg:max-h-[85vh] scrollbar-hide">
                  <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-6">
                      <div className="p-4 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/20">
                        <Database size={28} />
                      </div>
                      <div>
                        <h3 className="text-3xl lg:text-4xl font-black text-white tracking-tighter uppercase leading-none">
                           {editingProduct ? 'Edit Asset' : 'Asset Registry'}
                        </h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Hardware Inventory Protocol</p>
                      </div>
                    </div>
                    <button onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className="p-4 bg-white/5 rounded-2xl text-slate-400 hover:text-white transition-colors">
                      <X size={28} />
                    </button>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const fd = new FormData(e.currentTarget);
                      const p: Product = {
                        id: editingProduct?.id || 0,
                        name: fd.get('name') as string,
                        price: parseInt(fd.get('price') as string),
                        stock: parseInt(fd.get('stock') as string),
                        lowStockThreshold: parseInt(fd.get('lowStockThreshold') as string),
                        category: fd.get('category') as Category,
                        image: (fd.get('imagePreview') as string) || editingProduct?.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
                        description: fd.get('description') as string,
                        rating: editingProduct?.rating || 5.0,
                        guide: editingProduct?.guide || 'Manual técnico estándar.',
                        proTip: editingProduct?.proTip || 'Validar polaridad antes de conexión.',
                        specs: editingProduct?.specs || { "Revision": "v1.0" }
                      };
                      handleSaveProduct(p);
                    }} 
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                       <div className="space-y-8">
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Identity</label>
                             <input name="name" defaultValue={editingProduct?.name} required placeholder="Component name..." className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-indigo-500 font-black text-[12px] text-white uppercase tracking-tight" />
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Asset Class</label>
                               <select name="category" defaultValue={editingProduct?.category || 'Microcontroladores'} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-indigo-500 font-black text-[12px] text-white uppercase appearance-none">
                                  <option value="Microcontroladores">MCUs</option>
                                  <option value="Sensores">Sensors</option>
                                  <option value="Robótica">Robotics</option>
                                  <option value="Seguridad">Security</option>
                                  <option value="Herramientas">Tools</option>
                               </select>
                            </div>
                            <div className="space-y-3">
                               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Market Price ($)</label>
                               <input name="price" type="number" defaultValue={editingProduct?.price} required placeholder="Price" className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-indigo-500 font-black text-[12px] text-white uppercase" />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                               <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Stock</label>
                               <input name="stock" type="number" defaultValue={editingProduct?.stock} required placeholder="Units" className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-indigo-500 font-black text-[12px] text-white uppercase" />
                            </div>
                            <div className="space-y-3">
                               <label className="text-[11px] font-black text-red-500 uppercase tracking-widest ml-1">Low Stock Alert</label>
                               <input name="lowStockThreshold" type="number" defaultValue={editingProduct?.lowStockThreshold || 5} required className="w-full bg-slate-950 border border-red-500/20 rounded-2xl py-5 px-6 outline-none focus:border-red-500 font-black text-[12px] text-red-400 uppercase" />
                            </div>
                          </div>
                       </div>

                       <div className="space-y-8">
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Visual Asset Blueprint</label>
                             <div className="relative aspect-[16/10] rounded-3xl border-2 border-dashed border-white/10 bg-slate-950 flex flex-col items-center justify-center p-6 group hover:border-indigo-500/50 transition-all overflow-hidden">
                                {editingProduct?.image ? (
                                   <img src={editingProduct.image} className="w-full h-full object-contain relative z-10 p-4" alt="Preview" />
                                ) : (
                                   <div className="flex flex-col items-center gap-4">
                                      <ImageIcon size={48} className="text-slate-800" />
                                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">No Image Asset Loaded</p>
                                   </div>
                                )}
                                <div className="mt-4 w-full">
                                   <input 
                                    type="text" 
                                    name="imagePreview" 
                                    placeholder="Paste Image URL..." 
                                    className="bg-white/5 border border-white/10 rounded-xl px-5 py-3 text-[10px] font-black text-white w-full outline-none focus:border-indigo-500 text-center" 
                                   />
                                </div>
                             </div>
                          </div>
                          <div className="space-y-3">
                             <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Engineering Description</label>
                             <textarea name="description" defaultValue={editingProduct?.description} rows={4} className="w-full bg-slate-950 border border-white/10 rounded-2xl py-5 px-6 outline-none focus:border-indigo-500 font-black text-[12px] text-white uppercase resize-none scrollbar-hide" placeholder="Technical specifications summary..." />
                          </div>
                       </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-5 pt-10">
                       <button 
                        type="submit" 
                        className="flex-grow bg-indigo-600 text-white px-12 py-6 rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-4"
                       >
                         <Check size={20} /> {editingProduct ? 'Commit Changes to Database' : 'Execute Asset Registry'}
                       </button>
                       <button 
                        type="button" 
                        onClick={() => { setShowProductModal(false); setEditingProduct(null); }}
                        className="bg-white/5 text-slate-400 px-12 py-6 rounded-2xl font-black text-[12px] uppercase tracking-widest border border-white/5 hover:bg-white/10 transition-all"
                       >
                         Abort Protocol
                       </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

const ProductRow: React.FC<{ product: Product, onEdit: () => void, onDelete: () => void }> = ({ product, onEdit, onDelete }) => {
  const isCritical = product.stock <= (product.lowStockThreshold || 5);
  return (
    <motion.div 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`group lg:grid lg:grid-cols-12 lg:gap-4 p-4 lg:px-10 lg:py-8 items-center hover:bg-white/[0.03] transition-all relative ${isCritical ? 'bg-red-500/[0.03]' : ''}`}
    >
      <div className="col-span-4 flex items-center gap-6">
        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-3 shadow-xl shrink-0">
          <img src={product.image} className="w-full h-full object-contain" alt={product.name} />
        </div>
        <div className="space-y-1 overflow-hidden">
          <p className="text-sm font-black text-white uppercase truncate tracking-tighter">{product.name}</p>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">REF-{product.id}</p>
        </div>
      </div>
      <div className="hidden lg:flex col-span-2">
        <span className="bg-slate-950 border border-white/10 px-4 py-2 rounded-xl text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.category}</span>
      </div>
      <div className="col-span-2 flex flex-col items-start gap-1">
        <div className="flex items-center gap-3">
          <span className={`text-xl font-black tabular-nums ${isCritical ? 'text-red-500' : 'text-white'}`}>{product.stock}</span>
          {isCritical && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
        </div>
        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full ${isCritical ? 'bg-red-500' : 'bg-indigo-600'}`} 
            style={{ width: `${Math.min(100, (product.stock / 50) * 100)}%` }} 
          />
        </div>
      </div>
      <div className="col-span-2">
        <p className="text-xl font-black text-white tabular-nums">${product.price.toLocaleString()}</p>
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Market Value</p>
      </div>
      <div className="col-span-2 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={onEdit} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white border border-white/5 transition-all"><Edit3 size={18} /></button>
        <button onClick={onDelete} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-red-500 border border-white/5 transition-all"><Trash2 size={18} /></button>
      </div>
    </motion.div>
  );
};

const KPICard: React.FC<{ label: string, value: string, icon: any, color: string, isAlert?: boolean }> = ({ label, value, icon: Icon, color, isAlert }) => (
  <div className={`p-6 lg:p-10 rounded-[2.5rem] lg:rounded-[3.5rem] border transition-all ${isAlert ? 'bg-red-500/10 border-red-500/20' : 'bg-slate-900/40 border-white/5'}`}>
     <div className="flex justify-between items-start mb-6">
        <div className={`p-4 rounded-2xl ${isAlert ? 'bg-red-600 text-white' : `bg-${color}-600/20 text-${color}-400`}`}>
           <Icon size={24} />
        </div>
        <BarChart3 size={20} className="text-slate-800" />
     </div>
     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
     <p className="text-2xl lg:text-4xl font-black text-white tabular-nums tracking-tighter">{value}</p>
  </div>
);

export default AdminDashboard;
