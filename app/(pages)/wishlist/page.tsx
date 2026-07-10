import React from 'react';
import { redirect } from 'next/navigation';
import { getSession, deleteSession } from '../../lib/session';
import { User } from '@/models/User';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import dbConnect from '../../lib/mongodb';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import WishlistContent from './WishlistContent';

export const dynamic = 'force-dynamic';

async function logoutAction() {
  'use server';
  await deleteSession();
  redirect('/');
}

export default async function WishlistPage() {
  let activeUser = null;
  let serializedItems: any[] = [];

  try {
    const session = await getSession();
    if (!session || !session.userId) {
      redirect('/login');
    }

    await dbConnect();
    const dbUser = await User.findById(session.userId);
    if (!dbUser) {
      redirect('/login');
    }

    activeUser = {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      createdAt: dbUser.createdAt,
    };

    // Query and populate wishlist items (status: 'wish')
    const wishlistItems = await Cart.find({ userId: session.userId, status: 'wish' })
      .populate({
        path: 'productId',
        model: Product,
      })
      .sort({ createdAt: -1 });

    // Serialize MongoDB objects for the Client Component
    serializedItems = wishlistItems
      .filter(item => item.productId) // filter out if product was deleted
      .map(item => ({
        _id: item._id.toString(),
        userId: item.userId,
        quantity: item.quantity,
        createdAt: item.createdAt.toISOString(),
        productId: {
          _id: item.productId._id.toString(),
          name: item.productId.name,
          price: item.productId.price,
          category: item.productId.category,
          image: item.productId.image || null,
          type: item.productId.type || null,
        }
      }));

  } catch (error) {
    console.error('Wishlist page loading error:', error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Navbar */}
      <Navbar activeUser={activeUser} logoutAction={logoutAction} />

      {/* Wishlist Interactive Area */}
      <main className="flex-1 w-full">
        <WishlistContent initialItems={serializedItems} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
