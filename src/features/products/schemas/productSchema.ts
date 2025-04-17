import { z } from "zod";

export const ratingSchema = z.object({
  rate: z.number(),
  count: z.number(),
});

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number().optional(),
  rating: z.union([z.number(), ratingSchema]).optional(),
  stock: z.number().optional(),
  brand: z.string(),
  category: z.string(),
  thumbnail: z.string(),
  images: z.array(z.string()).optional(),
});

export const productsResponseSchema = z.object({
  products: z.array(productSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
});

export type Rating = z.infer<typeof ratingSchema>;
export type Product = z.infer<typeof productSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;
