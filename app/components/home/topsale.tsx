'use client';

import React from 'react';
import Link from 'next/link';
import { Star } from 'lucide-react';



interface TopSellingProps {
  products?: any[];
}

export default function TopSelling({ products = [] }: TopSellingProps) {
  if (products.length === 0) return null;

  const displayProducts = products.map((p, i) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    rating: p.rating || 4.8,
    badge: p.promo ? "Promo" : p.topSelling ? "Top Seller" : p.sponsored ? "Sponsored" : "Best Seller",
    category: p.category,
    image: p.image || `/topsale${(i % 3) + 1}.jpg`,
    description: "Signature item from our latest collection drop."
  }));

  const [addingId, setAddingId] = React.useState<string | null>(null);

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
    <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-white dark:bg-zinc-950 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-10 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5">
          <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Top Selling</h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">Explore this season's absolute favorites across all archives.</p>
        </div>

        {/* Top Selling Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((prod) => (
            <div 
              key={prod.id}
              className="group flex flex-col justify-between"
            >
              <div>
                {/* Product Image Container */}
                <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-900/65 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-zinc-900/85 dark:bg-zinc-50/85 text-white dark:text-zinc-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {prod.badge}
                  </span>

                  {/* Static Add to Cart Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex items-end justify-center p-4 pt-12 z-10">
                    <button 
                      onClick={() => handleAddToCart(prod.id)}
                      disabled={addingId === prod.id}
                      className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs py-3.5 rounded-2xl transition duration-150 shadow-lg text-center cursor-pointer"
                    >
                      {addingId === prod.id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="px-1">
                  <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest block">
                    {prod.category === 'womens' ? "Women's" 
                      : prod.category === 'mens' ? "Men's" 
                      : prod.category === 'footwear' ? "Footwear" 
                      : prod.category === 'active-wear' ? "Active Wear" 
                      : prod.category === 'travel-set' ? "Travel Set" 
                      : prod.category === 'lounge-wear' ? "Lounge Wear" 
                      : prod.category}
                  </span>
                  <h3 className="font-bold text-base md:text-lg text-zinc-900 dark:text-zinc-50 mt-1 leading-snug">
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
                  <span className="font-extrabold text-base md:text-lg text-zinc-900 dark:text-zinc-50">${prod.price}</span>
                  <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-2.5 py-1 rounded-full border border-zinc-200/40 dark:border-zinc-800/40">
                    <Star className="w-3.5 h-3.5 fill-amber-455 stroke-amber-455 text-amber-455" />
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{prod.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}