
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Box, DollarSign, TrendingUp, Users, Plus, 
  Search, Edit3, Trash2, X, Upload, Save, Calendar, 
  ShoppingCart, Filter, ChevronRight, Settings, CreditCard,
  PieChart, ArrowUpRight, ArrowDownRight, Globe, ShieldCheck, Mail, AlertTriangle
} from 'lucide-react';
import { Product, Sale, Expense, Category, StoreConfig } from './types';

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

type AdminTab = 'overview' | 'inventory' | 'sales' | 'finances' | 'config';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  products, setProducts, sales, expenses, setExpenses, 
  storeConfig, setStoreConfig, onClose 
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estadísticas Calculadas
  const stats = useMemo(() => {
    const totalRevenue = sales.reduce((acc, sale) => acc + sale.total, 0);
    const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const profit = totalRevenue - totalExpenses;
    const avgOrder = sales.length ? totalRevenue / sales.length : 0;
    
    return { totalRevenue, totalExpenses, profit, avgOrder };
  }, [sales, expenses]);

  const handleSaveProduct = (p: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(item => item.id === p.id ? p : item));
    } else {
      setProducts(prev => [...prev, { ...p, id: Date.now() }]);
    }
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('¿Confirmas la eliminación permanente de este componente del inventario?')) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleUpdateConfig = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newConfig: StoreConfig = {
      storeName: fd.get('storeName') as string,
      primaryColor: fd.get('primaryColor') as any,
      paymentUrl: fd.get('paymentUrl') as string,
      shippingUrl: fd.get('shippingUrl') as string,
      contactEmail: fd.get('contactEmail') as string,
    };
    setStoreConfig(newConfig);
    alert('Configuración sincronizada correctamente.');
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 rounded-[3rem] overflow-hidden flex flex-col border border-white/5 shadow-2xl">
      {/* Sidebar de Navegación */}
      <div className="flex h-full">
        <aside className="w-20 md:w-64 bg-slate-900 border-r border-white/5 flex flex-col p-6 space-y-8 shrink-0">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <span className="font-black text-xl tracking-tighter hidden md:block">OSART OS</span>
          </div>

          <nav className="flex-grow space-y-2">
            {[
              { id: 'overview', icon: PieChart, label: 'Resumen' },
              { id: 'inventory', icon: Box, label: 'Inventario' },
              { id: 'sales', icon: ShoppingCart, label: 'Ventas' },
              { id: 'finances', icon: DollarSign, label: 'Finanzas' },
              { id: 'config', icon: Settings, label: 'Tienda' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as AdminTab)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:bg-white/5'
                }`}
              >
                <div className="relative">
                   <tab.icon size={22} />
                   {tab.id === 'overview' && products.some(p => p.stock < (p.lowStockThreshold || 5)) && (
                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                   )}
                </div>
                <span className="font-bold text-sm hidden md:block">{tab.label}</span>
              </button>
            ))}
          </nav>

          <button onClick={onClose} className="mt-auto w-full p-4 rounded-2xl border border-white/10 text-slate-400 hover:bg-white/5 font-bold text-sm hidden md:block">
            Cerrar Terminal
          </button>
        </aside>

        {/* Área de Contenido Principal */}
        <main className="flex-grow overflow-y-auto p-8 bg-[#0a0c10]">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-white capitalize">{activeTab}</h2>
              <p className="text-slate-500 text-sm font-medium">Panel de Control de Infraestructura Soberana</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-900 p-2 rounded-xl border border-white/5 flex items-center gap-3 px-4">
                <Calendar size={16} className="text-blue-500" />
                <span className="text-xs font-black uppercase text-slate-300">Mayo 2024</span>
              </div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="ov" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard label="Ingresos Totales" value={`$${stats.totalRevenue.toLocaleString()}`} trend="+12%" icon={DollarSign} color="blue" />
                  <StatCard label="Gastos Operativos" value={`$${stats.totalExpenses.toLocaleString()}`} trend="-2%" icon={ArrowDownRight} color="red" />
                  <StatCard label="Margen Neto" value={`$${stats.profit.toLocaleString()}`} trend="+5%" icon={TrendingUp} color="green" />
                  <StatCard label="Ticket Promedio" value={`$${stats.avgOrder.toLocaleString()}`} trend="+8%" icon={CreditCard} color="indigo" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5">
                    <h3 className="font-black text-xl mb-6">Actividad de Ventas Reciente</h3>
                    <div className="space-y-4">
                      {sales.slice(0, 5).map(sale => (
                        <div key={sale.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center">
                              <Users size={20} />
                            </div>
                            <div>
                              <p className="font-bold text-sm text-white">{sale.customerEmail}</p>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{sale.date}</p>
                            </div>
                          </div>
                          <p className="font-black text-blue-400">${sale.total.toLocaleString()}</p>
                        </div>
                      ))}
                      {!sales.length && <p className="text-slate-500 text-center py-10 font-bold">Sin registros de transacciones.</p>}
                    </div>
                  </div>
                  
                  <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex items-center gap-3 mb-6">
                       <h3 className="font-black text-xl">Alertas de Inventario Crítico</h3>
                       {products.filter(p => p.stock < (p.lowStockThreshold || 5)).length > 0 && (
                          <span className="bg-red-500/20 text-red-500 px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                             ACCIÓN REQUERIDA
                          </span>
                       )}
                    </div>
                    <div className="space-y-4">
                       {products.filter(p => p.stock < (p.lowStockThreshold || 5)).map(p => (
                         <div key={p.id} className="flex items-center justify-between p-4 bg-red-500/10 rounded-2xl border border-red-500/20 group">
                            <div className="flex items-center gap-4">
                               <img src={p.image} className="w-10 h-10 rounded-lg object-cover" />
                               <div>
                                  <p className="font-bold text-sm text-white">{p.name}</p>
                                  <p className="text-[8px] text-red-400 font-black uppercase tracking-widest">Umbral: {p.lowStockThreshold || 5} unids</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-3">
                               <AlertTriangle size={14} className="text-red-500" />
                               <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">{p.stock} UNIDS</span>
                            </div>
                         </div>
                       ))}
                       {products.filter(p => p.stock < (p.lowStockThreshold || 5)).length === 0 && (
                          <div className="flex flex-col items-center justify-center py-10 text-slate-600">
                             <ShieldCheck size={40} className="mb-3 opacity-20" />
                             <p className="text-sm font-bold">Inventario dentro de parámetros nominales.</p>
                          </div>
                       )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'inventory' && (
              <motion.div key="inv" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                   <div className="relative w-96">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                      <input type="text" placeholder="Buscar por SKU, Nombre..." className="w-full bg-slate-900 border border-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all text-sm font-bold" />
                   </div>
                   <button 
                    onClick={() => { setEditingProduct(null); setShowProductModal(true); }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20"
                   >
                     <Plus size={18} /> Añadir Componente
                   </button>
                </div>

                <div className="bg-slate-900/50 rounded-[2.5rem] border border-white/5 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-widest border-b border-white/5">
                      <tr>
                        <th className="p-6">Producto</th>
                        <th className="p-6">Categoría</th>
                        <th className="p-6">Precio</th>
                        <th className="p-6">Stock / Umbral</th>
                        <th className="p-6">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-white/5 transition-colors group">
                          <td className="p-6">
                            <div className="flex items-center gap-4">
                              <img src={product.image} className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                              <span className="font-black text-sm text-white">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-6"><span className="text-xs font-bold text-slate-400">{product.category}</span></td>
                          <td className="p-6 font-black text-blue-400">${product.price.toLocaleString()}</td>
                          <td className="p-6">
                            <div className="flex flex-col gap-1">
                               <span className={`px-3 py-1 rounded-full text-[10px] font-black w-fit ${product.stock < (product.lowStockThreshold || 5) ? 'bg-red-600/20 text-red-500' : 'bg-green-600/20 text-green-500'}`}>
                                 {product.stock} UNIDS
                               </span>
                               <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest ml-1">Alerta: {product.lowStockThreshold || 5}</span>
                            </div>
                          </td>
                          <td className="p-6">
                            <div className="flex gap-2">
                              <button onClick={() => { setEditingProduct(product); setShowProductModal(true); }} className="p-2 hover:bg-blue-600 text-slate-400 hover:text-white rounded-lg transition-all"><Edit3 size={16} /></button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-2 hover:bg-red-600 text-slate-400 hover:text-white rounded-lg transition-all"><Trash2 size={16} /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'sales' && (
              <div className="bg-slate-900/50 rounded-[2.5rem] border border-white/5 p-8">
                 <h3 className="font-black text-xl mb-8">Libro de Ventas y Facturación</h3>
                 <div className="space-y-4">
                   {sales.map(sale => (
                     <div key={sale.id} className="bg-white/5 p-6 rounded-3xl border border-white/5 flex flex-wrap justify-between items-center gap-6">
                        <div className="flex gap-4 items-center">
                           <div className="bg-green-500/20 text-green-500 p-4 rounded-2xl"><ShoppingCart size={24} /></div>
                           <div>
                              <p className="font-black text-white">{sale.customerEmail}</p>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Pedido ID: {sale.id.slice(-8)} • {sale.date}</p>
                           </div>
                        </div>
                        <div className="flex-grow flex gap-10">
                           <div>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Items</p>
                              <p className="font-bold text-xs">{sale.items.length} componentes</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Estado</p>
                              <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase">PAGADO</span>
                           </div>
                        </div>
                        <p className="text-2xl font-black text-white">${sale.total.toLocaleString()}</p>
                     </div>
                   ))}
                   {!sales.length && <p className="text-slate-500 text-center py-20 font-bold">No se han registrado ventas aún.</p>}
                 </div>
              </div>
            )}

            {activeTab === 'finances' && (
              <div className="space-y-8">
                 <div className="bg-slate-900/50 p-8 rounded-[2.5rem] border border-white/5">
                    <div className="flex justify-between items-center mb-8">
                       <h3 className="font-black text-xl">Registro de Gastos del Mes</h3>
                       <button onClick={() => {
                          const desc = prompt('Descripción del gasto:');
                          const amount = prompt('Monto ($):');
                          if(desc && amount) {
                             setExpenses(prev => [...prev, {
                               id: Date.now().toString(),
                               date: new Date().toLocaleDateString(),
                               category: 'Servicios',
                               description: desc,
                               amount: parseInt(amount)
                             }]);
                          }
                       }} className="bg-white text-slate-950 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                          Registrar Gasto
                       </button>
                    </div>
                    <div className="space-y-3">
                       {expenses.map(exp => (
                         <div key={exp.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="flex items-center gap-4">
                               <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                               <div>
                                  <p className="font-bold text-sm text-white">{exp.description}</p>
                                  <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{exp.date}</p>
                               </div>
                            </div>
                            <p className="font-black text-red-400">-${exp.amount.toLocaleString()}</p>
                         </div>
                       ))}
                    </div>
                 </div>
              </div>
            )}

            {activeTab === 'config' && (
              <motion.div key="config" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl space-y-8">
                <div className="bg-slate-900/50 p-10 rounded-[2.5rem] border border-white/5">
                   <h3 className="text-2xl font-black mb-8 flex items-center gap-3">
                      <Settings className="text-blue-500" /> Configuración Global de la Plataforma
                   </h3>
                   
                   <form onSubmit={handleUpdateConfig} className="space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Comercial de la Tienda</label>
                            <input name="storeName" defaultValue={storeConfig.storeName} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Esquema de Color Primario</label>
                            <select name="primaryColor" defaultValue={storeConfig.primaryColor} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none">
                               <option value="blue">Azul Industrial (Standard)</option>
                               <option value="indigo">Indigo Eléctrico</option>
                               <option value="slate">Slate Minimalista</option>
                            </select>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><CreditCard size={12}/> Gateway de Pagos (API Endpoint)</label>
                            <input name="paymentUrl" defaultValue={storeConfig.paymentUrl} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Globe size={12}/> Sistema de Logística y Envíos</label>
                            <input name="shippingUrl" defaultValue={storeConfig.shippingUrl} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Mail size={12}/> Email de Soporte Técnico</label>
                            <input name="contactEmail" defaultValue={storeConfig.contactEmail} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                         </div>
                      </div>

                      <div className="bg-blue-600/10 p-6 rounded-3xl border border-blue-600/20 flex items-center gap-4">
                         <ShieldCheck className="text-blue-500 shrink-0" size={24} />
                         <p className="text-xs text-blue-100/60 font-medium">Estos ajustes afectan la identidad visual de la tienda y los flujos de backend simulados. Asegúrese de que los endpoints sean válidos para el entorno de producción.</p>
                      </div>

                      <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-600/30">
                        <Save size={24} /> Sincronizar Cambios de Infraestructura
                      </button>
                   </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal de Producto (Añadir/Editar) */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden border border-white/10"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                   <h3 className="text-2xl font-black">{editingProduct ? 'Editar Protocolo' : 'Nuevo Componente'}</h3>
                   <button onClick={() => { setShowProductModal(false); setEditingProduct(null); }} className="p-2 hover:bg-white/5 rounded-xl text-slate-500"><X size={24} /></button>
                </div>

                <form className="space-y-6" onSubmit={(e) => {
                   e.preventDefault();
                   const fd = new FormData(e.currentTarget);
                   const p: Product = {
                      id: editingProduct?.id || 0,
                      name: fd.get('name') as string,
                      price: parseInt(fd.get('price') as string),
                      stock: parseInt(fd.get('stock') as string),
                      lowStockThreshold: parseInt(fd.get('lowStockThreshold') as string),
                      category: fd.get('category') as Category,
                      image: editingProduct?.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80',
                      description: fd.get('description') as string,
                      rating: 5.0,
                      guide: 'Guía técnica base.',
                      proTip: 'Asegurar conexión.',
                      specs: { "Tipo": "Industrial" }
                   };
                   handleSaveProduct(p);
                }}>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
                       <input name="name" defaultValue={editingProduct?.name} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                       <select name="category" defaultValue={editingProduct?.category || 'Microcontroladores'} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold appearance-none">
                          <option value="Microcontroladores">Microcontroladores</option>
                          <option value="Pasivos">Pasivos</option>
                          <option value="Robótica">Robótica</option>
                          <option value="Semiconductores">Semiconductores</option>
                          <option value="Herramientas">Herramientas</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Precio ($)</label>
                       <input name="price" type="number" defaultValue={editingProduct?.price} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stock Actual</label>
                       <input name="stock" type="number" defaultValue={editingProduct?.stock} required className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold" />
                    </div>
                    <div className="space-y-2 col-span-2">
                       <label className="text-[10px] font-black text-red-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                          <AlertTriangle size={12} /> Nivel de Alerta de Stock Bajo
                       </label>
                       <input 
                         name="lowStockThreshold" 
                         type="number" 
                         defaultValue={editingProduct?.lowStockThreshold || 5} 
                         required 
                         className="w-full bg-red-500/5 border border-red-500/20 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-red-600 font-bold text-red-400" 
                       />
                       <p className="text-[9px] text-slate-500 font-medium ml-1">Se activará una notificación si el inventario cae por debajo de este valor.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción Técnica</label>
                     <textarea name="description" defaultValue={editingProduct?.description} rows={3} className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-5 outline-none focus:ring-2 focus:ring-blue-600 font-bold resize-none" />
                  </div>

                  <div className="border-2 border-dashed border-white/10 p-10 rounded-[2rem] text-center hover:bg-white/5 transition-all cursor-pointer relative group">
                     <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) {
                           const reader = new FileReader();
                           reader.onloadend = () => {
                             if(editingProduct) setEditingProduct({...editingProduct, image: reader.result as string});
                             else setEditingProduct({ id: 0, name: '', price: 0, stock: 0, category: 'Pasivos', rating: 5, image: reader.result as string, description: '', guide: '', proTip: '', specs: {} });
                           };
                           reader.readAsDataURL(file);
                        }
                     }} />
                     <div className="flex flex-col items-center gap-4">
                        <Upload size={32} className="text-blue-500" />
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cargar Imagen de Hardware</p>
                        {editingProduct?.image && <p className="text-[10px] text-blue-400 font-black">IMAGEN CARGADA ✓</p>}
                     </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-700 shadow-2xl shadow-blue-600/30">
                    <Save size={24} /> Sincronizar con Base de Datos
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string; trend: string; icon: any; color: string }> = ({ label, value, trend, icon: Icon, color }) => (
  <div className="bg-slate-900/50 p-6 rounded-3xl border border-white/5 group hover:border-blue-500/50 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-600/20 text-${color}-400`}>
        <Icon size={20} />
      </div>
      <span className={`text-xs font-black uppercase ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</span>
    </div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-white">{value}</p>
  </div>
);

export default AdminDashboard;
