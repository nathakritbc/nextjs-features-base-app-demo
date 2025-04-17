import Link from "next/link";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Demo App</h1>
        <p className="text-xl text-gray-600 mb-8">
          A Next.js application with Zustand state management, Next.js Server
          Actions, and API integration with DummyJSON.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Products
          </Link>

          <Link
            href="/auth/signin"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Sign In
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">
              Feature-Based Structure
            </h2>
            <p className="text-gray-600">
              Organized code with feature-based architecture for better
              maintainability and scalability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">
              Zustand State Management
            </h2>
            <p className="text-gray-600">
              Simple and efficient state management with Zustand stores for each
              feature.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-3">
              Next.js Server Actions
            </h2>
            <p className="text-gray-600">
              Seamless integration with Next.js Server Actions for form handling
              and data submission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
