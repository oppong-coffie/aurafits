'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductItem {
  id: string;
  name: string;
  price: number;
  rating?: number;
  category: string;
  image?: string;
  description?: string;
  promo?: boolean;
  topSelling?: boolean;
  sponsored?: boolean;
  flashSale?: boolean;
  colors?: string[];
  sizes?: string[];
  status?: string;
}

interface AllProductsProps {
  products?: ProductItem[];
}

export default function AllProducts({ products = [] }: AllProductsProps) {
  const [addingId, setAddingId] = React.useState<string | null>(null);

  const handleAddToCart = async (product: ProductItem) => {
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

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-slate-50 dark:bg-zinc-950/20 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="mb-10 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5"
        >
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Core Collection</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Explore our complete range of premium designs and lifestyle staples.</p>
        </motion.div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((prod, idx) => {
              // Fallback image cycle
              const fallbackImage = `/featured${(idx % 4) + 1}.jpg`;
              
              // Formatting category name
              const formattedCategory = prod.category === 'womens' ? "Women's" 
                : prod.category === 'mens' ? "Men's" 
                : prod.category === 'footwear' ? "Footwear" 
                : prod.category === 'active-wear' ? "Active Wear" 
                : prod.category === 'travel-set' ? "Travel Set" 
                : prod.category === 'lounge-wear' ? "Lounge Wear" 
                : prod.category;

              // Formatting badge
              const badge = prod.promo ? "Promo" 
                : prod.topSelling ? "Top Seller" 
                : prod.flashSale ? "Flash Deal" 
                : prod.sponsored ? "Sponsored" 
                : null;

              return (
                <motion.div 
                  key={prod.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.35) }}
                  className="group flex flex-col justify-between h-full bg-white dark:bg-zinc-900/40 rounded-3xl p-3 border border-zinc-200/50 dark:border-zinc-800/40 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-full">
                    {/* Product Image Container */}
                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-900/65 border border-zinc-200/35 dark:border-zinc-800/30">
                      <img 
                        src={prod.image || fallbackImage} 
                        alt={prod.name}
                        className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                      />
                      
                      {badge && (
                        <span className={`absolute top-3 left-3 text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                          badge === "Flash Deal" ? "bg-rose-600 text-white" 
                          : badge === "Promo" ? "bg-emerald-600 text-white"
                          : badge === "Sponsored" ? "bg-violet-600 text-white dark:bg-violet-900"
                          : "bg-zinc-900/85 dark:bg-zinc-50/85 text-white dark:text-zinc-900"
                        }`}>
                          {badge}
                        </span>
                      )}

                      {/* Static Add to Cart Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex items-end justify-center p-3 pt-10 z-10">
                        <button 
                          onClick={() => handleAddToCart(prod)}
                          disabled={addingId === prod.id || prod.status === 'Out Of Stock'}
                          className="w-full bg-pink-500 hover:bg-pink-650 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs py-3 rounded-2xl transition duration-150 shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                        >
                          <ShoppingBag size={14} />
                          <span>{addingId === prod.id ? "Adding..." : prod.status === 'Out Of Stock' ? "Out of Stock" : "Add to Cart"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Product Info */}
                    <div className="px-2">
                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                        {formattedCategory}
                      </span>
                      <h3 className="font-bold text-sm md:text-base text-zinc-900 dark:text-zinc-50 mt-1 leading-snug line-clamp-1 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors duration-155">
                        {prod.name}
                      </h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                        {prod.description || "Signature item from our latest collection drop."}
                      </p>
                    </div>
                  </div>

                  {/* Pricing & Rating Row */}
                  <div className="px-2 mt-4 pt-3.5 border-t border-zinc-200/40 dark:border-zinc-800/40">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-base text-zinc-900 dark:text-zinc-50">GHS {prod.price}</span>
                      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-full border border-zinc-200/40 dark:border-zinc-800/40">
                        <Star className="w-3 h-3 fill-amber-400 stroke-amber-400 text-amber-400" />
                        <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{prod.rating || 4.5}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/10">
            <p className="text-sm text-zinc-500">No active products found in the catalog.</p>
          </div>
        )}
      </div>
    </section>
  );
}
