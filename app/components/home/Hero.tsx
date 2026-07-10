'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight 
} from 'lucide-react';

const CAROUSEL_SLIDES = [
  {
    title: "Active Wear Performance",
    subtitle: "High-performance sportswear designed for comfort and agility.",
    cta: "Shop Active Wear",
    link: "/category/active-wear",
    image: "/slide14.jpg",
    badge: "New Release",
    accentText: "text-amber-400"
  },
  {
    title: "The Travel Set Collection",
    subtitle: "Curated collections and luggage designed for the modern voyager.",
    cta: "Shop Travel Sets",
    link: "/category/travel-set",
    image: "/active-slide.jpg",
    badge: "Best Sellers",
    accentText: "text-emerald-400"
  },
  {
    title: "Luxury Lounge Wear",
    subtitle: "Luxurious, cozy clothing for slow days and ultimate relaxation.",
    cta: "Shop Lounge Wear",
    link: "/category/lounge-wear",
    image: "/slide11.jpg",
    badge: "Limited Drop",
    accentText: "text-violet-400"
  }
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play Carousel Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  return (
    <section className="relative w-full overflow-hidden px-6 pt-6 md:px-12 lg:px-16 md:pt-10">
      <div className="max-w-[1600px] mx-auto relative group">
        {/* Slides Container */}
        <div className="relative h-[380px] md:h-[460px] w-full rounded-3xl overflow-hidden shadow-sm">
          {CAROUSEL_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={idx}
                className={`absolute inset-0 flex flex-col justify-center p-8 md:p-16 transition-all duration-500 ease-in-out ${
                  isActive ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"
                }`}
              >
                {/* Background Image with Zoom Micro-Animation */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-transform duration-[10000ms] ease-out ${
                      isActive ? "scale-155" : "scale-100"
                    }`}
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-transparent" />
                </div>

                <div className="relative max-w-xl space-y-4 z-10">
                  <span className={`inline-flex items-center gap-1 bg-white/10 dark:bg-black/35 border border-white/20 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md shadow-sm transition-all duration-700 ease-out transform ${
                    isActive ? "translate-y-0 opacity-100 delay-100" : "translate-y-4 opacity-0"
                  }`}>
                    <Sparkles size={12} className={slide.accentText} />
                    {slide.badge}
                  </span>
                  <h2 className={`text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white transition-all duration-700 ease-out transform ${
                    isActive ? "translate-y-0 opacity-100 delay-200" : "translate-y-4 opacity-0"
                  }`}>
                    {slide.title}
                  </h2>
                  <p className={`text-sm md:text-base text-zinc-200 leading-relaxed max-w-lg transition-all duration-700 ease-out transform ${
                    isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-4 opacity-0"
                  }`}>
                    {slide.subtitle}
                  </p>
                  <div className={`pt-2 transition-all duration-700 ease-out transform ${
                    isActive ? "translate-y-0 opacity-100 delay-500" : "translate-y-4 opacity-0"
                  }`}>
                    <Link 
                      href={slide.link} 
                      className="inline-flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold rounded-2xl px-6 py-3.5 transition duration-150 text-sm shadow-sm cursor-pointer"
                    >
                      <span>{slide.cta}</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Progress Bar Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 h-1.5 bg-white/30 z-20 animate-progress-bar" />
                )}
              </div>
            );
          })}
        </div>

        {/* Left Arrow */}
        <button 
          onClick={handlePrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 dark:bg-black/25 border border-white/10 text-white hover:bg-white/20 rounded-full shadow-md z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right Arrow */}
        <button 
          onClick={handleNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/10 dark:bg-black/25 border border-white/10 text-white hover:bg-white/20 rounded-full shadow-md z-20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {CAROUSEL_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentSlide 
                  ? "bg-white w-6" 
                  : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}