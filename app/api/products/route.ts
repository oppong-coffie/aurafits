import { getProducts, createProduct } from '@/controllers/productController';

export async function GET(request: Request) {
  return getProducts(request);
}

export async function POST(request: Request) {
  return createProduct(request);
}
