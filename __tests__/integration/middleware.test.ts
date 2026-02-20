/**
 * @file Prueba de Integración — Middleware de Sesión (updateSession)
 *
 * ¿Qué es una prueba de integración?
 * A diferencia de una prueba unitaria (que testea UNA función aislada),
 * una prueba de integración verifica cómo MÚLTIPLES módulos trabajan JUNTOS.
 *
 * ¿Qué estamos testeando?
 * El middleware `updateSession` integra TRES sistemas:
 *   1. 🍪 Cookies de Next.js (gestión de sesión)
 *   2. 🔐 Supabase Auth (autenticación del usuario)
 *   3. 📦 Supabase DB (consulta del perfil)
 *   4. 🚦 Next.js Router (redirecciones)
 *
 * ¿Por qué mockeamos Supabase?
 * No queremos conectarnos a una base de datos real en los tests.
 * Usamos `vi.mock()` para simular las respuestas de Supabase y así
 * poder testear TODA la lógica de redirección de forma predecible.
 *
 * Herramienta: Vitest + vi.mock (para simular dependencias externas)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

// ─────────────────────────────────────────────────────────────
// 🎭 PASO 1: Configurar los mocks ANTES de importar el módulo
// ─────────────────────────────────────────────────────────────

// Creamos funciones mock que podemos controlar desde cada test
const mockGetUser = vi.fn();
const mockSelectProfile = vi.fn();

// Mockeamos `@supabase/ssr` para interceptar la creación del cliente
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: mockGetUser,
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: mockSelectProfile,
        })),
      })),
    })),
  })),
}));

// ─────────────────────────────────────────────────────────────
// 🏗️ PASO 2: Helper para crear requests falsos de Next.js
// ─────────────────────────────────────────────────────────────

/**
 * Crea un NextRequest simulado para una ruta específica.
 * Necesitamos esto porque el middleware recibe un NextRequest real.
 */
function createMockRequest(path: string): NextRequest {
  const url = new URL(path, 'http://localhost:3000');
  return new NextRequest(url);
}

// ─────────────────────────────────────────────────────────────
// 🧪 SUITE PRINCIPAL: Middleware updateSession
// ─────────────────────────────────────────────────────────────

describe('Middleware updateSession — Integración de Auth + Rutas', () => {
  // Importamos la función DESPUÉS de configurar los mocks
  let updateSession: (request: NextRequest) => Promise<NextResponse>;

  beforeEach(async () => {
    // Limpiamos todos los mocks entre tests para evitar contaminación
    vi.clearAllMocks();

    // Importamos el módulo fresco en cada test
    const modulo = await import('@/utils/supabase/middleware');
    updateSession = modulo.updateSession;
  });

  // ─── CASO A: Usuario NO Autenticado ─────────────────────────

  describe('👤 Usuario NO Autenticado (Visitante)', () => {
    beforeEach(() => {
      // Simulamos que Supabase no devuelve ningún usuario
      mockGetUser.mockResolvedValue({ data: { user: null } });
    });

    it('permite acceder al feed (ruta pública)', async () => {
      // Arrange: visitante intenta entrar al feed
      const request = createMockRequest('/feed');

      // Act: ejecutamos el middleware
      const response = await updateSession(request);

      // Assert: NO debería redirigir (status 200)
      expect(response.status).toBe(200);
      // Verificamos que NO haya header de redirección
      expect(response.headers.get('location')).toBeNull();
    });

    it('redirige a /login si intenta acceder a /perfil (ruta privada)', async () => {
      const request = createMockRequest('/perfil');

      const response = await updateSession(request);

      // Debería redirigir (status 307 = redirect temporal)
      expect(response.status).toBe(307);
      // La URL de destino debería ser /login
      expect(response.headers.get('location')).toContain('/login');
    });

    it('redirige a /login si intenta acceder a /completar-perfil', async () => {
      const request = createMockRequest('/completar-perfil');

      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/login');
    });
  });

  // ─── CASO B: Usuario Autenticado SIN perfil ───────────────────

  describe('🔐 Usuario Autenticado SIN Perfil Completo', () => {
    beforeEach(() => {
      // Simulamos un usuario autenticado
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@guiapuntana.com' } },
      });
      // Simulamos que NO tiene perfil en la base de datos
      mockSelectProfile.mockResolvedValue({ data: null });
    });

    it('redirige a /completar-perfil si intenta acceder a /feed', async () => {
      const request = createMockRequest('/feed');

      const response = await updateSession(request);

      // El middleware debería forzar la redirección a completar el perfil
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/completar-perfil');
    });

    it('permite acceder a /completar-perfil (no genera loop de redirección)', async () => {
      const request = createMockRequest('/completar-perfil');

      const response = await updateSession(request);

      // No debería redirigir, está en la ruta correcta
      expect(response.status).toBe(200);
    });
  });

  // ─── CASO C: Usuario Autenticado CON perfil ───────────────────

  describe('✅ Usuario Autenticado CON Perfil Completo', () => {
    beforeEach(() => {
      // Simulamos usuario autenticado
      mockGetUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@guiapuntana.com' } },
      });
      // Simulamos que SÍ tiene perfil
      mockSelectProfile.mockResolvedValue({
        data: { id: 'perfil-456' },
      });
    });

    it('redirige / (landing) a /feed para usuarios con sesión', async () => {
      const request = createMockRequest('/');

      const response = await updateSession(request);

      // Los usuarios logueados no necesitan ver la landing
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/feed');
    });

    it('redirige /login a /feed (ya está autenticado)', async () => {
      const request = createMockRequest('/login');

      const response = await updateSession(request);

      // No tiene sentido mostrar login a un usuario ya logueado
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/feed');
    });

    it('redirige /completar-perfil a /feed (ya tiene perfil)', async () => {
      const request = createMockRequest('/completar-perfil');

      const response = await updateSession(request);

      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toContain('/feed');
    });
  });
});
