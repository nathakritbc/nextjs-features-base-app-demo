"use server";

import { LoginFormValues, loginSchema } from "../schemas/authSchema";
import { z } from "zod";
import axiosInstance from "@/lib/axios";
import { AxiosError } from "axios";

export async function login(credentials: LoginFormValues) {
  console.log("Server action running with username:", credentials.username);

  try {
    const validatedFields = loginSchema.parse(credentials);

    try {
      const response = await axiosInstance.post("/auth/login", {
        username: validatedFields.username,
        password: validatedFields.password,
      });

      const user = response.data;
      console.log("Login API success:", user.id, user.username);

      // Return minimal data to avoid serialization issues
      return {
        success: true,
        userId: user.id.toString(),
        username: user.username || user.firstName,
        email: user.email,
        token: user.token,
      };
    } catch (error) {
      console.error("Server action: API error");
      const axiosError = error as AxiosError<{ message?: string }>;

      if (
        axiosError.response?.status === 400 ||
        axiosError.response?.status === 401
      ) {
        return {
          success: false,
          error: "Invalid username or password",
        };
      }

      // กรณี API error
      return {
        success: false,
        error: axiosError.response?.data?.message || "Connection error",
        statusCode: axiosError.response?.status,
      };
    }
  } catch (error) {
    console.error("Server action: Validation error");

    // กรณี validation error
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: "Validation failed",
        validationErrors: error.errors.map((e) => ({
          path: e.path.join("."),
          message: e.message,
        })),
      };
    }

    // กรณี general error
    console.error("Unexpected server action error:", error);
    return {
      success: false,
      error: "Server error occurred",
    };
  }
}
