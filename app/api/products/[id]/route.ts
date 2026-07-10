import { toggleProductStatus, deleteProduct, updateProduct } from '@/controllers/productController';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return toggleProductStatus(request, id);
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return updateProduct(request, id);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return deleteProduct(request, id);
}
