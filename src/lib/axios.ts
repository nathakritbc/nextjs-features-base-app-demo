import axios, { AxiosError, AxiosResponse } from "axios";
import { getSession } from "next-auth/react";

// Create a custom axios instance
const axiosInstance = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Log request for debugging
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`,
      {
        params: config.params,
        data: config.data,
      }
    );

    // Add auth token from session if available
    const session = await getSession();
    if (session?.user?.token) {
      config.headers.Authorization = `Bearer ${session.user.token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error("Request error:", error.message);
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, {
      data: response.data,
    });
    return response;
  },
  (error: AxiosError) => {
    // Log error details
    console.error("API Error Response:", {
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized errors (e.g., redirect to login)
      console.error("Unauthorized access, redirecting to login");
      // Could trigger sign out or redirect here
    }

    if (error.response?.status === 429) {
      console.error("Rate limit exceeded");
      // Could implement retry logic here
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
