import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import dbConnect from '@/app/lib/mongodb';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { User } from '@/models/User';
import { sendSMS } from '@/app/lib/sms';

export const dynamic = 'force-dynamic';

// GET: Fetch dashboard data for all users
export async function GET() {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    // Fetch all items from DB with populated product
    const allItems = await Cart.find({})
      .populate({ path: 'productId', model: Product })
      .sort({ createdAt: -1 });

    // Fetch all users to map userId to userName
    const users = await User.find({});
    const userMap = new Map(users.map(u => [u._id.toString(), u.name]));

    const carts: any[] = [];
    const orders: any[] = [];
    const servedProducts: any[] = [];
    const rejectedProducts: any[] = [];

    allItems.forEach(item => {
      const p = item.productId;
      if (!p) return; // skip if product was deleted

      const userName = userMap.get(item.userId) || 'Anonymous';
      const formattedItem = {
        id: item._id.toString(),
        userName,
        productName: p.name,
        productId: p._id.toString(),
        productImage: p.image || null,
        totalValue: p.price * item.quantity,
        quantity: item.quantity,
        price: p.price,
        size: item.size || null,
        color: item.color || null,
        date: new Date(item.createdAt).toLocaleString(),
        createdAt: item.createdAt,
        status: item.status
      };

      // Categorize items by status
      if (item.status === 'pending' || item.status === 'cart') {
        carts.push(formattedItem);
      } else if (item.status === 'paid' || item.status === 'accepted') {
        orders.push(formattedItem);
      } else if (item.status === 'completed') {
        servedProducts.push(formattedItem);
      } else if (item.status === 'cancelled') {
        rejectedProducts.push(formattedItem);
      }
    });

    return NextResponse.json({
      success: true,
      carts,
      orders,
      servedProducts,
      rejectedProducts
    });
  } catch (err: any) {
    console.error('GET /api/admin/orders error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH: Update cart item status (serve / reject)
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { itemId, status } = await request.json();
    if (!itemId || !status) {
      return NextResponse.json({ success: false, message: 'Missing itemId or status' }, { status: 400 });
    }

    await dbConnect();
    
    // Load details of the order item
    const cartItem = await Cart.findById(itemId).populate({ path: 'productId', model: Product });
    if (!cartItem) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    cartItem.status = status;
    await cartItem.save();

    // Fetch the customer profile who placed the order
    const customer = await User.findById(cartItem.userId);

    // Send SMS alert on status change if customer has phone
    if (customer && customer.phone) {
      try {
        const prodName = cartItem.productId?.name || 'Staple Item';
        let smsText = '';
        if (status === 'accepted') {
          smsText = `Hi ${customer.name}, your AuraFits order for "${prodName}" has been accepted and is now in transit/processing!`;
        } else if (status === 'completed') {
          smsText = `Hi ${customer.name}, your AuraFits order for "${prodName}" has been completed/delivered! Thank you for shopping with us!`;
        } else if (status === 'cancelled') {
          smsText = `Hi ${customer.name}, your AuraFits order for "${prodName}" has been rejected/cancelled.`;
        }

        if (smsText) {
          await sendSMS(customer.phone, smsText);
        }
      } catch (smsErr) {
        console.error('Status Update SMS dispatch failed:', smsErr);
      }
    }

    return NextResponse.json({ success: true, cartItem });
  } catch (err: any) {
    console.error('PATCH /api/admin/orders error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
