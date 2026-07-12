'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Zap, 
  Clock, 
  Star 
} from 'lucide-react';
import { motion } from 'framer-motion';



interface FlashSalesProps {
  products?: any[];
}

export default function FlashSales({ products = [] }: FlashSalesProps) {
  const [countdown, setCountdown] = useState({ hours: 8, minutes: 0, seconds: 0 });

  if (products.length === 0) return null;

  const displayProducts = products.map((p, i) => {
    const oldP = p.oldPrice || p.price * 1.3;
    const newP = p.newPrice || p.price;
    const discountPercent = Math.round(((oldP - newP) / oldP) * 100);
    return {
      id: p.id,
      name: p.name,
      price: newP,
      originalPrice: Math.round(oldP),
      discount: `${discountPercent}% OFF`,
      rating: p.rating || 4.8,
      description: "Exclusive flash sale product offer.",
      category: p.category,
      image: p.image || `/flash${(i % 3) + 1}.jpg`,
      colors: p.colors || [],
      sizes: p.sizes || [],
      status: p.status || 'In Stock',
    };
  });

  const [addingId, setAddingId] = React.useState<string | null>(null);

  const handleAddToCart = async (product: any) => {
    if ((product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0)) {
      window.dispatchEvent(new CustomEvent('show-product-options', {
        detail: { product }
      }));
      return;
    }

    setAddingId(product.id);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id }),
      });
      if (res.status === 401) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: 'Please log in to add items to your cart.', type: 'error' }
        }));
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        return;
      }
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: 'Product added to cart!', type: 'success' }
        }));
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: data.message || 'Failed to add item to cart.', type: 'error' }
        }));
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      window.dispatchEvent(new CustomEvent('show-toast', {
        detail: { message: 'An error occurred. Please try again.', type: 'error' }
      }));
    } finally {
      setAddingId(null);
    }
  };

  // Live Countdown Effect
  useEffect(() => {
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(countdownTimer);
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, []);

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-white dark:bg-zinc-955 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-8">
        
        {/* Banner Top Info Card */}
        <div className="w-full bg-gradient-to-r from-yellow-500 to-yellow-500 dark:from-violet-900/60 dark:to-indigo-955/60 text-white rounded-3xl p-3 md:p-4 flex md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest bg-red-500 px-3 py-1 rounded-full inline-block">
              Flash Deal
            </span>
            <h2 className="text-lg md:text-2xl font-extrabold tracking-tight leading-tight">
              Low Sales
            </h2>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500 dark:text-red-400 block mb-2 font-mono">
              Ending In
            </span>
            <div className="flex items-center gap-2 font-mono font-bold text-lg md:text-2xl">
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-red-500">
                {String(countdown.hours).padStart(2, '0')}
              </span>
              <span className="text-white/60 animate-pulse">:</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-red-500">
                {String(countdown.minutes).padStart(2, '0')}
              </span>
              <span className="text-white/60 animate-pulse">:</span>
              <span className="bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 text-red-500">
                {String(countdown.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Full-width Products Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {displayProducts.map((prod, idx) => (
            <motion.div 
              key={prod.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
              className="group flex flex-col justify-between"
            >
              <div>
                {/* Product Image Container */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-900/65 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                  <motion.img 
                    src={prod.image} 
                    alt={prod.name}
                    animate={{ y: [0, -6, 0] }}
                    transition={{
                      duration: 2.5 + (idx % 3) * 0.4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-x-0 w-full h-[110%] -top-2.5 object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                  />
                  
                  {/* Discount Badge */}
                  <motion.span 
                    animate={{ scale: [1, 1.04, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md z-10"
                  >
                    {prod.discount}
                  </motion.span>

                  {/* Static Add to Cart Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex items-end justify-center p-4 pt-12 z-10">
                    <button 
                      onClick={() => handleAddToCart(prod)}
                      disabled={addingId === prod.id || prod.status === 'Out Of Stock'}
                      className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs py-3.5 rounded-2xl transition duration-150 shadow-lg text-center cursor-pointer disabled:cursor-not-allowed"
                    >
                      {addingId === prod.id ? "Adding..." : prod.status === 'Out Of Stock' ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="px-1">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">
                    {prod.category === 'active-wear' ? "Active Wear" : prod.category === 'travel-set' ? "Travel Set" : prod.category === 'lounge-wear' ? "Lounge Wear" : "Foot Wear"}
                  </span>
                  <h3 className="font-bold text-base md:text-lg hover:text-pink-500 text-zinc-900 dark:text-zinc-50 mt-1 leading-snug">
                    {prod.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Pricing & Rating Row */}
              <div className="px-1 mt-4 pt-3.5 border-t border-zinc-200/40 dark:border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="font-extrabold text-base md:text-lg text-zinc-900 dark:text-zinc-50">${prod.price}</span>
                    <span className="text-xs text-zinc-400 line-through">${prod.originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-200/40 dark:border-zinc-800/40">
                    <Star className="w-3.5 h-3.5 fill-amber-455 stroke-amber-455 text-amber-455" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{prod.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}