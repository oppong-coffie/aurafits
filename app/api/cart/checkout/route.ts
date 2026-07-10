import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import dbConnect from '@/app/lib/mongodb';
import { Cart } from '@/models/Cart';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { sendSMS } from '@/app/lib/sms';

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

    // Load user profile for phone info
    const user = await User.findById(session.userId);

    // Fetch details of items being checked out to get names
    const cartItems = await Cart.find({
      userId: session.userId,
      status: { $in: ['pending', 'cart', null, undefined] }
    }).populate({ path: 'productId', model: Product });

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

    // Send order confirmation SMS if phone exists
    if (user && user.phone) {
      try {
        const itemNames = cartItems
          .map(item => item.productId?.name || 'Staple Item')
          .join(', ');
        
        const smsMessage = `Hi ${user.name}, your AuraFits order of ${cartItems.length} item(s) (${itemNames}) has been successfully placed! We are preparing it for delivery. Thank you!`;
        
        await sendSMS(user.phone, smsMessage);
      } catch (smsErr) {
        console.error('Checkout SMS dispatch failed:', smsErr);
      }
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
