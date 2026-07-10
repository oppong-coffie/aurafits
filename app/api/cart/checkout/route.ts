import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import dbConnect from '@/app/lib/mongodb';
import { Cart } from '@/models/Cart';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Please log in to checkout.' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Update all active cart items to 'paid'
    const result = await Cart.updateMany(
      { userId: session.userId, status: { $in: ['pending', 'cart', null, undefined] } },
      { status: 'paid' }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Checkout successful! Your order has been placed.',
      updatedCount: result.modifiedCount
    });
  } catch (error: any) {
    console.error('POST /api/cart/checkout error:', error);
    return NextResponse.json(
      { success: false, message: 'Checkout failed: ' + error.message },
      { status: 500 }
    );
  }
}
