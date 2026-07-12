'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';



interface SponsoredProps {
  products?: any[];
}

export default function Sponsored({ products = [] }: SponsoredProps) {
  if (products.length === 0) return null;

  const displayItems = products.map((p, i) => {
    // Construct brand name from type
    const brandName = p.type 
      ? (p.type.charAt(0).toUpperCase() + p.type.slice(1) + " Label") 
      : "Partner Label";
    return {
      id: p.id,
      brand: brandName,
      name: p.name,
      price: p.price,
      tagline: "Eco-conscious protection & timeless style",
      category: p.category,
      image: p.image || `/sponsored${(i % 2) + 1}.jpg`,
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

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-12 md:py-16 bg-white dark:bg-zinc-950 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-10 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-5 flex items-center gap-3">
          <div className="bg-violet-50 dark:bg-violet-955/30 border border-violet-100 dark:border-violet-900/60 p-2.5 rounded-2xl text-violet-600 dark:text-violet-400">
            <Sparkles size={22} className="fill-current" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Featured Sponsors</h2>
            <p className="text-xs text-zinc-555 dark:text-zinc-400 mt-0.5">Handpicked premium designs sponsored by our key partner labels.</p>
          </div>
        </div>

        {/* Sponsored Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayItems.map((item) => (
            <div 
              key={item.id}
              className="group flex flex-col justify-between"
            >
              <div>
                {/* Product Image Container */}
                <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-900/65 shadow-sm border border-zinc-200/50 dark:border-zinc-800/50">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105"
                  />
                  <span className="absolute top-4 left-4 bg-zinc-900/85 dark:bg-zinc-50/85 text-white dark:text-zinc-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    Sponsored
                  </span>

                  {/* Static Add to Cart Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent flex items-end justify-center p-4 pt-12 z-10">
                    <button 
                      onClick={() => handleAddToCart(item)}
                      disabled={addingId === item.id || item.status === 'Out Of Stock'}
                      className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white font-bold text-xs py-3.5 rounded-2xl transition duration-150 shadow-lg text-center cursor-pointer disabled:cursor-not-allowed"
                    >
                      {addingId === item.id ? "Adding..." : item.status === 'Out Of Stock' ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="px-1">
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest block">
                    {item.brand}
                  </span>
                  <h3 className="font-bold text-base md:text-lg text-zinc-900 dark:text-zinc-50 mt-1 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>
              </div>

              {/* Pricing Row */}
              <div className="px-1 mt-4 pt-3.5 border-t border-zinc-200/40 dark:border-zinc-800/50">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-base md:text-lg text-zinc-900 dark:text-zinc-50">${item.price}</span>
                  <span className="text-xs font-semibold text-zinc-400">Partner Label</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}