import { z } from "zod";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  price: z.number(),
  discountPercentage: z.number().optional(),
  rating: z.number().optional(),
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

export type Product = z.infer<typeof productSchema>;
export type ProductsResponse = z.infer<typeof productsResponseSchema>;

export const fetchProducts = async (
  limit = 10,
  skip = 0
): Promise<ProductsResponse> => {
  try {
    const response = await axiosInstance.get(`/products`, {
      params: { limit, skip },
    });

    return productsResponseSchema.parse(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error("Error fetching products:", axiosError.message);
    throw error;
  }
};

export const fetchProductById = async (id: number): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);

    return productSchema.parse(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error fetching product with id ${id}:`, axiosError.message);
    throw error;
  }
};
