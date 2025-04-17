import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  Product,
  ProductsResponse,
  productSchema,
  productsResponseSchema,
} from "../schemas/productSchema";

/**
 * Fetches products with pagination
 */
export const fetchProductsAction = async (
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

/**
 * Fetches a single product by ID
 */
export async function fetchProductByIdAction(
  productId: number
): Promise<Product | undefined> {
  try {
    const response = await axiosInstance.get(`/products/${productId}`);

    return productSchema.parse(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(
      `Error fetching product with id ${productId}:`,
      axiosError.message
    );
    return undefined;
  }
}
