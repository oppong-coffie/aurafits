import Link from 'next/link';
import { Mail, Phone, MessageSquare, MapPin } from 'lucide-react';

/* Brand icons removed from lucide-react — using inline SVGs instead */
const InstagramIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const FacebookIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


const TwitterIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

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
          <div className="pt-2">
            <span className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3">Follow Us</span>
            <div className="flex gap-2.5">
              <a href="https://instagram.com/aurafitsgh" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-pink-500 dark:hover:text-pink-400 rounded-xl transition-all duration-200 border border-zinc-200/50 dark:border-zinc-800/50" aria-label="Instagram">
                <InstagramIcon size={15} />
              </a>
              <a href="https://facebook.com/aurafitsgh" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-blue-500 dark:hover:text-blue-400 rounded-xl transition-all duration-200 border border-zinc-200/50 dark:border-zinc-800/50" aria-label="Facebook">
                <FacebookIcon size={15} />
              </a>
              <a href="https://twitter.com/aurafitsgh" target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-500 dark:text-zinc-400 hover:text-sky-500 dark:hover:text-sky-400 rounded-xl transition-all duration-200 border border-zinc-200/50 dark:border-zinc-800/50" aria-label="Twitter">
                <TwitterIcon size={15} />
              </a>
            </div>
          </div>
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

        {/* Support */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">Support</h4>
          <ul className="space-y-2.5 text-xs text-zinc-500 dark:text-zinc-400">
            <li className="text-zinc-450 dark:text-zinc-500 font-semibold mb-1">For support;</li>
            <li className="flex items-center gap-2">
              <Mail size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span>Email: <a href="mailto:Aurafitsgh@gmail.com" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">Aurafitsgh@gmail.com</a></span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span>Contact: <a href="tel:0201321543" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors">0201321543</a></span>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span>WhatsApp: <a href="https://wa.me/233201321543" target="_blank" rel="noopener noreferrer" className="hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-semibold">0201321543</a></span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={13} className="text-zinc-400 dark:text-zinc-500 shrink-0" />
              <span>Location: Adjringanor</span>
            </li>
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
