import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: string;
  price: number;
  rating: number;
  type: string;
  status: 'Active' | 'Flagged';
  promo?: boolean;
  flashSale?: boolean;
  oldPrice?: number;
  newPrice?: number;
  topSelling?: boolean;
  featured?: boolean;
  sponsored?: boolean;
  image?: string;
  createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
  },
  image: {
    type: String,
  },
  category: { 
    type: String, 
    required: [true, 'Category is required'],
    trim: true,
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
  },
  rating: { 
    type: Number, 
    default: 4.5,
  },
  type: { 
    type: String, 
    default: 'shirt',
  },
  status: { 
    type: String, 
    enum: ['Active', 'Flagged'], 
    default: 'Active',
  },
  promo: { 
    type: Boolean, 
    default: false,
  },
  flashSale: { 
    type: Boolean, 
    default: false,
  },
  oldPrice: { 
    type: Number,
  },
  newPrice: { 
    type: Number,
  },
  topSelling: { 
    type: Boolean, 
    default: false,
  },
  featured: { 
    type: Boolean, 
    default: false,
  },
  sponsored: { 
    type: Boolean, 
    default: false,
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
  },
});

export const Product = models.Product || model<IProduct>('Product', ProductSchema);
