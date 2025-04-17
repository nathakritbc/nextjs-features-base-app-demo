import { Metadata } from "next";
import ProductDetailWithHook from "@/features/products/components/ProductDetailWithHook";
import { fetchProductByIdAction } from "@/features/products/actions/productActions";

interface ProductPageParams {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ProductPageParams): Promise<Metadata> {
  try {
    const product = await fetchProductByIdAction(parseInt(params.id, 10));
    return {
      title: `${product.title} | Demo App`,
      description: product.description,
    };
  } catch {
    return {
      title: "Product | Demo App",
      description: "View product details",
    };
  }
}

export default function ProductPage({ params }: ProductPageParams) {
  const productId = parseInt(params.id, 10);

  return (
    <main>
      <ProductDetailWithHook productId={productId} />
    </main>
  );
}
