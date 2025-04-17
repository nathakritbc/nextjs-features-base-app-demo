import { useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

interface ApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiResponse<T> extends ApiState<T> {
  fetchData: (config?: AxiosRequestConfig) => Promise<T | null>;
  setData: (data: T | null) => void;
  setError: (error: string | null) => void;
}

interface ApiErrorResponse {
  message?: string;
}

export function useApi<T>(
  initialUrl: string,
  initialConfig?: AxiosRequestConfig
): UseApiResponse<T> {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const fetchData = useCallback(
    async (config?: AxiosRequestConfig): Promise<T | null> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const mergedConfig = { ...initialConfig, ...config };
        const response: AxiosResponse<T> = await axiosInstance(
          initialUrl,
          mergedConfig
        );

        setState({
          data: response.data,
          isLoading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const errorMessage =
          axiosError.response?.data?.message ??
          (axiosError.message || "An error occurred");

        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));

        return null;
      }
    },
    [initialUrl, initialConfig]
  );

  const setData = useCallback((data: T | null) => {
    setState((prev) => ({ ...prev, data }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState((prev) => ({ ...prev, error }));
  }, []);

  return {
    ...state,
    fetchData,
    setData,
    setError,
  };
}
