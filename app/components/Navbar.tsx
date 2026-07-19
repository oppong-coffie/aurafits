'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserRoundCog, 
  Sun, 
  Menu, 
  Moon, 
  ChevronDown, 
  ShoppingCart, 
  Package, 
  Heart, 
  LogOut, 
  LogIn,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeUser: {
    id: string;
    name: string;
    email: string;
    role?: string;
    createdAt?: any;
  } | null;
  logoutAction: () => Promise<void>;
}

const categories = [
  { name: "Active Wear", slug: "active-wear" },
  { name: "Travel Set", slug: "travel-set" },
  { name: "Lounge Wear", slug: "lounge-wear" },
  { name: "Foot Wear", slug: "footwear" },
];

export default function Navbar({ activeUser, logoutAction }: NavbarProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const fetchCartCount = async () => {
    if (!activeUser) {
      setCartCount(0);
      return;
    }
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      if (data.success && data.cart) {
        const total = data.cart.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      }
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  useEffect(() => {
    fetchCartCount();

    window.addEventListener('cart-updated', fetchCartCount);
    window.addEventListener('focus', fetchCartCount);

    return () => {
      window.removeEventListener('cart-updated', fetchCartCount);
      window.removeEventListener('focus', fetchCartCount);
    };
  }, [activeUser]);

  // Initialize theme status on mount
  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  // Toggle theme status
  const toggleDarkMode = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  // Close dropdown menus if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="flex justify-between items-center px-3 sm:px-6 md:px-12 py-3 sm:py-4 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-md sticky top-0 z-[100] transition-colors duration-200 w-full">
      <div className="flex items-center gap-1.5 sm:gap-4 min-w-0">
        {/* Menu Icon with Click Dropdown */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-center"
            aria-label="Categories Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Categories Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute left-0 mt-2 w-52 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-[1000] text-sm transform origin-top-left backdrop-blur-md"
              >
                <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                  <span className="font-bold text-[10px] uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">Shop Categories</span>
                </div>
                {categories.map((category) => (
                  <Link 
                    key={category.slug} 
                    href={`/category/${category.slug}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-2.5 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150"
                  >
                    {category.name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Link href="/" className="flex items-center gap-2 sm:gap-3 font-extrabold text-base sm:text-xl text-zinc-900 dark:text-zinc-50 no-underline tracking-tight min-w-0">
          <img src="/logo.jpeg" alt="AuraFitGh Logo" width={32} height={32} className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5 flex-shrink-0" />
          <span className="truncate">AuraFitGh</span>
        </Link>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer flex-shrink-0 flex items-center justify-center"
        >
          {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>

        {activeUser && (
          <Link
            href="/cart"
            className="relative p-1.5 sm:p-2.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-center flex-shrink-0"
            aria-label="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[9px] font-extrabold h-4 w-4 sm:h-4.5 sm:w-4.5 rounded-full flex items-center justify-center border border-white dark:border-zinc-950">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {activeUser ? (
          /* User Account / Navigation Dropdown */
          <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1 sm:gap-1.5 p-1.5 sm:p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-bold shadow-inner">
                {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <ChevronDown size={14} className={`transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute right-0 mt-2 w-52 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-[1000] text-sm transform origin-top-right backdrop-blur-md"
                >
                  {/* User profile header */}
                  <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <p className="font-bold text-zinc-800 dark:text-zinc-200 truncate">{activeUser.name}</p>
                    <p className="text-[11px] text-zinc-500 truncate dark:text-zinc-400 leading-tight mt-0.5">{activeUser.email}</p>
                  </div>

                  <Link 
                    href="/cart" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-full text-left"
                  >
                    <ShoppingCart size={16} className="text-zinc-400" />
                    <span>Cart</span>
                  </Link>

                  <Link 
                    href="/orders" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-full text-left"
                  >
                    <Package size={16} className="text-zinc-400" />
                    <span>Orders</span>
                  </Link>

                  <Link 
                    href="/wishlist" 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-full text-left"
                  >
                    <Heart size={16} className="text-zinc-400" />
                    <span>Wishlist</span>
                  </Link>

                  {activeUser.role === 'admin' && (
                    <Link 
                      href="/adminhome" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-full text-left font-semibold"
                    >
                      <ShieldCheck size={16} className="text-pink-600 dark:text-pink-400" />
                      <span>Admin Panel</span>
                    </Link>
                  )}

                  <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                    <form action={logoutAction} onSubmit={() => setIsOpen(false)}>
                      <button 
                        type="submit" 
                        className="flex items-center gap-2.5 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors w-full text-left font-semibold cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Log Out</span>
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          /* Sign In Button directly in Navbar */
          <Link 
            href="/login" 
            className="flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold text-white bg-pink-500 hover:bg-pink-400 active:bg-pink-600 rounded-xl transition duration-150 shadow-xs uppercase tracking-wider cursor-pointer whitespace-nowrap shrink-0"
          >
            <LogIn className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
