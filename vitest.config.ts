/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Incluir tests unitarios e integración (NO los e2e, esos van con Playwright)
    include: ['__tests__/unit/**/*.test.ts', '__tests__/integration/**/*.test.ts'],

    // Entorno jsdom para simular el DOM del navegador
    environment: 'jsdom',

    // Aliases para que @/ funcione igual que en el proyecto
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
