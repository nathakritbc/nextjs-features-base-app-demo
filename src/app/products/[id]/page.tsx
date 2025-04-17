import { Metadata } from "next";
import ProductDetailWithHook from "@/features/products/components/ProductDetailWithHook";
import { fetchProductByIdAction } from "@/features/products/actions/productActions";
import { Product } from "@/features/products/schemas/productSchema";

interface ProductPageParams {
  params: {
    id: string;
  };
}

interface MetadataParams extends ProductPageParams {
  product: Product;
}

export async function generateMetadata({
  product,
}: MetadataParams): Promise<Metadata> {
  if (!product) {
    return {
      title: "Product | Demo App",
      description: "View product details",
    };
  }

  return {
    title: `${product.title} | Demo App`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageParams) {
  const productId = parseInt(params.id, 10);
  const product = await fetchProductByIdAction(productId);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <main>
      <ProductDetailWithHook productId={productId} result={product} />
    </main>
  );
}
