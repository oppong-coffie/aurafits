import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getSession, deleteSession } from '../../lib/session';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import dbConnect from '../../lib/mongodb';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import CategoryList from '../../components/CategoryList';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Server Action to log out
async function logoutAction() {
  'use server';
  await deleteSession();
  redirect('/');
}

const CATEGORY_DETAILS: Record<string, { name: string; description: string; bgImage: string }> = {
  "active-wear": {
    name: "Active Wear",
    description: "High-performance sportswear designed for comfort and agility.",
    bgImage: "/active2.jpg"
  },
  "travel-set": {
    name: "Travel Set",
    description: "Curated collections and luggage designed for the modern voyager.",
    bgImage: "/yes.jpg"
  },
  "lounge-wear": {
    name: "Lounge Wear",
    description: "Luxurious, cozy clothing for slow days and ultimate relaxation.",
    bgImage: "/l4.jpg"
  },
  "footwear": {
    name: "Foot Wear",
    description: "Premium leather shoes, boots, and sneakers designed for comfort and poise.",
    bgImage: "/foot1.jpg"
  }
};



export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const normalizedSlug = slug === 'foot-wear' ? 'footwear' : slug;
  const categoryInfo = CATEGORY_DETAILS[normalizedSlug];

  if (!categoryInfo) {
    notFound();
  }

  let activeUser = null;
  let productsList: any[] = [];

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

    // Query all products for this category (all statuses)
    const list = await Product.find({ category: normalizedSlug }).sort({ createdAt: -1 });
    productsList = list.map(p => ({
      id: p._id.toString(),
      name: p.name,
      price: p.price,
      rating: p.rating,
      type: p.type,
      status: p.status,
      promo: p.promo,
      flashSale: p.flashSale,
      oldPrice: p.oldPrice,
      newPrice: p.newPrice,
      topSelling: p.topSelling,
      featured: p.featured,
      sponsored: p.sponsored,
      image: p.image,
      colors: p.colors || [],
      sizes: p.sizes || [],
    }));
  } catch (error) {
    console.error('Error fetching data on category page:', error);
  }



  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      {/* Navbar */}
      <Navbar activeUser={activeUser} logoutAction={logoutAction} />

      {/* Hero Header */}
      <header className="relative w-full overflow-hidden bg-zinc-950 py-16 md:py-24 border-b border-zinc-200 dark:border-zinc-800/80">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={categoryInfo.bgImage} 
            alt={categoryInfo.name}
            className="w-full h-full object-cover object-top opacity-45 dark:opacity-35 scale-105"
          />
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-black/30" />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" /> */}
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-12">
          <Link href="/" className="inline-flex items-center gap-1 text-xs font-semibold text-pink-500 hover:text-pink-400 hover:underline uppercase tracking-wider mb-4 block">
            &larr; Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {categoryInfo.name}
          </h1>
          <p className="text-sm md:text-base text-zinc-300 mt-2 max-w-xl leading-relaxed">
            {categoryInfo.description}
          </p>
        </div>
      </header>

      {/* Products List & Filters */}
      <main className="flex-1 w-full px-6 py-12 md:px-12 md:py-16">
        <CategoryList products={productsList} />
      </main>
      <Footer />
    </div>
  );
}
