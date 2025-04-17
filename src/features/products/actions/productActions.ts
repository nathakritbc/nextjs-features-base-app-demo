import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import {
  Product,
  ProductsResponse,
  productSchema,
  productsResponseSchema,
} from "../api/productApi";

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
export const fetchProductByIdAction = async (id: number): Promise<Product> => {
  try {
    const response = await axiosInstance.get(`/products/${id}`);

    return productSchema.parse(response.data);
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error(`Error fetching product with id ${id}:`, axiosError.message);
    throw error;
  }
};
