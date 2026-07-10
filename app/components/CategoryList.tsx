'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, 
  Star, 
  ShoppingBag, 
  Tag, 
  Shirt, 
  Gem, 
  Glasses, 
  Wallet, 
  Footprints,
  SlidersHorizontal,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  type: string;
  image?: string;
}

interface CategoryListProps {
  products: Product[];
}

function ProductIcon({ type, className }: { type: string; className?: string }) {
  switch (type) {
    case 'shirt':
      return <Shirt className={className} />;
    case 'jewelry':
      return <Gem className={className} />;
    case 'sunglasses':
      return <Glasses className={className} />;
    case 'wallet':
      return <Wallet className={className} />;
    case 'bag':
      return <ShoppingBag className={className} />;
    case 'shoes':
      return <Footprints className={className} />;
    default:
      return <Tag className={className} />;
  }
}

export default function CategoryList({ products }: CategoryListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Find maximum price dynamically to set default slider max
  const maxProductPrice = useMemo(() => {
    if (products.length === 0) return 300;
    return Math.max(...products.map(p => p.price));
  }, [products]);

  const [maxPrice, setMaxPrice] = useState(maxProductPrice);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ show: boolean; message: string; type: 'success' | 'error' | null }>({
    show: false,
    message: '',
    type: null
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification((prev) => {
        if (prev.message === message) {
          return { ...prev, show: false };
        }
        return prev;
      });
    }, 3000);
  };

  // Sync state if products change
  React.useEffect(() => {
    setMaxPrice(maxProductPrice);
  }, [maxProductPrice]);

  const handleAddToCart = async (productId: string) => {
    setAddingId(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      if (res.status === 401) {
        showToast('Please log in to add items to your cart.', 'error');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        return;
      }
      const data = await res.json();
      if (data.success) {
        showToast('Product added to cart!', 'success');
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        showToast(data.message || 'Failed to add item to cart.', 'error');
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setAddingId(null);
    }
  };

  // Real-time filtering
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice = prod.price <= maxPrice;
      return matchesSearch && matchesPrice;
    });
  }, [products, searchQuery, maxPrice]);

  return (
    <div className="w-full space-y-8">
      
      {/* Top Filters Flex-Row */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-stretch sm:items-center bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm backdrop-blur-sm transition-colors duration-200">
        
        {/* Search Input */}
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            id="prod-search"
            type="text"
            className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/60 rounded-2xl pl-10 pr-4 py-3 text-xs text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-550 outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition duration-150"
            placeholder="Search products by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Price Slider */}
        <div className="w-full sm:w-72 flex items-center gap-4 bg-slate-50 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl px-4 py-2">
          <SlidersHorizontal size={14} className="text-zinc-450 dark:text-zinc-500 flex-shrink-0" />
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              <span>Price Limit</span>
              <span className="text-zinc-700 dark:text-zinc-300 font-extrabold">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max={maxProductPrice}
              step="5"
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-600 dark:accent-violet-400"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
        </div>

      </div>

      {/* Products Grid */}
      <div className="w-full">
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900/30 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-12 text-center shadow-sm">
            <ShoppingBag className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-zinc-850 dark:text-zinc-200">No Products Found</h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-450 mt-1">Try adjusting your filters or search keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
            {filteredProducts.map((product) => {
              const hasSale = product.originalPrice !== undefined;
              return (
                <div 
                  key={product.id} 
                  className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Visual container block for product */}
                    <div className="bg-zinc-100 dark:bg-zinc-950/70 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl aspect-square flex items-center justify-center mb-4 transition duration-200 relative group overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <ProductIcon type={product.type} className="w-12 h-12 text-zinc-400 dark:text-zinc-650 group-hover:scale-110 transition duration-250" />
                      )}
                      {hasSale && (
                        <span className="absolute top-3 right-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-rose-600 dark:text-rose-455 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                          Sale
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400" />
                      <span className="text-xs font-semibold text-zinc-650 dark:text-zinc-300">{product.rating}</span>
                    </div>

                    {/* Product Title */}
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 leading-tight">
                      {product.name}
                    </h3>
                  </div>

                  {/* Pricing and Actions */}
                  <div className="mt-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50">${product.price}</span>
                      {hasSale && (
                        <span className="text-xs text-zinc-450 line-through">${product.originalPrice}</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingId === product.id}
                      className="w-full mt-4 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 text-white font-semibold text-xs py-3 rounded-2xl transition duration-150 cursor-pointer disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag size={14} />
                      <span>{addingId === product.id ? "Adding..." : "Add to Cart"}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.15 } }}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-zinc-900/95 dark:bg-zinc-950/95 text-white dark:text-zinc-50 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-zinc-850/10 dark:border-zinc-800/80 max-w-sm"
          >
            <div className={`p-2 rounded-xl ${
              notification.type === 'success' 
                ? 'bg-pink-500/20 text-pink-500' 
                : 'bg-rose-500/20 text-rose-500'
            }`}>
              {notification.type === 'success' ? (
                <Check size={16} className="stroke-[3]" />
              ) : (
                <X size={16} className="stroke-[3]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold tracking-tight text-white dark:text-zinc-100">{notification.message}</p>
            </div>
            <button 
              onClick={() => setNotification(prev => ({ ...prev, show: false }))}
              className="text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300 transition-colors p-1"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
