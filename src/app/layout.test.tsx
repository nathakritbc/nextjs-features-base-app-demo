import { render, screen } from "@testing-library/react";
import RootLayout from "./layout";
import { describe, it, expect, vi } from "vitest";
// Mock the NextAuthProvider and Header components
vi.mock("@/lib/providers", () => ({
  NextAuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="next-auth-provider">{children}</div>
  ),
}));

vi.mock("@/components/Header", () => () => (
  <div data-testid="header">Header</div>
));

describe("RootLayout", () => {
  // it("renders the layout with header and main content", () => {
  //   render(
  //     <RootLayout>
  //       <div data-testid="child-content">Test Content</div>
  //     </RootLayout>
  //   );
  //   // Check if the NextAuthProvider is rendered
  //   expect(screen.getByTestId("next-auth-provider")).toBeInTheDocument();
  //   // Check if the Header is rendered
  //   expect(screen.getByTestId("header")).toBeInTheDocument();
  //   // Check if the main content is rendered
  //   expect(screen.getByTestId("child-content")).toBeInTheDocument();
  //   // Check if the main element has the correct classes
  //   const mainElement = screen.getByRole("main");
  //   expect(mainElement).toHaveClass("min-h-screen");
  //   expect(mainElement).toHaveClass("bg-gray-50");
  //   expect(mainElement).toHaveClass("pt-4");
  // });
  // it("applies the Inter font class to the body", () => {
  //   render(
  //     <RootLayout>
  //       <div>Test Content</div>
  //     </RootLayout>
  //   );
  //   // Find an element within the body and traverse up to the body
  //   // Using document.body directly might be less reliable in some testing setups
  //   const bodyElement = screen.getByText("Test Content").closest("body");
  //   expect(bodyElement).toHaveClass(expect.stringContaining("inter")); // Check for the generated class name part
  // });
  // it("sets the correct lang attribute on html element", () => {
  //   // Render the component to ensure the DOM is updated
  //   render(
  //     <RootLayout>
  //       <div>Test Content</div>
  //     </RootLayout>
  //   );
  //   // Access the html element directly from the document
  //   const htmlElement = document.documentElement;
  //   expect(htmlElement).toHaveAttribute("lang", "en");
  // });
});
