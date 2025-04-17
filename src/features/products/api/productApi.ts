import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";
import { Product, productSchema } from "../schemas/productSchema";
import { productsResponseSchema } from "../schemas/productSchema";
import { ProductsResponse } from "../schemas/productSchema";

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
