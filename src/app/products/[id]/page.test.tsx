import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import ProductPage, { generateMetadata } from "./page";
import { fetchProductByIdAction } from "@/features/products/actions/productActions";
import { StrictBuilder } from "builder-pattern";
import { Product } from "@/features/products/schemas/productSchema";
import { mock } from "vitest-mock-extended";
import { Metadata } from "next";

// Mock the product actions
vi.mock("@/features/products/actions/productActions", () => ({
  fetchProductByIdAction: vi.fn(),
}));

// Mock the ProductDetailWithHook component
vi.mock("@/features/products/components/ProductDetailWithHook", () => ({
  default: ({ productId, result }: { productId: number; result: any }) => (
    <div data-testid="product-detail-mock">
      <div>Product ID: {productId}</div>
      <div>Product Title: {result?.title || "No product"}</div>
    </div>
  ),
}));

describe("ProductPage", () => {
  // Mock Product type for testing purposes if needed, or use the actual type
  const mockProduct = mock<Product>({
    id: 1,
    title: "Awesome Gadget",
    description: "This gadget does awesome things.",
    price: 49.99,
    discountPercentage: 10,
    rating: 4.5,
    stock: 100,
    brand: "GadgetBrand",
    category: "Electronics",
    thumbnail: "https://example.com/thumbnail.jpg",
    images: ["https://example.com/image1.jpg"],
  });
  // const productActions = mock<>();

  beforeEach(() => {});

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("generateMetadata", () => {
    it("should return metadata with product title and description when product exists", async () => {
      // Type assertion needed because the function expects MetadataParams which includes 'params',
      // but for this specific function's logic, only 'product' is used.
      // We cast the input to satisfy the type checker.
      const metadataParams = { product: mockProduct } as any; // Cast to 'any' or a more specific partial type if preferred

      const expectedMetadata: Metadata = {
        title: "Awesome Gadget | Demo App",
        description: "This gadget does awesome things.",
      };

      const result = await generateMetadata(metadataParams);

      expect(result).toEqual(expectedMetadata);
    });

    it("should return default metadata when product does not exist (is null)", async () => {
      // Cast to 'any' or a more specific partial type if preferred
      const metadataParams = { product: null } as any;

      const expectedMetadata: Metadata = {
        title: "Product | Demo App",
        description: "View product details",
      };

      const result = await generateMetadata(metadataParams);

      expect(result).toEqual(expectedMetadata);
    });

    it("should return default metadata when product does not exist (is undefined)", async () => {
      // Cast to 'any' or a more specific partial type if preferred
      const metadataParams = { product: undefined } as any;

      const expectedMetadata: Metadata = {
        title: "Product | Demo App",
        description: "View product details",
      };

      const result = await generateMetadata(metadataParams);

      expect(result).toEqual(expectedMetadata);
    });

    // Optional: Test with a product having minimal required fields if applicable
    it("should handle product with only essential fields", async () => {
      const minimalProduct: Product = {
        id: 2,
        title: "Minimal Product",
        description: "Minimal description.",
        // Add other required fields from your Product schema with default/dummy values
        price: 0,
        discountPercentage: 0,
        rating: 0,
        stock: 0,
        brand: "",
        category: "",
        thumbnail: "",
        images: [],
      };
      // Cast to 'any' or a more specific partial type if preferred
      const metadataParams = { product: minimalProduct } as any;

      const expectedMetadata = StrictBuilder<Metadata>()
        .title("Minimal Product | Demo App")
        .description("Minimal description.")
        .build();

      const result = await generateMetadata(metadataParams);

      expect(result).toEqual(expectedMetadata);
    });
  });

  it("should render product detail when product is found", async () => {
    const mockProduct = {
      id: 1,
      title: "Test Product",
      description: "Test Description",
      price: 99.99,
      brand: "Test Brand",
      category: "Test Category",
      thumbnail: "/test-image.jpg",
    };

    vi.mocked(fetchProductByIdAction).mockResolvedValue(mockProduct);

    const { container } = render(await ProductPage({ params: { id: "1" } }));

    expect(fetchProductByIdAction).toHaveBeenCalledWith(1);
    expect(screen.getByTestId("product-detail-mock")).toBeInTheDocument();
    expect(screen.getByText("Product ID: 1")).toBeInTheDocument();
    expect(screen.getByText("Product Title: Test Product")).toBeInTheDocument();
  });

  it("should render product not found when product is not found", async () => {
    vi.mocked(fetchProductByIdAction).mockResolvedValue(undefined);

    const { container } = render(await ProductPage({ params: { id: "999" } }));

    expect(fetchProductByIdAction).toHaveBeenCalledWith(999);
    expect(screen.getByText("Product not found")).toBeInTheDocument();
  });
});
