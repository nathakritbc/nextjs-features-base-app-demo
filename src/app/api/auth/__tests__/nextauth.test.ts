import { describe, it, expect, vi, beforeEach } from "vitest";
import { authOptions } from "../[...nextauth]/route";
import { NextAuthOptions } from "next-auth";

// Setup proper spy on global.fetch
const fetchSpy = vi.spyOn(global, "fetch");

describe("NextAuth Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchSpy.mockClear();
  });

  it("should have the correct providers", () => {
    expect(authOptions.providers).toHaveLength(1);
    expect(authOptions.providers[0].id).toBe("credentials");
    expect(authOptions.providers[0].name).toBe("Credentials");
  });

  it("should have the correct session strategy", () => {
    expect(authOptions.session?.strategy).toBe("jwt");
  });

  it("should have the correct pages configuration", () => {
    expect(authOptions.pages?.signIn).toBe("/auth/signin");
  });

  it("should have debug mode enabled", () => {
    expect(authOptions.debug).toBe(true);
  });

  it("authorize should validate credentials", async () => {
    const credentials = {
      username: "emilys",
      password: "emilyspass",
    };

    const provider = authOptions.providers[0];

    if ("credentials" in provider && provider.authorize) {
      console.log("Testing authorize function with provider:", provider.id);

      // Create a proper mock response
      const mockUserData = {
        id: 15,
        username: "kminchelle",
        email: "kminchelle@example.com",
        firstName: "Jeanne",
        lastName: "Halvorson",
        token: "mock-token",
      };

      // Mock the fetch implementation with the spy
      fetchSpy.mockResolvedValueOnce(
        new Response(JSON.stringify(mockUserData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      console.log("Calling authorize...");
      const result = await provider.authorize(credentials, {});
      console.log("Authorize result:", result);

      expect(fetchSpy).toHaveBeenCalledWith(
        "https://dummyjson.com/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "Content-Type": "application/json",
          }),
          body: expect.any(String),
        })
      );

      // Verify the response is processed correctly
      expect(result).toEqual({
        id: "15",
        name: "kminchelle",
        email: "kminchelle@example.com",
        image: undefined,
        token: "mock-token",
      });
    }
  });

  it("authorize should return null for invalid credentials", async () => {
    const credentials = {
      username: "invalid",
      password: "invalid",
    };

    const provider = authOptions.providers[0];

    if ("credentials" in provider && provider.authorize) {
      // Mock failed response
      fetchSpy.mockResolvedValueOnce(
        new Response(null, {
          status: 401,
          statusText: "Unauthorized",
        })
      );

      const result = await provider.authorize(credentials, {});

      expect(result).toBeNull();
    }
  });

  it("authorize should handle network errors", async () => {
    const credentials = {
      username: "kminchelle",
      password: "0lelplR",
    };

    const provider = authOptions.providers[0];

    if ("credentials" in provider && provider.authorize) {
      // Mock network error
      fetchSpy.mockRejectedValueOnce(new Error("Network error"));

      const result = await provider.authorize(credentials, {});

      expect(result).toBeNull();
    }
  });

  it("jwt callback should add user id and token to token", async () => {
    const { callbacks } = authOptions as NextAuthOptions;
    const jwt = callbacks?.jwt;

    if (jwt) {
      const token = {};
      const user = { id: "15", token: "user-token" };

      const result = await jwt({
        token,
        user,
      } as unknown as Parameters<typeof jwt>[0]);

      expect(result).toEqual({
        id: "15",
        token: "user-token",
      });
    }
  });

  it("session callback should add user id and token to session", async () => {
    const { callbacks } = authOptions as NextAuthOptions;
    const session = callbacks?.session;

    if (session) {
      const initialSession = { user: {} };
      const token = { id: "15", token: "user-token" };

      const result = await session({
        session: initialSession,
        token,
      } as unknown as Parameters<typeof session>[0]);

      expect(result.user).toEqual({
        id: "15",
        token: "user-token",
      });
    }
  });
});
