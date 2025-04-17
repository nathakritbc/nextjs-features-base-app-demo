import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import ProductList from "./ProductList";
import { useProductStore } from "../store/productStore";

// Mock the product store
vi.mock("../store/productStore", () => ({
  useProductStore: vi.fn(),
}));

// Mock next/image since it's used in the component
vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} />,
}));

describe("ProductList", () => {
  const mockFetchProducts = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state initially", () => {
    // Setup mock store state
    vi.mocked(useProductStore).mockReturnValue({
      products: [],
      isLoading: true,
      error: null,
      pagination: {},
      fetchProducts: mockFetchProducts,
    } as any);

    render(<ProductList />);

    expect(
      screen.getByTestId("loading-spinner") || screen.getByRole("status")
    ).toBeInTheDocument();
    expect(mockFetchProducts).toHaveBeenCalled();
  });

  it("should display error message when there is an error", () => {
    // Setup mock store state with error
    vi.mocked(useProductStore).mockReturnValue({
      products: [],
      isLoading: false,
      error: "Failed to fetch products",
      pagination: {},
      fetchProducts: mockFetchProducts,
    } as any);

    render(<ProductList />);

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText(/Failed to fetch products/i)).toBeInTheDocument();
  });

  it("should display products when loaded successfully", async () => {
    const mockProducts = [
      {
        id: 1,
        title: "Test Product 1",
        description: "Description 1",
        price: 99.99,
        brand: "Brand 1",
        thumbnail: "/test1.jpg",
        rating: 4.5,
      },
      {
        id: 2,
        title: "Test Product 2",
        description: "Description 2",
        price: 149.99,
        brand: "Brand 2",
        thumbnail: "/test2.jpg",
        rating: 3.8,
      },
    ];

    // Setup mock store state with products
    vi.mocked(useProductStore).mockReturnValue({
      products: mockProducts,
      isLoading: false,
      error: null,
      pagination: {},
      fetchProducts: mockFetchProducts,
    } as any);

    render(<ProductList />);

    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument();
      expect(screen.getByText("Test Product 1")).toBeInTheDocument();
      expect(screen.getByText("Test Product 2")).toBeInTheDocument();
      expect(screen.getByText("$99.99")).toBeInTheDocument();
      expect(screen.getByText("$149.99")).toBeInTheDocument();
      expect(screen.getByText("Brand 1")).toBeInTheDocument();
      expect(screen.getByText("Brand 2")).toBeInTheDocument();
    });
  });

  it("should display empty state when no products are available", () => {
    // Setup mock store state with empty products array
    vi.mocked(useProductStore).mockReturnValue({
      products: [],
      isLoading: false,
      error: null,
      pagination: {},
      fetchProducts: mockFetchProducts,
    } as any);

    render(<ProductList />);

    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
