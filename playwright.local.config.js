import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e-local',
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 15_000 },
  retries: 0,
  reporter: 'list',
  use: {
    actionTimeout: 10_000,
    baseURL: 'http://127.0.0.1:5173',
    trace: 'off',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'local-mobile', use: { ...devices['Pixel 7'] } },
    { name: 'local-desktop', use: { ...devices['Desktop Chrome'] } },
  ],
});
