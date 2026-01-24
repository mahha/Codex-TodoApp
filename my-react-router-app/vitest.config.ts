import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["app/**/*.test.{ts,tsx}", "tests/unit/**/*.test.ts"],
    exclude: ["tests/e2e/**", "**/node_modules/**"],
  },
});
