import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import dbConnect from '@/app/lib/mongodb';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';
import { User } from '@/models/User';

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
        date: new Date(item.createdAt).toLocaleString(),
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
    
    const updated = await Cart.findByIdAndUpdate(
      itemId, 
      { status }, 
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, cartItem: updated });
  } catch (err: any) {
    console.error('PATCH /api/admin/orders error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
