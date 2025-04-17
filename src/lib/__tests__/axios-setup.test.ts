/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeAll, afterEach } from "vitest";
import axios from "axios";
import { AxiosInstance } from "axios";

// Create a mock for axios before any imports that use it
vi.mock("axios");

describe("Axios Client Setup", () => {
  beforeAll(() => {
    // Reset modules to ensure clean import
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should create axios instance with correct configuration", async () => {
    // Mock the axios.create method with a properly typed mock return value
    vi.mocked(axios.create).mockReturnValue({
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
      get: vi.fn(),
      post: vi.fn(),
      put: vi.fn(),
      delete: vi.fn(),
    } as unknown as AxiosInstance);

    // Now import the module
    const { default: axiosInstance } = await import("../axios");

    // Verify the instance exists
    expect(axiosInstance).toBeDefined();

    // Verify axios.create was called with correct config
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: "https://dummyjson.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
});
