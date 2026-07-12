import React from 'react';
import { redirect } from 'next/navigation';
import { getSession, deleteSession } from '../../lib/session';
import { User } from '@/models/User';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import dbConnect from '../../lib/mongodb';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import OrdersContent from './OrdersContent';

export const dynamic = 'force-dynamic';

async function logoutAction() {
  'use server';
  await deleteSession();
  redirect('/');
}

export default async function OrdersPage() {
  let activeUser = null;
  let serializedItems: any[] = [];

  try {
    const session = await getSession();
    if (!session || !session.userId) {
      redirect('/login');
    }

    await dbConnect();
    const dbUser = await User.findById(session.userId).lean();
    if (!dbUser) {
      redirect('/login');
    }

    activeUser = {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      role: (dbUser as any).role || 'user',
      createdAt: dbUser.createdAt,
    };

    // Query and populate orders (status: 'paid')
    const orderItems = await Cart.find({ userId: session.userId, status: 'paid' })
      .populate({
        path: 'productId',
        model: Product,
      })
      .sort({ createdAt: -1 });

    // Serialize MongoDB objects for the Client Component
    serializedItems = orderItems
      .filter(item => item.productId)
      .map(item => ({
        _id: item._id.toString(),
        userId: item.userId,
        quantity: item.quantity,
        createdAt: item.createdAt.toISOString(),
        status: item.status,
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
    console.error('Orders page loading error:', error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Navbar */}
      <Navbar activeUser={activeUser} logoutAction={logoutAction} />

      {/* Orders Area */}
      <main className="flex-1 w-full">
        <OrdersContent items={serializedItems} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
