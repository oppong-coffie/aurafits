import { NextResponse } from 'next/server';
import { getSession } from '@/app/lib/session';
import dbConnect from '@/app/lib/mongodb';
import { Cart } from '@/models/Cart';
import { Product } from '@/models/Product';

export const dynamic = 'force-dynamic';

// GET: Retrieve user's cart items
export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Please log in to view your cart.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'pending';

    await dbConnect();
    const query: any = { userId: session.userId };
    if (status === 'pending' || status === 'cart') {
      query.status = { $in: ['pending', 'cart', null, undefined] };
    } else {
      query.status = status;
    }

    const cartItems = await Cart.find(query)
      .populate({
        path: 'productId',
        model: Product,
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      cart: cartItems
    });
  } catch (error: any) {
    console.error('GET /api/cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve cart: ' + error.message },
      { status: 500 }
    );
  }
}

// POST: Add a product to the cart (or increment quantity)
export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Please log in to add items to your cart.' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    // Check if product is already in user's cart
    const existingItem = await Cart.findOne({
      userId: session.userId,
      productId: productId,
      status: { $in: ['pending', 'cart', null, undefined] }
    });

    if (existingItem) {
      existingItem.quantity += 1;
      await existingItem.save();
      return NextResponse.json({
        success: true,
        message: 'Product quantity incremented in cart.',
        cartItem: existingItem
      });
    } else {
      const newItem = await Cart.create({
        userId: session.userId,
        productId: productId,
        quantity: 1,
        status: 'pending'
      });
      return NextResponse.json({
        success: true,
        message: 'Product added to cart.',
        cartItem: newItem
      });
    }
  } catch (error: any) {
    console.error('POST /api/cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add to cart: ' + error.message },
      { status: 500 }
    );
  }
}

// PATCH: Update quantity of a product in the cart
export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { productId, quantity, status } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // If status transition is requested (moving between cart and wishlist)
    if (status) {
      const searchStatus = status === 'wish' ? 'pending' : 'wish';
      const searchFilter = searchStatus === 'pending'
        ? { $in: ['pending', 'cart', null, undefined] }
        : 'wish';
      
      const currentItem = await Cart.findOne({
        userId: session.userId,
        productId: productId,
        status: searchFilter
      });

      if (!currentItem) {
        return NextResponse.json(
          { success: false, message: `Item not found in ${searchStatus}.` },
          { status: 404 }
        );
      }

      // Check if there is already an item in the target status
      const targetItem = await Cart.findOne({
        userId: session.userId,
        productId: productId,
        status: status
      });

      if (targetItem) {
        // Merge!
        targetItem.quantity += currentItem.quantity;
        await targetItem.save();
        await Cart.findByIdAndDelete(currentItem._id);
        return NextResponse.json({
          success: true,
          message: `Items merged in ${status}.`,
          cartItem: targetItem
        });
      } else {
        // Change status
        currentItem.status = status;
        await currentItem.save();
        return NextResponse.json({
          success: true,
          message: `Item moved to ${status}.`,
          cartItem: currentItem
        });
      }
    }

    // Standard quantity update (applies to active cart items)
    if (quantity !== undefined) {
      if (quantity < 1) {
        return NextResponse.json(
          { success: false, message: 'Quantity must be at least 1.' },
          { status: 400 }
        );
      }

      const updatedItem = await Cart.findOneAndUpdate(
        { userId: session.userId, productId: productId, status: { $in: ['pending', 'cart', null, undefined] } },
        { quantity: quantity },
        { new: true }
      );

      if (!updatedItem) {
        return NextResponse.json(
          { success: false, message: 'Item not found in cart.' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Cart quantity updated.',
        cartItem: updatedItem
      });
    }

    return NextResponse.json(
      { success: false, message: 'No action specified (quantity or status).' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('PATCH /api/cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update quantity: ' + error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove an item from the cart
export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || !session.userId) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const status = searchParams.get('status') || 'pending';

    if (!productId) {
      return NextResponse.json(
        { success: false, message: 'Product ID is required.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const deleteFilter = (status === 'pending' || status === 'cart')
      ? { $in: ['pending', 'cart', null, undefined] }
      : status;

    const deleted = await Cart.findOneAndDelete({
      userId: session.userId,
      productId: productId,
      status: deleteFilter
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Item not found in cart.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed from cart.'
    });
  } catch (error: any) {
    console.error('DELETE /api/cart error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete item: ' + error.message },
      { status: 500 }
    );
  }
}
