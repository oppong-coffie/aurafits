'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from './Hero';
import Promo from './promo';
import Featured from './Featured';
import FlashSales from './Flash';
import TopSelling from './topsale';
import Sponsored from './Sponsored';
import AllProducts from './AllProducts';
import SplashScreen from './SplashScreen';

interface HomeContentProps {
  featuredProducts?: any[];
  flashProducts?: any[];
  topSellingProducts?: any[];
  sponsoredProducts?: any[];
  promoProducts?: any[];
  allProducts?: any[];
}

export default function HomeContent({ 
  featuredProducts = [], 
  flashProducts = [],
  topSellingProducts = [],
  sponsoredProducts = [],
  promoProducts = [],
  allProducts = []
}: HomeContentProps) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const hasShown = sessionStorage.getItem('pinkyshop_splash_shown');
    if (hasShown) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem('pinkyshop_splash_shown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && (
          <motion.div
            key="splash-overlay"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 1.03,
              transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } 
            }}
            className="fixed inset-0 z-[9999]"
          >
            <SplashScreen onComplete={handleSplashComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 w-full bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
        <Hero />
        <Promo />
        <FlashSales products={flashProducts} />
        <TopSelling products={topSellingProducts} />
        <Featured products={featuredProducts} />
        <Sponsored products={sponsoredProducts} />
        <AllProducts products={allProducts} />
      </div>
    </>
  );
}
