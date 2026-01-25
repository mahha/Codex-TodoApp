import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: "http://localhost:5177",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev -- --port 5177",
    url: "http://localhost:5177",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      HOME: "/tmp",
      XDG_CONFIG_HOME: "/tmp",
    },
  },
  reporter: [
    ["html", {
      host: "0.0.0.0",
      port: 9323,
    }],
  ],
  globalSetup: "./tests/e2e/global-setup.ts",
});
