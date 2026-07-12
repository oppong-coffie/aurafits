const { z } = require('zod');

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

const payload = {
  name: "Linen Wrap Jacket",
  category: "active-wear",
  price: 120,
  type: "shirt",
  promo: false,
  flashSale: false,
  oldPrice: undefined,
  newPrice: undefined,
  topSelling: false,
  featured: false,
  sponsored: false,
  status: "In Stock",
  colors: ["Black"],
  sizes: [] // empty sizes array
};

const result = CreateProductSchema.safeParse(payload);
console.log("Zod parse success:", result.success);
if (!result.success) {
  console.log("Zod errors:", result.error.flatten().fieldErrors);
} else {
  console.log("Parsed data:", result.data);
}
