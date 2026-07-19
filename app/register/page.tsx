'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Field errors from Zod
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  // General server/DB errors
  const [generalError, setGeneralError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setGeneralError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, address, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Refresh routing context and redirect home
        router.refresh();
        router.push('/');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setGeneralError(data.message || 'An error occurred during registration.');
        }
      }
    } catch (error: any) {
      setGeneralError('A network error occurred. Please try again.');
      console.error('Registration page error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 px-4 py-12 transition-colors duration-200">
      <motion.div 
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 20 }}
        className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col backdrop-blur-sm transition-colors duration-200"
      >
        
        {/* Brand Logo & Name */}
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-2xl tracking-tight text-zinc-900 dark:text-zinc-50 hover:opacity-90">
            <motion.img 
              initial={{ rotate: -15, scale: 0.8 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              src="/logo.jpeg" 
              alt="AuraFitGh Logo" 
              className="w-10 h-10 rounded-xl object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5" 
            />
            <span>AuraFitGh</span>
          </Link>
        </div>

        {/* Title Headers */}
        <h2 className="text-xl font-extrabold text-center tracking-tight mb-1 text-zinc-900 dark:text-zinc-100">Create Account</h2>
        <p className="text-sm text-center text-zinc-500 dark:text-zinc-400 mb-6">Join us today to start shopping in style</p>

        {/* Server Alert Message */}
        <AnimatePresence>
          {generalError && (
            <motion.div 
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-red-600 dark:text-red-400 rounded-2xl p-4 text-xs mb-4 font-bold flex items-center gap-2 overflow-hidden"
            >
              <span>⚠️</span>
              <span>{generalError}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="register-name">Full Name</label>
            <input
              id="register-name"
              type="text"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 dark:focus:ring-pink-500/30 dark:focus:border-pink-400 rounded-2xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition duration-150"
              placeholder="Jane Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <AnimatePresence>
              {errors.name && (
                <motion.span 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[11px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 mt-1 overflow-hidden"
                >
                  ⚠️ {errors.name[0]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="register-phone">Phone Number</label>
            <input
              id="register-phone"
              type="tel"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 dark:focus:ring-pink-500/30 dark:focus:border-pink-400 rounded-2xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition duration-150"
              placeholder="+233 24 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <AnimatePresence>
              {errors.phone && (
                <motion.span 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[11px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 mt-1 overflow-hidden"
                >
                  ⚠️ {errors.phone[0]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="register-address">Delivery Address</label>
            <input
              id="register-address"
              type="text"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 dark:focus:ring-pink-500/30 dark:focus:border-pink-400 rounded-2xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition duration-150"
              placeholder="123 Ring Road, Accra, Ghana"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
            <AnimatePresence>
              {errors.address && (
                <motion.span 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[11px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 mt-1 overflow-hidden"
                >
                  ⚠️ {errors.address[0]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="register-email">Email Address</label>
            <input
              id="register-email"
              type="email"
              className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 dark:focus:ring-pink-500/30 dark:focus:border-pink-400 rounded-2xl px-4 py-3 text-xs text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition duration-150"
              placeholder="jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <AnimatePresence>
              {errors.email && (
                <motion.span 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[11px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 mt-1 overflow-hidden"
                >
                  ⚠️ {errors.email[0]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider" htmlFor="register-password">Password</label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-pink-500/25 focus:border-pink-500 dark:focus:ring-pink-500/30 dark:focus:border-pink-400 rounded-2xl pl-4 pr-11 py-3 text-xs text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 outline-none transition duration-150"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.span 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[11px] text-red-600 dark:text-red-400 font-semibold flex items-center gap-1 mt-1 overflow-hidden"
                >
                  ⚠️ {errors.password[0]}
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-400 active:bg-pink-600 text-white font-bold rounded-2xl py-3.5 transition shadow-sm cursor-pointer disabled:opacity-50 text-xs mt-4 uppercase tracking-wider active:scale-[0.99]"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <UserPlus size={14} />
            )}
            <span>{isLoading ? 'Creating Account...' : 'Sign Up'}</span>
          </button>
        </form>

        {/* Bottom Switch Link */}
        <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-6">
          Already have an account? 
          <Link href="/login" className="text-pink-600 dark:text-pink-400 hover:underline font-semibold ml-1.5">
            Sign In
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
