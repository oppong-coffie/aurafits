import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface ICart extends Document {
  userId: string;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  size?: string;
  color?: string;
  createdAt: Date;
  status: 'pending' | 'wish' | 'paid' | 'cart' | 'accepted' | 'completed' | 'cancelled';
}

const CartSchema = new Schema<ICart>({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    default: 1,
    min: [1, 'Quantity must be at least 1'],
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  status: {
    type: String,
    required: [true, 'Status is required'],
    default: 'pending',
    enum: ['pending', 'wish', 'paid', 'cart', 'accepted', 'completed', 'cancelled'],
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Next.js hot reloading can compile the model multiple times; this pattern prevents model overwrite errors.
export const Cart = models.Cart || model<ICart>('Cart', CartSchema);
