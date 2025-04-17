import { describe, it, expect, vi, beforeEach } from "vitest";
import { login } from "./authActions";
import axiosInstance from "@/lib/axios";

// Mock axios instance
vi.mock("@/lib/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("Auth Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("login", () => {
    it("should call axios post with the correct parameters", async () => {
      // Setup mock response
      const mockUser = {
        id: 1,
        username: "test",
        email: "test@example.com",
        token: "fake-token",
      };

      // Use vi.mocked instead of type casting
      vi.mocked(axiosInstance.post).mockResolvedValueOnce({
        data: mockUser,
      });

      const credentials = {
        username: "test",
        password: "password",
      };

      const result = await login(credentials);

      expect(vi.mocked(axiosInstance.post)).toHaveBeenCalledWith(
        "/auth/login",
        {
          username: "test",
          password: "password",
        }
      );

      expect(result).toEqual({
        success: true,
        userId: "1",
        username: "test",
        email: "test@example.com",
        token: "fake-token",
      });
    });

    it("should handle login failure properly", async () => {
      // Mock a 401 unauthorized error
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        response: {
          status: 401,
          data: { message: "Invalid credentials" },
        },
      });

      const credentials = {
        username: "test",
        password: "wrong-password",
      };

      const result = await login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid username or password");
      expect(vi.mocked(axiosInstance.post)).toHaveBeenCalledWith(
        "/auth/login",
        {
          username: "test",
          password: "wrong-password",
        }
      );
    });

    it("should handle network errors properly", async () => {
      // Mock a network error
      vi.mocked(axiosInstance.post).mockRejectedValueOnce({
        message: "Network Error",
        response: null,
      });

      const credentials = {
        username: "test",
        password: "test123",
      };

      const result = await login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection error");
    });

    it("should handle validation errors properly", async () => {
      const credentials = {
        username: "", // Invalid - empty username
        password: "", // Invalid - empty password
      };

      const result = await login(credentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Validation failed");
      expect(result.validationErrors).toBeDefined();
      // axios.post should not be called for validation errors
      expect(vi.mocked(axiosInstance.post)).not.toHaveBeenCalled();
    });
  });
});
