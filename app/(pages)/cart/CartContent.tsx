'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  image?: string;
  type?: string;
  colors?: string[];
  sizes?: string[];
}

interface CartItem {
  _id: string;
  userId: string;
  productId: Product;
  quantity: number;
  size?: string;
  color?: string;
  createdAt: string;
}

interface CartContentProps {
  initialItems?: CartItem[];
}

export default function CartContent({ initialItems = [] }: CartContentProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  // Update quantity handler
  const handleUpdateQuantity = async (productId: string, currentQty: number, delta: number, size?: string, color?: string) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;

    setUpdatingId(productId);
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity: newQty, size, color }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => 
          prev.map(item => 
            item.productId._id === productId && item.size === size && item.color === color
              ? { ...item, quantity: newQty } 
              : item
          )
        );
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        alert(data.message || 'Failed to update quantity.');
      }
    } catch (err) {
      console.error('Update quantity error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  // Update options (size/color) handler
  const handleUpdateOptions = async (cartItemId: string, newSize?: string, newColor?: string) => {
    setUpdatingId(cartItemId);
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartItemId, size: newSize, color: newColor }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.merged) {
          setItems(prev => {
            const remaining = prev.filter(item => item._id !== data.deletedId);
            return remaining.map(item => 
              item._id === data.updatedItem._id 
                ? { ...item, quantity: data.updatedItem.quantity } 
                : item
            );
          });
        } else if (data.cartItem) {
          setItems(prev => 
            prev.map(item => 
              item._id === cartItemId 
                ? { ...item, size: data.cartItem.size, color: data.cartItem.color } 
                : item
            )
          );
        }
        window.dispatchEvent(new CustomEvent('cart-updated'));
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: 'Item options updated.', type: 'success' }
        }));
      } else {
        window.dispatchEvent(new CustomEvent('show-toast', {
          detail: { message: data.message || 'Failed to update options.', type: 'error' }
        }));
      }
    } catch (err) {
      console.error('Update options error:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const promptRemoveItem = (item: CartItem) => {
    setItemToRemove(item);
    setShowRemoveModal(true);
  };

  const handleAddToWishlist = async () => {
    if (!itemToRemove) return;
    const productId = itemToRemove.productId._id;
    const size = itemToRemove.size;
    const color = itemToRemove.color;
    setUpdatingId(productId);
    setShowRemoveModal(false);
    try {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, status: 'wish', size, color }),
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(item => !(item.productId._id === productId && item.size === size && item.color === color)));
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        alert(data.message || 'Failed to add to wishlist.');
      }
    } catch (err) {
      console.error('Add to wishlist error:', err);
    } finally {
      setUpdatingId(null);
      setItemToRemove(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToRemove) return;
    const productId = itemToRemove.productId._id;
    const size = itemToRemove.size;
    const color = itemToRemove.color;
    setUpdatingId(productId);
    setShowRemoveModal(false);
    try {
      const res = await fetch(`/api/cart?productId=${productId}&status=pending&size=${encodeURIComponent(size || '')}&color=${encodeURIComponent(color || '')}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setItems(prev => prev.filter(item => !(item.productId._id === productId && item.size === size && item.color === color)));
        window.dispatchEvent(new CustomEvent('cart-updated'));
      } else {
        alert(data.message || 'Failed to remove item.');
      }
    } catch (err) {
      console.error('Remove item error:', err);
    } finally {
      setUpdatingId(null);
      setItemToRemove(null);
    }
  };

  const handleCheckout = async () => {
    setIsCheckoutLoading(true);
    try {
      const res = await fetch('/api/cart/checkout', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = '/orders';
      } else {
        alert(data.message || 'Checkout failed.');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An error occurred during checkout.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
  const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-12 md:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 pb-5 border-b border-zinc-200 dark:border-zinc-800">
        <div>
          <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-1">Review and manage your selected design items.</p>
        </div>
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-550 hover:text-zinc-900 dark:text-zinc-405 dark:hover:text-zinc-50 transition duration-150"
        >
          <ArrowLeft size={14} />
          <span>Back to Shop</span>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {items.length > 0 ? (
          <motion.div 
            key="cart-grid"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start"
          >
            {/* Left List Column */}
            <div className="lg:col-span-2 space-y-6">
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-col sm:flex-row gap-5 p-5 bg-white dark:bg-zinc-900/40 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/40 shadow-sm"
                  >
                    {/* Image */}
                    <div className="relative aspect-[3/4] w-full sm:w-[110px] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 shrink-0 border border-zinc-200/30 dark:border-zinc-800/30">
                      <img 
                        src={p.image || fallbackImage} 
                        alt={p.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-widest block">
                              {formattedCategory}
                            </span>
                            <h3 className="font-bold text-base md:text-lg text-zinc-900 dark:text-zinc-50 mt-0.5">
                              {p.name}
                            </h3>
                            <div className="flex flex-col gap-2 mt-2 select-none">
                              <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
                                Type: <span className="font-semibold text-zinc-700 dark:text-zinc-350">{p.type ? p.type.toUpperCase() : 'STAPLE'}</span>
                              </p>
                              
                              <div className="flex flex-wrap items-center gap-3">
                                {/* Size Selector */}
                                {p.sizes && p.sizes.length > 0 ? (
                                  <div className="flex items-center gap-1.5 bg-zinc-550/5 dark:bg-zinc-950/40 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 transition duration-150 focus-within:ring-1 focus-within:ring-violet-500">
                                    <span className="text-[9px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Size:</span>
                                    <select
                                      value={item.size || ''}
                                      onChange={(e) => handleUpdateOptions(item._id, e.target.value, item.color)}
                                      disabled={isUpdating}
                                      className="bg-transparent text-zinc-800 dark:text-zinc-200 text-xs font-bold outline-none cursor-pointer pr-1"
                                    >
                                      {!item.size && <option value="" className="bg-white dark:bg-zinc-900">Select</option>}
                                      {p.sizes.map((size) => (
                                        <option key={size} value={size} className="bg-white dark:bg-zinc-900 text-zinc-850 dark:text-zinc-200">
                                          {size}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ) : item.size ? (
                                  <div className="bg-zinc-550/5 dark:bg-zinc-950/40 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <span className="text-[9px] font-extrabold text-violet-600 dark:text-violet-400 uppercase tracking-wider">Size: {item.size}</span>
                                  </div>
                                ) : null}

                                {/* Color Selector */}
                                {p.colors && p.colors.length > 0 ? (
                                  <div className="flex items-center gap-1.5 bg-zinc-550/5 dark:bg-zinc-950/40 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800 transition duration-150 focus-within:ring-1 focus-within:ring-pink-500">
                                    <span className="text-[9px] font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Color:</span>
                                    <select
                                      value={item.color || ''}
                                      onChange={(e) => handleUpdateOptions(item._id, item.size, e.target.value)}
                                      disabled={isUpdating}
                                      className="bg-transparent text-zinc-800 dark:text-zinc-200 text-xs font-bold outline-none cursor-pointer pr-1"
                                    >
                                      {!item.color && <option value="" className="bg-white dark:bg-zinc-900">Select</option>}
                                      {p.colors.map((color) => (
                                        <option key={color} value={color} className="bg-white dark:bg-zinc-900 text-zinc-850 dark:text-zinc-200">
                                          {color}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                ) : item.color ? (
                                  <div className="bg-zinc-550/5 dark:bg-zinc-950/40 px-2.5 py-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
                                    <span className="text-[9px] font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Color: {item.color}</span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                          </div>
                          
                          {/* Price */}
                          <span className="font-extrabold text-base md:text-lg text-zinc-900 dark:text-zinc-50 shrink-0">
                            ${p.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800/50">
                        {/* Quantity Controls */}
                        <div className="flex items-center bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-2xl border border-zinc-200/35 dark:border-zinc-800/40 select-none">
                          <button 
                            onClick={() => handleUpdateQuantity(p._id, item.quantity, -1, item.size, item.color)}
                            disabled={item.quantity <= 1 || isUpdating}
                            className="p-1 hover:text-zinc-900 dark:hover:text-zinc-50 text-zinc-400 disabled:text-zinc-300 dark:disabled:text-zinc-700 transition duration-150 cursor-pointer"
                            aria-label="Decrease Quantity"
                          >
                            <Minus size={13} />
                          </button>
                          
                          <span className="w-8 text-center font-bold text-xs text-zinc-900 dark:text-zinc-50">
                            {item.quantity}
                          </span>

                          <button 
                            onClick={() => handleUpdateQuantity(p._id, item.quantity, 1, item.size, item.color)}
                            disabled={isUpdating}
                            className="p-1 hover:text-zinc-900 dark:hover:text-zinc-50 text-zinc-400 transition duration-150 cursor-pointer"
                            aria-label="Increase Quantity"
                          >
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button 
                          onClick={() => promptRemoveItem(item)}
                          disabled={isUpdating}
                          className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-350 py-2 px-3 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-2xl transition duration-150 cursor-pointer"
                          aria-label="Remove Item"
                        >
                          <Trash2 size={14} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Right Summary Column */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/40 rounded-3xl p-6 shadow-sm space-y-6">
                <h3 className="font-extrabold text-lg text-zinc-900 dark:text-zinc-50 tracking-tight pb-3.5 border-b border-zinc-150 dark:border-zinc-800">
                  Order Summary
                </h3>

                {/* Calculation Rows */}
                <div className="space-y-3.5 text-sm font-semibold">
                  <div className="flex justify-between text-zinc-550 dark:text-zinc-400">
                    <span>Subtotal</span>
                    <span className="text-zinc-900 dark:text-zinc-50">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-zinc-550 dark:text-zinc-400">
                    <span>Shipping</span>
                    <span className="text-zinc-900 dark:text-zinc-50">
                      {shipping === 0 ? <span className="text-emerald-600 dark:text-emerald-450 font-bold uppercase text-xs">Free</span> : `$${shipping}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-550 dark:text-zinc-400">
                    <span>Estimated Tax (8%)</span>
                    <span className="text-zinc-900 dark:text-zinc-50">${tax}</span>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-[10px] text-zinc-400 mt-1 bg-zinc-50 dark:bg-zinc-900/60 p-2 rounded-xl border border-zinc-200/20 dark:border-zinc-800/30">
                      💡 Tip: Add ${(200 - subtotal)} more to qualify for Free Shipping!
                    </p>
                  )}
                  
                  <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-zinc-50 pt-4 border-t border-zinc-150 dark:border-zinc-800">
                    <span>Total</span>
                    <span>${total}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <button 
                  onClick={handleCheckout}
                  disabled={isCheckoutLoading || items.length === 0}
                  className="w-full bg-violet-600 hover:bg-violet-750 disabled:bg-violet-400 disabled:cursor-not-allowed text-white font-bold text-sm py-4 rounded-2xl transition duration-150 shadow-lg text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  {isCheckoutLoading && (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  )}
                  <span>Proceed to Checkout</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="bg-zinc-100/50 dark:bg-zinc-900/20 border border-zinc-200/30 dark:border-zinc-800/30 rounded-3xl p-5 space-y-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-violet-600 dark:text-violet-400 shrink-0" size={16} />
                  <span>Secure checkout verified by industry standards.</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="text-violet-600 dark:text-violet-400 shrink-0" size={16} />
                  <span>Stateless shipping dispatched via global air courier.</span>
                </div>
                <div className="flex items-center gap-3">
                  <RotateCcw className="text-violet-600 dark:text-violet-400 shrink-0" size={16} />
                  <span>30-Day refund & exchange window for unused archives.</span>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="cart-empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center py-20 px-6 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-white dark:bg-zinc-900/10 shadow-sm"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="bg-violet-50 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/60 p-5 rounded-full text-violet-600 dark:text-violet-400 mb-6"
            >
              <ShoppingBag size={48} className="fill-current/10" />
            </motion.div>
            
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Your Bag is Empty</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm text-center leading-relaxed">
              Looks like you haven't added any premium pieces to your collection yet. Start exploring our latest drops to fill your bag!
            </p>

            <Link 
              href="/" 
              className="mt-8 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-50 dark:hover:bg-zinc-150 text-white dark:text-zinc-950 font-bold text-xs px-8 py-3.5 rounded-2xl transition duration-150 shadow-md cursor-pointer"
            >
              Continue Shopping
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Remove Confirmation Modal */}
      <AnimatePresence>
        {showRemoveModal && itemToRemove && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white dark:bg-zinc-900 w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-zinc-200 dark:border-zinc-800 text-center"
            >
              {/* Product preview inside popup */}
              <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-950/40 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/40 mb-6">
                <div className="relative aspect-[3/4] w-14 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/20 shrink-0">
                  <img
                    src={itemToRemove.productId.image || `/featured1.jpg`}
                    alt={itemToRemove.productId.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left min-w-0">
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-50 truncate">
                    {itemToRemove.productId.name}
                  </h4>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Price: ${itemToRemove.productId.price} &bull; Qty: {itemToRemove.quantity}
                  </p>
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Remove from Cart?
              </h3>
              <p className="text-xs text-zinc-550 dark:text-zinc-400 mt-2 max-w-xs mx-auto leading-relaxed">
                Save this item for later by moving it to your wishlist, or remove it entirely from your bag.
              </p>

              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={handleAddToWishlist}
                  disabled={updatingId !== null}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs py-3.5 rounded-2xl transition duration-150 cursor-pointer"
                >
                  Add to Wishlist
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={updatingId !== null}
                  className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 dark:text-rose-400 font-bold text-xs py-3.5 rounded-2xl transition duration-150 cursor-pointer"
                >
                  Delete Item
                </button>
                <button
                  onClick={() => {
                    setShowRemoveModal(false);
                    setItemToRemove(null);
                  }}
                  className="w-full bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-550 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 font-bold text-xs py-3.5 rounded-2xl transition duration-150 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
