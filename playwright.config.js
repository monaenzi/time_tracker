import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test files location
  testDir: './tests',
  
  // Maximum time one test can run
  timeout: 30 * 1000, // 30 seconds
  
  // Test execution settings
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  // Output directory for test artifacts (screenshots, videos, traces)
  outputDir: 'test-results',
  
  // Shared settings for all projects
  use: {
    // Base URL for your application
    baseURL: 'http://localhost:3000',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Trace on failure (for debugging)
    trace: 'on-first-retry',
  },

  // Configure projects for different browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Run your dev server before starting tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // Reuse existing server if running
    timeout: 120 * 1000, // 2 minutes to start server
  },
});
