import { PlaywrightTestConfig } from '@playwright/test';

const config: PlaywrightTestConfig = {
  use: {
    baseURL: 'http://localhost:3000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: false,
    actionTimeout: 1000,
  },
  expect: {
    timeout: 1000,
  },
  timeout: 5000,
  testDir: 'tests',
  webServer: {
    command: 'node tests/server/index.js',
    port: 3000,
    timeout: 120 * 1000,
  },
  workers: 1,
};

export default config;
