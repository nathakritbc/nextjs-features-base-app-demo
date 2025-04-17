import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SessionProvider } from "next-auth/react";
import LoginForm from "../components/LoginForm";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { Mock } from "vitest";

// Mock dependencies, preserving original SessionProvider
vi.mock("next-auth/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next-auth/react")>();
  return {
    ...actual,
    signIn: vi.fn(),
    useSession: () => ({
      data: null,
      status: "unauthenticated",
    }),
  };
});

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../store/authStore", () => ({
  useAuthStore: () => ({
    setAuth: vi.fn(),
    setLoading: vi.fn(),
  }),
}));

describe("Authentication Flow", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn();
    (useRouter as unknown as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("completes a successful login and redirection flow", async () => {
    // Mock a successful sign in
    (signIn as unknown as Mock).mockResolvedValue({ ok: true, error: null });

    render(
      <SessionProvider session={null}>
        <LoginForm />
      </SessionProvider>
    );

    // Verify that the form is loaded with default values
    expect(screen.getByLabelText("Username")).toHaveValue("kminchelle");
    expect(screen.getByLabelText("Password")).toHaveValue("0lelplR");

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Verify that signIn was called
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        username: "kminchelle",
        password: "0lelplR",
        redirect: false,
        callbackUrl: "/dashboard",
      });
    });

    // Verify redirection
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("handles login failure with error message", async () => {
    // Mock a failed sign in
    (signIn as unknown as Mock).mockResolvedValue({
      ok: false,
      error: "Invalid credentials",
    });

    render(
      <SessionProvider session={null}>
        <LoginForm />
      </SessionProvider>
    );

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });

    // Verify no redirection
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("completes a successful direct API login flow", async () => {
    // Mock a successful fetch response
    (global.fetch as unknown as Mock).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 15,
          username: "kminchelle",
          email: "kminchelle@example.com",
          token: "mock-token",
        }),
    });

    // Mock a successful sign in after API call
    (signIn as unknown as Mock).mockResolvedValue({ ok: true, error: null });

    render(
      <SessionProvider session={null}>
        <LoginForm />
      </SessionProvider>
    );

    // Click the direct API button
    fireEvent.click(screen.getByRole("button", { name: "Try Direct API" }));

    // Verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/auth/login",
        expect.objectContaining({
          method: "POST",
          body: expect.any(String),
          credentials: "include",
        })
      );
    });

    // Verify signIn was called after successful API call
    expect(signIn).toHaveBeenCalledWith("credentials", {
      username: "kminchelle",
      password: "0lelplR",
      redirect: false,
    });

    // Verify redirection
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("handles direct API errors", async () => {
    // Mock a failed fetch response
    (global.fetch as unknown as Mock).mockResolvedValue({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      json: () => Promise.resolve({ message: "Invalid credentials" }),
    });

    render(
      <SessionProvider session={null}>
        <LoginForm />
      </SessionProvider>
    );

    // Click the direct API button
    fireEvent.click(screen.getByRole("button", { name: "Try Direct API" }));

    // Verify error message
    await waitFor(() => {
      expect(
        screen.getByText(/Login failed with status 401/i)
      ).toBeInTheDocument();
    });

    // Verify signIn was not called
    expect(signIn).not.toHaveBeenCalled();

    // Verify no redirection
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("handles network errors during direct API call", async () => {
    // Mock a network error
    (global.fetch as unknown as Mock).mockRejectedValue(
      new Error("Network error")
    );

    render(
      <SessionProvider session={null}>
        <LoginForm />
      </SessionProvider>
    );

    // Click the direct API button
    fireEvent.click(screen.getByRole("button", { name: "Try Direct API" }));

    // Verify error message
    await waitFor(() => {
      expect(screen.getByText("Direct API call failed")).toBeInTheDocument();
    });

    // Verify no redirection
    expect(mockPush).not.toHaveBeenCalled();
  });
});
