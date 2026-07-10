'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag,
  Settings,
  Menu,
  X
} from 'lucide-react';

export default function AdminSubNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: '/adminhome', label: 'Overview Home', icon: LayoutDashboard },
    { href: '/adminusers', label: 'Registered Users', icon: Users },
    { href: '/adminproducts', label: 'Products Archives', icon: ShoppingBag },
  ];

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden w-full bg-pink-600 text-white flex items-center justify-between px-6 py-4 shadow-md z-40">
        <div className="flex items-center gap-2">
          <Settings size={18} className="animate-spin-slow" />
          <span className="font-extrabold text-sm uppercase tracking-wider">Admin Console</span>
        </div>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-1 hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
          aria-label="Toggle Navigation Menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/40 z-30 backdrop-blur-xs"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar (Responsive Panel) */}
      <aside className={`
        fixed md:sticky top-0 left-0 bottom-0 z-40
        w-64 h-full md:h-screen bg-pink-600 text-white 
        flex flex-col p-6 shadow-xl border-r border-pink-700/20
        transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        {/* Logo/Header */}
        <div className="flex items-center gap-3 pb-6 mb-6 border-b border-white/10">
          <div className="bg-white/15 p-2 rounded-2xl">
            <Settings size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-sm uppercase tracking-wider leading-none">Admin Panel</h1>
            <span className="text-[10px] text-pink-200 font-bold uppercase tracking-widest mt-0.5 block">Console Dashboard</span>
          </div>
        </div>

        {/* Links */}
        <nav className="flex-1 space-y-2.5">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-200 ${
                  isActive 
                    ? 'bg-white text-pink-600 shadow-md scale-[1.02]' 
                    : 'text-pink-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-pink-600' : 'text-pink-200'} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom branding or exit link */}
        <div className="pt-6 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-pink-700/40 hover:bg-pink-700/70 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition duration-150"
          >
            Exit to Store
          </Link>
        </div>
      </aside>
    </>
  );
}
