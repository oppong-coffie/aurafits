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
  category?: string;
  promo?: boolean;
  flashSale?: boolean;
  oldPrice?: number;
  newPrice?: number;
  topSelling?: boolean;
  featured?: boolean;
  sponsored?: boolean;
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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
              const displayOriginalPrice = product.originalPrice || product.oldPrice;
              const hasSale = displayOriginalPrice !== undefined;
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
                      {(hasSale || product.promo) && (
                        <span className="absolute top-3 right-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                          {product.promo ? "Promo" : "Sale"}
                        </span>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 text-amber-400" />
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
                        <span className="text-xs text-zinc-400 line-through">${displayOriginalPrice}</span>
                      )}
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="flex-1 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-semibold text-xs py-3 rounded-2xl transition duration-150 cursor-pointer text-center border border-zinc-200/50 dark:border-zinc-750/30 shadow-xs"
                      >
                        View
                      </button>
                      <button 
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingId === product.id}
                        className="flex-[2] bg-pink-600 hover:bg-pink-700 active:bg-pink-800 disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400 dark:disabled:text-zinc-500 text-white font-semibold text-xs py-3 rounded-2xl transition duration-150 cursor-pointer disabled:cursor-not-allowed shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag size={14} />
                        <span>{addingId === product.id ? "Adding..." : "Add to Cart"}</span>
                      </button>
                    </div>
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

      {/* Product Details Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh] md:max-h-[80vh]"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-650 dark:text-zinc-350 transition duration-150 cursor-pointer"
                aria-label="Close Modal"
              >
                <X size={18} />
              </button>

              {/* Product Image Panel */}
              <div className="w-full md:w-1/2 bg-zinc-150 dark:bg-zinc-950 flex items-center justify-center relative p-6 border-b md:border-b-0 md:border-r border-zinc-200 dark:border-zinc-800">
                {selectedProduct.image ? (
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="w-full h-full max-h-[250px] md:max-h-full object-cover rounded-2xl"
                  />
                ) : (
                  <ProductIcon type={selectedProduct.type} className="w-24 h-24 text-zinc-350 dark:text-zinc-700" />
                )}
                {(selectedProduct.originalPrice || selectedProduct.oldPrice || selectedProduct.promo) && (
                  <span className="absolute top-4 left-4 bg-rose-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                    {selectedProduct.promo ? "Promo" : "Sale"}
                  </span>
                )}
              </div>

              {/* Product Info Panel */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  {/* Category and Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-violet-650 dark:text-violet-400 uppercase tracking-widest block capitalize">
                      {selectedProduct.type || "Product"}
                    </span>
                    <div className="flex items-center gap-1 bg-zinc-105 dark:bg-zinc-800/80 px-2.5 py-0.5 rounded-full border border-zinc-200/50 dark:border-zinc-700/40">
                      <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 text-amber-400" />
                      <span className="text-[10px] font-bold text-zinc-700 dark:text-zinc-300">{selectedProduct.rating}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl md:text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight">
                    {selectedProduct.name}
                  </h2>

                  {/* Description / Extra Info */}
                  <div className="space-y-2">
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                      This premium item is crafted using comfortable, top-tier materials designed for everyday resilience and poise. A modern essential tailored for your collection.
                    </p>
                    <div className="pt-2 grid grid-cols-2 gap-y-2 gap-x-4 text-[11px] border-t border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                      <div>
                        <span className="font-semibold text-zinc-400 dark:text-zinc-505 uppercase tracking-wider block text-[9px]">Archived Type</span>
                        <span className="font-medium text-zinc-800 dark:text-zinc-200 mt-0.5 block capitalize">{selectedProduct.type || "Active Wear"}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-zinc-400 dark:text-zinc-505 uppercase tracking-wider block text-[9px]">Status</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400 mt-0.5 block font-bold">In Stock</span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Block */}
                  <div className="pt-2 flex items-baseline gap-2.5">
                    <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">${selectedProduct.price}</span>
                    {(selectedProduct.originalPrice || selectedProduct.oldPrice) && (
                      <span className="text-sm text-zinc-400 line-through">${selectedProduct.originalPrice || selectedProduct.oldPrice}</span>
                    )}
                  </div>
                </div>

                {/* Actions Button */}
                <div className="mt-8 space-y-2">
                  <a 
                    href={`https://wa.me/233201321543?text=${encodeURIComponent(`Hello, I'm interested in buying the ${selectedProduct.name} from AuraFits.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-750 active:bg-emerald-800 text-white font-semibold text-xs py-3.5 rounded-2xl transition duration-150 flex items-center justify-center gap-2 shadow-sm cursor-pointer no-underline text-center"
                  >
                    <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.003 5.234 5.24.001 11.693.001c3.128.002 6.07 1.22 8.28 3.434 2.21 2.215 3.425 5.162 3.424 8.291-.003 6.458-5.24 11.691-11.693 11.691-2.007-.001-3.97-.514-5.712-1.493L0 24zm6.49-3.232c1.644.976 3.256 1.488 4.954 1.49 5.305 0 9.622-4.297 9.624-9.578.002-2.556-.994-4.961-2.805-6.772C16.48 4.097 14.083 3.1 11.533 3.1c-5.302 0-9.619 4.298-9.62 9.582-.001 1.716.463 3.397 1.343 4.896L2.29 21.73l4.257-1.122zM16.63 13.91c-.278-.14-.1.642-.278.642-.284-.144-1.127-.417-2.15-1.328-.79-.705-1.324-1.577-1.48-1.846-.155-.269-.016-.414.12-.55.12-.12.278-.325.417-.487.14-.162.186-.278.278-.464.093-.186.046-.348-.023-.487-.069-.14-.627-1.51-.86-2.07-.225-.544-.453-.47-.626-.479-.162-.008-.348-.01-.532-.01-.186 0-.488.07-.743.348-.256.278-.975.952-.975 2.321 0 1.369.998 2.69 1.137 2.876.14.186 1.966 3.003 4.76 4.206.666.286 1.185.457 1.59.586.67.213 1.28.183 1.762.111.537-.08 1.646-.672 1.878-1.322.232-.65.232-1.206.162-1.322-.069-.116-.255-.186-.534-.326z"/>
                    </svg>
                    <span>Chat 0201321543 to Order</span>
                  </a>
                  <button 
                    onClick={() => {
                      handleAddToCart(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                    disabled={addingId === selectedProduct.id}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 active:bg-black dark:bg-white dark:hover:bg-zinc-100 dark:active:bg-zinc-200 text-white dark:text-zinc-900 font-semibold text-xs py-3.5 rounded-2xl transition duration-150 flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    <ShoppingBag size={15} />
                    <span>{addingId === selectedProduct.id ? "Adding..." : "Add to Cart"}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
