'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  rating?: number;
  category: string;
  image?: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  status?: string;
}

export default function ProductOptionsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState<ProductItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent<{ product: ProductItem }>;
      if (customEvent.detail && customEvent.detail.product) {
        const prod = customEvent.detail.product;
        setProduct(prod);
        // Set default selections
        setSelectedColor(prod.colors && prod.colors.length > 0 ? prod.colors[0] : '');
        setSelectedSize(prod.sizes && prod.sizes.length > 0 ? prod.sizes[0] : '');
        setIsOpen(true);
      }
    };

    window.addEventListener('show-product-options' as any, handleOpen);
    return () => {
      window.removeEventListener('show-product-options' as any, handleOpen);
    };
  }, []);

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: product.id,
          size: selectedSize || undefined,
          color: selectedColor || undefined
        }),
      });

      if (res.status === 401) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: 'Please log in to add items to your cart.', type: 'error' }
        }));
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        setIsOpen(false);
        return;
      }

      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: 'Product added to cart!', type: 'success' }
        }));
        window.dispatchEvent(new CustomEvent('cart-updated'));
        setIsOpen(false);
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
      setIsAdding(false);
    }
  };

  if (!product) return null;

  const hasColors = product.colors && product.colors.length > 0;
  const hasSizes = product.sizes && product.sizes.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-left relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 dark:text-zinc-500 transition cursor-pointer"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight pr-6">
              Customize Product Options
            </h3>
            <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1 mb-5">
              Select your preferred color and size for this item.
            </p>

            {/* Product Preview */}
            <div className="flex gap-4 p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 mb-5">
              <div className="relative aspect-[3/4] w-14 rounded-xl overflow-hidden bg-zinc-150 dark:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/20 shrink-0">
                <img
                  src={product.image || `/featured1.jpg`}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0 gap-1">
                <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                  {product.name}
                </h4>
                <p className="font-extrabold text-xs text-zinc-700 dark:text-zinc-300">
                  GHS {product.price}
                </p>
                {product.status && (
                  <span className={`self-start text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    product.status === 'Out Of Stock'
                      ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400'
                      : product.status === 'Few Left'
                      ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50 text-amber-600 dark:text-amber-400'
                      : 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50 text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {product.status}
                  </span>
                )}
              </div>
            </div>

            {/* Options Selection */}
            <div className="space-y-4 mb-6">
              {/* Colors */}
              {hasColors && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
                    Available Colors
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors!.map((color) => {
                      const isSelected = selectedColor === color;
                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            isSelected
                              ? 'bg-pink-50 dark:bg-pink-955/20 border-pink-500 text-pink-700 dark:text-pink-400 font-bold'
                              : 'bg-zinc-50 dark:bg-zinc-955/20 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {hasSizes && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider block">
                    Available Sizes
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes!.map((size) => {
                      const isSelected = selectedSize === size;
                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            isSelected
                              ? 'bg-violet-50 dark:bg-violet-955/20 border-violet-500 text-violet-700 dark:text-violet-400 font-bold'
                              : 'bg-zinc-50 dark:bg-zinc-955/20 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs py-3 rounded-2xl border border-zinc-200/50 dark:border-zinc-700/30 transition cursor-pointer text-center"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding || product.status === 'Out Of Stock'}
                className="flex-1 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-550 text-white font-bold text-xs py-3 rounded-2xl transition cursor-pointer disabled:cursor-not-allowed shadow-md flex items-center justify-center gap-1.5"
              >
                <ShoppingBag size={14} />
                <span>{
                  isAdding
                    ? 'Adding...'
                    : product.status === 'Out Of Stock'
                    ? 'Out of Stock'
                    : 'Add to Cart'
                }</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
