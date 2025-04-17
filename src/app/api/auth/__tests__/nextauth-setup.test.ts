/**
 * @vitest-environment jsdom
 */
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  afterAll,
} from "vitest";
import { NextAuthOptions } from "next-auth";

// Mock the CredentialsProvider
vi.mock("next-auth/providers/credentials", () => {
  return {
    default: vi.fn().mockImplementation(({ authorize }) => ({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {},
      authorize,
    })),
  };
});

// Mock fetch before importing any modules that use it
const originalFetch = global.fetch;
global.fetch = vi.fn();

describe("NextAuth Configuration", () => {
  let authOptions: NextAuthOptions;

  beforeEach(async () => {
    vi.resetModules();

    // Now import the module
    const routeModule = await import("../[...nextauth]/route");
    authOptions = routeModule.authOptions;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // Test cleanup to restore original fetch
  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("should have the correct providers configuration", () => {
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

  it("authorize should validate credentials and make API call", async () => {
    // Create a direct test of the credentials provider's authorize function
    const authorize = async () => {
      // Create mock response data
      const mockUserData = {
        id: 15,
        username: "kminchelle",
        email: "kminchelle@example.com",
        firstName: "Jeanne",
        lastName: "Halvorson",
        token: "mock-token",
      };

      // Mock the fetch call
      vi.mocked(global.fetch).mockResolvedValueOnce(
        new Response(JSON.stringify(mockUserData), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      );

      // Get the authorize function from the provider
      const provider = authOptions.providers[0];
      if ("credentials" in provider && provider.authorize) {
        const credentials = {
          username: "kminchelle",
          password: "0lelplR",
        };

        // Call the authorize function
        const result = await provider.authorize(credentials, {});

        // Verify fetch was called correctly
        expect(global.fetch).toHaveBeenCalledWith(
          "https://dummyjson.com/auth/login",
          expect.objectContaining({
            method: "POST",
            headers: expect.objectContaining({
              "Content-Type": "application/json",
            }),
            body: expect.any(String),
          })
        );

        // Verify response was processed correctly
        expect(result).toEqual({
          id: "15",
          name: "kminchelle",
          email: "kminchelle@example.com",
          image: undefined,
          token: "mock-token",
        });
      }
    };

    // Run the test
    await authorize();
  });

  it("should return null for invalid credentials", async () => {
    // Mock an unauthorized response
    vi.mocked(global.fetch).mockResolvedValueOnce(
      new Response(null, {
        status: 401,
        statusText: "Unauthorized",
      })
    );

    const provider = authOptions.providers[0];
    if ("credentials" in provider && provider.authorize) {
      const credentials = {
        username: "invalid",
        password: "invalid",
      };

      const result = await provider.authorize(credentials, {});
      expect(result).toBeNull();
    }
  });

  it("jwt callback should add user info to token", async () => {
    const { callbacks } = authOptions;
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

  it("session callback should add user info to session", async () => {
    const { callbacks } = authOptions;
    const session = callbacks?.session;

    if (session) {
      const mockSession = { user: {} };
      const token = { id: "15", token: "user-token" };

      const result = await session({
        session: mockSession,
        token,
      } as unknown as Parameters<typeof session>[0]);

      expect(result.user).toEqual({
        id: "15",
        token: "user-token",
      });
    }
  });
});
