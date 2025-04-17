import "../../utils/test-setup"; // Explicitly import setup file
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginForm from "./LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Mock } from "vitest";

// Mock dependencies
vi.mock("next-auth/react", () => ({
  signIn: vi.fn(),
  useSession: () => ({
    data: null,
    status: "unauthenticated",
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("../store/authStore", () => ({
  useAuthStore: () => ({
    setAuth: vi.fn(),
    setLoading: vi.fn(),
  }),
}));

describe("LoginForm", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as unknown as Mock).mockReturnValue({
      push: mockPush,
    });
  });

  it("renders the login form correctly", () => {
    render(<LoginForm />);

    // Check if form elements are rendered
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Login" })).toBeInTheDocument();
  });

  it("pre-fills the test credentials", () => {
    render(<LoginForm />);

    expect(screen.getByLabelText("Username")).toHaveValue("kminchelle");
    expect(screen.getByLabelText("Password")).toHaveValue("0lelplR");
  });

  it("shows validation errors when form is submitted with empty fields", async () => {
    render(<LoginForm />);

    // Clear the pre-filled values
    const usernameInput = screen.getByLabelText("Username");
    const passwordInput = screen.getByLabelText("Password");

    fireEvent.change(usernameInput, { target: { value: "" } });
    fireEvent.change(passwordInput, { target: { value: "" } });

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/username is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it("calls signIn when form is submitted with valid credentials", async () => {
    (signIn as unknown as Mock).mockResolvedValue({ ok: true, error: null });

    render(<LoginForm />);

    // Submit the form with default values
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Check if signIn was called with the right params
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        username: "kminchelle",
        password: "0lelplR",
        redirect: false,
        callbackUrl: "/dashboard",
      });
    });
  });

  it("redirects to dashboard on successful login", async () => {
    (signIn as unknown as Mock).mockResolvedValue({ ok: true, error: null });

    render(<LoginForm />);

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Check if redirected to dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("displays error message on failed login", async () => {
    (signIn as unknown as Mock).mockResolvedValue({
      ok: false,
      error: "Invalid credentials",
    });

    render(<LoginForm />);

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
    });
  });

  it("handles API exceptions", async () => {
    (signIn as unknown as Mock).mockRejectedValue(new Error("Network error"));

    render(<LoginForm />);

    // Submit the form
    fireEvent.click(screen.getByRole("button", { name: "Login" }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
    });
  });

  it("calls the direct API when Try Direct API button is clicked", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          username: "kminchelle",
          token: "sample-token",
        }),
    });

    render(<LoginForm />);

    // Click the Try Direct API button
    fireEvent.click(screen.getByRole("button", { name: "Try Direct API" }));

    // Check if fetch was called with the right params
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dummyjson.com/auth/login",
        expect.objectContaining({
          method: "POST",
          credentials: "include",
        })
      );
    });
  });
});
