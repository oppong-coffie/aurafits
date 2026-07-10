'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [stage, setStage] = useState<'cart' | 'logo' | 'text' | 'fadeout'>('cart');

  useEffect(() => {
    // Stage 1: Cart rolls in and stops
    const cartTimer = setTimeout(() => {
      setStage('logo');
    }, 3200);

    // Stage 2: Cart transitions to logo (bounce & ripple animation)
    const logoTimer = setTimeout(() => {
      setStage('text');
    }, 4400);

    // Stage 3: Logo text fades in
    const textTimer = setTimeout(() => {
      setStage('fadeout');
    }, 5600);

    // Stage 4: Trigger completion to slide/fade out parent
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 6200);

    return () => {
      clearTimeout(cartTimer);
      clearTimeout(logoTimer);
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center overflow-hidden select-none">
      
      {/* Radial Pink Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(236,72,153,0.08)_0%,transparent_70%)]" />

      {/* Main Animation Container */}
      <div className="relative flex flex-col items-center justify-center">
        
        {/* Moving Cart Stage */}
        {stage === 'cart' && (
          <motion.div
            initial={{ x: '-100vw', opacity: 0, scale: 0.8 }}
            animate={{ 
              x: 0, 
              opacity: 1, 
              scale: 1,
              transition: { type: 'spring', stiffness: 8, damping: 12 }
            }}
            exit={{ 
              scale: 0.5, 
              opacity: 0, 
              transition: { duration: 0.2 } 
            }}
            className="flex items-center justify-center w-24 h-24 bg-pink-500 rounded-3xl text-white shadow-[0_0_50px_rgba(236,72,153,0.35)] border border-pink-400/20"
          >
            {/* Cart rolling micro-animation */}
            <motion.div
              animate={{ 
                y: [0, -3, 0],
                rotate: [0, -2, 2, 0]
              }}
              transition={{ repeat: Infinity, duration: 0.22 }}
            >
              <ShoppingCart size={40} className="stroke-[2.5]" />
            </motion.div>
          </motion.div>
        )}

        {/* Logo and Text Entrance Stage */}
        {(stage === 'logo' || stage === 'text' || stage === 'fadeout') && (
          <div className="flex flex-col items-center gap-6">
            
            {/* Concentric ripples radiating from the collision point */}
            <div className="relative flex items-center justify-center">
              <AnimatePresence>
                {stage === 'logo' && (
                  <>
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0.6 }}
                      animate={{ scale: 2.2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className="absolute w-24 h-24 rounded-full border-2 border-pink-500/50"
                    />
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0.4 }}
                      animate={{ scale: 3.2, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.1, delay: 0.15, ease: 'easeOut' }}
                      className="absolute w-24 h-24 rounded-full border border-pink-400/30"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Logo Frame with Entrance Pop & Spin */}
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  opacity: 1,
                  transition: { type: 'spring', stiffness: 150, damping: 10, delay: 0.05 }
                }}
                className="relative z-10 w-44 h-44 dark:bg-zinc-900 flex items-center justify-center"
              >
                <img 
                  src="/logo.jpeg" 
                  alt="PinkyShop Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </div>

            {/* Slide-Up Text Fade-in */}
            <div className="h-8 flex items-center justify-center overflow-hidden">
              {(stage === 'text' || stage === 'fadeout') && (
                <motion.h1
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    transition: { type: 'spring', stiffness: 90, damping: 14 }
                  }}
                  className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-400 tracking-widest font-sans uppercase"
                >
                  Aura fits
                </motion.h1>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
