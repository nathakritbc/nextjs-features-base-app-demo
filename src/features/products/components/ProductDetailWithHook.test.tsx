import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProductDetailWithHook from "./ProductDetailWithHook";
import { useApi } from "@/hooks/useApi";

// Mock the useApi hook
vi.mock("@/hooks/useApi", () => ({
  useApi: vi.fn(),
}));

describe("ProductDetailWithHook", () => {
  const mockFetchData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    // Setup mock hook state
    vi.mocked(useApi).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      fetchData: mockFetchData,
    } as any);

    render(<ProductDetailWithHook productId={1} />);

    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();
  });

  it("should display error message when there is an error", () => {
    // Setup mock hook state with error
    vi.mocked(useApi).mockReturnValue({
      data: null,
      isLoading: false,
      error: "Failed to fetch product",
      fetchData: mockFetchData,
    } as any);

    render(<ProductDetailWithHook productId={1} />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch product/i)).toBeInTheDocument();
  });

  it("should display product not found when product is null", () => {
    // Setup mock hook state with no product
    vi.mocked(useApi).mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
      fetchData: mockFetchData,
    } as any);

    render(<ProductDetailWithHook productId={1} />);

    expect(screen.getByText(/Product not found/i)).toBeInTheDocument();
    expect(screen.getByText(/Return to products/i)).toBeInTheDocument();
  });

  it("should display product details when product is loaded", async () => {
    const mockProduct = {
      id: 1,
      title: "Test Product",
      price: 99.99,
      description: "This is a test product",
      category: "electronics",
      brand: "Test Brand",
      thumbnail: "/image.jpg",
      rating: { rate: 4.5, count: 100 },
    };

    // Setup mock hook state with product data
    vi.mocked(useApi).mockReturnValue({
      data: mockProduct,
      isLoading: false,
      error: null,
      fetchData: mockFetchData.mockResolvedValue(mockProduct),
    } as any);

    render(<ProductDetailWithHook productId={1} />);

    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument();
      expect(screen.getByText("$99.99")).toBeInTheDocument();
      expect(screen.getByText("This is a test product")).toBeInTheDocument();
      expect(screen.getByText("electronics")).toBeInTheDocument();
      expect(screen.getByText(/4.5/)).toBeInTheDocument();
    });
  });

  it("should call fetchData with the correct product ID", () => {
    vi.mocked(useApi).mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      fetchData: mockFetchData,
    } as any);

    render(<ProductDetailWithHook productId={42} />);

    expect(useApi).toHaveBeenCalledWith("/products/42");
    expect(mockFetchData).toHaveBeenCalled();
  });
});
