import { Metadata } from "next";
import ProductDetailWithHook from "@/features/products/components/ProductDetailWithHook";
import { fetchProductByIdAction } from "@/features/products/actions/productActions";
import { Product } from "@/features/products/schemas/productSchema";

interface ProductPageParams {
  params: {
    id: string;
  };
  product: Product;
}

export async function generateMetadata({
  product,
}: ProductPageParams): Promise<Metadata> {
  try {
    return {
      title: `${product?.title} | Demo App`,
      description: product?.description,
    };
  } catch {
    return {
      title: "Product | Demo App",
      description: "View product details",
    };
  }
}

export default async function ProductPage({ params }: ProductPageParams) {
  const productId = parseInt(params.id, 10);

  const product = await fetchProductByIdAction(productId);
  if (!product) {
    return <div>Product not found</div>;
  }

  await generateMetadata({ params, product });
  return (
    <main>
      <ProductDetailWithHook
        productId={productId}
        result={product || undefined}
      />
    </main>
  );
}
