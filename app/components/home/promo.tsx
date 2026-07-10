import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const STATIC_PROMOS = [
  {
    title: "Limited Edition Leatherwares",
    subtitle: "Handcrafted minimalism with premium grain leather.",
    badge: "Signature Collection",
    image: "/active-slide.jpg",
    link: "/category/active-wear",
    cta: "Discover Bags",
    accentText: "text-amber-400"
  },
  {
    title: "The Denim Edit",
    subtitle: "Selvedge denim and heavy-weight cotton basics.",
    badge: "Seasonal Focus",
    image: "/hero1.jpg",
    link: "/category/lounge-wear",
    cta: "Shop Denim",
    accentText: "text-emerald-400"
  },
  {
    title: "Luxe Knitwear",
    subtitle: "Comfortable luxury linens, coats and sweaters.",
    badge: "New Release",
    image: "/hero2.jpg",
    link: "/category/travel-set",
    cta: "Shop Travel-set",
    accentText: "text-violet-400"
  },
  {
    title: "Curated Footwear",
    subtitle: "Handcrafted derby shoes, loafers and classic sneakers.",
    badge: "Premium Shoes",
    image: "/slide2.jpg",
    link: "/category/footwear",
    cta: "Explore Shoes",
    accentText: "text-amber-400"
  },
  {
    title: "Fine Jewelry & Accessories",
    subtitle: "Minimalist solid gold pieces and accessories.",
    badge: "Limited Drop",
    image: "/slide6.jpg",
    link: "/category/active-wear",
    cta: "Active-Wear",
    accentText: "text-emerald-400"
  },
  {
    title: "Classic Eyewear",
    subtitle: "Acetate sunglasses and designer frames.",
    badge: "Summer Ready",
    image: "/slide8.jpg",
    link: "/category/travel-set",
    cta: "Explore Travel-set",
    accentText: "text-violet-400"
  },
  {
    title: "The Denim Edit",
    subtitle: "Selvedge denim and heavy-weight cotton basics.",
    badge: "Seasonal Focus",
    image: "/slide9.jpg",
    link: "/category/active-wear",
    cta: "Active-Wear",
    accentText: "text-emerald-400"
  },
  {
    title: "Luxe Knitwear",
    subtitle: "Comfortable luxury linens, coats and sweaters.",
    badge: "New Release",
    image: "/slide11.jpg",
    link: "/category/lounge-wear",
    cta: "Lounge-Wear",
    accentText: "text-violet-400"
  },
  {
    title: "Curated Footwear",
    subtitle: "Handcrafted derby shoes, loafers and classic sneakers.",
    badge: "Premium Shoes",
    image: "/slide12.jpg",
    link: "/category/footwear",
    cta: "Explore Footwear",
    accentText: "text-amber-400"
  },
  {
    title: "Fine Jewelry & Accessories",
    subtitle: "Minimalist solid gold pieces and accessories.",
    badge: "Limited Drop",
    image: "/slide13.jpg",
    link: "/category/active-wear",
    cta: "Active-Wear",
    accentText: "text-emerald-400"
  },
  {
    title: "Classic Eyewear",
    subtitle: "Acetate sunglasses and designer frames.",
    badge: "Summer Ready",
    image: "/slide15.jpg",
    link: "/category/travel-set",
    cta: "Explore Travel-set",
    accentText: "text-violet-400"
  },
];

export default function Promo() {
  const displayPromos = STATIC_PROMOS;

  return (
    <section className="w-full max-w-[1600px] mx-auto px-6 md:px-12 lg:px-1 mt-10 md:mt-14">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-4 flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Exclusive Promotions
          </h2>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Carefully curated collections with limited-time offers.
          </p>
        </div>
        <div className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-zinc-500">
          <span>Swipe or Scroll</span>
          <ArrowRight size={14} className="text-zinc-400" />
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
        className="w-full overflow-x-auto pb-6 pt-2 no-scrollbar scroll-smooth snap-x snap-mandatory flex gap-6"
      >
        {displayPromos.map((promo, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: Math.min(idx * 0.05, 0.4) }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="snap-start flex-shrink-0"
          >
            <Link 
              href={promo.link}
              className="w-[320px] md:w-[250px] h-[220px] md:h-[230px] group relative rounded-3xl overflow-hidden shadow-sm block cursor-pointer"
            >
              {/* Background Image with Auto-Floating/Bouncing Effect */}
              <motion.img 
                src={promo.image} 
                alt={promo.title}
                animate={{ y: [0, -6, 0] }}
                transition={{
                  duration: 2.5 + (idx % 3) * 0.4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-x-0 w-full h-[110%] -top-2.5 object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity duration-300" />
              
              {/* Promo Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${promo.accentText} mb-1.5`}>
                  {promo.badge}
                </span>
                <h3 className="text-lg md:text-xl font-bold tracking-tight mb-0.5 leading-snug">
                  {promo.title}
                </h3>
                <p className="text-xs text-zinc-300 mb-3 max-w-[240px] md:max-w-xs line-clamp-2 leading-relaxed">
                  {promo.subtitle}
                </p>
                <div className="inline-flex items-center gap-1 font-semibold text-xs text-white group-hover:gap-2 transition-all duration-150">
                  <span>{promo.cta}</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}