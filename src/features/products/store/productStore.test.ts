/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useProductStore } from "./productStore";
import * as productActions from "../actions/productActions";
import { mock } from "vitest-mock-extended";
// Mock the product actions
vi.mock("../actions/productActions", () => ({
  fetchProductsAction: mock(productActions.fetchProductsAction),
  fetchProductByIdAction: mock(productActions.fetchProductByIdAction),
}));

describe("productStore", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Create a clean store by getting the current state and preserving methods
    const store = useProductStore.getState();

    // Reset the store state
    useProductStore.setState({
      products: [],
      currentProduct: null,
      isLoading: false,
      error: null,
      pagination: {
        total: 0,
        skip: 0,
        limit: 10,
      },
      // Keep all method references intact
      fetchProducts: store.fetchProducts,
      fetchProductById: store.fetchProductById,
      setProducts: store.setProducts,
      setCurrentProduct: store.setCurrentProduct,
      setLoading: store.setLoading,
      setError: store.setError,
    });
  });

  describe("fetchProducts", () => {
    it("should update the store with products data on successful fetch", async () => {
      // Create mock product response
      const mockProductsResponse = {
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

      // Create our mock implementation
      vi.mocked(productActions.fetchProductsAction).mockResolvedValueOnce(
        mockProductsResponse
      );

      // Get the store and call the action
      const store = useProductStore.getState();
      await store.fetchProducts();

      // Verify the store was updated correctly
      const state = useProductStore.getState();
      expect(state.products).toEqual(mockProductsResponse.products);
      expect(state.pagination).toEqual({
        total: mockProductsResponse.total,
        skip: mockProductsResponse.skip,
        limit: mockProductsResponse.limit,
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();

      // Verify action was called with correct parameters
      expect(productActions.fetchProductsAction).toHaveBeenCalledWith(10, 0);
    });

    it("should update the store with error on failed fetch", async () => {
      // Create error to be thrown
      const mockError = new Error("API error");
      vi.mocked(productActions.fetchProductsAction).mockRejectedValueOnce(
        mockError
      );

      // Get the store and call the action
      const store = useProductStore.getState();
      await store.fetchProducts();

      // Verify error state was set correctly
      const state = useProductStore.getState();
      expect(state.products).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("API error");
    });
  });

  describe("fetchProductById", () => {
    it("should update the store with product data on successful fetch", async () => {
      // Create mock product
      const mockProduct = {
        id: 1,
        title: "Test Product",
        description: "Test Description",
        price: 100,
        brand: "Test Brand",
        category: "Test Category",
        thumbnail: "test-image.jpg",
      };

      // Set up mock response
      vi.mocked(productActions.fetchProductByIdAction).mockResolvedValueOnce(
        mockProduct
      );

      // Get the store and call the action
      const store = useProductStore.getState();
      await store.fetchProductById(1);

      // Verify state was updated
      const state = useProductStore.getState();
      expect(state.currentProduct).toEqual(mockProduct);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();

      // Verify action was called with the correct ID
      expect(productActions.fetchProductByIdAction).toHaveBeenCalledWith(1);
    });

    it("should update the store with error on failed fetch", async () => {
      // Create error to be thrown
      const mockError = new Error("API error");
      vi.mocked(productActions.fetchProductByIdAction).mockRejectedValueOnce(
        mockError
      );

      // Get the store and call the action
      const store = useProductStore.getState();
      await store.fetchProductById(1);

      // Verify error state was set correctly
      const state = useProductStore.getState();
      expect(state.currentProduct).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe("API error");
    });
  });

  describe("store actions", () => {
    it("should set products correctly", () => {
      // Create mock products response
      const mockProductsResponse = {
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

      // Get the store and call setProducts
      const store = useProductStore.getState();
      store.setProducts(mockProductsResponse);

      // Verify state was updated correctly
      const state = useProductStore.getState();
      expect(state.products).toEqual(mockProductsResponse.products);
      expect(state.pagination).toEqual({
        total: mockProductsResponse.total,
        skip: mockProductsResponse.skip,
        limit: mockProductsResponse.limit,
      });
    });

    it("should set current product correctly", () => {
      // Create mock product
      const mockProduct = {
        id: 1,
        title: "Test Product",
        description: "Test Description",
        price: 100,
        brand: "Test Brand",
        category: "Test Category",
        thumbnail: "test-image.jpg",
      };

      // Get the store and call setCurrentProduct
      const store = useProductStore.getState();
      store.setCurrentProduct(mockProduct);

      // Verify state was updated correctly
      const state = useProductStore.getState();
      expect(state.currentProduct).toEqual(mockProduct);
    });

    it("should set loading state correctly", () => {
      // Get the store
      const store = useProductStore.getState();

      // Set loading to true
      store.setLoading(true);
      expect(useProductStore.getState().isLoading).toBe(true);

      // Set loading to false
      store.setLoading(false);
      expect(useProductStore.getState().isLoading).toBe(false);
    });

    it("should set error state correctly", () => {
      // Get the store
      const store = useProductStore.getState();

      // Set error message
      store.setError("Test error");

      // Verify error was set
      expect(useProductStore.getState().error).toBe("Test error");
    });
  });
});
