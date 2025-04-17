"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApi } from "@/hooks/useApi";
import { Product, productSchema } from "../api/productApi";
import { z } from "zod";

interface ProductDetailWithHookProps {
  productId: number;
}

export default function ProductDetailWithHook({
  productId,
}: ProductDetailWithHookProps) {
  const {
    data: currentProduct,
    isLoading,
    error,
    fetchData,
  } = useApi<Product>(`/products/${productId}`);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await fetchData();
        if (data) {
          // Validate data with Zod if needed
          productSchema.parse(data);
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Validation error:", error.errors);
        }
      }
    };

    loadProduct();
  }, [fetchData, productId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Product not found</h2>
        <p className="mb-4">
          The product you are looking for does not exist or has been removed.
        </p>
        <Link href="/products" className="text-blue-600 hover:underline">
          Return to products
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-4">
        <Link
          href="/products"
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Products
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/2">
            <div className="relative h-80 w-full">
              <Image
                src={currentProduct.thumbnail}
                alt={currentProduct.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain"
              />
            </div>

            {currentProduct.images && currentProduct.images.length > 0 && (
              <div className="p-4 grid grid-cols-4 gap-2">
                {currentProduct.images.map((image, index) => (
                  <div
                    key={index}
                    className="relative h-20 w-full rounded overflow-hidden border"
                  >
                    <Image
                      src={image}
                      alt={`${currentProduct.title} - image ${index + 1}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="md:w-1/2 p-6">
            <h1 className="text-3xl font-bold mb-2">{currentProduct.title}</h1>
            <div className="flex items-center mb-4">
              <span className="text-sm text-gray-500 mr-2">
                {currentProduct.brand}
              </span>
              {currentProduct.rating && (
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(currentProduct.rating || 0)
                            ? "fill-current"
                            : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs text-gray-500 ml-1">
                    ({currentProduct.rating})
                  </span>
                </div>
              )}
            </div>

            <p className="text-gray-700 mb-6">{currentProduct.description}</p>

            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-3xl font-bold">
                  ${currentProduct.price}
                </span>
                {currentProduct.discountPercentage && (
                  <span className="ml-2 bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                    {currentProduct.discountPercentage}% OFF
                  </span>
                )}
              </div>
              {currentProduct.stock !== undefined && (
                <span
                  className={`text-sm font-medium ${
                    currentProduct.stock > 10
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {currentProduct.stock > 0
                    ? `In Stock (${currentProduct.stock})`
                    : "Out of Stock"}
                </span>
              )}
            </div>

            <div className="mb-6">
              <span className="block text-gray-500 mb-2">Category</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {currentProduct.category}
              </span>
            </div>

            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
