import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/test/**", "src/**/*.test.*", "src/**/*.spec.*"],
    },
  },
  resolve: {
    alias: [
      {
        find: /^@xlumina\/system$/,
        replacement: path.resolve(__dirname, "packages/lumina-system/src/index.ts"),
      },
      {
        find: /^@xlumina\/system\/(.*)$/,
        replacement: path.resolve(__dirname, "packages/lumina-system/src/$1"),
      },
      {
        find: /^@\/system\/(.*)$/,
        replacement: path.resolve(__dirname, "packages/lumina-system/src/$1"),
      },
      { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, "src/$1") },
    ],
  },
});
