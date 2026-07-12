import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongodb';
import { Cart } from '@/models/Cart';
import { User } from '@/models/User';
import { Product } from '@/models/Product';
import { sendSMS } from '@/app/lib/sms';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const reference = searchParams.get('reference');

  if (!reference) {
    return NextResponse.redirect(`${origin}/cart?payment=failed&reason=no_reference`);
  }

  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY || 'sk_test_placeholder_secret_key';

    // Verify transaction with Paystack
    const paystackRes = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${paystackSecret}`,
      }
    });

    const paystackData = await paystackRes.json();

    if (!paystackData.status || paystackData.data.status !== 'success') {
      console.error('Paystack verification failed:', paystackData);
      return NextResponse.redirect(`${origin}/cart?payment=failed&reason=transaction_not_successful`);
    }

    // Payment is successful! Fulfill the order
    const userId = paystackData.data.metadata?.userId;
    if (!userId) {
      console.error('Paystack transaction verified but no userId found in metadata.');
      return NextResponse.redirect(`${origin}/cart?payment=failed&reason=no_user_metadata`);
    }

    await dbConnect();

    // Load user profile for phone info
    const user = await User.findById(userId).lean() as any;

    // Fetch details of items being checked out
    const cartItems = await Cart.find({
      userId: userId,
      status: { $in: ['pending', 'cart', null, undefined] }
    }).populate({ path: 'productId', model: Product });

    // Mark all active cart items as paid
    const result = await Cart.updateMany(
      { userId: userId, status: { $in: ['pending', 'cart', null, undefined] } },
      { status: 'paid' }
    );

    if (result.matchedCount > 0 && user && user.phone) {
      try {
        const itemNames = cartItems
          .map(item => item.productId?.name || 'Staple Item')
          .join(', ');
        
        const smsMessage = `Hi ${user.name}, your AuraFits order of ${cartItems.length} item(s) (${itemNames}) has been successfully placed (Paid via Paystack)! We are preparing it for delivery. Thank you!`;
        
        await sendSMS(user.phone, smsMessage);
      } catch (smsErr) {
        console.error('Checkout SMS dispatch failed:', smsErr);
      }
    }

    // Redirect to orders page with success status
    return NextResponse.redirect(`${origin}/orders?payment=success`);

  } catch (error: any) {
    console.error('Paystack verification GET route error:', error);
    return NextResponse.redirect(`${origin}/cart?payment=failed&reason=verification_exception`);
  }
}
