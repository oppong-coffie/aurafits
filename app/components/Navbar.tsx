'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
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
    <nav className="flex justify-between items-center px-6 py-4 md:px-12 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/85 backdrop-blur-md sticky top-0 z-50 transition-colors duration-200">
      <div className="flex items-center gap-4">
        {/* Menu Icon with Click Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer"
            aria-label="Categories Menu"
          >
            <Menu size={24} />
          </button>

          {/* Categories Dropdown */}
          {isMenuOpen && (
            <div className="absolute left-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 text-sm transform origin-top-left transition-all duration-200 backdrop-blur-md">
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
            </div>
          )}
        </div>

        <Link href="/" className="flex items-center gap-3 font-extrabold text-xl text-zinc-900 dark:text-zinc-50 no-underline tracking-tight">
          <img src="/logo.jpeg" alt="PinkyShop Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5" />
          <span>AuraFitGh</span>
        </Link>
      </div>

      <div className="flex items-center gap-2">
        {/* Dark Mode Toggle */}
        <button 
          onClick={toggleDarkMode}
          aria-label="Toggle Dark Mode"
          className="p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {activeUser && (
          <Link
            href="/cart"
            className="relative p-2.5 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer flex items-center justify-center"
            aria-label="Shopping Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-pink-500 text-white text-[9px] font-extrabold h-4.5 w-4.5 rounded-full flex items-center justify-center border border-white dark:border-zinc-950">
                {cartCount}
              </span>
            )}
          </Link>
        )}

        {activeUser ? (
          /* User Account / Navigation Dropdown */
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 p-2 text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors duration-150 cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-955/40 text-violet-650 dark:text-violet-400 flex items-center justify-center text-xs font-bold shadow-inner">
                {activeUser.name ? activeUser.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <ChevronDown size={14} className={`transition-transform duration-250 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl py-2 z-50 text-sm transform origin-top-right transition-all duration-200 backdrop-blur-md">
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

                <Link 
                  href="/adminhome" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors w-full text-left font-semibold"
                >
                  <ShieldCheck size={16} className="text-violet-555 dark:text-violet-400" />
                  <span>Admin Panel</span>
                </Link>

                <div className="border-t border-zinc-100 dark:border-zinc-800 mt-1 pt-1">
                  <form action={logoutAction} onSubmit={() => setIsOpen(false)}>
                    <button 
                      type="submit" 
                      className="flex items-center gap-2.5 px-4 py-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-955/20 transition-colors w-full text-left font-semibold cursor-pointer"
                    >
                      <LogOut size={16} />
                      <span>Log Out</span>
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Sign In Button directly in Navbar */
          <Link 
            href="/login" 
            className="flex items-center gap-1.5 px-4.5 py-2 text-xs font-bold text-white bg-pink-500 hover:bg-pink-400 rounded-xl transition duration-150 shadow-xs uppercase tracking-wider cursor-pointer"
          >
            <LogIn size={13} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
