import "@testing-library/jest-dom/vitest";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

if (!("devicePixelRatio" in global)) {
  (global as Record<string, unknown>).devicePixelRatio = 1;
}

HTMLCanvasElement.prototype.getContext = HTMLCanvasElement.prototype.getContext || (() => null);
