import ProductListWithHook from "@/features/products/components/ProductListWithHook";

export const metadata = {
  title: "Products | Demo App",
  description: "Browse our collection of products",
};

export default function ProductsPage() {
  return (
    <main>
      <ProductListWithHook />
    </main>
  );
}
