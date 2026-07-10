'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ToastDetail {
  message: string;
  type: 'success' | 'error';
}

export default function Toast() {
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  useEffect(() => {
    const handleShowToast = (event: Event) => {
      const customEvent = event as CustomEvent<ToastDetail>;
      if (customEvent.detail) {
        setToast({
          show: true,
          message: customEvent.detail.message,
          type: customEvent.detail.type || 'success'
        });
      }
    };

    window.addEventListener('show-toast' as any, handleShowToast);
    return () => {
      window.removeEventListener('show-toast' as any, handleShowToast);
    };
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show, toast.message]);

  return (
    <AnimatePresence>
      {toast.show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.15 } }}
          className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-zinc-900/95 dark:bg-zinc-950/95 text-white dark:text-zinc-50 px-5 py-4 rounded-2xl shadow-2xl backdrop-blur-md border border-zinc-800/80 max-w-sm"
        >
          <div className={`p-2 rounded-xl ${
            toast.type === 'success' 
              ? 'bg-pink-500/20 text-pink-500' 
              : 'bg-rose-500/20 text-rose-500'
          }`}>
            {toast.type === 'success' ? (
              <Check size={16} className="stroke-[3]" />
            ) : (
              <X size={16} className="stroke-[3]" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold tracking-tight text-white dark:text-zinc-100">{toast.message}</p>
          </div>
          <button 
            onClick={() => setToast(prev => ({ ...prev, show: false }))}
            className="text-zinc-400 hover:text-zinc-200 dark:hover:text-zinc-300 transition-colors p-1"
          >
            <X size={14} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
