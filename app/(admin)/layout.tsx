import React from 'react';
import Footer from '../components/Footer';
import AdminSubNav from '../components/AdminSubNav';

export const dynamic = 'force-dynamic';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Sidebar Navigation Bar for Admin Sections */}
      <AdminSubNav />

      {/* Admin Content Route and Footer */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 w-full">
          {children}
        </div>
        {/* Shared Footer */}
        <Footer />
      </div>
    </div>
  );
}
