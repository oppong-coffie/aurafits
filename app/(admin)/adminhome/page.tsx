'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw,
  Sparkles,
  List,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminDashboardHome() {
  const [carts, setCarts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [servedProducts, setServedProducts] = useState<any[]>([]);
  const [rejectedProducts, setRejectedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for display layout mode (List vs Grid)
  const [displayMode, setDisplayMode] = useState<'list' | 'grid'>('list');

  // Fetch live dashboard data from MongoDB
  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      if (data.success) {
        setCarts(data.carts || []);
        setOrders(data.orders || []);
        setServedProducts(data.servedProducts || []);
        setRejectedProducts(data.rejectedProducts || []);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Generic status updater for pending checkout orders
  const handleUpdateOrderStatus = async (orderId: string, nextStatus: 'accepted' | 'completed' | 'cancelled') => {
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId: orderId, status: nextStatus }),
      });
      const data = await res.json();
      if (data.success) {
        const orderItem = orders.find(o => o.id === orderId);
        if (orderItem) {
          if (nextStatus === 'accepted') {
            // Keep in pending orders list, just update status locally
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'accepted' } : o));
          } else {
            // Remove from pending orders list
            setOrders(prev => prev.filter(o => o.id !== orderId));
            if (nextStatus === 'completed') {
              setServedProducts(prev => [
                { ...orderItem, status: 'completed', date: 'Just now' },
                ...prev
              ]);
            } else if (nextStatus === 'cancelled') {
              setRejectedProducts(prev => [
                { ...orderItem, status: 'cancelled', date: 'Just now' },
                ...prev
              ]);
            }
          }
        }
      } else {
        alert(data.message || 'Failed to update order status.');
      }
    } catch (err) {
      console.error('Update order status error:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-10 animate-pulse">
        <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-1/3" />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
          ))}
        </div>
        <div className="h-96 bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-6 py-10 md:py-14 space-y-12">
      
      {/* Dashboard Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/60 px-3 py-1 rounded-full flex items-center gap-1.5 w-fit">
            <Sparkles size={11} className="fill-current animate-pulse" />
            <span>AuraFit Management Console</span>
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-2.5">
            Admin Dashboard
          </h1>
          <p className="text-xs text-zinc-555 dark:text-zinc-400 mt-1">
            Analyze live sales velocity and manage pending checkout orders.
          </p>
        </div>
        
        <button 
          onClick={fetchDashboardData}
          className="inline-flex items-center gap-2 text-xs font-bold text-zinc-650 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 bg-white dark:bg-zinc-900/65 px-4 py-2.5 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/80 shadow-sm cursor-pointer hover:shadow transition duration-150"
        >
          <RotateCcw size={13} className="animate-spin-slow" />
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* Overview Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-850/45 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition duration-205 hover:shadow-md"
        >
          <div className="bg-violet-50 dark:bg-violet-950/30 p-3.5 rounded-2xl text-violet-600 dark:text-violet-400">
            <ShoppingBag size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Active Carts</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{carts.length}</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-850/45 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition duration-205 hover:shadow-md"
        >
          <div className="bg-amber-50 dark:bg-amber-950/30 p-3.5 rounded-2xl text-amber-600 dark:text-amber-400 animate-pulse">
            <Clock size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Pending Orders</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{orders.length}</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-850/45 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition duration-205 hover:shadow-md"
        >
          <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3.5 rounded-2xl text-emerald-600 dark:text-emerald-455">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Served Orders</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{servedProducts.length}</span>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -3, scale: 1.01 }}
          className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-850/45 rounded-3xl p-5 shadow-sm flex items-center gap-4 transition duration-205 hover:shadow-md"
        >
          <div className="bg-rose-50 dark:bg-rose-955/30 p-3.5 rounded-2xl text-rose-600 dark:text-rose-455">
            <XCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">Rejected Orders</span>
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{rejectedProducts.length}</span>
          </div>
        </motion.div>
      </div>

      {/* Section: Pending Orders (Stretched full-width with List/Grid Layout option) */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-805/45 rounded-3xl overflow-hidden shadow-sm">
        <div className="px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20 flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Pending Orders</h2>
          
          {/* Display Mode Toggle */}
          <div className="flex bg-zinc-200/60 dark:bg-zinc-950/60 p-1 rounded-xl border border-zinc-200/20 dark:border-zinc-850/40">
            <button
              onClick={() => setDisplayMode('list')}
              className={`p-1.5 rounded-lg transition duration-150 cursor-pointer flex items-center gap-1 ${
                displayMode === 'list' 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-550 shadow-sm' 
                  : 'text-zinc-455 hover:text-zinc-700'
              }`}
              title="List View"
            >
              <List size={13} />
              <span className="text-[10px] font-bold hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setDisplayMode('grid')}
              className={`p-1.5 rounded-lg transition duration-150 cursor-pointer flex items-center gap-1 ${
                displayMode === 'grid' 
                  ? 'bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-550 shadow-sm' 
                  : 'text-zinc-455 hover:text-zinc-700'
              }`}
              title="Grid View"
            >
              <Grid size={13} />
              <span className="text-[10px] font-bold hidden sm:inline">Grid</span>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <AnimatePresence mode="popLayout">
            {orders.length > 0 ? (
              displayMode === 'list' ? (
                /* List View layout */
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse min-w-[750px]">
                    <thead>
                      <tr className="border-b border-zinc-150 dark:border-zinc-800 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest bg-zinc-50/20 dark:bg-zinc-900/10">
                        <th className="px-5 py-3">Product</th>
                        <th className="px-5 py-3">Customer</th>
                        <th className="px-5 py-3">Date</th>
                        <th className="px-5 py-3 text-right">Value</th>
                        <th className="px-5 py-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                      {orders.map((ord, idx) => {
                        const isAccepted = ord.status === 'accepted';
                        return (
                          <motion.tr 
                            key={ord.id}
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -30 }}
                            className={`transition duration-150 ${
                              isAccepted 
                                ? 'bg-emerald-800/10 dark:bg-emerald-950/20 border-l-4 border-l-emerald-500' 
                                : 'hover:bg-zinc-50/20 dark:hover:bg-zinc-900/5'
                            }`}
                          >
                            {/* Product Image & Name */}
                            <td className="px-5 py-4 min-w-[200px]">
                              <div className="flex items-center gap-3">
                                <div className="relative aspect-[3/4] w-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-zinc-200/30 dark:border-zinc-800/30">
                                  <img 
                                    src={ord.productImage || `/featured${(idx % 4) + 1}.jpg`} 
                                    alt={ord.productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-xs text-zinc-900 dark:text-zinc-50 truncate">{ord.productName}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-zinc-450 dark:text-zinc-500 uppercase font-semibold">Qty: {ord.quantity}</span>
                                    {isAccepted && (
                                      <span className="inline-flex bg-emerald-800/25 dark:bg-emerald-955/65 text-emerald-600 dark:text-emerald-450 text-[9px] font-extrabold px-1.5 py-0.2 rounded border border-emerald-500/20 uppercase tracking-wider">
                                        Accepted Order
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Customer */}
                            <td className="px-5 py-4">
                              <span className="font-bold text-xs text-zinc-805 dark:text-zinc-200">{ord.userName}</span>
                            </td>

                            {/* Date */}
                            <td className="px-5 py-4 text-xs text-zinc-450 dark:text-zinc-500 font-medium">
                              {ord.date}
                            </td>

                            {/* Value */}
                            <td className="px-5 py-4 text-right">
                              <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-50">${ord.totalValue}</span>
                            </td>

                            {/* Action Buttons */}
                            <td className="px-5 py-4">
                              <div className="flex items-center justify-center gap-2">
                                {!isAccepted ? (
                                  <motion.button
                                    animate={{
                                      scale: [1, 1.02, 1],
                                      boxShadow: [
                                        "0 0 0 0px rgba(99, 102, 241, 0)",
                                        "0 0 0 6px rgba(99, 102, 241, 0.25)",
                                        "0 0 0 0px rgba(99, 102, 241, 0)"
                                      ]
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1.5,
                                      ease: "easeInOut"
                                    }}
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'accepted')}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] rounded-xl transition duration-150 cursor-pointer text-center shadow-sm"
                                  >
                                    Accept Order
                                  </motion.button>
                                ) : (
                                  <span className="px-3 py-1.5 text-emerald-600 dark:text-emerald-455 font-bold text-[10px] flex items-center gap-1 select-none">
                                    <CheckCircle2 size={12} className="fill-current" />
                                    <span>Accepted</span>
                                  </span>
                                )}
                                
                                {isAccepted ? (
                                  <motion.button
                                    animate={{
                                      scale: [1, 1.02, 1],
                                      boxShadow: [
                                        "0 0 0 0px rgba(16, 185, 129, 0)",
                                        "0 0 0 6px rgba(16, 185, 129, 0.25)",
                                        "0 0 0 0px rgba(16, 185, 129, 0)"
                                      ]
                                    }}
                                    transition={{
                                      repeat: Infinity,
                                      duration: 1.5,
                                      ease: "easeInOut"
                                    }}
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-xl transition duration-150 cursor-pointer text-center shadow-sm"
                                  >
                                    Complete Order
                                  </motion.button>
                                ) : (
                                  <button
                                    onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-650 dark:bg-emerald-955/20 dark:hover:bg-emerald-900/35 dark:text-emerald-450 font-bold text-[10px] rounded-xl transition duration-150 cursor-pointer text-center"
                                  >
                                    Complete Order
                                  </button>
                                )}

                                <button
                                  onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-650 border border-zinc-200/20 dark:bg-rose-950/20 dark:hover:bg-rose-900/35 dark:text-rose-455 font-bold text-[10px] rounded-xl transition duration-150 cursor-pointer text-center"
                                >
                                  Reject Order
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Grid View layout with 3 actions */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {orders.map((ord, idx) => {
                    const isAccepted = ord.status === 'accepted';
                    return (
                      <motion.div 
                        key={ord.id}
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ type: 'spring', duration: 0.4 }}
                        className={`border rounded-3xl p-5 space-y-4 hover:shadow-sm transition flex flex-col justify-between ${
                          isAccepted 
                            ? 'bg-emerald-950/15 border-emerald-500/40 dark:bg-emerald-950/25' 
                            : 'bg-zinc-50/45 dark:bg-zinc-950/15 border-zinc-200/35 dark:border-zinc-800/40'
                        }`}
                      >
                        <div className="space-y-4">
                          <div className="flex gap-4">
                            <div className="relative aspect-[3/4] w-14 sm:w-16 rounded-2xl overflow-hidden bg-zinc-150 dark:bg-zinc-900 shrink-0 border border-zinc-250/20 dark:border-zinc-800/40">
                              <img 
                                src={ord.productImage || `/featured${(idx % 4) + 1}.jpg`} 
                                alt={ord.productName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0 py-0.5 flex flex-col justify-between">
                              <div>
                                {isAccepted ? (
                                  <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-455 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit">
                                    Accepted Order
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-extrabold text-amber-600 dark:text-amber-455 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 px-2 py-0.5 rounded-md uppercase tracking-wider block w-fit">
                                    Paid Pending
                                  </span>
                                )}
                                <p className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm mt-2.5 truncate">{ord.userName}</p>
                                <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-0.5 truncate font-semibold">{ord.productName}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/50">
                            <div>
                              <span>Quantity: {ord.quantity}</span>
                              <span className="text-[10px] text-zinc-400 dark:text-zinc-550 block font-normal mt-0.5">{ord.date}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-zinc-450 dark:text-zinc-505 block">Total</span>
                              <span className="font-black text-sm text-zinc-900 dark:text-zinc-50">${ord.totalValue}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Grid actions (3 choices) */}
                        <div className="flex flex-col gap-2 mt-4 pt-1.5 border-t border-zinc-150/40 dark:border-zinc-800/25">
                          {!isAccepted ? (
                            <div className="flex gap-2">
                              <motion.button 
                                animate={{
                                  scale: [1, 1.02, 1],
                                  boxShadow: [
                                    "0 0 0 0px rgba(99, 102, 241, 0)",
                                    "0 0 0 6px rgba(99, 102, 241, 0.25)",
                                    "0 0 0 0px rgba(99, 102, 241, 0)"
                                  ]
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }}
                                onClick={() => handleUpdateOrderStatus(ord.id, 'accepted')}
                                className="flex-1 bg-indigo-550 hover:bg-indigo-655 text-white font-bold text-[10px] py-2 rounded-xl transition duration-150 shadow-sm cursor-pointer text-center"
                              >
                                Accept Order
                              </motion.button>
                              <button 
                                onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-2 rounded-xl transition duration-150 shadow-sm cursor-pointer text-center"
                              >
                                Complete Order
                              </button>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <span className="flex-1 border border-emerald-500/20 bg-emerald-800/10 text-emerald-655 dark:text-emerald-450 font-bold text-[10px] py-2 rounded-xl flex items-center justify-center gap-1 select-none">
                                <CheckCircle2 size={12} className="fill-current" />
                                <span>Accepted</span>
                              </span>
                              <motion.button 
                                animate={{
                                  scale: [1, 1.02, 1],
                                  boxShadow: [
                                    "0 0 0 0px rgba(16, 185, 129, 0)",
                                    "0 0 0 6px rgba(16, 185, 129, 0.25)",
                                    "0 0 0 0px rgba(16, 185, 129, 0)"
                                  ]
                                }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 1.5,
                                  ease: "easeInOut"
                                }}
                                onClick={() => handleUpdateOrderStatus(ord.id, 'completed')}
                                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] py-2 rounded-xl transition duration-150 shadow-sm cursor-pointer text-center"
                              >
                                Complete Order
                              </motion.button>
                            </div>
                          )}
                          <button 
                            onClick={() => handleUpdateOrderStatus(ord.id, 'cancelled')}
                            className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-955/20 dark:hover:bg-rose-900/30 dark:text-rose-455 font-bold text-[10px] py-2 rounded-xl transition duration-150 cursor-pointer text-center"
                          >
                            Reject Order
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-10 text-center text-zinc-505 flex flex-col items-center justify-center"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3 fill-emerald-500/10" />
                <p className="text-sm font-bold text-zinc-850 dark:text-zinc-200">All Clear!</p>
                <p className="text-xs text-zinc-450 mt-1 max-w-[240px]">All pending customer checkout orders have been served.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Grid for Served & Rejected logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Section: Served Products */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-805/45 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20">
            <h2 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest">Served Products (Fulfilled)</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
            <AnimatePresence>
              {servedProducts.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-5 flex justify-between items-center hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition duration-150 overflow-hidden"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative aspect-[3/4] w-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-zinc-200/30 dark:border-zinc-800/30">
                      <img 
                        src={p.productImage || `/featured${(idx % 4) + 1}.jpg`} 
                        alt={p.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">{p.productName}</p>
                      <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Customer: {p.userName} &bull; {p.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-zinc-900 dark:text-zinc-50 block">${p.totalValue}</span>
                    <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-600 dark:text-emerald-450 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm mt-1 uppercase">
                      Completed
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {servedProducts.length === 0 && (
              <div className="p-8 text-center text-xs text-zinc-505 leading-relaxed font-semibold">No served products history.</div>
            )}
          </div>
        </div>

        {/* Section: Rejected Products */}
        <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-805/45 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-4.5 border-b border-zinc-100 dark:border-zinc-800/60 bg-zinc-50/50 dark:bg-zinc-900/20">
            <h2 className="text-xs font-extrabold text-zinc-400 dark:text-zinc-555 uppercase tracking-widest">Rejected / Flagged Orders</h2>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-850">
            <AnimatePresence>
              {rejectedProducts.map((p, idx) => (
                <motion.div 
                  key={p.id}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-5 flex justify-between items-center hover:bg-zinc-50/30 dark:hover:bg-zinc-900/10 transition duration-150 overflow-hidden"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative aspect-[3/4] w-10 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-zinc-200/30 dark:border-zinc-800/30">
                      <img 
                        src={p.productImage || `/featured${(idx % 4) + 1}.jpg`} 
                        alt={p.productName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-zinc-900 dark:text-zinc-100 text-sm truncate">{p.productName}</p>
                      <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">Customer: {p.userName} &bull; {p.date}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-black text-sm text-zinc-900 dark:text-zinc-50 block">${p.totalValue}</span>
                    <span className="inline-flex items-center gap-1 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-600 dark:text-rose-455 text-[9px] font-extrabold px-1.5 py-0.5 rounded shadow-sm mt-1 uppercase">
                      Rejected
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {rejectedProducts.length === 0 && (
              <div className="p-8 text-center text-xs text-zinc-550 leading-relaxed font-semibold">No rejected products history.</div>
            )}
          </div>
        </div>
      </div>

      {/* Sales Revenue Trend (Stretched full-width at the bottom of the page) */}
      <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-sm text-zinc-850 dark:text-zinc-205 tracking-tight">Sales Revenue Trend</h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Mocked gross sales metrics over the last 5 weeks.</p>
        </div>
        
        <div className="h-48 flex items-end justify-between gap-6 pt-8 pb-4 px-2 border-b border-zinc-100 dark:border-zinc-800/80">
          {[
            { label: 'Week 23', value: 850, pct: 'h-[35%]', color: 'from-violet-500/80 to-indigo-500/80' },
            { label: 'Week 24', value: 1200, pct: 'h-[50%]', color: 'from-violet-500/80 to-indigo-500/80' },
            { label: 'Week 25', value: 1650, pct: 'h-[68%]', color: 'from-violet-500/80 to-indigo-500/80' },
            { label: 'Week 26', value: 1400, pct: 'h-[58%]', color: 'from-violet-500/80 to-indigo-500/80' },
            { label: 'Week 27', value: 2420, pct: 'h-[100%]', color: 'from-violet-650 to-indigo-650 dark:from-violet-500 dark:to-indigo-550' }
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-955 dark:bg-zinc-50 text-white dark:text-zinc-950 text-[10px] font-extrabold py-1 px-2.5 rounded-lg -translate-y-1 shadow-md">
                ${bar.value}
              </div>
              <div className="w-full flex items-end justify-end h-full min-h-[4px]">
                <div className={`w-full ${bar.pct} bg-gradient-to-t ${bar.color} rounded-t-xl group-hover:opacity-90 transition-all duration-305 shadow-sm`} />
              </div>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-555 mt-1">{bar.label}</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}
