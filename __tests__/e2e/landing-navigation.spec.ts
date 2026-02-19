/**
 * @file Prueba End-to-End (E2E) — Navegación desde la Landing Page
 *
 * ¿Qué es una prueba E2E?
 * Una prueba E2E (End-to-End) simula a un USUARIO REAL interactuando con la
 * aplicación en un NAVEGADOR REAL. No se mockea nada: el frontend, el backend,
 * la base de datos, todo funciona como en producción.
 *
 * ¿Por qué Playwright?
 * Playwright es la herramienta más moderna para E2E:
 * - Soporta Chrome, Firefox y Safari
 * - Es más rápido y estable que Cypress/Selenium
 * - Tiene auto-waiting (espera automática por elementos)
 * - Excelente integración con Next.js
 *
 * ¿Qué estamos testeando?
 * El flujo de un visitante nuevo que llega a la landing page:
 *   1. 📄 Ve la página de inicio correctamente
 *   2. 📝 Verifica que el contenido principal sea visible
 *   3. 🔗 Navega al feed haciendo clic en "Comenzar ahora"
 *   4. 🧭 Verifica que el footer contenga los links legales
 *
 * ⚠️ Pre-requisito: La app debe estar corriendo en localhost:3000
 *    Ejecutar: npm run dev (en otra terminal)
 *
 * Herramienta: Playwright Test (@playwright/test)
 */

import { test, expect } from '@playwright/test';

// ─────────────────────────────────────────────────────────────
// 🧪 SUITE: Landing Page — Experiencia del Visitante
// ─────────────────────────────────────────────────────────────

test.describe('Landing Page — Flujo de Navegación del Visitante', () => {
  /**
   * Antes de cada test, navegamos a la página de inicio.
   * Playwright espera automáticamente a que la página termine de cargar.
   */
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  // ─── TEST 1: La landing carga correctamente ───────────────

  test('la landing page carga y muestra el contenido principal', async ({
    page,
  }) => {
    // 1️⃣ Verificamos el título de la pestaña del navegador
    await expect(page).toHaveTitle(/Guía Puntana/i);

    // 2️⃣ Verificamos que el heading principal (h1) sea visible
    //    Usamos un regex porque el h1 tiene saltos de línea y un <span>
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('talento local');

    // 3️⃣ Verificamos que el subtítulo descriptivo sea visible
    const subtitle = page.getByText(/herramienta definitiva/i);
    await expect(subtitle).toBeVisible();

    // 4️⃣ Verificamos que el botón CTA principal exista
    const ctaButton = page.getByRole('link', { name: /comenzar ahora/i });
    await expect(ctaButton).toBeVisible();
    await expect(ctaButton).toHaveAttribute('href', '/feed');
  });

  // ─── TEST 2: Navegación al feed ──────────────────────────

  test('el botón "Comenzar ahora" navega correctamente al feed', async ({
    page,
  }) => {
    // 1️⃣ Localizamos el botón CTA
    const ctaButton = page.getByRole('link', { name: /comenzar ahora/i });

    // 2️⃣ Hacemos clic y esperamos la navegación
    await ctaButton.click();

    // 3️⃣ Verificamos que la URL cambió a /feed
    //    waitForURL espera hasta que la navegación se complete
    await page.waitForURL('**/feed');
    expect(page.url()).toContain('/feed');
  });

  // ─── TEST 3: Footer y links legales ──────────────────────

  test('el footer muestra los links legales correctamente', async ({
    page,
  }) => {
    // 1️⃣ Localizamos el footer
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // 2️⃣ Verificamos el texto de SimpleDevs
    await expect(footer).toContainText('SimpleDevs');
    await expect(footer).toContainText('Hecho con');

    // 3️⃣ Verificamos que los links legales existan y apunten correctamente
    const termsLink = footer.getByRole('link', {
      name: /términos y condiciones/i,
    });
    await expect(termsLink).toBeVisible();
    await expect(termsLink).toHaveAttribute('href', '/about');

    const licenseLink = footer.getByRole('link', {
      name: /GNU Affero/i,
    });
    await expect(licenseLink).toBeVisible();
    await expect(licenseLink).toHaveAttribute('href', '/license');

    // 4️⃣ Verificamos los links de redes sociales
    const instagramLink = footer.getByRole('link', { name: /instagram/i });
    await expect(instagramLink).toHaveAttribute(
      'href',
      'https://www.instagram.com/simpledevs_sl/'
    );
    await expect(instagramLink).toHaveAttribute('target', '_blank');

    const emailLink = footer.getByRole('link', { name: /email/i });
    await expect(emailLink).toHaveAttribute(
      'href',
      'mailto:simpledevs.sl@gmail.com'
    );
  });
});
