import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-colors duration-200 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 font-extrabold text-lg text-zinc-900 dark:text-zinc-50 tracking-tight">
            <img src="/logo.jpeg" alt="PinkyShop Logo" width={24} height={24} className="w-6 h-6 rounded-md object-contain bg-white border border-zinc-200 dark:border-zinc-700 p-0.5" />
            <span>AuraFitsGH</span>
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Experience next-generation online fashion. Hand-curated collections backed by secure, stateless session engineering.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Shop Archives</h4>
          <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <li><Link href="/category/active-wear" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Active Wear</Link></li>
            <li><Link href="/category/travel-set" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Travel Set</Link></li>
            <li><Link href="/category/lounge-wear" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Lounge Wear</Link></li>
            <li><Link href="/category/footwear" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Foot Wear</Link></li>
          </ul>
        </div>

        {/* Customer Service */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Services</h4>
          <ul className="space-y-2 text-xs text-zinc-500 dark:text-zinc-400">
            <li><Link href="/orders" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Track Orders</Link></li>
            <li><Link href="/wishlist" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Wishlist</Link></li>
            <li><Link href="/cart" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Shopping Bag</Link></li>
            <li><Link href="/auth" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Developer Playground</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/40 py-6 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>&copy; {new Date().getFullYear()} AuraFitsGH Inc. All rights reserved.</span>
          <div className="flex gap-4">
            <span>Powered by AuraFits Technologies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
