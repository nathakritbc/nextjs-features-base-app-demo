import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductDetail from "./ProductDetail";
import { useProductStore } from "../store/productStore";

// Mock the product store
vi.mock("../store/productStore", () => ({
  useProductStore: vi.fn(),
}));

describe("ProductDetail", () => {
  const mockFetchProductById = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    // Setup mock store state
    vi.mocked(useProductStore).mockReturnValue({
      currentProduct: null,
      isLoading: true,
      error: null,
      fetchProductById: mockFetchProductById,
    } as any);

    render(<ProductDetail productId={1} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(mockFetchProductById).toHaveBeenCalledWith(1);
  });

  it("should display error message when there is an error", () => {
    // Setup mock store state with error
    vi.mocked(useProductStore).mockReturnValue({
      currentProduct: null,
      isLoading: false,
      error: "Failed to fetch product",
      fetchProductById: mockFetchProductById,
    } as any);

    render(<ProductDetail productId={1} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch product/i)).toBeInTheDocument();
  });

  it("should display product not found when product is null", () => {
    // Setup mock store state with no product
    vi.mocked(useProductStore).mockReturnValue({
      currentProduct: null,
      isLoading: false,
      error: null,
      fetchProductById: mockFetchProductById,
    } as any);

    render(<ProductDetail productId={1} />);

    expect(screen.getByText(/Product not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to products/i)).toBeInTheDocument();
  });

  it("should display product details when product is loaded", () => {
    // Setup mock store state with product
    const mockProduct = {
      id: 1,
      title: "Test Product",
      description: "Test Description",
      price: 100,
      brand: "Test Brand",
      category: "Test Category",
      thumbnail: "/test-image.jpg",
    };

    vi.mocked(useProductStore).mockReturnValue({
      currentProduct: mockProduct,
      isLoading: false,
      error: null,
      fetchProductById: mockFetchProductById,
    } as any);

    render(<ProductDetail productId={1} />);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
    expect(screen.getByText("$100")).toBeInTheDocument();
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    expect(screen.getByText("Test Category")).toBeInTheDocument();
  });

  it("should call fetchProductById when productId changes", () => {
    // Setup mock store state
    vi.mocked(useProductStore).mockReturnValue({
      currentProduct: null,
      isLoading: true,
      error: null,
      fetchProductById: mockFetchProductById,
    } as any);

    const { rerender } = render(<ProductDetail productId={1} />);
    expect(mockFetchProductById).toHaveBeenCalledWith(1);

    // Change productId prop
    rerender(<ProductDetail productId={2} />);
    expect(mockFetchProductById).toHaveBeenCalledWith(2);
  });
});
