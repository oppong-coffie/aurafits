import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Product } from '@/models/Product';
import dbConnect from '@/app/lib/mongodb';

const CreateProductSchema = z.object({
  name: z.string().min(2, 'Product name must be at least 2 characters long').max(100),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(1, 'Price must be at least 1'),
  type: z.string().default('shirt'),
  promo: z.boolean().optional(),
  flashSale: z.boolean().optional(),
  oldPrice: z.number().optional(),
  newPrice: z.number().optional(),
  topSelling: z.boolean().optional(),
  featured: z.boolean().optional(),
  sponsored: z.boolean().optional(),
  image: z.string().optional(),
  status: z.enum(['Active', 'Flagged']).optional(),
});



export async function getProducts(request: Request) {
  try {
    await dbConnect();
    


    // Read query parameters
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');

    const filter: any = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const list = await Product.find(filter).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      products: list.map(p => ({
        id: p._id.toString(),
        name: p.name,
        category: p.category,
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
      }))
    });
  } catch (error: any) {
    console.error('getProducts controller error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve products from database.' },
      { status: 500 }
    );
  }
}

export async function createProduct(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const result = CreateProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newProduct = await Product.create({
      ...result.data,
      rating: 4.5,
      status: 'Active'
    });

    return NextResponse.json({
      success: true,
      product: {
        id: newProduct._id.toString(),
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
        rating: newProduct.rating,
        type: newProduct.type,
        status: newProduct.status,
        promo: newProduct.promo,
        flashSale: newProduct.flashSale,
        oldPrice: newProduct.oldPrice,
        newPrice: newProduct.newPrice,
        topSelling: newProduct.topSelling,
        featured: newProduct.featured,
        sponsored: newProduct.sponsored,
        image: newProduct.image,
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('createProduct controller error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product in database.' },
      { status: 500 }
    );
  }
}

export async function toggleProductStatus(request: Request, id: string) {
  try {
    await dbConnect();
    
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    // Toggle
    product.status = product.status === 'Active' ? 'Flagged' : 'Active';
    await product.save();

    return NextResponse.json({
      success: true,
      product: {
        id: product._id.toString(),
        name: product.name,
        status: product.status
      }
    });
  } catch (error: any) {
    console.error('toggleProductStatus controller error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product status.' },
      { status: 500 }
    );
  }
}

export async function deleteProduct(request: Request, id: string) {
  try {
    await dbConnect();
    
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully.'
    });
  } catch (error: any) {
    console.error('deleteProduct controller error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product.' },
      { status: 500 }
    );
  }
}

export async function updateProduct(request: Request, id: string) {
  try {
    await dbConnect();
    const body = await request.json();

    const result = CreateProductSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, message: 'Product not found.' },
        { status: 404 }
      );
    }

    // Update fields
    Object.assign(product, result.data);
    await product.save();

    return NextResponse.json({
      success: true,
      product: {
        id: product._id.toString(),
        name: product.name,
        category: product.category,
        price: product.price,
        rating: product.rating,
        type: product.type,
        status: product.status,
        promo: product.promo,
        flashSale: product.flashSale,
        oldPrice: product.oldPrice,
        newPrice: product.newPrice,
        topSelling: product.topSelling,
        featured: product.featured,
        sponsored: product.sponsored,
        image: product.image,
      }
    });
  } catch (error: any) {
    console.error('updateProduct controller error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product in database.' },
      { status: 500 }
    );
  }
}
