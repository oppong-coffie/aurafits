'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Trash2, 
  ShoppingBag, 
  ArrowLeft,
  ShoppingCart,
  Heart,
  Plus
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
}

interface WishlistContentProps {
  initialItems?: CartItem[];
}

export default function WishlistContent({ initialItems = [] }: WishlistContentProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Restore item to cart (status: 'cart')
  const handleRestoreToCart = async (productId: string) => {
    setUpdatingId(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, status: 'pending' }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(item => item.productId._id !== productId));
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        alert(data.message || 'Failed to restore item.');
      }
    } catch (err) {
      console.error('Restore item error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete item completely from wishlist (status: 'wish')
  const handleDeleteItem = async (productId: string) => {
    if (!confirm('Are you sure you want to permanently delete this item from your wishlist?')) return;
    setUpdatingId(productId);
    try {
      const res = await fetch(`/api/cart?productId=${productId}&status=wish`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(item => item.productId._id !== productId));
      } else {
        alert(data.message || 'Failed to delete item.');
      }
    } catch (err) {
      console.error('Delete item error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight flex items-center gap-2.5">
            <Heart size={28} className="text-violet-600 dark:text-violet-400 fill-violet-600/10" />
            <span>Wishlist</span>
          </h1>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1">Manage items you have saved for later.</p>
        </div>
        <Link 
          href="/cart" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-550 hover:text-zinc-900 dark:text-zinc-405 dark:hover:text-zinc-50 transition duration-150"
        >
          <ShoppingCart size={14} />
          <span>Back to Cart</span>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {items.length > 0 ? (
          <motion.div 
            key="wishlist-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map((item, idx) => {
              const p = item.productId;
              const isUpdating = updatingId === p._id;
              
              const fallbackImage = `/featured${(idx % 4) + 1}.jpg`;
              const formattedCategory = p.category === 'womens' ? "Women's" 
                : p.category === 'mens' ? "Men's" 
                : p.category === 'footwear' ? "Footwear" 
                : p.category === 'active-wear' ? "Active Wear" 
                : p.category === 'travel-set' ? "Travel Set" 
                : p.category === 'lounge-wear' ? "Lounge Wear" 
                : p.category;

              return (
                <motion.div 
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col p-5 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm justify-between"
                >
                  <div>
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 mb-4">
                      <img 
                        src={p.image || fallbackImage} 
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Details */}
                    <div>
                      <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">
                        {formattedCategory}
                      </span>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 mt-0.5">
                        {p.name}
                      </h3>
                      <p className="text-xs text-zinc-450 dark:text-zinc-405 font-medium mt-0.5">
                        Type: {p.type ? p.type.toUpperCase() : 'STAPLE'}
                      </p>
                      
                      {/* Price & Quantity Info */}
                      <div className="flex items-center justify-between mt-3">
                        <span className="font-extrabold text-base text-zinc-900 dark:text-zinc-50">
                          ${p.price}
                        </span>
                        <span className="text-[11px] text-zinc-400 font-semibold bg-zinc-50 dark:bg-zinc-900/60 px-2 py-0.5 rounded-lg border border-zinc-200/20 dark:border-zinc-850/40">
                          Qty: {item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex gap-2.5 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                    <button 
                      onClick={() => handleRestoreToCart(p._id)}
                      disabled={isUpdating}
                      className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-violet-600 hover:bg-violet-750 text-white py-3 px-4 rounded-2xl transition duration-150 cursor-pointer disabled:bg-violet-400"
                    >
                      <ShoppingCart size={13} />
                      <span>Restore to Cart</span>
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteItem(p._id)}
                      disabled={isUpdating}
                      className="p-3 text-rose-600 hover:text-rose-750 hover:bg-rose-50 dark:text-rose-400 dark:hover:text-rose-350 dark:hover:bg-rose-950/20 rounded-2xl border border-zinc-200/40 dark:border-zinc-800/40 transition duration-150 cursor-pointer"
                      aria-label="Delete Item"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div 
            key="wishlist-empty"
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
              <Heart size={48} className="fill-violet-600/10 text-violet-600" />
            </motion.div>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Your Wishlist is Empty</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm text-center leading-relaxed">
              You haven't saved any premium pieces yet. Explore the shop and move items you love to your wishlist to buy them later!
            </p>

            <Link 
              href="/" 
              className="mt-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-950 font-bold text-xs px-8 py-3.5 rounded-2xl transition duration-150 shadow-md cursor-pointer"
            >
              Discover Pieces
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
