import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para pruebas E2E.
 * Documentación: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  // Carpeta donde están los tests E2E
  testDir: './__tests__/e2e',

  // Tiempo máximo por test (30 segundos)
  timeout: 30_000,

  // Reintentos en CI para evitar flaky tests
  retries: process.env.CI ? 2 : 0,

  // Reporter: lista en local, HTML en CI
  reporter: process.env.CI ? 'html' : 'list',

  use: {
    // URL base de la app (debe estar corriendo)
    baseURL: 'http://localhost:3000',

    // Tomar screenshot solo cuando falle un test
    screenshot: 'only-on-failure',

    // Grabar video solo en el primer reintento
    video: 'on-first-retry',
  },

  // Navegadores a probar
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // Levantar el servidor de desarrollo automáticamente antes de los tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000, // 2 minutos para compilar
  },
});
