const mongoose = require('mongoose');
const { z } = require('zod');

// Read MONGODB_URI from .env.local
const fs = require('fs');
const path = require('path');
const dotenvContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const match = dotenvContent.match(/MONGODB_URI=(.*)/);
if (!match) {
  console.error("No MONGODB_URI found in .env.local");
  process.exit(1);
}
const MONGODB_URI = match[1].trim();

// Define Schema
const ProductSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Product name is required'],
    trim: true,
  },
  image: {
    type: String,
  },
  colors: {
    type: [String],
    default: [],
  },
  sizes: {
    type: [String],
    default: [],
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
    enum: ['In Stock', 'Out Of Stock', 'Few Left'], 
    default: 'In Stock',
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

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

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
  status: z.enum(['In Stock', 'Out Of Stock', 'Few Left']).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
});

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  // Create temporary product
  const tempProd = await Product.create({
    name: "Temp Test Product",
    category: "active-wear",
    price: 99,
    colors: ["Red"],
    sizes: ["M"]
  });
  console.log("Created temp product:", tempProd._id);

  // Attempt update with edited colors but empty/no sizes
  const payload = {
    name: "Temp Test Product",
    category: "active-wear",
    price: 99,
    colors: ["Blue"], // edited color
    sizes: [] // empty size
  };

  const result = CreateProductSchema.safeParse(payload);
  console.log("Zod parse success:", result.success);

  try {
    const product = await Product.findById(tempProd._id);
    Object.assign(product, result.data);
    await product.save();
    console.log("Update success! Saved product:", product);
  } catch (err) {
    console.error("Update failed with error:", err);
  } finally {
    // Cleanup
    await Product.findByIdAndDelete(tempProd._id);
    await mongoose.disconnect();
  }
}

run();
