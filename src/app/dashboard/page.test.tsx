import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import DashboardPage from "./page";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock the next-auth/react module
vi.mock("next-auth/react", () => ({
  useSession: vi.fn(),
}));

// Mock the next/navigation module
vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

describe("DashboardPage", () => {
  const mockPush = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default router mock
    (useRouter as any).mockReturnValue({
      push: mockPush,
    });
  });

  it("should show loading state when status is loading", () => {
    // Mock the session hook to return loading status
    (useSession as any).mockReturnValue({
      data: null,
      status: "loading",
    });

    render(<DashboardPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should redirect to signin page when unauthenticated", () => {
    // Mock the session hook to return unauthenticated status
    (useSession as any).mockReturnValue({
      data: null,
      status: "unauthenticated",
    });

    render(<DashboardPage />);

    expect(mockPush).toHaveBeenCalledWith("/auth/signin");
  });

  it("should render dashboard content when authenticated", () => {
    // Mock the session hook to return authenticated status with user data
    (useSession as any).mockReturnValue({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
          id: "user123",
        },
      },
      status: "authenticated",
    });

    render(<DashboardPage />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Welcome, Test User")).toBeInTheDocument();
    expect(screen.getByTestId("header-email")).toHaveTextContent(
      "test@example.com"
    );
    expect(screen.getByTestId("account-email")).toHaveTextContent(
      "test@example.com"
    );
    expect(screen.getByTestId("account-id")).toHaveTextContent("user123");
  });

  it("should display 'Not available' for user ID when ID is not provided", () => {
    // Mock the session hook to return authenticated status without user ID
    (useSession as any).mockReturnValue({
      data: {
        user: {
          name: "Test User",
          email: "test@example.com",
          // id is intentionally missing or null/undefined
        },
      },
      status: "authenticated",
    });

    render(<DashboardPage />);

    // Check that the fallback text is displayed for the user ID
    expect(screen.getByTestId("account-id")).toHaveTextContent("Not available");
    // You might also want to check other elements render correctly
    expect(screen.getByText("Welcome, Test User")).toBeInTheDocument();
    expect(screen.getByTestId("account-email")).toHaveTextContent(
      "test@example.com"
    );
  });

  it("should use email as fallback when name is not provided", () => {
    // Mock the session hook to return authenticated status with user data without name
    (useSession as any).mockReturnValue({
      data: {
        user: {
          email: "test@example.com",
          id: "user123",
        },
      },
      status: "authenticated",
    });

    render(<DashboardPage />);

    expect(screen.getByText("Welcome, test@example.com")).toBeInTheDocument();
    expect(screen.getByTestId("account-name")).toHaveTextContent(
      "Not provided"
    );
  });
});
