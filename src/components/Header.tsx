"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const isAuthenticated = status === "authenticated";

  return (
    <header className="bg-white shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Demo App
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            href="/products"
            className={`px-3 py-2 rounded-md ${
              pathname?.startsWith("/products")
                ? "bg-blue-100 text-blue-700"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Products
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className={`px-3 py-2 rounded-md ${
                  pathname === "/dashboard"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>

              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-700">
                  {session?.user?.name || session?.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-1 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
