import { create } from "zustand";
import { Product, ProductsResponse } from "../api/productApi";
import {
  fetchProductByIdAction,
  fetchProductsAction,
} from "../actions/productActions";

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    skip: number;
    limit: number;
  };
  fetchProducts: (limit?: number, skip?: number) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  setProducts: (productsResponse: ProductsResponse) => void;
  setCurrentProduct: (product: Product | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  currentProduct: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    skip: 0,
    limit: 10,
  },

  fetchProducts: async (limit = 10, skip = 0) => {
    set({ isLoading: true, error: null });
    try {
      const productsResponse = await fetchProductsAction(limit, skip);
      set({
        products: productsResponse.products,
        pagination: {
          total: productsResponse.total,
          skip: productsResponse.skip,
          limit: productsResponse.limit,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "An error occurred while fetching products",
        isLoading: false,
      });
    }
  },

  fetchProductById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const product = await fetchProductByIdAction(id);
      set({ currentProduct: product, isLoading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : `An error occurred while fetching product with id ${id}`,
        isLoading: false,
      });
    }
  },

  setProducts: (productsResponse: ProductsResponse) =>
    set({
      products: productsResponse.products,
      pagination: {
        total: productsResponse.total,
        skip: productsResponse.skip,
        limit: productsResponse.limit,
      },
    }),

  setCurrentProduct: (product: Product | null) =>
    set({ currentProduct: product }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setError: (error: string | null) => set({ error }),
}));
