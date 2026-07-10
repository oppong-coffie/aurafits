'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Package, 
  ShoppingBag, 
  ArrowLeft,
  Calendar,
  CheckCircle2,
  DollarSign,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  type?: string;
}

interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  createdAt: string;
  status: string;
}

interface OrdersContentProps {
  items?: CartItem[];
}

export default function OrdersContent({ items = [] }: OrdersContentProps) {
  const [trackingItem, setTrackingItem] = React.useState<CartItem | null>(null);

  const getTrackingStep = (status: string) => {
    switch (status) {
      case 'completed':
        return 4; // Delivered
      case 'accepted':
        return 3; // In Transit
      case 'pending':
      default:
        return 2; // Processing
    }
  };

  const getStatusStatement = (status: string) => {
    switch (status) {
      case 'completed':
        return "Your premium package has been successfully delivered. Enjoy your curated wardrobe!";
      case 'accepted':
        return "Your order has been shipped and is currently in transit to your local distribution hub.";
      case 'pending':
      default:
        return "We have successfully received your payment. Our warehouse team is currently preparing your order.";
    }
  };

  // Format Date helper
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calculations
  const totalSpent = items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
            <Package size={28} className="text-violet-600 dark:text-violet-400" />
            <span>Order History</span>
          </h1>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1">Track and manage your purchased premium archives.</p>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-550 hover:text-zinc-900 dark:text-zinc-405 dark:hover:text-zinc-50 transition duration-150 self-start sm:self-center"
        >
          <ArrowLeft size={14} />
          <span>Continue Shopping</span>
        </Link>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Order items list */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item, idx) => {
              const p = item.productId;
              const fallbackImage = `/featured${(idx % 4) + 1}.jpg`;
              const formattedCategory = p.category === 'womens' ? "Women's" 
                : p.category === 'mens' ? "Men's" 
                : p.category === 'footwear' ? "Footwear" 
                : p.category === 'active-wear' ? "Active Wear" 
                : p.category === 'travel-set' ? "Travel Set" 
                : p.category === 'lounge-wear' ? "Lounge Wear" 
                : p.category;

              // Mock transaction ID from mongoose ID
              const mockOrderId = `ORD-${item._id.substring(item._id.length - 8).toUpperCase()}`;

              return (
                <motion.div 
                  key={item._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 p-5 shadow-sm space-y-4"
                >
                  {/* Order Meta Header */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3.5 border-b border-zinc-100 dark:border-zinc-800/50">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                          Order {mockOrderId}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-900/40">
                          <CheckCircle2 size={10} className="fill-current" />
                          <span>PAID</span>
                        </span>
                      </div>
                      <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-550 flex items-center gap-1">
                        <Calendar size={10} />
                        {formatDate(item.createdAt)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-zinc-400 dark:text-zinc-500 block">Total Price</span>
                      <span className="text-sm font-extrabold text-zinc-900 dark:text-zinc-100">${p.price * item.quantity}</span>
                    </div>
                  </div>

                  {/* Product Details Grid */}
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="relative aspect-[3/4] w-16 sm:w-20 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-zinc-200/30 dark:border-zinc-800/30">
                      <img 
                        src={p.image || fallbackImage} 
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content details */}
                    <div className="flex-1 flex flex-col justify-between py-0.5 min-w-0">
                      <div>
                        <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider block">
                          {formattedCategory}
                        </span>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-150 mt-0.5 truncate">
                          {p.name}
                        </h3>
                        <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">
                          Type: {p.type ? p.type.toUpperCase() : 'STAPLE'}
                        </p>
                      </div>

                      {/* Detail counts and tracking action */}
                      <div className="flex flex-wrap items-center justify-between gap-4 mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/40">
                        <div className="flex items-center gap-4 text-xs font-semibold text-zinc-450 dark:text-zinc-400">
                          <span>Price: ${p.price}</span>
                          <span>Quantity: {item.quantity}</span>
                        </div>
                        <button
                          onClick={() => setTrackingItem(item)}
                          className="bg-pink-500 hover:bg-pink-400 text-white font-bold text-[10px] px-3.5 py-2 rounded-xl transition duration-150 shadow-xs cursor-pointer uppercase tracking-wider"
                        >
                          Track Package
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary/Metrics Widget */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-6 shadow-sm space-y-6"
            >
              <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50 tracking-tight pb-3.5 border-b border-zinc-150 dark:border-zinc-800">
                Purchases Summary
              </h3>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200/20 dark:border-zinc-850/30">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">Total Spent</span>
                  <span className="text-xl font-extrabold text-violet-600 dark:text-violet-400 mt-1 block">${totalSpent}</span>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-950/40 p-4 rounded-2xl border border-zinc-200/20 dark:border-zinc-850/30">
                  <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">Items Ordered</span>
                  <span className="text-xl font-extrabold text-violet-600 dark:text-violet-400 mt-1 block">{totalItems}</span>
                </div>
              </div>

              {/* Guarantees info block */}
              <div className="pt-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 space-y-2 leading-relaxed bg-zinc-50/40 dark:bg-zinc-955/20 border border-zinc-200/20 dark:border-zinc-850/30 rounded-2xl p-4">
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>Invoice ready and mailed to your inbox.</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span>Dispatched and currently in transit.</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div 
          key="orders-empty"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/10 shadow-sm"
        >
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/60 p-5 rounded-full text-violet-600 dark:text-violet-400 mb-6"
          >
            <ShoppingBag size={48} className="text-violet-600" />
          </motion.div>
          
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No Orders Yet</h2>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-2 max-w-sm text-center leading-relaxed">
            You haven't checked out any premium pieces yet. Place your first order by clicking Proceed to Checkout in your cart!
          </p>

          <Link 
            href="/" 
            className="mt-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-950 font-bold text-xs px-8 py-3.5 rounded-2xl transition duration-150 shadow-md cursor-pointer"
          >
            Start Shopping
          </Link>
        </motion.div>
      )}

      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.93, y: 15, opacity: 0 }}
              animate={{ 
                scale: 1, 
                y: 0, 
                opacity: 1,
                transition: { type: 'spring', stiffness: 280, damping: 24 }
              }}
              exit={{ 
                scale: 0.95, 
                y: 10, 
                opacity: 0, 
                transition: { duration: 0.15 } 
              }}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <Package className="text-pink-500 w-5 h-5 animate-pulse" />
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-55 tracking-tight">
                    Track Package
                  </h3>
                </div>
                <button 
                  onClick={() => setTrackingItem(null)}
                  className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-450 dark:text-zinc-400 transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Order Info */}
              <div className="bg-zinc-50 dark:bg-zinc-955/40 p-4 rounded-2xl border border-zinc-200/20 dark:border-zinc-850/30">
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                  <span>Order ID:</span>
                  <span className="font-mono font-bold text-zinc-805 dark:text-zinc-200">
                    {`ORD-${trackingItem._id.substring(trackingItem._id.length - 8).toUpperCase()}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-500 dark:text-zinc-400 mt-2">
                  <span>Product:</span>
                  <span className="font-bold text-zinc-805 dark:text-zinc-200 truncate max-w-[200px]">
                    {trackingItem.productId.name}
                  </span>
                </div>
              </div>

              {/* Stepper Progress Bar */}
              <div className="py-6 relative">
                {/* Horizontal Line Background */}
                <div className="absolute left-6 right-6 top-10.5 h-0.5 bg-zinc-200 dark:bg-zinc-800 z-0">
                  {/* Active Line Fill */}
                  <div 
                    className="h-full bg-pink-500 transition-all duration-500" 
                    style={{ 
                      width: `${((getTrackingStep(trackingItem.status) - 1) / 3) * 100}%` 
                    }} 
                  />
                </div>

                {/* Steps Row */}
                <div className="flex justify-between items-start relative z-10 w-full">
                  {[
                    { label: "Placed", desc: "Payment received" },
                    { label: "Processing", desc: "Preparing items" },
                    { label: "In Transit", desc: "Shipped out" },
                    { label: "Delivered", desc: "Handed over" }
                  ].map((step, idx) => {
                    const stepNumber = idx + 1;
                    const currentStep = getTrackingStep(trackingItem.status);
                    const isCompleted = stepNumber < currentStep;
                    const isActive = stepNumber === currentStep;
                    const isPending = stepNumber > currentStep;

                    return (
                      <div key={idx} className="flex flex-col items-center text-center flex-1 max-w-[25%] px-1">
                        {/* Step Indicator Dot */}
                        <div className={`relative w-9 h-9 rounded-full flex items-center justify-center border font-bold text-xs transition duration-300 shrink-0 mb-2 ${
                          isCompleted 
                            ? 'bg-pink-500 border-pink-500 text-white shadow-sm' 
                            : isActive 
                              ? 'bg-pink-500 border-pink-500 text-white shadow-md' 
                              : 'border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 bg-white dark:bg-zinc-900'
                        }`}>
                          {isActive && (
                            <span className="absolute -inset-1 rounded-full bg-pink-500/35 animate-ping z-0" />
                          )}
                          <span className="relative z-10">{isCompleted ? "✓" : stepNumber}</span>
                        </div>
                        
                        {/* Step Text Info */}
                        <p className={`text-[10px] sm:text-xs font-bold leading-tight ${
                          isActive 
                            ? 'text-pink-500' 
                            : isPending 
                              ? 'text-zinc-400 dark:text-zinc-650' 
                              : 'text-zinc-800 dark:text-zinc-200'
                        }`}>
                          {step.label}
                        </p>
                        <p className="text-[9px] text-zinc-400 dark:text-zinc-550 leading-normal mt-0.5 hidden sm:block">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statement summary box */}
              <div className="bg-pink-50/40 dark:bg-pink-955/10 border border-pink-100 dark:border-pink-950/40 text-pink-700 dark:text-pink-400 rounded-2xl p-4 text-xs font-bold leading-relaxed">
                <p className="flex gap-2">
                  <span className="shrink-0 mt-0.5">ℹ️</span>
                  <span>{getStatusStatement(trackingItem.status)}</span>
                </p>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setTrackingItem(null)}
                className="w-full bg-zinc-900 hover:bg-zinc-850 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-900 font-bold text-xs py-3.5 rounded-xl transition cursor-pointer text-center"
              >
                Done
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
