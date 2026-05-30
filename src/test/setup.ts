import "@testing-library/jest-dom";
import { vi, beforeEach } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

global.IntersectionObserver = vi.fn(function (
  this: IntersectionObserver,
  _callback: IntersectionObserverCallback,
  _options?: IntersectionObserverInit,
) {
  (this as unknown as Record<string, unknown>).observe = vi.fn();
  (this as unknown as Record<string, unknown>).unobserve = vi.fn();
  (this as unknown as Record<string, unknown>).disconnect = vi.fn();
}) as unknown as typeof IntersectionObserver;

vi.stubGlobal("requestAnimationFrame", function (fn: FrameRequestCallback) {
  fn(0);
  return 0;
});
vi.stubGlobal("cancelAnimationFrame", vi.fn());

// jsdom does not implement scrollIntoView
window.HTMLElement.prototype.scrollIntoView = vi.fn();

beforeEach(() => {
  document.body.style.overflow = "";
});
