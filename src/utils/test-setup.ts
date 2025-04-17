import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import "@testing-library/jest-dom";

// Extend Vitest's expect with Jest DOM matchers
expect.extend(matchers);

// Run cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock fetch for all tests
global.fetch = vi.fn();

// Define types for better TypeScript support
declare global {
  interface Window {
    fetch: typeof fetch;
  }
}

// Mock intersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

// Suppress specific console errors during tests
const originalConsoleError = console.error;
console.error = (...args) => {
  // Suppress React useLayoutEffect warning in tests
  if (args[0].includes("useLayoutEffect")) return;
  originalConsoleError(...args);
};
