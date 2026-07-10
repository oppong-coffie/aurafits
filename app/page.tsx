import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSession, deleteSession } from './lib/session';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import dbConnect from './lib/mongodb';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeContent from './components/home/HomeContent';


export const dynamic = 'force-dynamic';

// Server Action to log the user out directly on the server
async function logoutAction() {
  'use server';
  await deleteSession();
  redirect('/');
}

export default async function Home() {
  let activeUser = null;
  let featuredProducts: any[] = [];
  let flashProducts: any[] = [];
  let topSellingProducts: any[] = [];
  let sponsoredProducts: any[] = [];
  let allProducts: any[] = [];
  let promoProducts: any[] = [];

  try {
    await dbConnect();
    const session = await getSession();
    if (session && session.userId) {
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

    // Query featured and flash sale products
    const featuredList = await Product.find({ featured: true, status: 'Active' }).sort({ createdAt: -1 }).limit(4);
    featuredProducts = featuredList.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      rating: p.rating,
      type: p.type,
      category: p.category,
      promo: p.promo,
      flashSale: p.flashSale,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      topSelling: p.topSelling,
      featured: p.featured,
      sponsored: p.sponsored,
      image: p.image,
    }));

    const flashList = await Product.find({ flashSale: true, status: 'Active' }).sort({ createdAt: -1 }).limit(4);
    flashProducts = flashList.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      rating: p.rating,
      type: p.type,
      category: p.category,
      promo: p.promo,
      flashSale: p.flashSale,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      topSelling: p.topSelling,
      featured: p.featured,
      sponsored: p.sponsored,
      image: p.image,
    }));

    // Query top selling products
    const topSellingList = await Product.find({ topSelling: true, status: 'Active' }).sort({ createdAt: -1 }).limit(3);
    topSellingProducts = topSellingList.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      rating: p.rating,
      type: p.type,
      category: p.category,
      promo: p.promo,
      flashSale: p.flashSale,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      topSelling: p.topSelling,
      featured: p.featured,
      sponsored: p.sponsored,
      image: p.image,
    }));

    // Query sponsored products
    const sponsoredList = await Product.find({ sponsored: true, status: 'Active' }).sort({ createdAt: -1 }).limit(2);
    sponsoredProducts = sponsoredList.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      rating: p.rating,
      type: p.type,
      category: p.category,
      promo: p.promo,
      flashSale: p.flashSale,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      topSelling: p.topSelling,
      featured: p.featured,
      sponsored: p.sponsored,
      image: p.image,
    }));

    // Query promo products
    const promoList = await Product.find({ promo: true, status: 'Active' }).sort({ createdAt: -1 });
    promoProducts = promoList.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      rating: p.rating,
      type: p.type,
      category: p.category,
      promo: p.promo,
      flashSale: p.flashSale,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      topSelling: p.topSelling,
      featured: p.featured,
      sponsored: p.sponsored,
      image: p.image,
    }));

    // Query all active products
    const allList = await Product.find({ status: 'Active' }).sort({ createdAt: -1 });
    allProducts = allList.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      rating: p.rating,
      type: p.type,
      category: p.category,
      promo: p.promo,
      flashSale: p.flashSale,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      topSelling: p.topSelling,
      featured: p.featured,
      sponsored: p.sponsored,
      image: p.image,
    }));
  } catch (error) {
    console.error('Error fetching data on home page:', error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-55 transition-colors duration-200">
      {/* Navbar */}
      <Navbar activeUser={activeUser} logoutAction={logoutAction} />

      {/* Main Content Area */}
      <HomeContent 
        featuredProducts={featuredProducts} 
        flashProducts={flashProducts} 
        topSellingProducts={topSellingProducts}
        sponsoredProducts={sponsoredProducts}
        promoProducts={promoProducts}
        allProducts={allProducts}
      />
      <Footer />
    </div>
  );
}

