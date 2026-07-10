import React from 'react';
import { redirect } from 'next/navigation';
import { getSession, deleteSession } from '../../lib/session';
import { User } from '@/models/User';
import dbConnect from '../../lib/mongodb';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import HomeContent from '../../components/home/HomeContent';

export const dynamic = 'force-dynamic';

// Server Action to log the user out directly on the server
async function logoutAction() {
  'use server';
  await deleteSession();
  redirect('/');
}

export default async function Home() {
  let activeUser = null;

  try {
    const session = await getSession();
    if (session && session.userId) {
      await dbConnect();
      const dbUser = await User.findById(session.userId);
      if (dbUser) {
        activeUser = {
          id: dbUser._id.toString(),
          name: dbUser.name,
          email: dbUser.email,
          createdAt: dbUser.createdAt,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching session on home page:', error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Navbar */}
      <Navbar activeUser={activeUser} logoutAction={logoutAction} />

      {/* Main Content Area */}
      <HomeContent />

      {/* Footer */}
      <Footer />
    </div>
  );
}
