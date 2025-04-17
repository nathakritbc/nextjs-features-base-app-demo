"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useApi } from "@/hooks/useApi";
import { z } from "zod";
import { productsResponseSchema } from "../schemas/productSchema";
import { ProductsResponse } from "../schemas/productSchema";

export default function ProductListWithHook() {
  const [pagination, setPagination] = useState({
    limit: 10,
    skip: 0,
    total: 0,
  });

  const { data, isLoading, error, fetchData } =
    useApi<ProductsResponse>("/products");

  const loadProducts = async (limit?: number, skip?: number) => {
    try {
      // Update query params if provided
      const params = {
        limit: limit !== undefined ? limit : pagination.limit,
        skip: skip !== undefined ? skip : pagination.skip,
      };

      const data = await fetchData({ params });

      if (data) {
        // Validate with Zod if needed
        productsResponseSchema.parse(data);

        // Update pagination state
        setPagination({
          limit: data.limit,
          skip: data.skip,
          total: data.total,
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
      }
    }
  };

  useEffect(() => {
    loadProducts();
    // Only run on initial render, pagination changes are handled by the loadProducts calls
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper function to get the rating value
  const getRatingValue = (rating: any): number => {
    if (!rating) return 0;
    return typeof rating === "object" ? rating.rate : rating;
  };

  if (isLoading && !data) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
          role="status"
          data-testid="loading-spinner"
        ></div>
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

  const products = data?.products || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48 w-full">
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold mb-2 line-clamp-1">
                  {product.title}
                </h2>
                <p className="text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">${product.price}</span>
                  <span className="text-sm text-gray-500">{product.brand}</span>
                </div>

                {product.rating && (
                  <div className="mt-2 flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(getRatingValue(product.rating))
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
                      ({getRatingValue(product.rating)})
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {products.length > 0 && (
        <div className="mt-8 flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-600">
              Showing {pagination.skip + 1} to{" "}
              {Math.min(pagination.skip + products.length, pagination.total)} of{" "}
              {pagination.total} products
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pagination.skip === 0 || isLoading}
              onClick={() =>
                loadProducts(
                  pagination.limit,
                  Math.max(0, pagination.skip - pagination.limit)
                )
              }
            >
              Previous
            </button>

            <button
              className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={
                pagination.skip + pagination.limit >= pagination.total ||
                isLoading
              }
              onClick={() =>
                loadProducts(
                  pagination.limit,
                  pagination.skip + pagination.limit
                )
              }
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
