import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import dbConnect from '@/app/lib/mongodb';
import { Cart } from '@/models/Cart';
import { User } from '@/models/User';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Please log in to make a payment.' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Fetch user details for email address
    const user = await User.findById(session.userId).lean() as any;
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User profile not found.' },
        { status: 404 }
      );
    }

    // Get active cart items
    const cartItems = await Cart.find({
      userId: session.userId,
      status: { $in: ['pending', 'cart', null, undefined] }
    }).populate({ path: 'productId', model: Product });

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { success: false, message: 'Your cart is empty.' },
        { status: 400 }
      );
    }

    // Compute checkout totals (similar to frontend calculations)
    const subtotal = cartItems.reduce((sum: number, item: any) => {
      const price = item.productId?.price || 0;
      return sum + (price * item.quantity);
    }, 0);

    const shipping = subtotal > 200 || subtotal === 0 ? 0 : 15;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const totalAmount = Math.round((subtotal + shipping + tax) * 100) / 100;

    // Paystack expects amount in minor units (e.g. cents/kobo)
    const amountInCents = Math.round(totalAmount * 100);

    // Get the request origin for generating full callback URL
    const { origin } = new URL(request.url);

    // Reference format: aura_pay_ + timestamp + random token
    const reference = `aura_pay_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder_secret_key';

    // Call Paystack API
    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: amountInCents,
        currency: 'GHS',
        reference,
        callback_url: `${origin}/api/paystack/verify`,
        metadata: {
          userId: session.userId,
          custom_fields: [
            {
              display_name: "User ID",
              variable_name: "user_id",
              value: session.userId
            }
          ]
        }
      })
    });

    const paystackData = await paystackRes.json();
    if (!paystackData.status) {
      console.error('Paystack initialization response:', paystackData);
      return NextResponse.json(
        { success: false, message: paystackData.message || 'Failed to initialize Paystack transaction.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference
    });

  } catch (error: any) {
    console.error('Paystack initialization endpoint error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment initialization failed: ' + error.message },
      { status: 500 }
    );
  }
}
