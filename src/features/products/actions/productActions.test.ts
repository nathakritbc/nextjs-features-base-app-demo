import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchProductsAction, fetchProductByIdAction } from "./productActions";
import axiosInstance from "@/lib/axios";
import { Product, ProductsResponse } from "../schemas/productSchema";
// Mock axios
vi.mock("@/lib/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("productActions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("fetchProductsAction", () => {
    it("should fetch products successfully", async () => {
      // Create mock response
      const mockProductsResponse: ProductsResponse = {
        products: [
          {
            id: 1,
            title: "Test Product",
            description: "Test Description",
            price: 100,
            brand: "Test Brand",
            category: "Test Category",
            thumbnail: "test-image.jpg",
          },
        ],
        total: 100,
        skip: 0,
        limit: 10,
      };

      // Mock axios get implementation
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockProductsResponse,
      });

      // Call the action
      const result = await fetchProductsAction();

      // Verify result
      expect(result).toEqual(mockProductsResponse);

      // Verify axios was called correctly
      expect(axiosInstance.get).toHaveBeenCalledWith("/products", {
        params: { limit: 10, skip: 0 },
      });
    });

    it("should handle errors when fetching products", async () => {
      // Mock error
      const mockError = new Error("Network error");
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

      // Verify error is thrown
      await expect(fetchProductsAction()).rejects.toThrow();
    });

    it("should accept custom limit and skip parameters", async () => {
      // Create mock response
      const mockProductsResponse: ProductsResponse = {
        products: [],
        total: 100,
        skip: 20,
        limit: 5,
      };

      // Mock axios get implementation
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockProductsResponse,
      });

      // Call the action with custom parameters
      await fetchProductsAction(5, 20);

      // Verify axios was called with custom parameters
      expect(axiosInstance.get).toHaveBeenCalledWith("/products", {
        params: { limit: 5, skip: 20 },
      });
    });
  });

  describe("fetchProductByIdAction", () => {
    it("should fetch a product by ID successfully", async () => {
      // Create mock product
      const mockProduct: Product = {
        id: 1,
        title: "Test Product",
        description: "Test Description",
        price: 100,
        brand: "Test Brand",
        category: "Test Category",
        thumbnail: "test-image.jpg",
      };

      // Mock axios get implementation
      vi.mocked(axiosInstance.get).mockResolvedValueOnce({
        data: mockProduct,
      });

      // Call the action
      const result = await fetchProductByIdAction(1);

      // Verify result
      expect(result).toEqual(mockProduct);

      // Verify axios was called correctly
      expect(axiosInstance.get).toHaveBeenCalledWith("/products/1");
    });

    it("should handle errors when fetching a product by ID", async () => {
      // Mock error
      const mockError = new Error("Product not found");
      vi.mocked(axiosInstance.get).mockRejectedValueOnce(mockError);

      // Verify error is thrown
      await expect(fetchProductByIdAction(999)).rejects.toThrow();
    });
  });
});
