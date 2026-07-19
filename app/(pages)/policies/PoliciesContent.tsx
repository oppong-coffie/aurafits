'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, RefreshCw, Truck, Shield, Clock, MapPin, CheckCircle2, HelpCircle } from 'lucide-react';

type TabId = 'terms' | 'refunds' | 'delivery' | 'privacy';

export default function PoliciesContent() {
  const [activeTab, setActiveTab] = useState<TabId>('terms');

  // Handle URL hash routing if user clicks direct policy link (e.g. /policies#privacy)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '') as TabId;
      const validTabs: TabId[] = ['terms', 'refunds', 'delivery', 'privacy'];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  const tabs = [
    { id: 'terms', name: 'Terms of Service', icon: Scale, desc: 'Rules & guidelines for using AuraFitsGH' },
    { id: 'refunds', name: 'Refund Policy', icon: RefreshCw, desc: 'Returns, replacements, and money-back conditions' },
    { id: 'delivery', name: 'Delivery Time Frame', icon: Truck, desc: 'Shipping coverage, speed, and self-pickup info' },
    { id: 'privacy', name: 'Privacy Policy', icon: Shield, desc: 'How we protect and manage your personal data' },
  ] as const;

  return (
    <div className="w-full bg-slate-50/50 dark:bg-zinc-950/30 min-h-screen pb-20">
      {/* Header Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-900/10 via-indigo-900/5 to-transparent border-b border-zinc-200/50 dark:border-zinc-800/60 py-16 md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.08),transparent_50%)]" />
        <div className="max-w-6xl mx-auto px-6 relative z-10 text-center md:text-left">
          <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-widest bg-violet-50 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/40 px-3 py-1 rounded-full">
            Legal & Support
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mt-4">
            Policies & Terms of Service
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 max-w-xl mt-2 leading-relaxed">
            Everything you need to know about shopping, delivery timelines, return policies, and privacy terms at AuraFitsGH.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Side Tabs Navigation (Desktop) / Top horizontal list (Mobile) */}
          <aside className="w-full md:w-80 shrink-0">
            {/* Mobile horizontal scroller */}
            <div className="md:hidden flex gap-2 overflow-x-auto pb-3 scrollbar-none snap-x -mx-6 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.history.pushState(null, '', `#${tab.id}`);
                    }}
                    className={`snap-center shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl border text-xs font-bold transition duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-500/10'
                        : 'bg-white dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400'
                    }`}
                  >
                    <Icon size={14} className={isSelected ? 'text-white' : 'text-zinc-400'} />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Desktop sticky navigation stack */}
            <div className="hidden md:flex flex-col gap-2.5 sticky top-24 bg-white dark:bg-zinc-900/40 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl p-4.5 shadow-sm">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-3 block mb-1">Navigation</span>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      window.history.pushState(null, '', `#${tab.id}`);
                    }}
                    className={`w-full flex items-center gap-3.5 px-4.5 py-4.5 rounded-2xl border text-left cursor-pointer transition duration-150 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-violet-50 dark:bg-violet-950/25 border-violet-100 dark:border-violet-900/60 text-violet-600 dark:text-violet-400'
                        : 'bg-transparent border-transparent hover:bg-zinc-50 dark:hover:bg-zinc-850/30 text-zinc-700 dark:text-zinc-400'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-violet-600 dark:bg-violet-400 rounded-r"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon size={18} className={`shrink-0 transition-colors ${isSelected ? 'text-violet-600 dark:text-violet-400' : 'text-zinc-400 dark:text-zinc-500'}`} />
                    <div className="min-w-0">
                      <span className="text-xs font-bold block">{tab.name}</span>
                      <span className="text-[10px] text-zinc-400 dark:text-zinc-500 block mt-0.5 truncate leading-none">
                        {tab.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main content display */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/80 rounded-3xl p-6 md:p-8 shadow-sm min-h-[450px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-6"
                >
                  {/* Content for Terms of Service */}
                  {activeTab === 'terms' && (
                    <>
                      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2.5 bg-violet-50 dark:bg-violet-950/40 rounded-xl text-violet-600 dark:text-violet-400 border border-violet-100/50 dark:border-violet-900/40">
                          <Scale size={20} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Terms of Service</h2>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Last updated: July 2026</p>
                        </div>
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-350 text-xs leading-relaxed space-y-4 font-medium">
                        <p>
                          Welcome to AuraFitsGH! By accessing and purchasing from our store, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
                        </p>
                        
                        <div className="bg-slate-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 p-4.5 rounded-2xl space-y-2.5">
                          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-xs">
                            <CheckCircle2 size={13} className="text-violet-600 dark:text-violet-400" />
                            1. Electronic Communications
                          </h3>
                          <p className="pl-5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            When you place an order or send us a WhatsApp message, you communicate with us electronically. You consent to receive communications from us (via email, SMS text notifications, or messaging networks). You agree that all notices, disclosures, and order details satisfy legal requirements.
                          </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 p-4.5 rounded-2xl space-y-2.5">
                          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-xs">
                            <CheckCircle2 size={13} className="text-violet-600 dark:text-violet-400" />
                            2. Account Responsibilities
                          </h3>
                          <p className="pl-5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            If you create an account on AuraFitsGH, you are responsible for maintaining the confidentiality of your credentials and restricting unauthorized access. Accounts are for personal use only. We reserve the right to refuse service, terminate accounts, or cancel orders at our sole discretion.
                          </p>
                        </div>

                        <div className="bg-slate-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800 p-4.5 rounded-2xl space-y-2.5">
                          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-2 text-xs">
                            <CheckCircle2 size={13} className="text-violet-600 dark:text-violet-400" />
                            3. Product Pricing & Descriptions
                          </h3>
                          <p className="pl-5 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            All prices displayed on this site are in Ghanaian Cedis (GHS). We strive to provide highly accurate descriptions and pictures of products. If a product offered by us is not as described, your sole remedy is to return it in unused condition following our return policy.
                          </p>
                        </div>

                        <div className="pt-2 text-[10px] text-zinc-400 dark:text-zinc-500 flex items-center gap-2">
                          <HelpCircle size={12} />
                          Need further clarification? Feel free to contact our support desk via the details in the footer.
                        </div>
                      </div>
                    </>
                  )}

                  {/* Content for Refund Policy */}
                  {activeTab === 'refunds' && (
                    <>
                      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl text-rose-600 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/40">
                          <RefreshCw size={20} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Refund & Return Policy</h2>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Last updated: July 2026</p>
                        </div>
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-350 text-xs leading-relaxed space-y-4 font-medium">
                        <p>
                          We want you to love your AuraFits items! If a size doesn't fit or you receive a damaged product, our simplified return mechanism is designed to handle it quickly.
                        </p>

                        {/* Highlight Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                          <div className="border border-zinc-200/60 dark:border-zinc-800 p-4.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20">
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">Return Window</span>
                            <p className="text-sm font-black text-zinc-800 dark:text-zinc-50">48 Hours</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 leading-normal">Returns must be requested within 48 hours of delivery.</p>
                          </div>
                          
                          <div className="border border-zinc-200/60 dark:border-zinc-800 p-4.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20">
                            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block mb-1">Condition</span>
                            <p className="text-sm font-black text-zinc-800 dark:text-zinc-50">Tags & Packaging Intact</p>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-1 leading-normal">Items must be unworn, unwashed, and in original packaging.</p>
                          </div>
                        </div>

                        <div className="space-y-3 mt-4">
                          <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">Returns and Exchanges Process</h3>
                          <ul className="space-y-2 pl-4 list-disc text-[11px] text-zinc-500 dark:text-zinc-400">
                            <li><strong>Size Exchange:</strong> We offer a direct exchange for size availability. The cost of returning the item is paid by the client, and we will send the new size free of charge.</li>
                            <li><strong>Incorrect/Defective Item:</strong> If we sent an incorrect size or a defective item, we will collect it and deliver the correct replacement at zero cost to you.</li>
                            <li><strong>Refunds:</strong> Once the returned item is checked and verified at our Adjringanor base, we process the refund directly to your Mobile Money wallet or bank card within 1-2 business days.</li>
                          </ul>
                        </div>

                        <div className="p-4 bg-amber-50/50 dark:bg-amber-955/15 border border-amber-200/20 dark:border-amber-900/30 text-amber-800 dark:text-amber-400 rounded-2xl text-[11px] leading-relaxed">
                          ⚠️ <strong>Please note:</strong> Accessories, loungewear sets (on clearance/sales events), and activewear sets without tags cannot be returned or refunded for hygiene reasons.
                        </div>
                      </div>
                    </>
                  )}

                  {/* Content for Delivery Time Frame */}
                  {activeTab === 'delivery' && (
                    <>
                      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-900/40">
                          <Truck size={20} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Delivery Time Frame & Areas</h2>
                          <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5">Last updated: July 2026</p>
                        </div>
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-350 text-xs leading-relaxed space-y-4 font-medium">
                        <p>
                          AuraFitsGH provides fast and secure shipping options across Ghana. Here is a breakdown of our delivery timelines, locations, and costs.
                        </p>

                        {/* Delivery Table */}
                        <div className="overflow-x-auto border border-zinc-200/60 dark:border-zinc-800 rounded-2xl my-4">
                          <table className="w-full text-left border-collapse text-[11px]">
                            <thead>
                              <tr className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200/65 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold">
                                <th className="p-3">Location / Region</th>
                                <th className="p-3">Timeline</th>
                                <th className="p-3 text-right">Standard Fee</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-zinc-650 dark:text-zinc-400">
                              <tr>
                                <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">Accra Metro (Same-Day)</td>
                                <td className="p-3">Orders placed before 1:00 PM are delivered same-day. After 1:00 PM, next day.</td>
                                <td className="p-3 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200">GHS 15.00</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">Accra Suburbs & Tema</td>
                                <td className="p-3">1 - 2 Business Days</td>
                                <td className="p-3 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200">GHS 15.00</td>
                              </tr>
                              <tr>
                                <td className="p-3 font-semibold text-zinc-800 dark:text-zinc-200">Other Regions in Ghana</td>
                                <td className="p-3">2 - 3 Business Days (sent via bus terminals or courier services)</td>
                                <td className="p-3 text-right font-mono font-bold text-zinc-800 dark:text-zinc-200">GHS 35.00+</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="border border-zinc-200/60 dark:border-zinc-800 p-4.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 space-y-1.5">
                            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-xs">
                              <MapPin size={14} className="text-indigo-600 dark:text-indigo-400" />
                              Self-Pickup Option
                            </div>
                            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed">
                              You can collect your order directly from our warehouse at Adjringanor, Accra. Select the self-pickup option on checkout or contact us via WhatsApp to schedule collection.
                            </p>
                          </div>

                          <div className="border border-zinc-200/60 dark:border-zinc-800 p-4.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-950/20 space-y-1.5">
                            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-bold text-xs">
                              <Clock size={14} className="text-indigo-600 dark:text-indigo-400" />
                              Free Shipping Tip
                            </div>
                            <p className="text-[10px] text-zinc-450 dark:text-zinc-500 leading-relaxed">
                              All orders above <strong>GHS 200.00</strong> qualify for **Free Shipping** automatically within Accra. Add items to your cart to trigger free shipping!
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Content for Privacy Policy */}
                  {activeTab === 'privacy' && (
                    <>
                      <div className="flex items-center gap-3 pb-4 border-b border-zinc-100 dark:border-zinc-800">
                        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-600 dark:text-emerald-450 border border-emerald-100/50 dark:border-emerald-900/40">
                          <Shield size={20} />
                        </div>
                        <div>
                          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Privacy Policy</h2>
                          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Last updated: July 2026</p>
                        </div>
                      </div>

                      <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-350 text-xs leading-relaxed space-y-4 font-medium">
                        <p>
                          At AuraFitsGH, we prioritize your data safety. This policy details how we collect, use, and guard your personal profile, addresses, and transaction info.
                        </p>

                        <div className="space-y-4 mt-2">
                          <div className="flex gap-3">
                            <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">1</div>
                            <div>
                              <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">Information Collection</h3>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                                We collect name, telephone number (for billing, delivery coordination, and SMS notification alerts), physical address (for delivery logistics), and email address (for account confirmation).
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">2</div>
                            <div>
                              <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">Secure Payments (Paystack Integration)</h3>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                                We utilize Paystack for secure transaction checkouts. AuraFitsGH **never stores nor processes** your MoMo pins, bank numbers, or card verification values (CVV). All banking details are handled directly over Paystack's PCI-DSS compliant secure infrastructure.
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 flex items-center justify-center text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold font-mono">3</div>
                            <div>
                              <h3 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs">Cookies & Sessions</h3>
                              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                                We use stateless JWT sessions stored in browser cookies to recognize your cart state, user profile settings, and login authorization. You can disable cookies in your browser settings, but it may cause cart item storage or login states to fail.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
