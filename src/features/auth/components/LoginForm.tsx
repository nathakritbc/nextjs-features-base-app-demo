"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginFormValues, loginSchema } from "../schemas/authSchema";
import { useAuthStore } from "../store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [debugging, setDebugging] = useState<string | null>(null);
  const { setAuth, setLoading } = useAuthStore();

  // Redirect if already logged in
  useEffect(() => {
    if (session?.user) {
      router.push("/dashboard");
    }
  }, [session, router]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "kminchelle",
      password: "0lelplR",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true);
    setError(null);
    setDebugging(null);

    try {
      setDebugging("Logging in directly with NextAuth...");

      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        console.error("NextAuth signIn failed:", result.error);
        setError(result.error || "Login failed. Check your credentials.");
        return;
      }

      if (result?.ok) {
        console.log("Login successful, redirecting to dashboard");
        setAuth(true);
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected login error:", err);
      setError("Login failed. Please check network connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // ให้ทดลองใช้ API โดยตรง (สำหรับการแก้ไขปัญหาเท่านั้น)
  const tryDirectApi = async () => {
    setLoading(true);
    setError(null);
    setDebugging("Trying direct API call...");

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: "kminchelle",
          password: "0lelplR",
          expiresInMins: 30,
        }),
        credentials: "include",
      });

      if (!response.ok) {
        setDebugging(`API error: ${response.status} ${response.statusText}`);
        const errorData = await response.json().catch(() => ({}));
        console.error("API error:", errorData);
        setError(`Login failed with status ${response.status}`);
        return;
      }

      const data = await response.json();
      setDebugging(`API success: ${JSON.stringify(data)}`);
      console.log("Direct API response:", data);

      // ทดลองเรียก NextAuth login อีกครั้งหลังจากได้ข้อมูลตอบกลับจาก API
      const result = await signIn("credentials", {
        username: "kminchelle",
        password: "0lelplR",
        redirect: false,
      });

      if (result?.ok) {
        setAuth(true);
        router.push("/dashboard");
      } else {
        setError("NextAuth login failed after successful API call");
      }
    } catch (err) {
      console.error("Direct API error:", err);
      setError("Direct API call failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      <div className="mb-4 text-gray-600 text-sm">
        <p>
          <strong>Test user:</strong> kminchelle
        </p>
        <p>
          <strong>Password:</strong> 0lelplR
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {debugging && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          {debugging}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            type="text"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("username")}
          />
          {errors.username && (
            <p className="mt-1 text-red-600 text-sm">
              {errors.username.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block mb-1 font-medium" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-red-600 text-sm">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="mt-4">
          <button
            type="button"
            onClick={tryDirectApi}
            className="w-full py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
            disabled={isSubmitting}
          >
            Try Direct API
          </button>
        </div>
      </form>
    </div>
  );
}
