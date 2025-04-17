"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            Welcome, {session.user?.name || session.user?.email}
          </h2>
          <p className="text-gray-600 mb-4">
            This is a protected dashboard page that requires authentication.
          </p>
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              You are currently signed in as{" "}
              <strong>{session.user?.email}</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Account Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span>{session.user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span>{session.user?.name || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">User ID:</span>
                <span>{session.user?.id || "Not available"}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
            <p className="text-gray-600 italic">
              No recent activity to display.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
