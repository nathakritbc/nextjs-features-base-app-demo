import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

// Clear any existing mocks
vi.clearAllMocks();

// Setup the spy first
const createSpy = vi.spyOn(axios, "create");

// Now import the module which will use axios.create
import axiosInstance from "../axios";

describe("Axios Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an axios instance with the correct config", () => {
    expect(createSpy).toHaveBeenCalledWith({
      baseURL: "https://dummyjson.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  });
});
